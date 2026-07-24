import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

// Process-level uncaught error protection for production deployments (Render.com)
process.on("uncaughtException", (err) => {
  console.error("[Server Critical] Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[Server Critical] Unhandled Rejection:", reason);
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Set up body parsing with high limit for base64 images
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Shared Gemini client setup
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Gemini features will fail.");
  }
  
  const ai = new GoogleGenAI({
    apiKey: apiKey || "dummy_key",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });

  // Helper to run generateContent with retries and model fallback for lightning-fast responses
  async function callGeminiWithFallback(params: {
    contents: any;
    config?: any;
  }) {
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest"
    ];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini API] Requesting ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const msg = error.message || (error.error && error.error.message) || "";
        console.warn(`[Gemini API] ${modelName} notice:`, msg);
      }
    }

    throw lastError || new Error("የባለሙያ ምክረ-ሃሳብ ዝግጅት በአሁኑ ወቅት አልተሳካም። እባክዎን ከጥቂት ሰከንዶች በኋላ እንደገና ይሞክሩ።");
  }

  // Lazy connection to MongoDB Atlas
  let mongoClient: MongoClient | null = null;
  let mongoConnectionFailed = false;
  const mongoUri = process.env.MONGODB_URI;

  async function getMongoClient(): Promise<MongoClient | null> {
    if (!mongoUri || mongoConnectionFailed) return null;
    if (!mongoClient) {
      try {
        console.log("[MongoDB] Connecting to MongoDB Atlas...");
        mongoClient = new MongoClient(mongoUri, {
          serverSelectionTimeoutMS: 4000,
          connectTimeoutMS: 5000
        });
        await mongoClient.connect();
        console.log("[MongoDB] Successfully connected to MongoDB Atlas.");
        
        // Ensure indexes are set up on initialization
        const db = mongoClient.db();
        const usersCollection = db.collection("users");
        
        // Create TTL (Time-To-Live) index on "expiresAt" field. 
        // When expiresAt timestamp is reached, MongoDB Atlas will automatically delete the user record.
        await usersCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        
        // Ensure transaction ID is unique
        await usersCollection.createIndex({ txnId: 1 }, { unique: true });
        
        console.log("[MongoDB] Database indices verified successfully.");
      } catch (err: any) {
        console.warn("[MongoDB] Connection or index verification failed (using local JSON DB fallback):", err?.message || err);
        mongoClient = null;
        mongoConnectionFailed = true;
      }
    }
    return mongoClient;
  }

  // Persistent JSON file-based database to store verified transaction IDs as fallback
  const dbPath = path.join(process.cwd(), "transactions_db.json");
  const verifiedTxnIds = new Set<string>();

  try {
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, "utf-8");
      const savedTxns = JSON.parse(dbContent);
      if (Array.isArray(savedTxns)) {
        savedTxns.forEach(txn => {
          if (txn && typeof txn === "string") {
            verifiedTxnIds.add(txn.toUpperCase().trim());
          }
        });
        console.log(`[Database] Successfully loaded ${verifiedTxnIds.size} registered transactions from transactions_db.json.`);
      }
    } else {
      console.log("[Database] No transactions_db.json found. Creating a fresh transaction store.");
      fs.writeFileSync(dbPath, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("[Database] Error loading or initializing transactions_db.json:", error);
  }

  // Enhanced function to register transactions to local database and MongoDB Atlas
  const registerTransactionInDbExtended = async (userData: {
    txnId: string;
    senderName: string;
    packageType: string;
    expectedAmount: number;
    extractedAmount: number;
    expiresAt: Date;
    createdAt: Date;
    verifiedSender: string;
    status: string;
  }) => {
    const cleanId = userData.txnId.toUpperCase().trim();
    verifiedTxnIds.add(cleanId);
    
    // 1. Save to local fallback file
    try {
      fs.writeFileSync(dbPath, JSON.stringify(Array.from(verifiedTxnIds), null, 2), "utf-8");
      console.log(`[Database] Fallback transaction ${cleanId} registered locally.`);
    } catch (error) {
      console.error("[Database] Error writing fallback transactions_db.json:", error);
    }

    // 2. Save/Upsert into MongoDB Atlas
    const client = await getMongoClient();
    if (client) {
      try {
        const db = client.db();
        // Keep unique transaction ID, store all user and purchase details
        await db.collection("users").updateOne(
          { txnId: cleanId },
          { $set: userData },
          { upsert: true }
        );
        console.log(`[MongoDB] Full user details stored in MongoDB Atlas for transaction ${cleanId}.`);
      } catch (err) {
        console.error("[MongoDB] Error inserting user document:", err);
      }
    }
  };

  // API Route for verifying Telebirr receipts via expert analysis / PDF Document Analysis
  app.post("/api/verify-receipt", async (req: express.Request, res: express.Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "Maki Styling Advisory services are temporarily unavailable. Please verify connection credentials." 
        });
      }

      const { image, expectedAmount, senderName } = req.body;
      if (!image) {
        return res.status(400).json({ error: "እባክዎን የቴሌብር ክፍያ ማረጋገጫ ደረሰኝ ፎቶ ወይም ፒዲኤፍ ይጫኑ።" });
      }

      // Extract mime type and base64 string dynamically from data URL
      let base64Data = image;
      let mimeType = "image/jpeg";

      if (image.startsWith("data:")) {
        const matches = image.match(/^data:([^;]+);base64,(.*)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          base64Data = image.split(",")[1] || image;
        }
      }

      const prompt = `
You are an expert financial receipt auditor for the elite Ethiopian personal styling service "የማኪ የፋሽንና የፀጉር ስታይል መማክርት" (Maki Fashion & Hair Styling Advisory).
Analyze the uploaded Telebirr transaction receipt screenshot, document (PDF), or receipt details carefully.

Telebirr has three kinds of receipts/formats. You must auto-detect which one is being presented:
1. DETAILED RECEIPT SCREENSHOT: A full-screen or detailed receipt containing Sender Name, Recipient Number, Recipient Name, Transaction Amount, Transaction ID, and Date/Time.
2. DETAILED OFFICIAL PDF: An official Telebirr Transaction receipt in PDF format (often downloaded from info.ethiotelecom.et). It contains structured fields such as "Payer Name / የከፋይ ስም", "Payer telebirr no.", "Credited party name / የገንዘብ ተቀባይ ስም" or "Transaction To" (e.g., TEKALIGH), "Settled Amount / የተከፈለው መጠን" (e.g., 50 Birr, 100 Birr, or 300 Birr), "Total Paid Amount / ጠቅላላ የተከፈለው መጠን", "Invoice No. / የክፍያ ቁጥር" or "Transaction Number", "Payment date / የክፍያ ቀን", etc.
3. SIMPLE RECEIPT SCREENSHOT: A simple transfer completion success overlay, modal, simplified transfer list, or quick confirmation screen/SMS screenshot. It might only display the recipient's name and a Transaction ID, but might omit or crop the sender's name and the transaction amount.

STRICT MANDATORY RECIPIENT VERIFICATION RULES:
- CRITICAL REQUIREMENT: The Recipient / Credited Party / "Transaction To" name MUST BE STRICTLY AND ONLY "TEKALIGH" (or phone "0966782412"). NO OTHER RECIPIENT NAME IS ALLOWED!
- STRICT REJECTION RULE: If the payment receipt shows ANY OTHER RECIPIENT NAME such as "FIREALEM", "TEKALIGN", "ZERIHUN", or any other person that is NOT strictly "TEKALIGH", you MUST IMMEDIATELY MARK 'isValid' as FALSE!
- Explanation for invalid recipient: Set 'explanation' in Amharic explaining that the payment recipient name on the receipt is incorrect (e.g. "የተላከበት የተቀባይ ስም TEKALIGH ብቻ መሆን አለበት። እባክዎን ወደ ትክክለኛው የተቀባይ ስም TEKALIGH ያስተላለፉበትን ደረሰኝ ይጫኑ።").

Apply the following verification steps strictly:

- If it is a DETAILED RECEIPT (Screenshot or Official PDF):
  1. Recipient check: Must be paid ONLY to TEKALIGH (or 0966782412). If paid to FIREALEM, TEKALIGN, or anyone else, isValid = false.
  2. Amount check: Must be at least ${expectedAmount} ETB (Birr) (i.e. >= ${expectedAmount} ETB).
  3. Sender name check: Verify if the sender/payer name shown on the receipt semantically matches the claimed sender name: "${senderName}". (Spelling can vary slightly between English and Amharic, e.g., "ASTER BEKELE" or "አስቴር በከለ" matches "Aster Bekele").

- If it is a SIMPLE RECEIPT:
  1. Recipient check: Must strictly be paid ONLY to TEKALIGH (or 0966782412). Reject any receipt paid to FIREALEM, TEKALIGN, or any other recipient name!
  2. Amount and Sender checks: For a simple receipt, if sender name or amount are absent, set isValid to true ONLY IF recipient is TEKALIGH and a valid Transaction ID exists.

In all cases:
1. Extract the Transaction ID/Reference Code (usually starting with letters like FT or DG, like FT26A189... or DGE4TVRXN6, etc.).
2. Generate a JSON response matching the required schema. Write the "explanation" field in polite, authoritative Amharic (አማርኛ).
`;

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      };

      const response = await callGeminiWithFallback({
        contents: [imagePart, { text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { 
                type: Type.BOOLEAN,
                description: "True if the receipt is a valid successful Telebirr transfer meeting the specified detailed or simple receipt criteria."
              },
              receiptType: {
                type: Type.STRING,
                description: "The detected receipt style: 'detailed' or 'simple'."
              },
              extractedTxnId: { 
                type: Type.STRING, 
                description: "The extracted transaction ID reference code from the receipt, e.g. FT26A189..."
              },
              extractedSenderName: { 
                type: Type.STRING, 
                description: "The sender's name as displayed on the receipt, or empty string if not shown/applicable."
              },
              extractedAmount: { 
                type: Type.NUMBER, 
                description: "The payment amount extracted from the receipt, or 0 if not shown/applicable."
              },
              isRecipientCorrect: { 
                type: Type.BOOLEAN,
                description: "True if the recipient was verified to be TEKALIGH (or 0966782412)."
              },
              explanation: { 
                type: Type.STRING, 
                description: "A short explanation in encouraging, friendly, and professional Amharic (አማርኛ). If successful, thank them. If failed, specify why in detail."
              }
            },
            required: ["isValid", "receiptType", "extractedTxnId", "extractedSenderName", "extractedAmount", "isRecipientCorrect", "explanation"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("ማኪ ደረሰኝዎን ማንበብ አልቻለችም፤ እባክዎን ጥራት ያለው ፎቶ እንደገና ይጫኑ።");
      }

      const cleanJson = resultText.replace(/^```(json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      const auditResult = JSON.parse(cleanJson);

      // Prevent duplicate transaction IDs and persist to database
      if (auditResult.isValid && auditResult.extractedTxnId) {
        const txn = auditResult.extractedTxnId.toUpperCase().trim();
        
        let isDuplicate = false;
        const client = await getMongoClient();
        
        if (client) {
          try {
            const db = client.db();
            const existingUser = await db.collection("users").findOne({ txnId: txn });
            if (existingUser) {
              isDuplicate = true;
            }
          } catch (dbErr) {
            console.error("[MongoDB] Error querying transaction:", dbErr);
          }
        } else {
          if (verifiedTxnIds.has(txn)) {
            isDuplicate = true;
          }
        }

        if (isDuplicate) {
          auditResult.isValid = false;
          auditResult.explanation = `ይህ የደረሰኝ ግብይት መለያ (${txn}) ቀደም ሲል ለሌላ አገልግሎት ስራ ላይ ውሏል ወይም ጊዜው አልፏል! እባክዎን አዲስ ክፍያ ይፈፅሙ።`;
        } else {
          // Calculate expiration dates
          let pkgType = "today";
          let days = 1;
          if (expectedAmount === 100) {
            pkgType = "weekly";
            days = 7;
          } else if (expectedAmount === 300) {
            pkgType = "monthly";
            days = 30;
          }

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + days);

          // Non-blocking background registration in DB
          registerTransactionInDbExtended({
            txnId: txn,
            senderName: senderName || "Guest",
            packageType: pkgType,
            expectedAmount,
            extractedAmount: auditResult.extractedAmount || expectedAmount,
            expiresAt,
            createdAt: new Date(),
            verifiedSender: auditResult.extractedSenderName || senderName || "Guest",
            status: "active"
          }).catch(err => console.error("[Database] Async registration error:", err));
        }
      }

      res.json(auditResult);
    } catch (error: any) {
      console.error("Receipt Verification Error:", error);
      res.status(500).json({ error: error.message || "ደረሰኙን ማረጋገጥ አልተቻለም።" });
    }
  });

  // API Route for preparing personal style and hair consultations
  app.post("/api/recommend", async (req: express.Request, res: express.Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "Maki Styling Advisory services are temporarily unavailable. Please verify connection credentials." 
        });
      }

      const { image, packageType, gender, scanMode, txnId, senderName, isMore } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Missing image data. Please upload a clear photo." });
      }

      // Convert data URL to base64 string
      const base64Data = image.split(",")[1] || image;
      
      const isFemale = gender === "female";
      const isUpperBody = scanMode === "upper_body";

      // Query MongoDB Atlas for user profile and previous recommendations
      let userContextNote = "";
      if (txnId || senderName) {
        try {
          const client = await getMongoClient();
          if (client) {
            const query: any = {};
            if (txnId) query.txnId = String(txnId).toUpperCase().trim();
            else if (senderName) query.senderName = String(senderName).trim();

            const userDoc = await client.db().collection("users").findOne(query);
            if (userDoc) {
              userContextNote = `
[MONGODB ATLAS STORED USER PROFILE & HISTORY]:
User Name: ${userDoc.senderName || senderName || "Registered Member"}
Registered Package: ${userDoc.packageType || packageType}
Registration Date: ${userDoc.createdAt}
Previous Consultation History: ${userDoc.lastRecommendation ? "User has previous recommendation history saved in MongoDB. Build upon their previous profile seamlessly." : "First consultation for this active package."}
`;
            }
          }
        } catch (dbErr) {
          console.warn("[MongoDB] Error checking user context:", dbErr);
        }
      }

      let prompt = `
You are "ማኪ" (Maki), an elite Ethiopian master fashion designer, clothing consultant, and hair barber/stylist expert from Addis Ababa.
The user uploaded their photo for a personalized expert face, body posture, fashion, and hair styling analysis.
${userContextNote}
Gender: ${isFemale ? "Female (ሴት)" : "Male (ወንድ)"}.
Scan Mode: ${isUpperBody ? "Upper Body (Hair Focus)" : "Whole Body (Outfit & Hair Focus)"}.
Package: ${packageType || "today"}.
${isMore ? "This is a request for MORE additional fashion outfits and hair combinations (ተጨማሪ ስታይል ቅንጅቶች)." : "This is the initial fast style analysis."}

CRITICAL MANDATORY INSTRUCTIONS FOR ANALYSIS & RECOMMENDATIONS:

1. SECTION 1: EXPERT FACE & BODY POSTURE ANALYSIS (~500 CHARACTERS):
   Write a comprehensive, highly detailed ~500 character expert evaluation in Amharic (አማርኛ) titled "🔍 የፊትና የሰውነት ቅርፅ የባለሙያ መግለጫ (Expert Face & Posture Analysis)":
   - Detailed Facial Analysis: Evaluate their exact face shape (oval/round/diamond/square/heart), cheekbone structure, jawline definition, forehead width, eyes, nose, and skin undertone.
   - Detailed Body Posture Analysis: Evaluate their shoulder alignment, posture stance, neck length, upper body proportions, and overall physical balance.

2. SECTION 2: TAILORED STYLE COMBINATIONS BASED ON ANALYSIS:
   Begin with the exact bridge phrase:
   "የፊትዎ ገፅታና የሰውነት አቋምዎ ከላይ በተተነተነው መሰረት፣ ለእርስዎ የሚስማማው የተሟላ የፋሽን፣ የፀጉርና የአካሰሰሪ ቅንጅት (Tailored Combinations) እነሆ፦"

   ${isFemale ? `
   FOR FEMALE CLIENTS, EVERY COMBINATION MUST SPECIFICALLY INCLUDE ALL 5 ELEMENTS:
   1. 👗 አልባሳት (Clothing Outfit): Recommended dress, suit, or outfit cut to complement her body shape.
   2. 💇‍♀️ የፀጉር ስታይል (Hairstyle): Haircut or styling that flatters her face shape.
   3. 💄 የሜካፕ ቅንጅት (Makeup Match): Foundation tone (🧴 Base), Eyeliner style (👁️ Eyes), Lipstick shade (💄 Lips), and Blush (✨ Glow).
   4. 👠 ጫማ (Shoes / Heels): Complementary footwear style and heel type.
   5. 👜 ቦርሳ (Handbag / Bag): Matching bag style, size, and material.
   ` : `
   FOR MALE CLIENTS, EVERY COMBINATION MUST SPECIFICALLY INCLUDE ALL 5 ELEMENTS:
   1. 👔 አልባሳት (Clothing Outfit): Recommended suit, jacket, or casual wear for his frame and posture.
   2. 💈 የፀጉርና የጺም ስታይል (Haircut & Beard Grooming): Barber cut (fade/taper/lineup) and beard shaping for his jawline.
   3. 👞 ጫማ (Shoes / Footwear): Leather dress shoes, boots, or sneakers.
   4. ⌚ የእጅ ሰዓት (Watch / Timepiece): Classic, executive, or luxury watch style.
   5. 👖 ቀበቶ (Belt / Leather Belt): Matching leather belt color and buckle type.
   `}

3. PROVIDE 3 DISTINCT STYLING COMBINATIONS:
   - Casual Look (ካዡዋል ቅንጅት)
   - Executive / Professional Look (ፕሮፌሽናል ቅንጅት)
   - Formal Evening Look (ፎርማል / የምሽት ቅንጅት)

Include tips on how to assemble these looks using existing wardrobe items.
Structure the entire output in clear, beautifully formatted Amharic markdown.
`;

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      };

      const response = await callGeminiWithFallback({
        contents: [imagePart, { text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationText: {
                type: Type.STRING,
                description: "The complete beautifully formatted Amharic markdown lookbook covering Casual, Professional, and Formal looks."
              },
              imagenPrompt: {
                type: Type.STRING,
                description: "Primary English prompt for Imagen 3."
              },
              imagenPrompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 3 English prompts for Casual, Professional, and Formal looks."
              }
            },
            required: ["recommendationText", "imagenPrompt"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("ማኪ የፎቶ ትንተናውን ማከናወን አልቻለችም፤ እባክዎን ጥራት ያለው ፎቶ እንደገና ይጫኑ።");
      }

      const cleanJson = resultText.replace(/^```(json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsedResult = JSON.parse(cleanJson);
      const recText = parsedResult.recommendationText || "";
      const primaryPrompt = parsedResult.imagenPrompt || "";
      const promptList: string[] = (parsedResult.imagenPrompts && parsedResult.imagenPrompts.length > 0)
        ? parsedResult.imagenPrompts.slice(0, 3)
        : [primaryPrompt];

      const generatedImages: string[] = [];
      const imageModelsToTry = [
        "gemini-3.1-flash-lite-image",
        "gemini-3.1-flash-image"
      ];

      // Generate style look previews using supported Gemini image models
      for (const promptStr of promptList) {
        if (!promptStr) continue;
        let generatedForPrompt = false;

        for (const imgModel of imageModelsToTry) {
          if (generatedForPrompt) break;
          try {
            console.log(`[ImageGen] Generating style preview with model ${imgModel}...`);
            const imgResponse = await ai.models.generateContent({
              model: imgModel,
              contents: promptStr,
              config: {
                imageConfig: {
                  aspectRatio: "3:4"
                }
              }
            });

            const parts = imgResponse.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || "image/jpeg";
                generatedImages.push(`data:${mime};base64,${part.inlineData.data}`);
                generatedForPrompt = true;
                break;
              }
            }
          } catch (imgError: any) {
            console.log(`[ImageGen] Model ${imgModel} info:`, imgError?.message || "Using curated style fallback");
          }
        }
      }

      // Fallback images if generation fails
      if (generatedImages.length === 0) {
        if (gender === "female") {
          generatedImages.push(
            isMore 
              ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
              : "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600"
          );
        } else {
          generatedImages.push(
            isMore
              ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"
              : "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600"
          );
        }
      }

      // Asynchronously record consultation history in MongoDB Atlas
      if (txnId || senderName) {
        getMongoClient().then(client => {
          if (client) {
            const query: any = {};
            if (txnId) query.txnId = String(txnId).toUpperCase().trim();
            else if (senderName) query.senderName = String(senderName).trim();

            client.db().collection("users").updateOne(
              query,
              { 
                $set: { 
                  lastRecommendation: recText.substring(0, 1000), 
                  lastAnalyzedAt: new Date() 
                } 
              }
            ).catch(err => console.error("[MongoDB] History save error:", err));
          }
        }).catch(err => console.error("[MongoDB] Client error:", err));
      }

      res.json({
        recommendation: recText,
        generatedImages: generatedImages,
        generatedImage: generatedImages[0]
      });
    } catch (error: any) {
      console.error("Style Consultant Error:", error);
      res.status(500).json({ error: "በምክረ-ሃሳብ ዝግጅት ወቅት ስህተት ተከስቷል። እባክዎን ከጥቂት ሰከንዶች በኋላ እንደገና ይሞክሩ።" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(500).send("<h1>App Building in Progress</h1><p>Please wait a moment and refresh the page.</p>");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

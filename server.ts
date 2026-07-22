import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // Helper to run generateContent with retries and model fallback to handle 503/transient errors
  async function callGeminiWithFallback(params: {
    contents: any;
    config?: any;
  }) {
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite"
    ];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      let attempts = 2; // Reduced to 2 to fail-over faster
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          console.log(`[Gemini API] Requesting ${modelName} (Attempt ${attempt}/${attempts})...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: params.contents,
            config: params.config,
          });
          return response;
        } catch (error: any) {
          lastError = error;
          const status = error.status || (error.error && error.error.code) || 0;
          const msg = error.message || (error.error && error.error.message) || "";
          console.warn(`[Gemini API] ${modelName} failed on attempt ${attempt}:`, msg);
          
          // If the error is 503/UNAVAILABLE, 429/RESOURCE_EXHAUSTED, or 404/NOT_FOUND,
          // don't keep retrying the same model. Fall back to the next model immediately!
          const isUnavailable = 
            status === 503 || 
            status === 429 || 
            status === 404 ||
            msg.includes("503") || 
            msg.includes("429") || 
            msg.includes("404") || 
            msg.includes("UNAVAILABLE") || 
            msg.includes("RESOURCE_EXHAUSTED") ||
            msg.includes("NOT_FOUND") ||
            msg.includes("no longer available") ||
            msg.includes("not found") ||
            msg.includes("not supported") ||
            msg.includes("high demand") ||
            msg.includes("limit");

          if (isUnavailable) {
            console.warn(`[Gemini API] ${modelName} is unavailable, not found, or rate limited. Fast-falling back to next model...`);
            break; // Break the attempt loop for this model and go to the next model in modelsToTry
          }

          if (attempt < attempts) {
            const delayMs = attempt * 1000;
            console.log(`[Gemini API] Retrying ${modelName} in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }
    }

    throw lastError || new Error("የባለሙያ ምክረ-ሃሳብ ዝግጅት በአሁኑ ወቅት አልተሳካም። እባክዎን ከጥቂት ሰከንዶች በኋላ እንደገና ይሞክሩ።");
  }

  // Lazy connection to MongoDB Atlas
  let mongoClient: MongoClient | null = null;
  const mongoUri = process.env.MONGODB_URI;

  async function getMongoClient(): Promise<MongoClient | null> {
    if (!mongoUri) return null;
    if (!mongoClient) {
      try {
        console.log("[MongoDB] Connecting to MongoDB Atlas...");
        mongoClient = new MongoClient(mongoUri);
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
      } catch (err) {
        console.error("[MongoDB] Connection or index verification failed:", err);
        mongoClient = null;
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
2. DETAILED OFFICIAL PDF: An official Telebirr Transaction receipt in PDF format (often downloaded from info.ethiotelecom.et). It contains structured fields such as "Payer Name / የከፋይ ስም" (e.g. FIREALEM TAKELIGN MARU), "Payer telebirr no.", "Credited party name / የገንዘብ ተቀባይ ስም" or "Transaction To", "Settled Amount / የተከፈለው መጠን" (e.g., 50 Birr, 70 Birr, 100 Birr, or 300 Birr), "Total Paid Amount / ጠቅላላ የተከፈለው መጠን", "Invoice No. / የክፍያ ቁጥር" or "Transaction Number", "Payment date / የክፍያ ቀን", etc.
3. SIMPLE RECEIPT SCREENSHOT: A simple transfer completion success overlay, modal, simplified transfer list, or quick confirmation screen/SMS screenshot. It might only display the recipient's name and a Transaction ID, but might omit or crop the sender's name and the transaction amount.

Apply the following verification rules strictly:

- If it is a DETAILED RECEIPT (Screenshot or Official PDF):
  1. Recipient or Account check: Must involve the merchant account. This means either "FIREALEM", "FIREALEM TAKELIGN MARU", "0991490243", or "Zerihun Muluneh Yomgalu" (the registered merchant name, associated recipient, or transaction representative) must be present in the document either as the payer, credited party, recipient, or sender.
  2. Amount check: Must be at least ${expectedAmount} ETB (Birr) (i.e. >= ${expectedAmount} ETB). If they paid more, that is acceptable! (Look at the "Settled Amount", "Total Paid Amount", "Transaction Amount", or equivalent fields).
  3. Sender name check: Verify if the sender/payer name shown on the receipt semantically matches the claimed sender name: "${senderName}". (Spelling can vary slightly between English and Amharic, so do a flexible, smart comparison e.g., "ASTER BEKELE" or "አስቴር በከለ" matches "Aster" or "አስቴር" or "Aster Bekele"). If there is an official PDF, accept any payer name as long as the transaction is a valid Telebirr transfer involving the merchant details.

- If it is a SIMPLE RECEIPT:
  1. Recipient check: You must check ONLY that the recipient name is EXACTLY "FIREALEM" or "FIREALEM TAKELIGN MARU" or "Zerihun Muluneh Yomgalu" (strictly case-sensitive, in English or equivalent spelling variations, e.g. do NOT accept initials, but accept standard representations).
  2. Amount and Sender checks: For a simple receipt, ignore deviations or absence of the sender name or transaction amount (since simple receipts might not display these fields). Simply set 'isValid' to true if the recipient is correct and a valid Transaction ID exists.

In all cases:
1. Extract the Transaction ID/Reference Code (usually starting with letters like FT or DG, like FT26A189... or DGE4TVRXN6, etc.).
2. Generate a JSON response matching the required schema. Write the "explanation" field in polite, beautiful, encouraging Amharic (አማርኛ).
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
                description: "True if the recipient was verified to be FIREALEM (or 0991490243)."
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

      const auditResult = JSON.parse(resultText.trim());

      // Prevent duplicate transaction IDs and persist to database
      if (auditResult.isValid && auditResult.extractedTxnId) {
        const txn = auditResult.extractedTxnId.toUpperCase().trim();
        
        let isDuplicate = false;
        const client = await getMongoClient();
        
        if (client) {
          try {
            const db = client.db();
            // Delete expired items first
            await db.collection("users").deleteMany({ expiresAt: { $lt: new Date() } });
            
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

          // Register in database
          await registerTransactionInDbExtended({
            txnId: txn,
            senderName: senderName || "Guest",
            packageType: pkgType,
            expectedAmount,
            extractedAmount: auditResult.extractedAmount || expectedAmount,
            expiresAt,
            createdAt: new Date(),
            verifiedSender: auditResult.extractedSenderName || senderName || "Guest",
            status: "active"
          });
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

      const { image, packageType, gender, scanMode, txnId, isMore } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Missing image data. Please upload a clear photo." });
      }

      // Convert data URL to base64 string
      const base64Data = image.split(",")[1] || image;
      
      const isFemale = gender === "female";
      const isUpperBody = scanMode === "upper_body";

      let prompt = `
You are "ማኪ" (Maki), an elite Ethiopian master fashion designer, clothing consultant, and hair barber/stylist expert from Addis Ababa.
The user uploaded their photo for a personalized fashion and hair styling analysis.
Gender: ${isFemale ? "Female (ሴት)" : "Male (ወንድ)"}.
Scan Mode: ${isUpperBody ? "Upper Body (Hair Focus)" : "Whole Body (Outfit & Hair Focus)"}.
Package: ${packageType || "today"}.
${isMore ? "This is a request for MORE additional fashion outfits and hair styles (ተጨማሪ ስታይሎች)." : "This is the initial fast style analysis."}

CRITICAL MANDATORY INSTRUCTIONS ON USER FACIAL IDENTITY & POSTURE:
1. Carefully analyze the uploaded photo's face (jawline, cheekbones, eye shape, nose, skin tone undertone) and body posture.
2. The user's face and natural skin color MUST be preserved.
3. ${isFemale ? `
FOR FEMALE CLIENTS:
- Analyze her posture, body build, and natural skin tone.
- Recommend 10+ stunning modern fashion outfits tailored to her posture and skin tone.
- ${isMore ? "Incorporate high-fashion American model hairstyles, celebrity red carpet braids, glamorous waves, high ponytails, and modern Habesha fusion hairstyles without changing her face." : "Provide modern Habesha Kemis fusion, high-fashion dresses, and modern street style with hairstyles fitting her face shape."}
- Detail why the specific color palette elevates her look to be chic, modern, and high-fashion.
` : `
FOR MALE CLIENTS:
- Act as a master barber and executive tailor expert.
- Instantly analyze his jawline, forehead, and body posture within milliseconds.
- Recommend trending male haircuts (sharp high-skin fade, drop fade, taper cut, texturized afro curls, lineup) matching his face shape.
- Recommend tailored executive suits, modern blazers, and urban street style fitting his posture and color tone.
`}

Structure your response in warm, encouraging, highly professional AMHARIC (አማርኛ) markdown with clear headings, bullet points, and expert tips.

For the "imagenPrompt" JSON field:
Write a hyper-detailed, photorealistic English prompt for Imagen 3 describing a high-fashion editorial portrait.
It MUST specify:
- The exact facial features, skin tone shade, face shape, eye shape, and posture of the person in the reference input image.
- The new recommended modern fashion outfit (${isFemale ? "modern luxury dress/outfit and high-fashion American model hairstyle" : "tailored modern blazer/jacket with a sharp barber fade haircut"}).
- Include key phrases: "exact facial structure and skin tone from reference image preserved, photorealistic studio fashion portrait, 8k resolution, elegant lighting".
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
                description: "The complete beautifully formatted Amharic markdown lookbook."
              },
              imagenPrompt: {
                type: Type.STRING,
                description: "The detailed English prompt for Imagen 3."
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

      const parsedResult = JSON.parse(resultText.trim());
      const recText = parsedResult.recommendationText || "";
      const imagenPromptStr = parsedResult.imagenPrompt || "";

      let numberOfImages = 1;

      const generatedImages: string[] = [];

      if (imagenPromptStr) {
        try {
          console.log(`[Imagen] Generating style preview with prompt: "${imagenPromptStr}"`);
          const imageResponse = await ai.models.generateImages({
            model: "imagen-3.0-generate-002",
            prompt: imagenPromptStr,
            config: {
              numberOfImages: numberOfImages,
              outputMimeType: "image/jpeg",
              aspectRatio: "3:4"
            }
          });

          if (imageResponse && imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            for (const imgObj of imageResponse.generatedImages) {
              const imgBytes = imgObj.image.imageBytes;
              generatedImages.push(`data:image/jpeg;base64,${imgBytes}`);
            }
          }
        } catch (imgError: any) {
          console.warn("[Imagen] Failed to generate image via Imagen 3:", imgError.message || imgError);
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
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

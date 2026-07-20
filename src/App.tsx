/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  Volume1, 
  VolumeX, 
  X, 
  Check, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Info, 
  ChevronRight, 
  RotateCcw, 
  Star, 
  ArrowRight, 
  Wifi, 
  Smartphone,
  Camera,
  Upload,
  Download,
  Share2,
  FileText,
  User,
  Calendar,
  Award,
  RefreshCw,
  Sparkle,
  Instagram,
  Briefcase,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import habeshaKemisImg from "./assets/images/habesha_kemis_traditional_1784116987366.jpg";
import modernHabeshaImg from "./assets/images/modern_habesha_dress_1784117000820.jpg";
import modernCasualImg from "./assets/images/modern_casual_style_1784117015193.jpg";
import eveningGownImg from "./assets/images/evening_gown_fashion_1784117031845.jpg";

const ModelGirlSilhouette = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Elegant minimal line art of a fashionable girl profile */}
    <path
      d="M30 75C30 75 32 63 36 55C38 51 41 46 41 40C41 32 36 25 36 18C36 14 38 10 42 8C46 6 52 7 55 10C61 15 63 22 62 30C61 38 56 46 56 55C56 63 58 75 58 75"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Hair volume flow */}
    <path
      d="M42 8C35 12 30 20 30 28C30 38 38 42 38 48C38 54 32 60 28 66C24 72 23 80 25 88"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    />
    {/* Elegant shoulder-neck-collar line */}
    <path
      d="M38 55C40 57 44 59 48 59C52 59 55 57 56 55"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Eyes closed eyelash */}
    <path
      d="M45 22C46.5 23 48.5 23 50 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Elegant lips line */}
    <path
      d="M47 30C48 31 50 31 51 30"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Earring sparkle */}
    <circle cx="39" cy="36" r="2" fill="currentColor" className="animate-pulse text-amber-400" />
  </svg>
);

interface SocialTrendPost {
  id: string;
  platform: "instagram" | "tiktok";
  handle: string;
  avatar: string;
  image: string;
  likes: string;
  views?: string;
  comments: string;
  tags: string[];
  descriptionAmh: string;
  descriptionEng: string;
  category: "dress" | "haircut" | "hairstyle";
}

// Compress Base64 image using HTML5 Canvas to 800px width/height maximums at 0.75 quality (JPEG)
// This reduces file sizes from 4MB to ~70KB, making network transfers and Gemini analysis 50x faster!
const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        resolve(compressedBase64);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

const socialTrends: SocialTrendPost[] = [
  {
    id: "social-1",
    platform: "instagram",
    handle: "@danayit_mekbib",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150",
    image: habeshaKemisImg,
    likes: "45.8k",
    comments: "1.2k",
    tags: ["#habeshakemis", "#ethiopianfashion", "#danayitstyle"],
    descriptionAmh: "በእጅ የተሸመነ እጅግ ማራኪ የባህል ቀሚስ ጥበብ ከተንዠረገገ ሻሽ ጋር። ለልዩ የሰርግ ፕሮግራሞች እጅግ ተመራጭ የሆነ ድንቅ ባህላዊ ስራ።",
    descriptionEng: "Elegant hand-woven Habesha Kemis with gold-gilded pattern details, worn by famous television host and artist Danayit Mekbib.",
    category: "dress"
  },
  {
    id: "social-2",
    platform: "tiktok",
    handle: "@yordi_tiktoker",
    avatar: "https://images.unsplash.com/photo-1524250502761-136f25028110?auto=format&fit=crop&q=80&w=150",
    image: "https://images.unsplash.com/photo-1524250502761-136f25028110?auto=format&fit=crop&q=80&w=600",
    likes: "182.1k",
    views: "2.4M",
    comments: "3.4k",
    tags: ["#yordistyle", "#ethiopiantiktok", "#bouncycurls"],
    descriptionAmh: "ወቅታዊ የከተማ ቺክ ዘና ያለ አልባሳት ከደማቅ ፀጉር ከርል ጋር። በ2026 በኢትዮጵያ ወጣቶች ዘንድ እጅግ የተወደደው የዮርዲ ቲክቶክ ተወዳጅ ስታይል።",
    descriptionEng: "Vibrant urban streetwear and bouncy natural curls style. Inspired by top Ethiopian TikTok star Yordi's viral outfits.",
    category: "hairstyle"
  },
  {
    id: "social-3",
    platform: "instagram",
    handle: "@fryat_yemane",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=150",
    image: modernHabeshaImg,
    likes: "32.9k",
    comments: "580",
    tags: ["#fryatyemane", "#culturalfusion", "#habeshabeauty"],
    descriptionAmh: "ዘመናዊ የሀበሻ ባህልና የምዕራባውያን ውህደት ያለው አስደናቂ የምሽት እራት አልባሳት። ፍርያት የማነ በልዩ ዝግጅት ላይ ያደመቀችበት የጥበብ ዲዛይን።",
    descriptionEng: "Stunning cultural fusion gown worn by top actress and model Fryat Yemane, combining hand-woven heritage and luxury couture.",
    category: "dress"
  },
  {
    id: "social-4",
    platform: "tiktok",
    handle: "@rophnan_cyber",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    likes: "95.5k",
    views: "1.1M",
    comments: "2.1k",
    tags: ["#rophnan", "#cyberhabesha", "#afrofuturism"],
    descriptionAmh: "በእጅ ከተሸመነ ባህላዊ ጥበብ ጋር የተቀናጀ ልዩ የአፍሮ-ፊውቸሪስት ኮት እና ቴክስቸርድ ፀጉር ስታይል። የሙዚቃው ፈር ቀዳጅ ሮፍናን መለያ ምልክት።",
    descriptionEng: "Dapper tailored cultural-fusion jacket and textured afro dreads/twists, styled by electronic music icon Rophnan.",
    category: "haircut"
  },
  {
    id: "social-5",
    platform: "instagram",
    handle: "@hanan_tarq",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=150",
    image: modernCasualImg,
    likes: "54.2k",
    comments: "980",
    tags: ["#hanantarq", "#modestfashion", "#chicaddis"],
    descriptionAmh: "ለእለት ተእለት ውሎ የሚሆን እጅግ ውብና የረቀቀ የከተማ አልባሳት። በታዋቂዋ ተዋናይት ሃናን ታርቅ የኢንስታግራም ገፅ ላይ ሰፊ መወያያ የሆነ ስማርት ዲዛይን።",
    descriptionEng: "Sophisticated and modest urban chic clothing designed for modern city events, popularized by legendary actress Hanan Tarq.",
    category: "dress"
  },
  {
    id: "social-6",
    platform: "tiktok",
    handle: "@melat_nebiyu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    image: eveningGownImg,
    likes: "74.8k",
    views: "920k",
    comments: "1.4k",
    tags: ["#melatnebiyu", "#luxurygala", "#eveningcouture"],
    descriptionAmh: "ክብርንና ማራኪነትን የሚያላብስ ድንቅ የምሽት እራት አልባሳት። በፊልም ኮከቧ መላት ነቢዩ ቲክቶክ ላይ የታየ ልዩ የመድረክ ቀሚስ።",
    descriptionEng: "Breathtaking premium evening gala dress featured on TikTok by prominent cinema icon and style star Melat Nebiyu.",
    category: "dress"
  }
];

// Synthesizer Controller using Web Audio API to play real audio when active
class AudioSynthController {
  private ctx: AudioContext | null = null;
  private intervalId: any = null;
  private gainNode: GainNode | null = null;
  private volume: number = 0.5;

  start(volume: number) {
    this.volume = volume;
    try {
      this.stop(); // Stop any existing synth
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      // Warm elegant synth chords representing Liya's AI fashion wavelength
      const notes = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25]; // C4, E4, G4, C5, D5, E5
      let step = 0;

      const playTone = () => {
        if (!this.ctx || this.ctx.state === "suspended") return;
        
        const time = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const toneGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[step % notes.length], time);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, time);
        
        toneGain.gain.setValueAtTime(0, time);
        toneGain.gain.linearRampToValueAtTime(0.2, time + 0.2);
        toneGain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

        osc.connect(filter);
        filter.connect(toneGain);
        
        if (this.gainNode) {
          toneGain.connect(this.gainNode);
        } else {
          toneGain.connect(this.ctx.destination);
        }

        osc.start(time);
        osc.stop(time + 1.3);
        
        step++;
      };

      playTone();
      this.intervalId = setInterval(playTone, 1400);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }

  setVolume(vol: number) {
    this.volume = vol;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
    this.gainNode = null;
  }
}

interface ClothingStyle {
  id: string;
  name: string;
  englishName: string;
  category: "traditional" | "modern" | "evening" | "fusion" | "hairstyles";
  gender: "female" | "male";
  image: string;
  description: string;
  priceRange: string;
  rating: number;
  likes: string;
  fabric: string;
  occasions: string;
}

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<"home" | "scanner" | "saved" | "expert">("home");
  const [homeSubTab, setHomeSubTab] = useState<"showcase" | "social">("showcase");
  const [socialPlatform, setSocialPlatform] = useState<"all" | "instagram" | "tiktok">("all");
  const [activeGenderFilter, setActiveGenderFilter] = useState<"all" | "female" | "male">("all");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<ClothingStyle | null>(null);
  
  // Payment states
  const [paid, setPaid] = useState<boolean>(false);
  const [purchasedPackage, setPurchasedPackage] = useState<"today" | "weekly" | "monthly" | null>(null);
  const [purchasedTxnId, setPurchasedTxnId] = useState<string | null>(localStorage.getItem("clothing_app_txn_id"));
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<"today" | "weekly" | "monthly">("weekly");
  const [paymentStep, setPaymentStep] = useState<"package" | "telebirr_p2p" | "verifying" | "success">("package");
  const [txnId, setTxnId] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Expiration states
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");
  const [showExpiredModal, setShowExpiredModal] = useState<boolean>(false);
  const [expiredPackageName, setExpiredPackageName] = useState<string>("");
  
  // Scanner states
  const [scannerGender, setScannerGender] = useState<"female" | "male">("female");
  const [scanMode, setScanMode] = useState<"upper_body" | "whole_body">("upper_body");
  const [scannerPhoto, setScannerPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const [analysisImages, setAnalysisImages] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisProgressMsg, setAnalysisProgressMsg] = useState<string>("");

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Expert View States
  const [selectedSkinTone, setSelectedSkinTone] = useState<"honey" | "cocoa" | "wheat" | "ebony">("honey");
  const [selectedStar, setSelectedStar] = useState<any | null>(null);
  
  // Sound guide states
  const [volume, setVolume] = useState<number>(0.5);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const synthRef = useRef<AudioSynthController | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 30, 25, 45, 10, 35, 50, 20, 40, 15, 30, 25]);

  // Webcam & UI references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  const handlePackageExpired = (pkg: "today" | "weekly" | "monthly") => {
    localStorage.removeItem("clothing_app_paid");
    localStorage.removeItem("clothing_app_package");
    localStorage.removeItem("clothing_app_paid_time");
    setPaid(false);
    setPurchasedPackage(null);
    setExpiredPackageName(pkg === "today" ? "የዛሬ (የ1 ቀን)" : pkg === "weekly" ? "የሳምንት (የ7 ቀናት)" : "የወር (የ30 ቀናት)");
    setShowExpiredModal(true);
    setActiveTab("home");
  };

  // Load persistence states on Mount and handle countdown
  useEffect(() => {
    const savedPaid = localStorage.getItem("clothing_app_paid");
    const savedPkg = localStorage.getItem("clothing_app_package") as "today" | "weekly" | "monthly" | null;
    const savedPaidTime = localStorage.getItem("clothing_app_paid_time");

    if (savedPaid === "true" && savedPkg && savedPaidTime) {
      const paidTime = parseInt(savedPaidTime);
      let duration = 24 * 60 * 60 * 1000; // today
      if (savedPkg === "weekly") duration = 7 * 24 * 60 * 60 * 1000;
      if (savedPkg === "monthly") duration = 30 * 24 * 60 * 60 * 1000;

      const elapsed = Date.now() - paidTime;
      if (elapsed >= duration) {
        // Already expired
        handlePackageExpired(savedPkg);
      } else {
        setPaid(true);
        setPurchasedPackage(savedPkg);
      }
    }
    
    const savedFavs = localStorage.getItem("clothing_app_favs");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }
    
    // Create synthesizer instance
    synthRef.current = new AudioSynthController();
    
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      stopCamera();
    };
  }, []);

  // Expiration countdown check interval
  useEffect(() => {
    if (!paid) return;
    const checkExpiration = () => {
      const paidTimeStr = localStorage.getItem("clothing_app_paid_time");
      const savedPkg = localStorage.getItem("clothing_app_package") as "today" | "weekly" | "monthly" | null;
      if (!paidTimeStr || !savedPkg) return;

      const paidTime = parseInt(paidTimeStr);
      let duration = 24 * 60 * 60 * 1000; // today
      if (savedPkg === "weekly") duration = 7 * 24 * 60 * 60 * 1000;
      if (savedPkg === "monthly") duration = 30 * 24 * 60 * 60 * 1000;

      const elapsed = Date.now() - paidTime;
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        handlePackageExpired(savedPkg);
      } else {
        const totalMinutes = Math.floor(remaining / (60 * 1000));
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const days = Math.floor(hours / 24);
        
        let displayStr = "";
        if (days > 0) {
          displayStr = `${days} ቀን ከ ${hours % 24} ሰዓት`;
        } else if (hours > 0) {
          displayStr = `${hours} ሰዓት ከ ${mins} ደቂቃ`;
        } else {
          displayStr = `${mins} ደቂቃ ብቻ`;
        }
        setTimeLeftStr(displayStr);
      }
    };

    checkExpiration();
    const timer = setInterval(checkExpiration, 15000); // Check every 15 seconds
    return () => clearInterval(timer);
  }, [paid]);

  // Animate the sound wave visualizer if playing
  useEffect(() => {
    let interval: any;
    if (audioPlaying) {
      interval = setInterval(() => {
        setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 45) + 10));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [audioPlaying]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("clothing_app_favs", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleAudio = () => {
    if (audioPlaying) {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      setAudioPlaying(false);
    } else {
      if (synthRef.current) {
        synthRef.current.start(volume);
      }
      setAudioPlaying(true);
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (synthRef.current) {
      synthRef.current.setVolume(val);
    }
  };

  // Curated clothing designs with high quality model images for Men & Women
  const clothingStyles: ClothingStyle[] = [
    {
      id: "style-1",
      name: "ባህላዊ የሀበሻ ቀሚስ - Inspired by @danayit_mekbib on Instagram",
      englishName: "Classic Hand-woven Habesha Gown",
      category: "traditional",
      gender: "female",
      image: habeshaKemisImg,
      description: "በጥንቃቄ በእጅ የተሸመነ፣ ውብና ደማቅ ጥበብ ያለበት የሀበሻ ባህላዊ ቀሚስ። በታዋቂዋ ዲዛይነር እና አርቲስት ዳናይት መክቢብ የኢንስታግራም ገፅ ላይ ሰፊ እውቅና ያገኘው ይህ ልዩ አልባሳት ለሰርግ、ለልደትና ለባህላዊ በዓላት ፍጹም ምርጫ ነው። የሴቶችን ውበትና ኢትዮጵያዊ ክብር በላቀ ሁኔታ ያጎላል።",
      priceRange: "4,500 - 12,000 ETB",
      rating: 4.9,
      likes: "4.8k",
      fabric: "ንጹህ የኢትዮጵያ ጥጥ (Pure Ethiopian Cotton)",
      occasions: "ለባህላዊ በዓላት、ለሰርግ ስነ-ስርዓት、ለልዩ ግብዣዎች"
    },
    {
      id: "style-2",
      name: "ዘመናዊ የባህልና የፋሽን ውህደት - Inspired by @fryat_yemane on TikTok",
      englishName: "Modern Cultural Fusion Gown",
      category: "fusion",
      gender: "female",
      image: modernHabeshaImg,
      description: "የባህልና የዘመናዊ ፋሽን ድንቅ ጥምረት! በታዋቂዋ ፍርያት የማነ የቲክቶክና የኢንስታግራም ገፆች ላይ ታይቶ በሚሊዮን የሚቆጠሩ እይታዎችን ያገኘው ይህ ቀሚስ ከባህላዊ የሽመና ጥበብ ጋር ተዋህዶ በዘመናዊ ዲዛይን የተሰፋ የምሽት አልባሳት ነው። ለልዩ ግብዣዎች、ለዘመናዊ ሰርግ እና ለደማቅ ዝግጅቶች እጅግ ተስማሚ ነው።",
      priceRange: "6,000 - 15,500 ETB",
      rating: 4.8,
      likes: "3.2k",
      fabric: "ሐር እና ባህላዊ ጥበብ ድብልቅ (Silk & Traditional Blend)",
      occasions: "ለራት ግብዣዎች、ለምሽት ፓርቲዎች、ለኮክቴል ዝግጅቶች"
    },
    {
      id: "style-3",
      name: "ዘመናዊ የከተማ ቺክ አልባሳት - Curated from @yordi_tiktoker on TikTok",
      englishName: "Contemporary Urban Streetwear",
      category: "modern",
      gender: "female",
      image: modernCasualImg,
      description: "ዘመናዊ፣ ምቹ እና ማራኪ የዕለት ተዕለት የከተማ አልባሳት። በያርዳና በዮርዲ ቲክቶክ ቪዲዮዎች ላይ የተዋወቀው ይህ ስታይል ለስራ、ለትምህርት ቤት ወይም ለጓደኛ መገናኛዎች እጅግ ምቹ ነው። በቀላሉ ከጫማ እና ከኪስ ቦርሳ ጋር የሚቀናጅ ልዩ ዲዛይን ነው።",
      priceRange: "2,800 - 6,500 ETB",
      rating: 4.7,
      likes: "2.4k",
      fabric: "ፕሪሚየም ተለጣጭ ጥጥ (Premium Stretch Cotton & Denim)",
      occasions: "ለዕለት ተዕለት ውሎ、ለስራ ቦታ、ለጓደኞች መውጫ"
    },
    {
      id: "style-4",
      name: "የምሽት ማራኪ የራት ቀሚስ - Inspired by @melat_nebiyu on Instagram",
      englishName: "Glamorous Evening Dinner Gown",
      category: "evening",
      gender: "female",
      image: eveningGownImg,
      description: "ክብርን እና ውበትን የሚያላብስ ድንቅ የምሽት እራት ቀሚስ። በታዋቂዋ ተዋናይት መላት ነቢዩ የኢንስታግራም ገፆች ላይ በስፋት የታየ ሲሆን ከሐርና ከሳቲን የተሰራ፣ በደማቅ ቀለማትና በረቂቅ ዲዛይን የተዋበ ነው። ለትላልቅ የራት ግብዣዎችና ለኮክቴል ፓርቲዎች ተመራጭ ነው።",
      priceRange: "5,500 - 13,000 ETB",
      rating: 4.9,
      likes: "1.9k",
      fabric: "ሐር ሳቲን (High-grade Silk Satin & Organza)",
      occasions: "ለVIP የምሽት ግብዣዎች、ለሰርግ እራት、ለማዕረግ ስነ-ስርዓቶች"
    },
    {
      id: "hair-1",
      name: "ባህላዊ የአልባሶ ሹሩባ - Inspired by @hanan_tarq on Instagram",
      englishName: "Habesha Albaso Traditional Braiding",
      category: "hairstyles",
      gender: "female",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600",
      description: "በቲክቶክ ፋሽን አድናቂዎችና በታዋቂዋ ተዋናይት ሃናን ታርቅ ዘንድ እጅግ የተወደደው የሀበሻ ባህላዊ የአልባሶ (ቁንጮ) ሹሩባ ስታይል። ለልዩ ባህላዊ በዓላት፣ ለሰርግና ለክብር ግብዣዎች ምርጥ ውበትን ያጎናፅፋል።",
      priceRange: "1,500 - 3,500 ETB",
      rating: 4.9,
      likes: "3.7k",
      fabric: "ተፈጥሮአዊ የፀጉር አሰራር (Natural Braiding)",
      occasions: "ለሰርግ、ለባህላዊ ፌስቲቫል、ለልደት ፕሮግራሞች"
    },
    {
      id: "hair-2",
      name: "ዘመናዊ አፍሮ ከርል ፀጉር ዲዛይን - Curated from @abenezer_styles on TikTok",
      englishName: "Modern Afro Curl & Fade",
      category: "hairstyles",
      gender: "male",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
      description: "በቲክቶክ ፋሽን አድናቂ ወጣቶችና በታዋቂው የወንድ ሞዴል አቤኔዘር ዘንድ እጅግ ተወዳጅ የሆነ፣ ለወንዶች የሚስማማ ዘመናዊ የፀጉር ከርልና የጎን እቅጭ (Fade) ስታይል። ለዕለት ተዕለት ቺክ እና ለዘመናዊ መልክ ምርጥ ምርጫ ነው።",
      priceRange: "500 - 1,200 ETB",
      rating: 4.8,
      likes: "1.5k",
      fabric: "ዘመናዊ የፀጉር ማስተካከያ (Modern Curl Styling)",
      occasions: "ለእለት ተእለት、ለስራ、ለምሽት ፓርቲ"
    },
    {
      id: "hair-3",
      name: "ዘመናዊ የሴቶች የተፈጥሮ ፀጉር ስታይል - Inspired by @eyerus_dancer on TikTok",
      englishName: "Modern Black Natural Styling",
      category: "hairstyles",
      gender: "female",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=600",
      description: "በአሁኑ ሰዓት በቲክቶክ ላይ በዳንሰኛዋ እየሩስ ተወዳጅ የሆነው፣ ምቹ、ዘመናዊና የተፈጥሮ ፀጉርን ውበት የሚያጎላ የሴቶች የተፈጥሮ ፀጉር አሰራር ስታይል በAddis Beauty Studio የተዘጋጀ።",
      priceRange: "1,000 - 2,500 ETB",
      rating: 4.7,
      likes: "2.8k",
      fabric: "የተፈጥሮ ፀጉር እንክብካቤ (Natural Texturized Haircut)",
      occasions: "ለቢሮ、ለዕለት ተዕለት ቺክ、ለስابقةዎች"
    },
    {
      id: "style-5",
      name: "ባህላዊ የሰንበት አልባሳት - Inspired by @selam_tesfaye on Instagram",
      englishName: "Casual Sunday Traditional Wear",
      category: "traditional",
      gender: "female",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      description: "በታዋቂዋ ሰላም ተስፋዬ የኢንስታግራም ገፅ ላይ የተስተዋወቀው የቤተሰብ መሰብሰቢያ የሚሆን ቀለል ያለ የጥበብ አልባሳት። ክብደቱ ቀላል በመሆኑ ለረጅም ሰዓታት ለመልበስ እጅግ ምቹ ነው፤ ውበትንና ባህልን በአንድነት ያጣምራል።",
      priceRange: "3,200 - 5,500 ETB",
      rating: 4.6,
      likes: "740",
      fabric: "ቀጭን የሽመና ጥጥ (Light Ethiopian Cotton Yarn)",
      occasions: "ለእሁድ ፕሮግራሞች、ለቤት ውስጥ ስብሰባዎች、ለቅዳሜ ገበያ"
    },
    {
      id: "style-6",
      name: "ወቅታዊ የቢሮና ስራ አስፈጻሚ አልባሳት - Professional Corporate Look",
      englishName: "Modern Executive Workwear Suit",
      category: "modern",
      gender: "female",
      image: "https://images.unsplash.com/photo-1524250502761-136f25028110?auto=format&fit=crop&q=80&w=600",
      description: "ለዘመናዊ የስራ ሴቶች የተዘጋጀ ሳቢና ባለሙያነትን የሚያሳይ የቢሮ አልባሳት። ምቹ፣ በራስ መተማመንን የሚጨምር እና በስራ ቦታ ልዩ ውበትን የሚሰጥ ዘመናዊ ስታይል ነው።",
      priceRange: "3,800 - 7,000 ETB",
      rating: 4.8,
      likes: "610",
      fabric: "ተለጣጭ ፖሊ-ቪስኮስ (Structured Poly-Viscose Blend)",
      occasions: "ለስራ ስብሰባዎች、ለቢሮ ውሎ、ለንግድ ጉዞዎች"
    },
    {
      id: "style-m1",
      name: "ዘመናዊ የሀበሻ ጥበብ ሸሚዝ (ለወንዶች)",
      englishName: "Hand-woven Men's Cultural Shirt",
      category: "traditional",
      gender: "male",
      image: "https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=600",
      description: "በእጅ የተሸመነ የባህል ጥበብ ኮሌታና እጅጌ ያለው ዘመናዊ የወንዶች የሀበሻ ጥበብ ሸሚዝ። ለሰርግ፣ ለደማቅ ግብዣዎችና ለሃይማኖታዊ በዓላት ልዩ ውበትንና ክብርን ያላብሳል።",
      priceRange: "3,500 - 8,000 ETB",
      rating: 4.9,
      likes: "740",
      fabric: "ንጹህ የሀበሻ ጥጥና ጥበብ (Hand-woven Cotton with Traditional Pattern)",
      occasions: "ለሰርግ、ለልዩ ዝግጅቶች、ለባህላዊ ፕሮግራሞች"
    },
    {
      id: "style-m2",
      name: "ወቅታዊ የወንዶች የቢሮና ስራ አስፈጻሚ ሱፍ",
      englishName: "Modern Executive Workwear Suit",
      category: "modern",
      gender: "male",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
      description: "ለዘመናዊ ወንዶች የተዘጋጀ ሳቢና ባለሙያነትን የሚያሳይ ልዩ ሱፍ። ለእለት ተእለት የቢሮ ስራ፣ ለስብሰባዎችና ለንግድ ጉዞዎች ሙሉ በራስ መተማመንን የሚሰጥ ዘመናዊ ዲዛይን ነው።",
      priceRange: "7,000 - 15,000 ETB",
      rating: 4.8,
      likes: "910",
      fabric: "ተለጣጭ ፖሊ-ቪስኮስ (Structured Italian Poly-Blend)",
      occasions: "ለስራ ስብሰባዎች、ለንግድ እራት、ለቢሮ ውሎ"
    },
    {
      id: "style-m3",
      name: "የወንዶች የከተማ ምቹ ስታይል (Casual Smart)",
      englishName: "Contemporary Men's Casual Smart",
      category: "fusion",
      gender: "male",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
      description: "ለከተማ ውሎ፣ ለቅዳሜ እረፍትና ለጓደኛ መገናኛዎች የሚሆን ምቹና ዘመናዊ የወንዶች አልባሳት። በቀላሉ ከጂንስ ሱሪና ከስኒከር ጫማዎች ጋር የሚቀናጅ፣ ዘና ያለ ስሜትን የሚሰጥ ምርጫ ነው።",
      priceRange: "2,500 - 5,000 ETB",
      rating: 4.7,
      likes: "812",
      fabric: "ፕሪሚየም ጥጥ (Soft Denim & Cotton Blend)",
      occasions: "ለእለት ተእለት መውጫ、ለቅዳሜ እረፍት、ለጓደኞች ስብሰባ"
    },
    {
      id: "style-m4",
      name: "ልከኛ የሙስሊም አልባሳት - በኢትዮጵያ ባህላዊ ጥበብ የተዋበ አባያ (ለሴቶች)",
      englishName: "Elegant Islamic Abaya with Habesha Embroidery",
      category: "fusion",
      gender: "female",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600",
      description: "የኢትዮጵያን ባህላዊ በእጅ የተሸመነ የጥበብ ጌጣጌጥ ከረቂቅና ልከኛ እስላማዊ አባያ (Abaya) ጋር ያዋሃደ ድንቅ ስራ። ለጁምዓ ጸሎት፣ ለዒድ በዓልና ለተለያዩ ትላልቅ የቤተሰብ ፕሮግራሞች ፍጹም የሆነ የውበት መገለጫ ነው።",
      priceRange: "4,200 - 9,500 ETB",
      rating: 4.9,
      likes: "1.4k",
      fabric: "የተመረጠ የሳውዲ ሐር ከሀገር በቀል ጥበብ ጋር (Saudi Silk with Hand-woven Borders)",
      occasions: "ለጁምዓ ጸሎት、ለዒድ በዓላት、ለእለት ተእለት ልከኛ ፋሽን"
    },
    {
      id: "style-m5",
      name: "ወቅታዊ የሙስሊም ወንዶች ስማርት ጀለቢያና ካፍታን",
      englishName: "Modern Men's Islamic Jalabiya & Kaftan Set",
      category: "fusion",
      gender: "male",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600",
      description: "ለዘመናዊ ሙስሊም ወንዶች የተዘጋጀ፣ በረቂቅ ጥልፍ የተሸለመ ነጭ ጀለቢያ። ለዒድ በዓል፣ ለጁምዓ ሰላትና ለክብረ በዓል ግብዣዎች ሙሉ በራስ መተማመንን የሚያላብስ ድንቅና ክቡር ዲዛይን።",
      priceRange: "3,800 - 8,500 ETB",
      rating: 4.8,
      likes: "945",
      fabric: "ፕሪሚየም ቀጭን ሌንን (Premium Fine Linen)",
      occasions: "ለዒድ በዓል、ለጁምዓ ጸሎት、ለቤተሰብ ዝግጅቶች"
    },
    {
      id: "style-m6",
      name: "ባህላዊ የገናና ጥምቀት የነጠላ ስብስብ",
      englishName: "Festive Habesha Gown with Orthodox Netela",
      category: "traditional",
      gender: "female",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      description: "ለንጹህ የኦርቶዶክስ ተዋህዶ በዓላት (ጥምቀት፣ ፋሲካ፣ ገና) እና ለሰንበት ቤተክርስቲያን መርሃ-ግብሮች የተዘጋጀ ደማቅ የሀበሻ ቀሚስ። ባለ ጥልፍ ጥበቡ እና በንጽህና የተሸመነው ረጅም ነጠላ ልዩ መንፈሳዊ ሞገስን ይሰጣል።",
      priceRange: "5,000 - 14,000 ETB",
      rating: 4.9,
      likes: "2.1k",
      fabric: "የባህል ድርብ ድር ሽመና ጥጥ (Premium Double-thread Ethiopian Cotton)",
      occasions: "ለጥምቀት በዓል、ለገና በዓል、ለሰንበት ቅዳሴ"
    }
  ];

  // Filtering Logic for showcase
  const filteredStyles = clothingStyles.filter(style => {
    const matchesGender = activeGenderFilter === "all" || style.gender === activeGenderFilter;
    const matchesCategory = activeCategoryFilter === "all" || style.category === activeCategoryFilter;
    return matchesGender && matchesCategory;
  });

  // Handle click on premium feature
  const handleOpenScanner = () => {
    if (paid) {
      setActiveTab("scanner");
    } else {
      setPaymentStep("package");
      setShowPaymentModal(true);
    }
  };

  // Handle Package Selection inside Modal
  const handleSelectPackage = (pkg: "today" | "weekly" | "monthly") => {
    setSelectedPackage(pkg);
    setPaymentStep("telebirr_p2p");
  };

  // Handle transaction submission via Gemini vision receipt verification
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotPreview) {
      setPaymentError("እባክዎን የቴሌብር ክፍያ ማረጋገጫ ደረሰኝ ፎቶ (Screenshot) ይጫኑ።");
      return;
    }

    setPaymentStep("verifying");
    setPaymentError(null);

    const expectedAmount = selectedPackage === "today" ? 50 : selectedPackage === "weekly" ? 100 : 300;

    try {
      const response = await fetch("/api/verify-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: screenshotPreview,
          expectedAmount,
          senderName: senderName || "Guest"
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "የደረሰኝ ማረጋገጫው አልተሳካም። እባክዎን ጥራት ያለው ፎቶ እንደገና ይጫኑ።");
      }

      const result = await response.json();

      if (result.isValid) {
        setPaymentStep("success");
        setPaid(true);
        setPurchasedPackage(selectedPackage);
        setPurchasedTxnId(result.extractedTxnId || "DEMO_TXN_" + Date.now());
        localStorage.setItem("clothing_app_paid", "true");
        localStorage.setItem("clothing_app_package", selectedPackage);
        localStorage.setItem("clothing_app_paid_time", Date.now().toString());
        localStorage.setItem("clothing_app_txn_id", result.extractedTxnId || "DEMO_TXN_" + Date.now());
      } else {
        setPaymentStep("telebirr_p2p");
        setPaymentError(result.explanation || "ደረሰኙ ልክ አይደለም፤ እባክዎን ትክክለኛ የቴሌብር ማረጋገጫ ይጫኑ።");
      }
    } catch (err: any) {
      console.error("Payment Verification Error:", err);
      setPaymentStep("telebirr_p2p");
      setPaymentError(err.message || "የደረሰኝ ማረጋገጫ ሂደቱ ላይ ችግር አጋጥሟል፤ እባክዎን እንደገና ይሞክሩ።");
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSenderName("");
    setScreenshotPreview(null);
    setPaymentError(null);
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = "";
    }
  };

  const handleResetDemo = () => {
    localStorage.removeItem("clothing_app_paid");
    localStorage.removeItem("clothing_app_package");
    localStorage.removeItem("clothing_app_txn_id");
    setPaid(false);
    setPurchasedPackage(null);
    setPurchasedTxnId(null);
    setAnalysisResult(null);
    setAnalysisImage(null);
    setAnalysisImages([]);
    setScannerPhoto(null);
    setActiveTab("home");
  };

  // Handle receipt screenshot file picker with client-side compression (or raw PDF)
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resultStr = reader.result as string;
        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
          setScreenshotPreview(resultStr);
        } else {
          const compressed = await compressImage(resultStr);
          setScreenshotPreview(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle scanner photo file picker with client-side compression
  const handleScannerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setScannerPhoto(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  // HTML5 Camera controller
  const startCamera = async (mode: "user" | "environment" = cameraFacingMode) => {
    try {
      setCameraActive(true);
      setScannerPhoto(null);
      
      // Stop existing tracks to avoid conflicts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access failed", err);
      alert("ካሜራ ለመክፈት አልተቻለም። እባክዎን የፎቶ ፋይል መጫኛውን (Upload) ይጠቀሙ።");
      setCameraActive(false);
    }
  };

  const toggleCamera = async () => {
    const newMode = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(newMode);
    if (cameraActive) {
      await startCamera(newMode);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setScannerPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  // Submit and call server-side Gemini API
  const handleAnalyzeStyle = async () => {
    if (!scannerPhoto) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisImage(null);
    setAnalysisImages([]);
    setAnalysisError(null);

    // Dynamic loading message loops for high fidelity experience
    const progressMsgs = [
      "ምስልዎን በመጫን ላይ... (Uploading Photo)",
      "የፊትዎን እና የሰውነትዎን ቅርፅ በመተንተን ላይ... (Analyzing features)",
      "ለቆዳዎ ከለር የሚስማሙ ምርጥ ቀለማትን በመምረጥ ላይ... (Matching colors)",
      "የፀጉርዎን አይነትና ምርጥ ፀጉር ስታይል በማዘጋጀት ላይ... (Selecting hair trends)",
      "ቀን፣ ሳምንትና ወር የፋሽን ፕላን በማጠናቀር ላይ... (Compiling lookbook)"
    ];

    let step = 0;
    setAnalysisProgressMsg(progressMsgs[0]);
    const msgInterval = setInterval(() => {
      step = (step + 1) % progressMsgs.length;
      setAnalysisProgressMsg(progressMsgs[step]);
    }, 2500);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: scannerPhoto,
          packageType: purchasedPackage || "today",
          gender: scannerGender,
          scanMode: scanMode,
          txnId: purchasedTxnId
        }),
      });

      const data = await response.json();
      clearInterval(msgInterval);

      if (!response.ok) {
        throw new Error(data.error || "የስታይል ትንተናው ሊሳካ አልቻለም።");
      }

      setAnalysisResult(data.recommendation);
      if (data.generatedImages && data.generatedImages.length > 0) {
        setAnalysisImage(data.generatedImages[0]);
        setAnalysisImages(data.generatedImages);
      } else if (data.generatedImage) {
        setAnalysisImage(data.generatedImage);
        setAnalysisImages([data.generatedImage]);
      }
    } catch (err: any) {
      clearInterval(msgInterval);
      setAnalysisError(err.message || "የስታይል ትንተናው ሊሳካ አልቻለም። እባክዎን እንደገና ይሞክሩ።");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="app-container" className="min-h-screen bg-rose-50/20 text-slate-900 font-sans flex flex-col relative overflow-x-hidden selection:bg-rose-200/50">
      
      {/* Upper Brand Header */}
      <nav className="w-full bg-white/85 backdrop-blur-md border-b border-rose-100/50 px-4 py-3.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200/50 p-1">
              <ModelGirlSilhouette className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-black text-rose-950 tracking-tight text-base sm:text-lg block">ማኪ (Maki)</span>
              <span className="text-[10px] text-slate-400 font-bold block -mt-1 tracking-wider uppercase">Fashion & Hair Style Advisor</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "home"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "text-slate-600 hover:bg-rose-50/50"
              }`}
            >
              አልባሳት (Showcase)
            </button>
            <button
              onClick={() => setActiveTab("expert")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "expert"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "text-slate-600 hover:bg-rose-50/50"
              }`}
            >
              የባለሙያ ምክር (Star Guide)
            </button>
            <button
              onClick={handleOpenScanner}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === "scanner"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : paid
                  ? "text-rose-600 bg-rose-50/80 hover:bg-rose-100/50 border border-rose-100"
                  : "bg-amber-400 text-slate-950 font-black hover:bg-amber-500"
              }`}
            >
              <Sparkle className="w-3 h-3 fill-current animate-spin-slow" />
              የእኔ የስታይል ምክር
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "saved"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "text-slate-600 hover:bg-rose-50/50"
              }`}
            >
              የተወደዱ ({favorites.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 flex-1 flex flex-col gap-8">
        
        {/* TOP INTERACTIVE BANNER */}
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-rose-100">
          <div className="absolute right-0 bottom-0 opacity-20 translate-y-6 translate-x-6 pointer-events-none">
            <ModelGirlSilhouette className="w-72 h-72 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-white/25 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-rose-50 inline-block">
              የኢትዮጵያ የመጀመሪያው የፋሽንና የፀጉር ስታይል አማካሪ
            </span>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              የፊትዎን ቅርፅና ከለር በመቃኘት ለእርስዎ የሚስማማውን አልባሳትና የፀጉር ስታይል ይወቁ!
            </h1>
            <p className="text-xs sm:text-sm text-rose-50 leading-relaxed max-w-xl">
              ፎቶዎን በማንሳት ብቻ ለእርስዎ የሚስማማውን የወንድና የሴት ስታይል፣ የፀጉር ዲዛይንና የዕለት ተዕለት አልባሳት ዝርዝር በማኪ የፋሽን አማካሪነት በሰከንዶች ውስጥ ያግኙ።
            </p>
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              <button
                onClick={handleOpenScanner}
                className="bg-slate-950 text-white hover:bg-slate-900 px-5 py-3 rounded-full text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-lg"
              >
                {paid ? "የእኔን ስታይል ጀምር" : "የስታይልና የፀጉር አማካሪ ጀምር (ከ50 ብር ጀምሮ)"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {paid && (
                <span className="text-[11px] font-bold text-amber-300 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-300/30 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  የተከፈተ ፓኬጅ: {purchasedPackage === "today" ? "የ1 ቀን" : purchasedPackage === "weekly" ? "የ1 ሳምንት" : "የ1 ወር"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* VIEW 1: HOME CATALOGUE / CURATED SHOWCASE */}
        {activeTab === "home" && (
          <div className="space-y-8">
            
            {/* WHY CHOOSE MAKI & DAILY OUTFIT PLANNER BENTO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              
              {/* Left Column: Why Choose Maki (Impact Section) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-rose-50/50 to-amber-50/30 rounded-3xl p-6 border border-rose-100/40 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100/50 text-rose-700 text-xs font-bold rounded-full">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    ለምን የማኪ ስታይል መማክርት?
                  </div>
                  <h3 className="text-xl font-black text-rose-950 leading-snug">
                    ለዕለት ተዕለት ኑሮዎና በዓላትዎ የተዘጋጀ ልዩ የኢትዮጵያውያን መመሪያ
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    የማኪ ስታይል አማካሪ መተግበሪያ በኢትዮጵያ ውስጥ የመጀመሪያው በምስል ንባብ (Gemini API) የታገዘ የስታይል መማክርት ነው። ቀንዎን በራስ መተማመን እንዲጀምሩ፣ በስራ ቦታዎ ብቁና ዘመናዊ ሆነው እንዲታዩ እንዲሁም ለሃይማኖታዊ በዓላት ተገቢውን ባህላዊ ክብር እንዲያላብሱ ይረዳዎታል።
                  </p>
                  
                  {/* Key Benefits List */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">ለሁሉም እምነትና ባህል ተስማሚ</h4>
                        <p className="text-[10px] text-slate-500">የኦርቶዶክስ ባህላዊ የጥጥ አልባሳት (ነጠላ) እና የሙስሊም ልከኛ ፋሽኖች (አባያ፣ ጀለቢያ) ሙሉ ስብስብ።</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">ዕለታዊ የመውጫ እቅድ አውጪ</h4>
                        <p className="text-[10px] text-slate-500">ከስራ መግባት በፊት፣ ለጁምዓ ሰላት፣ ለእሁድ መርሃ-ግብር ወይም ለሰርግ የሚስማማውን አልባሳት በአንድ ጠቅታ ይለዩ።</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">በቴሌብር ፈጣን ክፍያ የተዘጋጀ</h4>
                        <p className="text-[10px] text-slate-500">ማንኛውንም የስታይል መቃኛና ትንተና ፈጣን በሆነውና ባላችሁበት ቦታ ሆነው በቴሌብር ክፍያ ያግኙ።</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Daily Occasion Planner */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-rose-500" />
                        የዛሬው የስታይል ዕቅድ አውጪ (Occasion Planner)
                      </h3>
                      <p className="text-[11px] text-slate-500">የሚሄዱበትን መርሃ-ግብር ይምረጡና የሚስማማዎትን ዲዛይን ይመልከቱ</p>
                    </div>
                  </div>

                  {/* Scenarios Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    <button
                      onClick={() => {
                        setActiveGenderFilter("all");
                        setActiveCategoryFilter("modern");
                        setHomeSubTab("showcase");
                      }}
                      className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/20 text-left transition-all group"
                    >
                      <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-slate-800 group-hover:text-rose-700 transition-colors">ሥራና ዕለታዊ ቢሮ (Office)</span>
                        <p className="text-[9px] text-slate-400">ለስብሰባ፣ ለድርጅት ስራና ለሙያዊ እይታ የሚስማሙ ምቹ ዘመናዊ ልብሶች</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveGenderFilter("all");
                        setActiveCategoryFilter("fusion");
                        setHomeSubTab("showcase");
                      }}
                      className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 text-left transition-all group"
                    >
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-slate-800 group-hover:text-amber-700 transition-colors">የጁምዓና እስልምና በዓላት (Islamic)</span>
                        <p className="text-[9px] text-slate-400">ለጁምዓ ጸሎትና ለዒድ በዓላት የሚሆኑ በእጅ ጥልፍ ያሸበረቁ አባያና ጀለቢያዎች</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveGenderFilter("female");
                        setActiveCategoryFilter("traditional");
                        setHomeSubTab("showcase");
                      }}
                      className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/20 text-left transition-all group"
                    >
                      <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-slate-800 group-hover:text-sky-700 transition-colors">የኦርቶዶክስ ክብረ-በዓላት (Orthodox)</span>
                        <p className="text-[9px] text-slate-400">ለጥምቀት፣ ለገናና ለቅዳሴ የሚሆኑ ደማቅ የሀበሻ ቀሚሶች ከነጠላ ጋር</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveGenderFilter("all");
                        setActiveCategoryFilter("all");
                        setHomeSubTab("showcase");
                      }}
                      className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 text-left transition-all group"
                    >
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-700 transition-colors">ሰርግና ማህበራዊ ግብዣዎች</span>
                        <p className="text-[9px] text-slate-400">ለባህላዊና ዘመናዊ ሰርግ፣ ለራት ግብዣዎችና ምሽቶች የሚሆኑ ድንቅ አልባሳት</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="bg-slate-50 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-600">ለእርስዎ የሚስማማውን ስታይል ለማወቅ የፊት ቅርፅዎን መቃኘት ይፈልጋሉ?</span>
                  </div>
                  <button
                    onClick={handleOpenScanner}
                    className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] px-4 py-2 rounded-xl transition active:scale-95"
                  >
                    በካሜራ እራስዎን ይፈትሹ
                  </button>
                </div>
              </div>

            </div>

            {/* Home Sub-Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl max-w-sm sm:max-w-md mx-auto sm:mx-0 shadow-inner">
              <button
                onClick={() => setHomeSubTab("showcase")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  homeSubTab === "showcase"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                የተመረጡ አልባሳት (Catalog)
              </button>
              <button
                onClick={() => setHomeSubTab("social")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  homeSubTab === "social"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                ትኩስ ማህበራዊ ሚዲያ (Social Trends)
              </button>
            </div>

            {homeSubTab === "social" ? (
              <div className="space-y-6 animate-fade-in">
                {/* Social Filters Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100/40 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-rose-950 flex items-center gap-1.5">
                      ትኩስ የማህበራዊ ሚዲያ ፋሽኖች
                    </h2>
                    <p className="text-xs text-slate-500">ከኢንስታግራም እና ቲክቶክ የተሰበሰቡ የወቅቱ ምርጥ አልባሳትና የፀጉር ስታይሎች</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Platform Selector */}
                    <div className="bg-white p-1 rounded-full border border-rose-100 flex items-center shadow-sm">
                      {[
                        { id: "all", label: "ሁሉም ሚዲያ" },
                        { id: "instagram", label: "Instagram" },
                        { id: "tiktok", label: "TikTok" }
                      ].map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => setSocialPlatform(platform.id as any)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            socialPlatform === platform.id
                              ? "bg-rose-500 text-white"
                              : "text-slate-600 hover:text-slate-950"
                          }`}
                        >
                          {platform.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Posts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {socialTrends
                    .filter(post => socialPlatform === "all" || post.platform === socialPlatform)
                    .map(post => (
                      <div 
                        key={post.id}
                        className="bg-white rounded-3xl overflow-hidden border border-rose-100/40 shadow-sm flex flex-col group relative"
                      >
                        {/* Post Header */}
                        <div className="p-4 flex items-center justify-between border-b border-slate-50">
                          <div className="flex items-center gap-2.5">
                            <img src={post.avatar} alt={post.handle} className="w-8 h-8 rounded-full object-cover border border-rose-100" />
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-extrabold text-[11px] text-slate-800">{post.handle}</span>
                                <span className="w-3 h-3 bg-blue-500 text-white rounded-full flex items-center justify-center text-[7px] font-black">✓</span>
                              </div>
                              <span className="text-[9px] text-slate-400 capitalize">{post.platform} • ዛሬ የወጣ</span>
                            </div>
                          </div>
                          
                          {/* Platform Badge */}
                          <div className={`p-1.5 rounded-xl ${post.platform === "instagram" ? "bg-gradient-to-tr from-amber-500 via-pink-500 to-violet-600 text-white" : "bg-slate-950 text-white"}`}>
                            {post.platform === "instagram" ? (
                              <Instagram className="w-3.5 h-3.5" />
                            ) : (
                              <Smartphone className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </div>

                        {/* Post Media Container */}
                        <div className="relative aspect-square bg-slate-100 overflow-hidden group/media">
                          <img 
                            src={post.image} 
                            alt={post.handle} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/media:scale-105 transition-all duration-500" 
                          />
                          
                          {/* Overlay call to action to use face-analysis scanner */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 gap-2 text-center backdrop-blur-[2px]">
                            <span className="text-white text-xs font-black tracking-wide bg-rose-500/90 px-3 py-1.5 rounded-full shadow-lg">በማኪ አስመርጥ!</span>
                            <p className="text-[10px] text-rose-50 max-w-[200px]">ይህንን ስታይል ለፊትዎ ቅርፅና ከለር የሚስማማ መሆኑን በማኪ ይተንትኑት</p>
                            <button
                              onClick={() => {
                                if (paid) {
                                  if (post.category === "haircut") {
                                    setScannerGender("male");
                                  } else {
                                    setScannerGender("female");
                                  }
                                  setActiveTab("scanner");
                                } else {
                                  setPaymentStep("package");
                                  setShowPaymentModal(true);
                                }
                              }}
                              className="bg-white hover:bg-slate-50 text-rose-650 font-black px-4 py-2 rounded-xl text-[10px] shadow-lg transition active:scale-95"
                            >
                              የእኔን ስታይል ጀምር
                            </button>
                          </div>
                        </div>

                        {/* Social Interactions */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            {/* Likes and stats */}
                            <div className="flex items-center gap-4 text-xs font-extrabold text-slate-600">
                              <span className="flex items-center gap-1 hover:text-rose-550 cursor-pointer">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-slate-400">💬</span>
                                {post.comments}
                              </span>
                              {post.views && (
                                <span className="text-slate-400 font-normal ml-auto text-[10px]">{post.views} እይታዎች</span>
                              )}
                            </div>

                            {/* Caption translation block */}
                            <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                              {post.descriptionAmh}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                              "{post.descriptionEng}"
                            </p>
                          </div>

                          {/* Hashtags and Category */}
                          <div className="pt-2 border-t border-slate-50 space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-bold text-rose-600 bg-rose-50/50 px-2 py-0.5 rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <button
                              onClick={() => {
                                if (paid) {
                                  if (post.category === "haircut") {
                                    setScannerGender("male");
                                  } else {
                                    setScannerGender("female");
                                  }
                                  setActiveTab("scanner");
                                } else {
                                  setPaymentStep("package");
                                  setShowPaymentModal(true);
                                }
                              }}
                              className="w-full py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-[10px] font-black shadow-md hover:opacity-95 transition flex items-center justify-center gap-1"
                            >
                              <Sparkle className="w-3 h-3 text-amber-200 fill-current animate-pulse" />
                              በማኪ ይሞክሩት (Try with Maki)
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header filter options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100/40 pb-4">
              <div>
                <h2 className="text-xl font-black text-rose-950 flex items-center gap-1.5">
                  የተመረጡ የፋሽን ዲዛይኖች
                </h2>
                <p className="text-xs text-slate-500">ለወንዶችና ለሴቶች የሚሆኑ ምርጥ ባህላዊ፣ ዘመናዊና የምሽት አልባሳት</p>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Gender Filters */}
                <div className="bg-white p-1 rounded-full border border-rose-100 flex items-center shadow-sm">
                  {[
                    { id: "all", label: "ሁሉም" },
                    { id: "female", label: "ሴቶች" },
                    { id: "male", label: "ወንዶች" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveGenderFilter(tab.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        activeGenderFilter === tab.id
                          ? "bg-rose-500 text-white"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Category Filters */}
                <div className="bg-white p-1 rounded-full border border-rose-100 flex items-center shadow-sm">
                  {[
                    { id: "all", label: "ሁሉም አይነት" },
                    { id: "traditional", label: "ባህላዊ" },
                    { id: "fusion", label: "ውህድ" },
                    { id: "modern", label: "ዘመናዊ" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategoryFilter(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        activeCategoryFilter === tab.id
                          ? "bg-rose-100/70 text-rose-950"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStyles.map(style => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className="bg-white rounded-3xl overflow-hidden border border-rose-100/40 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col group relative"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <span className="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {style.category === "traditional" ? "ባህላዊ" : style.category === "fusion" ? "ውህድ" : style.category === "modern" ? "ዘመናዊ" : "የምሽት"}
                    </span>

                    <span className="absolute top-3 right-12 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      {style.gender === "female" ? "ሴት" : "ወንድ"}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(style.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-rose-500 hover:bg-rose-50 active:scale-90 transition"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorites.includes(style.id) ? "fill-current" : ""}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg flex items-center gap-1 text-[9px] font-bold">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span>{style.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-rose-600 transition-colors">
                        {style.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                        {style.englishName}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 pt-1">
                        {style.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-rose-50/60 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">የስፌት ግምት ዋጋ</span>
                        <span className="text-xs font-black text-rose-950">{style.priceRange}</span>
                      </div>
                      <span className="text-rose-500 text-[10px] font-black group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        ዝርዝር መግለጫ <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
            )}

            {/* Interactive Voice Helper Banner */}
            <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-4">
                <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 flex items-center justify-center">
                  <Play className="w-6 h-6 text-rose-500 fill-current animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800">የድምፅ ረዳት ገለፃ ማጫወቻ (Voice Assistant Guide)</h4>
                  <p className="text-xs text-slate-500 max-w-md mt-0.5 leading-relaxed">
                    ስለ ማኪ የፋሽንና የፀጉር መምረጫ አጠቃቀምና ክፍያ አጭር የድምፅ ማብራሪያ ለማዳመጥ ይጫወቱ።
                  </p>
                </div>
              </div>

              {/* Player element */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {audioPlaying && (
                  <div className="flex items-end gap-1 h-6 shrink-0 mr-2">
                    {waveHeights.slice(0, 8).map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="w-1 bg-rose-500 rounded-full transition-all duration-150"></div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={toggleAudio}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    audioPlaying 
                      ? "bg-rose-550 text-white" 
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {audioPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {audioPlaying ? "ድምፅ አቁም (Stop)" : "ድምፅ አጫውት (Play)"}
                </button>

                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                  <Volume2 className="w-4 h-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: AI STYLE & HAIR SCANNER (UNLOCKED AFTER PAYMENT) */}
        {activeTab === "scanner" && (
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                የተከፈተ ፕሪሚየም አገልግሎት (Premium Unlocked)
              </span>
              <h2 className="text-2xl font-black text-slate-900">የማኪ የፋሽንና የፀጉር ስታይል አማካሪ</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                የእርስዎን ፎቶ እዚህ ያክሉ ወይም በካሜራ ያንሱ። ማኪ የፊትዎን ቅርፅና የሰውነትዎን ከለር በማጣጣም ምርጡን ምክረ-ሃሳብ ታዘጋጃለች።
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Side: Photo Capture / Upload */}
              <div className="space-y-4">
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl aspect-[4/3] overflow-hidden relative flex flex-col items-center justify-center p-4">
                  {cameraActive ? (
                    <div className="w-full h-full relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-2xl"></video>
                      <button
                        onClick={toggleCamera}
                        className="absolute top-2 left-2 px-2.5 py-1.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 flex items-center gap-1.5 text-[10px] font-bold shadow-md"
                        title="ካሜራ ቀይር (Flip Camera)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>ቀይር (Flip)</span>
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white font-extrabold px-5 py-2.5 rounded-full shadow-lg hover:bg-rose-600 flex items-center gap-1.5 text-xs transition active:scale-95 z-10"
                      >
                        <Camera className="w-4 h-4" />
                        ፎቶ አንሳ (Capture)
                      </button>
                      <button
                        onClick={stopCamera}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-950"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : scannerPhoto ? (
                    <div className="w-full h-full relative">
                      <img src={scannerPhoto} alt="User style" className="w-full h-full object-cover rounded-2xl" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => setScannerPhoto(null)}
                          className="p-2 rounded-full bg-slate-950/85 text-white hover:bg-slate-900 shadow-md transition"
                          title="ፎቶ ቀይር"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">ምስልዎን እዚህ ያስገቡ</p>
                        <p className="text-[10px] text-slate-400">ከፊትዎ ጀምሮ እስከ ደረትዎ ድረስ በግልጽ የሚታይ ፎቶ ይምረጡ</p>
                      </div>
                      
                      <div className="flex gap-2.5 justify-center pt-2">
                        <button
                          onClick={startCamera}
                          className="px-4 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-rose-100"
                        >
                          <Camera className="w-4 h-4" />
                          ካሜራ ክፈት (Camera)
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                        >
                          <Upload className="w-4 h-4" />
                          ፎቶ ምረጥ (Upload)
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleScannerPhotoChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Profile Preferences selection */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <span className="block font-bold text-slate-700">የአለባበስ ጾታ (Gender):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setScannerGender("female")}
                        className={`py-2 px-3 rounded-xl font-bold border transition ${
                          scannerGender === "female"
                            ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        ሴት (Female)
                      </button>
                      <button
                        onClick={() => setScannerGender("male")}
                        className={`py-2 px-3 rounded-xl font-bold border transition ${
                          scannerGender === "male"
                            ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        ወንድ (Male)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block font-bold text-slate-700">የፎቶ ትኩረት (Scan Focus):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setScanMode("upper_body")}
                        className={`py-2 px-3 rounded-xl font-bold text-center border transition ${
                          scanMode === "upper_body"
                            ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        የላይኛው አካል (Upper Body)
                      </button>
                      <button
                        onClick={() => setScanMode("whole_body")}
                        className={`py-2 px-3 rounded-xl font-bold text-center border transition ${
                          scanMode === "whole_body"
                            ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        ሙሉ ሰውነት (Whole Body)
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 flex gap-2 text-[10px] text-amber-900 leading-normal">
                    <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block">የእርስዎ የክፍያ ፓኬጅ:</span>
                      የተከፈተልዎ ፓኬጅ {purchasedPackage === "today" ? "የዛሬ (የ1 ቀን)" : purchasedPackage === "weekly" ? "የ1 ሳምንት" : "የ1 ወር"} የፋሽንና የፀጉር ስታይል ፕላነር ነው። በዚሁ መሰረት የተሟላ መረጃ ይዘጋጃል።
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeStyle}
                  disabled={!scannerPhoto || isAnalyzing}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2.5 transition active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-white animate-spin"></div>
                      ማኪ ትንታኔ በመስራት ላይ...
                    </>
                  ) : (
                    <>
                      <ModelGirlSilhouette className="w-5 h-5 text-rose-400 animate-pulse" />
                      የእኔን ስታይልና ፀጉር በማኪ አስመርጥ
                    </>
                  )}
                </button>
              </div>

              {/* Right Side: AI Styling Result display */}
              <div className="bg-slate-50 rounded-3xl border border-slate-100/80 p-5 flex flex-col justify-between min-h-[380px]">
                {isAnalyzing ? (
                  <div className="my-auto flex flex-col items-center text-center space-y-4 py-12 animate-fade-in">
                    {/* Animated Face Scan lines */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 flex items-center justify-center">
                      {scannerPhoto ? (
                        <img src={scannerPhoto} alt="scanning" className="w-full h-full object-cover opacity-50" />
                      ) : (
                        <User className="w-10 h-10 text-slate-300" />
                      )}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-400 animate-scan z-10 shadow-lg shadow-rose-300"></div>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-black text-sm text-slate-800 animate-pulse">ማኪ እያዘጋጀች ነው...</h4>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-xs">{analysisProgressMsg}</p>
                    </div>
                  </div>
                ) : analysisError ? (
                  <div className="my-auto flex flex-col items-center text-center space-y-3 py-10">
                    <span className="text-3xl">⚠️</span>
                    <h4 className="font-bold text-sm text-rose-900">የስታይል ትንተና ስህተት</h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-normal">{analysisError}</p>
                    <button
                      onClick={handleAnalyzeStyle}
                      className="px-4 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs"
                    >
                      እንደገና ሞክር (Retry)
                    </button>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-rose-100/60 pb-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
                        <h3 className="font-extrabold text-sm text-rose-950">የማኪ ልዩ የስታይል መመሪያ (Style Guide)</h3>
                      </div>
                      
                      <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 font-bold font-mono">
                        Maki Style Advisor
                      </div>
                    </div>

                    {/* Scrollable recommendation block */}
                    <div className="flex-1 max-h-[440px] overflow-y-auto pr-1 text-slate-700 leading-relaxed text-xs space-y-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-inner">
                      {analysisImage && (
                        <div className="space-y-3 border-b border-rose-100 pb-4 mb-4">
                          <span className="text-[10px] bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100 font-black uppercase tracking-wider inline-block">
                            የእርስዎ ዲዛይን ቅድመ-ዕይታ (Your Styling Lookbook Gallery)
                          </span>
                          <div className="relative aspect-[3/4] max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-rose-100 shadow-md bg-slate-50">
                            <img 
                              src={analysisImage} 
                              alt="Generated style recommendation preview" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-all duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 text-white text-center">
                              <p className="text-[10px] font-bold">የፊትና የሰውነት ቅርፅ ቅንጅት ቅድመ-ዕይታ</p>
                              <p className="text-[8px] text-slate-300">Generated dynamically by Maki</p>
                            </div>
                          </div>
                          
                          {/* Thumbnails list if there are multiple images */}
                          {analysisImages.length > 1 && (
                            <div className="flex gap-2 justify-center overflow-x-auto py-2 px-1">
                              {analysisImages.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setAnalysisImage(img)}
                                  className={`w-12 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                                    analysisImage === img ? "border-rose-500 scale-105 shadow-sm" : "border-slate-200 opacity-70 hover:opacity-100"
                                  }`}
                                >
                                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <SimpleMarkdownRenderer text={analysisResult} />
                    </div>

                    <div className="pt-4 border-t border-slate-200/50 flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(analysisResult);
                          alert("የማኪ የስታይል ምክረ-ሃሳብ በተሳካ ሁኔታ ተገልብጧል (Copied to clipboard!)");
                        }}
                        className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        ኮፒ አድርግ (Copy Text)
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="py-2.5 px-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-rose-100"
                      >
                        <Download className="w-4 h-4" />
                        ሴቭ / ፕሪንት (Print)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto flex flex-col items-center text-center space-y-3.5 py-12">
                    <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 p-2.5">
                      <ModelGirlSilhouette className="w-full h-full" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-800">ምስልዎን ያስገቡና ስታይል መምረጫ ይጀምሩ</h4>
                      <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                        ከግራ በኩል ፎቶዎን ካከሉ በኋላ 'በማኪ አስመርጥ' የሚለውን በመጫን ለእርስዎ ተብሎ የተዘጋጀውን የተሟላ የፋሽንና የፀጉር ስታይል እዚህ ይመልከቱ።
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: SAVED FAVORITES */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-rose-950">የተወደዱ አልባሳት ዲዛይኖች ({favorites.length})</h2>
              <p className="text-xs text-slate-500">ለቀጣይ ስፌት እንዲመችዎ ምልክት ያደረጓቸው ውብ ዲዛይኖች</p>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clothingStyles
                  .filter(style => favorites.includes(style.id))
                  .map(style => (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className="bg-white rounded-3xl overflow-hidden border border-rose-100/40 shadow-sm hover:shadow-md cursor-pointer flex flex-col group relative"
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={style.image}
                          alt={style.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <span className="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {style.category === "traditional" ? "ባህላዊ" : style.category === "fusion" ? "ውህድ" : style.category === "modern" ? "ዘመናዊ" : "የምሽት"}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(style.id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-rose-500 hover:bg-rose-50 transition"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-rose-600 transition-colors">
                            {style.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                            {style.englishName}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-rose-50/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">የስፌት ግምት ዋጋ</span>
                            <span className="text-xs font-black text-rose-950">{style.priceRange}</span>
                          </div>
                          <span className="text-rose-500 text-[10px] font-black flex items-center gap-0.5">
                            ዝርዝር <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-rose-100/50 p-6 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-700">ምንም የተወደደ አልባሳት የለም</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    በአልባሳት መምረጫው ላይ የሚወዱትን አልባሳት የልብ ምልክቱን በመጫን እዚህ ማስቀመጥና በኋላ በቀላሉ ለባለሙያዎ ማሳየት ይችላሉ።
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="px-5 py-2.5 bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-100"
                >
                  ወደ አልባሳት ዝርዝር ሂድ
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: EXPERT SKIN TONE & CELEBRITY STYLE GUIDE */}
        {activeTab === "expert" && (
          <div className="space-y-8 animate-fade-in" id="expert-guide-tab">
            
            {/* Header section */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest inline-block shadow-sm">
                ⭐ የፋሽንና የፀጉር ባለሙያ መማሪያ (Expert Advisor) ⭐
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-950">የቆዳ ከለርና የከዋክብት (Stars) ስታይል መምሪያ</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                በማኪ ልዩ የፋሽንና የፀጉር ባለሙያ እገዛ ለቆዳዎ አይነትና ለፊትዎ ቅርፅ የሚስማማውን ምርጥ አልባሳትንና የፀጉር ስታይሎችን በታዋቂ የሀገር ውስጥ ከዋክብት (Stars) መነሻነት ያግኙ። ታዋቂ የኢትዮጵያ ከዋክብት (Stars) የሚጠቀሙባቸውን የስታይል ሚስጥሮች እዚህ ያግኙ።
              </p>
            </div>

            {/* INTERACTIVE SKIN TONE SELECTOR SECTION */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-lg space-y-6">
              <div>
                <h3 className="text-sm font-black text-rose-950 flex items-center gap-2">
                  <span className="w-2 h-4 bg-rose-500 rounded-full"></span>
                  ደረጃ 1፡ የቆዳዎን ከለር (Skin Tone) ይምረጡ
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">የቆዳዎን ቀለም በመምረጥ ለእርስዎ ብቻ የሚስማሙ የቀለም ውህዶችንና ምክሮችን ይመልከቱ</p>
              </div>

              {/* Skin Tone Buttons Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: "honey", label: "ማርማ (Honey Gold)", bg: "bg-[#e5a964]", desc: "ማራኪ ወርቃማ/ማር የመሰለ የቆዳ ቀለም", text: "text-[#5c3e17]" },
                  { id: "cocoa", label: "ቡናማ (Deep Cocoa)", bg: "bg-[#8c6239]", desc: "ቡናማና ደማቅ ጠቆር ያለ የቆዳ ቀለም", text: "text-white" },
                  { id: "wheat", label: "ስንዴማ (Light Wheat)", bg: "bg-[#f5cd96]", desc: "ቀለል ያለ የስንዴ መልክ የቆዳ ቀለም", text: "text-[#5c401d]" },
                  { id: "ebony", label: "ጥቁር አደይ (Rich Ebony)", bg: "bg-[#3d2514]", desc: "ደማቅ፣ ጥልቅና ውብ የጥቁር አደይ ቀለም", text: "text-white" }
                ].map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedSkinTone(tone.id as any)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 relative overflow-hidden group ${
                      selectedSkinTone === tone.id
                        ? "border-rose-500 bg-rose-50/10 shadow-md scale-[1.02]"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${tone.bg} shadow-inner border border-white/20 flex items-center justify-center font-bold ${tone.text} shrink-0`}>
                      {tone.label.charAt(0)}
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-800 block">{tone.label}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{tone.desc}</span>
                    </div>

                    {selectedSkinTone === tone.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Skin Tone Color Guidelines Panel */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual Palette */}
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">የሚመከሩ ቀለማት (Matching Palette)</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkinTone === "honey" && [
                      { hex: "#e65c00", name: "ደማቅ ብርቱካን" },
                      { hex: "#ffc107", name: "ወርቃማ ቢጫ" },
                      { hex: "#008080", name: "አረንጓዴ ሻይ" },
                      { hex: "#fffdd0", name: "ክሬም ከለር" },
                      { hex: "#ff4d4d", name: "ደማቅ ቀይ" }
                    ].map((col, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/50 shadow-sm text-[9px] font-bold">
                        <div style={{ backgroundColor: col.hex }} className="w-4 h-4 rounded-full shadow-inner"></div>
                        <span>{col.name}</span>
                      </div>
                    ))}
                    {selectedSkinTone === "cocoa" && [
                      { hex: "#b58b4c", name: "የሰናፍጭ ቢጫ" },
                      { hex: "#fffdd0", name: "ዝሆን ጥርስ" },
                      { hex: "#4169e1", name: "ሮያል ብሉ" },
                      { hex: "#556b2f", name: "ወይራ አረንጓዴ" },
                      { hex: "#e6e6fa", name: "ላቬንደር" }
                    ].map((col, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/50 shadow-sm text-[9px] font-bold">
                        <div style={{ backgroundColor: col.hex }} className="w-4 h-4 rounded-full shadow-inner"></div>
                        <span>{col.name}</span>
                      </div>
                    ))}
                    {selectedSkinTone === "wheat" && [
                      { hex: "#e63946", name: "ጥልቅ ቀይ" },
                      { hex: "#1d3557", name: "ጥቁር ሰማያዊ" },
                      { hex: "#457b9d", name: "ውሃማ ሰማያዊ" },
                      { hex: "#f1faee", name: "ንጹህ ክሬም" },
                      { hex: "#ffb703", name: "ደማቅ ቢጫ" }
                    ].map((col, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/50 shadow-sm text-[9px] font-bold">
                        <div style={{ backgroundColor: col.hex }} className="w-4 h-4 rounded-full shadow-inner"></div>
                        <span>{col.name}</span>
                      </div>
                    ))}
                    {selectedSkinTone === "ebony" && [
                      { hex: "#ffffff", name: "ንጹህ ነጭ" },
                      { hex: "#e0115f", name: "ደማቅ ማጀንታ" },
                      { hex: "#ff6600", name: "ኒዮን ኦሬንጅ" },
                      { hex: "#ffd700", name: "ወርቅማ ቢጫ" },
                      { hex: "#000080", name: "ኔቪ ብሉ" }
                    ].map((col, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/50 shadow-sm text-[9px] font-bold">
                        <div style={{ backgroundColor: col.hex }} className="w-4 h-4 rounded-full shadow-inner"></div>
                        <span>{col.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">የጌጣጌጥ ምርጫ (Jewelry)</span>
                    <p className="text-[11px] font-extrabold text-slate-700 mt-1">
                      {selectedSkinTone === "honey" || selectedSkinTone === "wheat" 
                        ? "✨ ቢጫ ወርቅ እና መዳብማ ጌጣጌጦች (Yellow Gold & Copper)" 
                        : "✨ ነጭ ወርቅ፣ ብር እና ፕላቲነም ጌጣጌጦች (Silver & White Gold)"}
                    </p>
                  </div>
                </div>

                {/* Expert Guidance Text */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">የባለሙያ የስታይል ምክር (Expert Styling Advice)</span>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                    {selectedSkinTone === "honey" && (
                      <p>
                        <strong>ማርማ (Honey Gold)</strong> የቆዳ ቀለም ያላቸው ሰዎች ሞቅ ያለ እና ማራኪ ወርቃማ አንጸባራቂነት አላቸው። ለዚህ የቆዳ ቀለም ደማቅ ሞቅ ያሉ ቀለሞች (እንደ ብርቱካናማ፣ ደማቅ ሰናፍጭ፣ ክሬም እና የወይራ አረንጓዴ) እጅግ በጣም ይስማማሉ። በባህላዊ የሀበሻ ልብስ ላይ <strong>የወርቅ ጥበብ (Gold Tilet)</strong> እና ወርቅማ ጨርቆች ተወዳዳሪ የሌለው ውበት ይፈጥራሉ።
                      </p>
                    )}
                    {selectedSkinTone === "cocoa" && (
                      <p>
                        <strong>ቡናማ (Deep Cocoa)</strong> የቆዳ ቀለም ጥልቅ፣ ማራኪ እና የተረጋጋ ውበት አለው። ለእርስዎ ምርጥ ቀለሞች የሰናፍጭ ቢጫ፣ ንጹህ የዝሆን ጥርስ ነጭ (Ivory)፣ ሮያል ሰማያዊ እና ላቬንደር ናቸው። እነዚህ ቀለሞች በቆዳዎ ላይ ከፍተኛ ንፅፅር በመፍጠር አንጸባራቂነትን ይሰጡዎታል። በባህላዊ አልባሳት ላይ <strong>የደማቅ ቀለማት ጥበብ</strong> በደንብ ያደምቅዎታል።
                      </p>
                    )}
                    {selectedSkinTone === "wheat" && (
                      <p>
                        <strong>ስንዴማ (Light Wheat)</strong> የቆዳ ቀለም ሞቅ ያለና ቀለል ያለ መልክ አለው። ለዚህ የቆዳ ቀለም ጥልቅ ቀይ (Burgundy/Crimson)፣ ኔቪ ብሉ፣ ውሃማ ሰማያዊ እና ፒች (Peach) ቀለማት እጅግ በጣም ያምራሉ። በባህላዊ የሀበሻ ልብስ ላይ <strong>የብርማ ወይም የሰማያዊ ጥበብ ጠርዞች</strong> ልዩ ታሪካዊ ግርማን ያላብሳሉ።
                      </p>
                    )}
                    {selectedSkinTone === "ebony" && (
                      <p>
                        <strong>ጥቁር አደይ (Rich Ebony)</strong> የቆዳ ቀለም እጅግ በጣም ውብ፣ ደማቅና ጥልቅ የጥቁር አደይ መልክ ያለው ነው። ለእርስዎ ንጹህ ነጭ (Pristine White)፣ ደማቅ ማጀንታ፣ ኒዮን ኦሬንጅ እና ወርቅማ ቀለማት አስደናቂ የሆነ የንፅፅር ውበት ይፈጥራሉ። ነጭ የባህል ቀለሞችን ከደማቅ ጥበቦች ጋር ማቀናጀት ዓለም አቀፍ ሱፐር-ሞዴል እይታን ያላብሰዎታል።
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 items-center text-[10px]">
                      <span className="font-bold text-rose-600 uppercase">ተዛማጅ ከዋክብት (Star Matches)፡</span>
                      {selectedSkinTone === "honey" && (
                        <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">ማስቴዋል ወንድሰን፣ ሄኖክ ወንዲሙ</span>
                      )}
                      {selectedSkinTone === "cocoa" && (
                        <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">ዮሴፍ ረታ, ብሌን ማሞ</span>
                      )}
                      {selectedSkinTone === "wheat" && (
                        <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">ቴዲ አፍሮ, ሰላም ተስፋዬ</span>
                      )}
                      {selectedSkinTone === "ebony" && (
                        <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">ሊያ ከበደ, ሮፍናን</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAMOUS STARS LOOKBOOK SECTION */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-rose-950 flex items-center gap-2">
                  <span className="w-2 h-4 bg-rose-500 rounded-full"></span>
                  ደረጃ 2፡ የታዋቂ ከዋክብት (Stars) የፋሽንና የፀጉር ስታይል መማሪያ
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">ታዋቂ የኢትዮጵያ ከዋክብት የሚለብሷቸውን ዲዛይኖችና የፀጉር ስታይሎች በባለሙያ ማብራሪያ ይመልከቱ። ፎቶውን በመጫን ዝርዝር መረጃ ይክፈቱ።</p>
              </div>

              {/* Stars Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: "star-mastewal",
                    name: "ማስቴዋል ወንድሰን",
                    englishName: "Mastewal Wondesen",
                    role: "ታዋቂ ሞዴልና አርቲስት (Top Model)",
                    gender: "female",
                    skinTone: "honey",
                    skinToneAmh: "ማርማ (Honey Gold)",
                    hairStyle: "ስሊክ ሃይ ፖኒቴል (Sleek High Ponytail)",
                    image: "https://images.unsplash.com/photo-1524250502761-136f25028110?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Vibrant Contemporary Chic",
                    clothingStyleAmh: "ደማቅ ዘመናዊ አልባሳት (Orange Top)",
                    makeupSecret: "ቀለል ያለ የፊት ኩል ከወርቅ ጌጣጌጦች ጋር ማጣመር",
                    expertAdvice: "እንደ ማስቴዋል አይነት ማርማ የቆዳ ቀለም ካለዎት እንደ ደማቅ ብርቱካናማ (Orange)፣ ወርቅማ (Gold)፣ ክሬም እና አረንጓዴ ቀለማት ልዩ ውበትን ይሰጡዎታል። ፀጉርዎን ወደኋላ ስቧት በማሰር (Sleek High Ponytail) የፊትዎን ውበት ማጉላት ይችላሉ።",
                    starSecret: "ደማቅ የፋሽን ቀለማትን ከጥቁር ወይም ነጭ የከተማ አልባሳት ጋር በማደባለቅ የመለጠጥ ውበት ማሳየት።"
                  },
                  {
                    id: "star-joseph",
                    name: "ዮሴፍ ረታ",
                    englishName: "Joseph Reta",
                    role: "ታዋቂ የወንዶች የፋሽን ሞዴል (Male Model)",
                    gender: "male",
                    skinTone: "cocoa",
                    skinToneAmh: "ቡናማ (Deep Cocoa)",
                    hairStyle: "ቴክስቸርድ ሃይ ስኪን ፌድ (High Skin Fade)",
                    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Custom Tailored Executive Formal",
                    clothingStyleAmh: "ሳቢ ባለሙያነትን የሚያሳይ ልዩ የወንዶች ሱፍ",
                    makeupSecret: "የፂም መስመርን በደንብ ማስተካከል እና የቆዳ እርጥበትን መጠበቅ",
                    expertAdvice: "ጥቁር ቡናማ የቆዳ ቀለም ላላቸው ወንዶች የቡናማ፣ የክሬም፣ የሮያል ብሉ እና የሰናፍጭ ቢጫ ቀለማት እጅግ ይስማማቸዋል። የጎን እቅጭ ፀጉር አቆራረጥ (High Skin Fade) ከላይ ቴክስቸርድ ኩርባዎችን በማስቀመጥ በራስ መተማመንን የሚጨምር እይታ ይሰጣል።",
                    starSecret: "ድርብ ደረት ያለው ሱፍ ከቀይ ሰረዝ ክራቫት እና ከነጭ ሸሚዝ ጋር በስራ ቦታ መልበስ።"
                  },
                  {
                    id: "star-blen",
                    name: "ብሌን ማሞ",
                    englishName: "Blen Mamo",
                    role: "የውበትና የፋሽን ተፅዕኖ ፈጣሪ (Influencer)",
                    gender: "female",
                    skinTone: "cocoa",
                    skinToneAmh: "ቡናማ (Medium Cocoa)",
                    hairStyle: "ባውንሲ አፍሮ ከርልስ (Bouncy Afro Curls)",
                    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Contemporary Urban Streetwear",
                    clothingStyleAmh: "ምቹና ዘመናዊ የከተማ ስታይል (Off-shoulder)",
                    makeupSecret: "የዐይን ሽፋሽፍት ማስዋብ እና ተፈጥሮአዊ የቆዳ ንፅህና",
                    expertAdvice: "ለቡናማ የቆዳ ቀለም ባለቤቶች ነጭ ሰፊ ቲሸርቶች፣ በጎን በኩል የሚያንሸራትቱ ጃኬቶች እና ሰማያዊ የጂንስ ሱሪዎች በጣም ቺክ የሆነ ገፅታ ይሰጣሉ። ተፈጥሮአዊ የፀጉር ከርል (Afro Curls) መልቀቅ የወጣትነትና የነጻነት ስሜት ይሰጣል።",
                    starSecret: "ጥቁር ሰፊ ጃኬትን በትከሻ ላይ ዘና አድርጎ መልበስ ለከተማ መውጫ ፍጹም ስታይል ነው።"
                  },
                  {
                    id: "star-liya",
                    name: "ሊያ ከበደ",
                    englishName: "Liya Kebede",
                    role: "አለም አቀፍ ሱፐር-ሞዴል (Supermodel)",
                    gender: "female",
                    skinTone: "ebony",
                    skinToneAmh: "ጥቁር አደይ (Rich Ebony)",
                    hairStyle: "ሶፍት ናቹራል ዌቭስ (Soft Natural Waves)",
                    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "High-Fashion Fusion Couture",
                    clothingStyleAmh: "ዘመናዊ የባህል ውህደት የምሽት አልባሳት",
                    makeupSecret: "ተፈጥሯዊ የፊት ገጽታን ማጉላት (Nude Makeup)",
                    expertAdvice: "ጥቁር አደይ የቆዳ ቀለም ካለዎት ደማቅ ሮዝ (Magenta)፣ ንጹህ ነጭ እና ወርቅማ ቀለማት በቆዳዎ ላይ ደምቀው ይታያሉ። በሐር ጨርቅ የተሰሩ ባህላዊ የሀበሻ ቀሚሶችን ከዘመናዊ ጃኬት ጋር በማዋሃድ አለም አቀፍ ደረጃን የጠበቀ መልክ ማምጣት ይቻላል።",
                    starSecret: "ባህላዊ የጥበብ ጠርዝ ያለውን ቀሚስ ከቀላል ወርቃማ ጌጣጌጦች ጋር ማጣመር የረቀቀ ውበት ይሰጣል።"
                  },
                  {
                    id: "star-teddy",
                    name: "ቴዲ አፍሮ",
                    englishName: "Teddy Afro",
                    role: "ታዋቂ የሙዚቃ አቀንቃኝና የቅጥ አዶ (Music Legend)",
                    gender: "male",
                    skinTone: "wheat",
                    skinToneAmh: "ስንዴማ (Light Wheat)",
                    hairStyle: "አጭር የተስተካከለ አፍሮ (Short Clean Afro)",
                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Cultural Heritage Smart Casual",
                    clothingStyleAmh: "ባህላዊ ጥልፍ ያለባቸው ዘመናዊ ኮቶች",
                    makeupSecret: "ንጹህ የፊት መላጨት እና ለስላሳ የፂም መስመር",
                    expertAdvice: "ስንዴማ የቆዳ ቀለም ላላቸው ወንዶች ጥልቅ አረንጓዴ፣ ደማቅ ቀይ፣ ክሬም እና ሰማያዊ ቀለማት እጅግ ማራኪ ናቸው። አጭርና ክብ የተስተካከለ አፍሮ ፀጉር ከባህላዊ ጥልፍ ጋር የተሰፉ ኮቶችን መልበስ ታላቅነትንና ክብርን ያሳያል።",
                    starSecret: "የሀገር ባህል ጥበብ ኮሌታ ያላቸው የወንዶች ሸሚዞችን ከጥቁር ጂንስ ጋር በማቀናጀት ለበዓላት መቅረብ።"
                  },
                  {
                    id: "star-selam",
                    name: "ሰላም ተስፋዬ",
                    englishName: "Selam Tesfaye",
                    role: "ታዋቂ የፊልም ተዋናይት (Celebrity Actress)",
                    gender: "female",
                    skinTone: "wheat",
                    skinToneAmh: "ስንዴማ (Light Wheat)",
                    hairStyle: "ባህላዊ የአልባሶ ሹሩባ (Albaso Braiding)",
                    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Royal Habesha Luxury",
                    clothingStyleAmh: "የከበሩ ባህላዊ የሀበሻ የሰርግ ቀሚሶች",
                    makeupSecret: "ደማቅ የከንፈር ቀለም እና አይን ላይ ያተኮረ ሜካፕ",
                    expertAdvice: "በስንዴማ የቆዳ ቀለም ላይ የተሰሩ ባህላዊ የአልባሶ ሹሩባዎች አስደናቂ ታሪካዊ ግርማን ያላብሳሉ። ወርቅማ ጥልፍ ያላቸው ነጭ የባህል ቀሚሶች ለሰርግ ወይም ለልዩ ዝግጅቶች በስንዴማ ቆዳ ላይ እጅግ ያበራሉ።",
                    starSecret: "በእጅ የተሰሩ የወርቅ ወይም የብር ባህላዊ ጌጣጌጦችን ከተንዠረገገ ሻሽ ጋር መልበስ።"
                  },
                  {
                    id: "star-henok",
                    name: "ሄኖክ ወንዲሙ",
                    englishName: "Henok Wondimu",
                    role: "ታዋቂ ተዋናይና ሞዴል (Leading Actor)",
                    gender: "male",
                    skinTone: "honey",
                    skinToneAmh: "ማርማ (Honey Gold)",
                    hairStyle: "ሻርፕ ስኪን ፌድ (Sharp Fade & Beard)",
                    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Modern Executive Smart Casual",
                    clothingStyleAmh: "ዘመናዊ የቢሮና የስራ አስፈጻሚ አልባሳት",
                    makeupSecret: "ከሻምፑ በኋላ የፀጉርና የፂም ማለስለሻ መጠቀም",
                    expertAdvice: "ማርማ የቆዳ ቀለም ካለዎት ሰማያዊ ሱፎች፣ ጥቁር ኤሊ-አንገት ማሊያዎች እና የስራ አስፈጻሚ ጃኬቶች ፍጹም ይስማማዎታል። የፀጉርዎንና የፂምዎን መስመር በሹል ሁኔታ ማስተካከል መልክዎን ይበልጥ ያጎላዋል።",
                    starSecret: "ከላይ ጃኬት ወይም ብሌዘር ከውስጥ ደግሞ ጥቁር ኤሊ-አንገት ማሊያ መልበስ ለምሽት ዝግጅቶች እጅግ ስማርት ያደርጋል።"
                  },
                  {
                    id: "star-rophnan",
                    name: "ሮፍናን (Rophnan)",
                    englishName: "Rophnan",
                    role: "ታዋቂ የኤሌክትሮኒክ ሙዚቃ ፈጣሪ (Music Pioneer)",
                    gender: "male",
                    skinTone: "ebony",
                    skinToneAmh: "ጥቁር አደይ (Rich Ebony)",
                    hairStyle: "ቴክስቸርድ ድሬድሎክስ (Afro Twist/Dreads)",
                    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
                    clothingStyle: "Avant-Garde Afro-Futurist",
                    clothingStyleAmh: "የባህልና የሳይበር ስትሪትዌር ውህደት",
                    makeupSecret: "ተፈጥሯዊ የፂም አያያዝና የፀጉር እርጥበት ማሳደግ",
                    expertAdvice: "በጥቁር አደይ የቆዳ ቀለም ላይ እንደ ኒዮን ቀለሞች፣ ደማቅ ቢጫ እና ነጭ አልባሳት እጅግ ድንቅ ንፅፅር ይፈጥራሉ። አፍሮ ትዊስት ወይም ድሬድሎክስ ፀጉር በሀገር ውስጥ የሽመና ጨርቅ ከተሰሩ ባልዲ ባርኔጣዎች ጋር መልበስ ልዩ የወጣትነት ስሜት ይሰጣል።",
                    starSecret: "በግዕዝ ፊደላት ወይም በባህላዊ ምልክቶች ያጌጡ ዘመናዊ ኮፍያዎችን እና የቆዳ ጫማዎችን ማጣመር።"
                  }
                ].map(star => (
                  <div
                    key={star.id}
                    onClick={() => setSelectedStar(star)}
                    className="bg-white rounded-3xl overflow-hidden border border-rose-100/40 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col group relative"
                  >
                    {/* Media container */}
                    <div className="relative aspect-[4/3] bg-slate-150 overflow-hidden">
                      <img 
                        src={star.image} 
                        alt={star.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                      />
                      <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                        {star.skinToneAmh}
                      </span>
                      <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {star.gender === "female" ? "ሴት" : "ወንድ"}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider block w-fit">
                          {star.clothingStyle}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-rose-650 transition-colors mt-1">
                          {star.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                          {star.englishName}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 pt-1 font-semibold">
                          {star.role}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-rose-50/60 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-[8px] text-slate-400 block uppercase font-bold">የፀጉር ስታይል</span>
                          <span className="font-extrabold text-slate-700 truncate block max-w-[120px]">{star.hairStyle}</span>
                        </div>
                        <span className="text-rose-500 text-[9px] font-black group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          ምክር ክፈት <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPERT HAIR STYLIST TIPS SECTION */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg text-lg">
                  💇‍♂️
                </div>
                <div>
                  <h3 className="text-base font-black text-amber-300">የፀጉርና የፂም ባለሙያ መመሪያ (Expert Hair & Beard Tips)</h3>
                  <p className="text-[10px] text-slate-400">የፊትዎን ቅርፅ መነሻ በማድረግ ለእርስዎ ፍጹም የሚስማማውን የፀጉር ስታይል ይምረጡ</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {[
                  {
                    shape: "ክብ ፊት (Round Face)",
                    hair: "ረጅም ሹሩባዎች (Braids/Locks) ወይም ከላይ ከፍ ያሉ የፀጉር ከርሎች",
                    beard: "ረጅም የፂም ስታይል ከታች በኩል ሹል የሚመስል (Goatee)",
                    why: "ፊትዎ ይበልጥ ረዘም ብሎ እንዲታይ እና የአጥንት መዋቅርዎን በማሳየት ውበትን ይጨምራል።"
                  },
                  {
                    shape: "ሞላላ ፊት (Oval Face)",
                    hair: "ሁሉም የፀጉር ስታይሎች (Albaso, High fade, Curly Afro, Pixie cuts)",
                    beard: "እኩል የተስተካከለ መካከለኛ ፂም (Full beard / Short stubble)",
                    why: "ይህ የፊት ቅርፅ ፍጹም ሚዛናዊ በመሆኑ ሁሉንም አይነት የፀጉርና የፂም ስታይሎችን ያለምንም ችግር ይቀበላል።"
                  },
                  {
                    shape: "ካሬ ፊት (Square Face)",
                    hair: "ለስላሳ ኩርባዎች (Soft curls)፣ የጎን ሹሩባዎች ወይም የጎን እቅጭ (Fade with soft edges)",
                    beard: "የጎን ፂምን ዝቅ አድርጎ ከታች ክብ ማድረግ (Circle beard / stubble)",
                    why: "የፊትን ጠንካራ የመንጋጋ መስመር ለስላሳ እንዲመስል በማድረግ ተስማሚ የሆነ ውበትን ይፈጥራል።"
                  },
                  {
                    shape: "አልማዝ ፊት (Diamond Face)",
                    hair: "አፍሮ ከርል (Afro volumes)፣ የጎን ጠርዝ ያላቸው ሹሩባዎች ወይም ረጅም ፀጉር",
                    beard: "ሙሉ፣ ወፍራም እና ሰፊ ፂም በጉንጭ በኩል (Full beard)",
                    why: "የጠቆረውን አገጭ እና ሰፊውን ጉንጭ ሚዛናዊ በማድረግ የተዋበ ወንድማማችነትን ወይም የሴትነት ማራኪነትን ይሰጣል።"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <span className="font-extrabold text-amber-300 block text-xs border-b border-white/10 pb-1.5">{item.shape}</span>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">የሚመከር ፀጉር (Hair):</span>
                      <p className="text-slate-200 leading-normal">{item.hair}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">የሚመከር ፂም (Beard):</span>
                      <p className="text-slate-200 leading-normal">{item.beard}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 italic leading-normal pt-1.5 border-t border-white/5">
                      💡 {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* STAR DETAIL OVERLAY POPUP */}
            {selectedStar && (
              <div 
                className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
                onClick={() => setSelectedStar(null)}
              >
                <div 
                  className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Image header banner */}
                  <div className="relative aspect-[16/10] bg-slate-150 shrink-0">
                    <img src={selectedStar.image} alt={selectedStar.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setSelectedStar(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-900 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-rose-600 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg uppercase tracking-wider">
                      ★ {selectedStar.englishName} Style
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-rose-50 pb-2.5">
                      <div>
                        <h3 className="font-black text-rose-950 text-xl leading-snug">{selectedStar.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{selectedStar.englishName}</p>
                      </div>
                      <span className="bg-rose-50 text-rose-700 text-xs font-black px-3 py-1 rounded-full border border-rose-100">
                        {selectedStar.skinToneAmh}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-rose-50/20 rounded-2xl p-4 border border-rose-100/30">
                      💁‍♀️ <strong>የከዋክብቱ ሚና፡</strong> {selectedStar.role}
                    </p>

                    <div className="space-y-4 text-xs">
                      {/* Specs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">የአለባበስ ዘይቤ (Dressing Style)</span>
                          <span className="font-black text-slate-800">{selectedStar.clothingStyleAmh}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">የፀጉር ዲዛይን (Hair Design)</span>
                          <span className="font-black text-slate-800">{selectedStar.hairStyle}</span>
                        </div>
                      </div>

                      {/* Expert Column Advice */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">የማኪ የባለሙያ ምክር (Expert Advice)</span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                          {selectedStar.expertAdvice}
                        </p>
                      </div>

                      {/* Star Secrets */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">የስታይል ምስጢር (Celebrity Style Secret)</span>
                        <div className="flex items-start gap-2 bg-rose-50/10 rounded-xl p-4 border border-rose-100/30">
                          <span className="text-rose-500 mt-1 select-none">✨</span>
                          <p className="text-xs text-slate-700 leading-relaxed">{selectedStar.starSecret}</p>
                        </div>
                      </div>

                      {/* Makeup secret */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">የጌጣጌጥና የውበት ምስጢር (Accents & Accessories)</span>
                        <p className="text-xs text-slate-700 leading-relaxed pl-2 border-l-2 border-rose-500 italic">
                          "{selectedStar.makeupSecret}"
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                      <button
                        onClick={() => setSelectedStar(null)}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition active:scale-95"
                      >
                        ተመለስ (Close)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStar(null);
                          setScannerGender(selectedStar.gender);
                          if (paid) {
                            setActiveTab("scanner");
                          } else {
                            setPaymentStep("package");
                            setShowPaymentModal(true);
                          }
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs rounded-full transition shadow-lg shadow-rose-100 flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200 fill-current animate-pulse" />
                        በማኪ ሞክር (Try Style)
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Demo Controller Footer */}
        <div className="pt-8 pb-4 text-center space-y-3.5 border-t border-rose-100/60 max-w-sm mx-auto">
          <p className="text-[10px] text-slate-400 leading-normal">
            ይህ መተግበሪያ የተከፈለበትን መረጃ በስልክዎ ውስጣዊ የማከማቻ ክፍል (localStorage) ውስጥ ስለሚይዝ፣ ስልክዎን ቢያጠፉትም ክፍያዎ አይጠፋም።
          </p>
          <button
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-100/40 rounded-lg text-[10px] font-bold transition active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3 h-3 text-rose-550" />
            የክፍያ ታሪክ አጥፋ (Reset Demo)
          </button>
        </div>

      </main>

      {/* CLOTHING DETAIL DRAWER OVERLAY */}
      {selectedStyle && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setSelectedStyle(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header banner image */}
            <div className="relative aspect-[4/3] bg-slate-100">
              <img
                src={selectedStyle.image}
                alt={selectedStyle.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedStyle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <span className="absolute bottom-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                {selectedStyle.category === "traditional" ? "ባህላዊ የሀበሻ ስታይል" : selectedStyle.category === "fusion" ? "ወቅታዊ የባህል ውህደት" : selectedStyle.category === "modern" ? "ዘመናዊ አልባሳት" : "ምርጥ የምሽት ልብስ"}
              </span>
            </div>

            {/* Inner Content text */}
            <div className="p-6 space-y-5">
              
              <div className="space-y-1">
                <h3 className="font-black text-rose-950 text-lg sm:text-xl leading-snug">{selectedStyle.name}</h3>
                <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">{selectedStyle.englishName}</p>
              </div>

              {/* Description paragraph */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ስለ አልባሳቱ ዝርዝር መግለጫ (Description)</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/20 rounded-2xl p-4 border border-rose-100/40">
                  {selectedStyle.description}
                </p>
              </div>

              {/* Technical Spec table */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-rose-50/20 p-3 rounded-xl border border-rose-100/30">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase mb-0.5">የጨርቅ አይነት (Fabric)</span>
                  <span className="font-bold text-slate-700">{selectedStyle.fabric}</span>
                </div>
                <div className="bg-rose-50/20 p-3 rounded-xl border border-rose-100/30">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase mb-0.5">የዋጋ ክልል (Price Range)</span>
                  <span className="font-black text-rose-950">{selectedStyle.priceRange}</span>
                </div>
                <div className="col-span-2 bg-rose-50/20 p-3 rounded-xl border border-rose-100/30">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase mb-0.5">የሚስማማቸው አጋጣሚዎች (Occasions)</span>
                  <span className="font-bold text-slate-700">{selectedStyle.occasions}</span>
                </div>
              </div>

              {/* Purchase guidance */}
              <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 flex items-start gap-3 text-xs text-rose-950 leading-normal">
                <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">ዲዛይኑን መግዛት ይፈልጋሉ?</strong>
                  ይህንን ውብ የአልባሳት ዲዛይን በሀገር ውስጥ ያሉ ታዋቂ ስፌት ቤቶች በቀላሉ ሊሰፉት ይችላሉ። ፎቶውን በመጫን ሴቭ በማድረግ ወይም ስክሪንሹት በማንሳት ለባለሙያዎ ማሳየት ይችላሉ።
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedStyle(null)}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-full transition shadow-lg shadow-rose-100"
              >
                ተመለስ (Close)
              </button>

            </div>

          </div>
        </div>
      )}

      {/* DETAILED PREMIUM TELEBIRR PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              
              {/* Branded Telebirr Header */}
              <div className="bg-gradient-to-r from-[#005fb8] to-[#0073e6] px-5 py-5 text-white relative flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md">
                    <span className="text-[#005fb8] font-black text-xs font-display tracking-tighter">tele</span>
                    <span className="text-[#ffcc00] font-black text-[10px] font-display tracking-tighter">birr</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-wider uppercase">በቀላሉ በቴሌብር ይክፈሉ! አሁን ይዘንጡ !</h3>
                    <p className="text-[10px] text-blue-100">ዘመናዊ አለባበስ እና የ ጸጉር ስታይሎች</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1.5 rounded-full bg-black/10 text-white hover:bg-black/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                
                {/* STEP 1: SELECT PACKAGE */}
                {paymentStep === "package" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center space-y-1">
                      <h4 className="font-black text-slate-800 text-base">የምክር አገልግሎት ፓኬጅ ይምረጡ</h4>
                      <p className="text-[10px] text-slate-400">ለእርስዎ ፍላጎት የሚስማማውን ፓኬጅ መርጠው በቴሌብር ይክፈሉ</p>
                    </div>

                    <div className="space-y-3">
                      {/* Package 1: Daily */}
                      <div 
                        onClick={() => handleSelectPackage("today")}
                        className="bg-slate-50 border-2 border-slate-200/60 hover:border-rose-300 hover:bg-rose-50/10 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-800 block">የዛሬ ብቻ (Daily Guide)</span>
                            <span className="text-[10px] text-slate-400 block leading-tight">የ1 ቀን የተሟላ የስታይልና ፀጉር ዲዛይን</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 block">50 Birr</span>
                          <span className="text-[9px] font-bold text-rose-500 block">ለዛሬ ብቻ</span>
                        </div>
                      </div>

                      {/* Package 2: Weekly */}
                      <div 
                        onClick={() => handleSelectPackage("weekly")}
                        className="bg-gradient-to-r from-amber-500/5 to-rose-500/5 border-2 border-rose-200 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] font-black px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                          ታዋቂ (Popular)
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center border border-rose-200">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-800 block">የ1 ሳምንት ፕላነር (Weekly Plan)</span>
                            <span className="text-[10px] text-slate-400 block leading-tight">የ7 ቀናት ሙሉ ስታይልና ፀጉር አማካሪ</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-rose-950 block">100 Birr</span>
                          <span className="text-[9px] font-bold text-rose-600 block">ለ7 ቀናት</span>
                        </div>
                      </div>

                      {/* Package 3: Monthly */}
                      <div 
                        onClick={() => handleSelectPackage("monthly")}
                        className="bg-slate-50 border-2 border-slate-200/60 hover:border-rose-300 hover:bg-rose-50/10 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-800 block">የ1 ወር ስትራቴጂ (Monthly Strategy)</span>
                            <span className="text-[10px] text-slate-400 block leading-tight">የ30 ቀናት የተሟላ የፀጉርና ፋሽን መመሪያ</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 block">300 Birr</span>
                          <span className="text-[9px] font-bold text-rose-500 block">ለ30 ቀናት</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: TELEBIRR P2P GUIDE */}
                {paymentStep === "telebirr_p2p" && (
                  <form onSubmit={paymentStep === "telebirr_p2p" ? handlePaymentSubmit : undefined} className="space-y-4 animate-fade-in">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <h4 className="font-extrabold text-xs text-blue-900 uppercase">በቴሌብር የማስተላለፊያ መመሪያ</h4>
                      </div>
                      <div className="text-[11px] text-slate-700 leading-relaxed space-y-2">
                        <p>
                          እባክዎን የፓኬጁን ክፍያ <strong className="text-blue-950 text-xs font-black">{selectedPackage === "today" ? "50.00" : selectedPackage === "weekly" ? "100.00" : "300.00"} ብር</strong> ወደሚከተለው የቴሌብር ቁጥር ያስተላልፉ፡
                        </p>
                        <div className="bg-white p-3 rounded-xl border border-blue-200/60 text-center space-y-1">
                          <span className="text-[9px] text-slate-400 block font-bold">የቴሌብር ስልክ ቁጥር (Mobile Number)</span>
                          <span className="text-lg font-black text-slate-900 select-all block tracking-wider">0966782412</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          * በቴሌብር መተግበሪያ(telebirr App) ወይም በ <strong className="text-slate-800">*999#</strong> ተጠቅመው ገንዘብ ማስተላለፍ ይችላሉ።
                        </p>
                        <p className="text-[11px] text-rose-600 font-extrabold text-center bg-rose-50/50 py-1.5 rounded-lg border border-rose-100/40">
                          ⚠️ ከፍለው ሲጨርሱ ስክሪንሾት(screenshot) አድርገው መላክ እንዳይረሱ
                        </p>
                      </div>
                    </div>

                    {/* Form inputs */}
                    <div className="space-y-3 text-xs pt-1">
                      
                      {/* Sender Name */}
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-600">የላኪው ሙሉ ስም (Sender Full Name)</label>
                        <input
                          type="text"
                          required
                          placeholder="ገንዘብ ያስተላለፉበትን ስም ያስገቡ"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        />
                      </div>

                      {/* Screenshot Upload */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-600">የክፍያ ማረጋገጫ ደረሰኝ ፎቶ ወይም ፒዲኤፍ (Receipt Screenshot or PDF)</label>
                        
                        {screenshotPreview ? (
                          <div className="relative aspect-[3/1] bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-4">
                            {screenshotPreview.startsWith("data:application/pdf") ? (
                              <div className="flex items-center gap-3.5 text-rose-950 font-black text-xs">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-150 shrink-0">
                                  <FileText className="w-5.5 h-5.5" />
                                </div>
                                <div className="text-left">
                                  <span className="block text-slate-800 font-extrabold text-xs">የፒዲኤፍ ማረጋገጫ ደረሰኝ (PDF Receipt)</span>
                                  <span className="block text-[9px] text-emerald-600 font-bold">ለመላክ ዝግጁ ነው (Ready to Verify)</span>
                                </div>
                              </div>
                            ) : (
                              <img src={screenshotPreview} alt="Screenshot receipt" className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => setScreenshotPreview(null)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 z-10"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => screenshotInputRef.current?.click()}
                            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100/50 transition flex flex-col items-center justify-center gap-1.5"
                          >
                            <Upload className="w-5 h-5 text-slate-400" />
                            <span className="font-semibold text-slate-600 text-[11px]">የደረሰኝ ስክሪንሹት ወይም ፒዲኤፍ ይጫኑ (Upload Screenshot or PDF)</span>
                            <span className="text-[9px] text-slate-400">ደረሰኙን በሰከንድ ባልሞላ ጊዜ ውስጥ እናረጋግጣለን</span>
                          </div>
                        )}

                        <input
                          type="file"
                          ref={screenshotInputRef}
                          accept="image/*,application/pdf"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </div>

                      {paymentError && (
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-[11px] font-bold leading-normal">
                          ⚠️ {paymentError}
                        </div>
                      )}

                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setPaymentStep("package")}
                        className="py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl transition text-xs hover:bg-slate-50 active:scale-95"
                      >
                        ተመለስ
                      </button>
                      <button
                        type="submit"
                        disabled={!senderName || !screenshotPreview}
                        className="flex-1 py-3 bg-[#005fb8] text-white font-extrabold rounded-xl shadow-md text-xs hover:bg-blue-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 transition flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-200" />
                        ክፍያ በፎቶ አረጋግጥ (Verify Payment)
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: VERIFYING RECEIPT ANIMATION */}
                {paymentStep === "verifying" && (
                  <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
                    {/* Glowing scanner wheel */}
                    <div className="relative w-16 h-16">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                      <div className="absolute inset-2 bg-slate-50 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-800">ደረሰኝዎን በቴሌብር ሲስተም በማረጋገጥ ላይ...</h4>
                      <p className="text-[10px] text-slate-400">ይህ ጥቂት ሰከንዶች ሊወስድ ይችላል፤ እባክዎን አይዝጉት።</p>
                    </div>
                  </div>
                )}

                {/* STEP 4: SUCCESS RECEIPT */}
                {paymentStep === "success" && (
                  <div className="py-4 space-y-5 text-center animate-fade-in">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-white shadow-md flex items-center justify-center text-emerald-500 mx-auto animate-bounce">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-emerald-600 text-sm">የክፍያ ደረሰኝዎ በተሳካ ሁኔታ ተረጋግጧል!</h4>
                      <p className="text-[10px] text-slate-500">የማኪ ስታይል አገልግሎት ሙሉ በሙሉ ተከፍቶልዎታል።</p>
                    </div>

                    {/* Receipt Details Box */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-[11px] space-y-2 font-mono">
                      <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                        <span className="text-slate-400">የግብይት ኮድ:</span>
                        <span className="font-bold text-slate-800 select-all">{txnId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">የላኪ ስም:</span>
                        <span className="font-bold text-slate-700">{senderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">የተከፈለ መጠን:</span>
                        <span className="font-black text-emerald-600">{selectedPackage === "today" ? "50.00" : selectedPackage === "weekly" ? "100.00" : "300.00"} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ፓኬጅ ዓይነት:</span>
                        <span className="font-bold text-slate-700">{selectedPackage === "today" ? "የ1 ቀን (ዛሬ)" : selectedPackage === "weekly" ? "የ7 ቀናት (ሳምንት)" : "የ30 ቀናት (ወር)"}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setActiveTab("scanner");
                      }}
                      className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl shadow-lg shadow-rose-100 text-xs flex items-center justify-center gap-1.5"
                    >
                      ወደ ስታይል አማካሪ ሂድ (Proceed)
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled custom animations helper */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 96%; }
          100% { top: 0%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}

// Custom Markdown parser with bullet formatting and bold tags highlight matching
function SimpleMarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  
  return (
    <div className="space-y-3.5 text-xs text-slate-800 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;
        
        // Headers
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="text-xs font-black text-slate-900 pt-3 border-b border-slate-100 pb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {parseBoldText(trimmed.replace(/^###\s*/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={idx} className="text-sm font-black text-rose-950 pt-4 pb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full"></span>
              {parseBoldText(trimmed.replace(/^##\s*/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={idx} className="text-base font-black text-rose-900 pt-5 pb-2 border-b-2 border-rose-100 flex items-center gap-2">
              {parseBoldText(trimmed.replace(/^#\s*/, ""))}
            </h2>
          );
        }
        
        // Bullet points
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-rose-500 mt-1.5 shrink-0 select-none text-[10px]">•</span>
              <p className="flex-1">{parseBoldText(trimmed.replace(/^[-*]\s*/, ""))}</p>
            </div>
          );
        }
        
        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-rose-600 font-extrabold mt-0.5 shrink-0 select-none">{numMatch[1]}.</span>
              <p className="flex-1">{parseBoldText(numMatch[2])}</p>
            </div>
          );
        }
        
        // Paragraph
        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {parseBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Highlight helper mapping **bold** into nice background labels
function parseBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-extrabold text-slate-950 bg-amber-50/80 text-[11px] px-1 rounded-md border border-amber-100/50">
          {part}
        </strong>
      );
    }
    return part;
  });
}

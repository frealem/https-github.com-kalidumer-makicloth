import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRightLeft, CheckCircle2, User, Wand2, RefreshCw } from "lucide-react";

import femaleTransformImg from "../assets/images/ethiopian_female_transformation_1784854832705.jpg";
import maleTransformImg from "../assets/images/ethiopian_male_transformation_1784854845785.jpg";

interface CelebrityData {
  id: string;
  name: string;
  role: string;
  gender: "female" | "male";
  fullImage: string;
  beforeHair: string;
  afterHair: string;
  beforeOutfit: string;
  afterOutfit: string;
  makeupOrGrooming: string;
  quoteAmharic: string;
  quoteEnglish: string;
}

const CELEBRITIES: CelebrityData[] = [
  {
    id: "female_star_1",
    name: "ታዋቂዋ የሀበሻ አርቲስት (Ethiopian Female Celebrity)",
    role: "ታዋቂ ድምፃዊትና ተዋናይት (Famous Singer & Actress)",
    gender: "female",
    fullImage: femaleTransformImg,
    beforeHair: "ባህላዊ የሀበሻ ቁንጥር ሹሩባ (Traditional Braids)",
    afterHair: "ዘመናዊ የወደቀ የሆሊዉድ ዌቭስ (Flowing Hollywood Waves)",
    beforeOutfit: "ባህላዊ የወርቅ ጥልፍ ቀሚስ",
    afterOutfit: "ዘመናዊ ጂኦሜትሪክ የሀበሻ ፊውዥን ቀሚስ ከቾከር ጋር",
    makeupOrGrooming: "የለስላሳ አይን ማኪያቶና የከንፈር ግሎስ (Soft Glam Makeup)",
    quoteAmharic: "የፊት ቅርፅንና የቆዳ ከለርን መሰረት ያደረገ የፀጉር፣ አልባሳትና የሜካፕ ለውጥ!",
    quoteEnglish: "Identity-preserved transformation elevating hair, modern Habesha dress, and makeup."
  },
  {
    id: "male_star_1",
    name: "ታዋቂው የኢትዮጵያ አርቲስት (Ethiopian Male Celebrity)",
    role: "ታዋቂ ድምፃዊና የኪነ-ጥበብ ባለሙያ (Famous Artist)",
    gender: "male",
    fullImage: maleTransformImg,
    beforeHair: "ያልተስተካከለ የአፍሮ ፀጉር (Unstyled Afro Hair)",
    afterHair: "ተጣጥቦ የተስተካከለ ስኪን ፌድ ከላይነፕ ጋር (Sharp Drop Fade & Lineup)",
    beforeOutfit: "ካዡዋል ጃኬት በባህላዊ ሸሚዝ ላይ",
    afterOutfit: "ዘመናዊ ኔቪ ቬስት ጃኬት በጥቁር ቲሸርትና ሰንሰለት",
    makeupOrGrooming: "የተስተካከለ የጽም ጥርብ (Groomed Beard & Lineup)",
    quoteAmharic: "የጋገነ የፀጉር ቅርፅና የልብስ ማስተካከያ ለሙያዊና ለራስ መተማመን እይታ!",
    quoteEnglish: "Professional hair fade and structured layering for executive confidence."
  }
];

export const CelebrityTransformationSection: React.FC = () => {
  const [activeCelebIndex, setActiveCelebIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isAutoAnimating, setIsAutoAnimating] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const activeCeleb = CELEBRITIES[activeCelebIndex];

  // Auto animation effect if not dragging
  useEffect(() => {
    if (!isAutoAnimating) return;
    let direction = 1;
    const interval = setInterval(() => {
      setSliderPosition((prev) => {
        if (prev >= 85) direction = -1;
        if (prev <= 15) direction = 1;
        return prev + direction * 0.4;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isAutoAnimating]);

  const handleMouseDown = () => {
    setIsAutoAnimating(false);
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden border border-rose-900/30">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            የታዋቂ ሰዎች የስታይል ማሻሻያ (Ethiopian Celebrity Before & After)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            የማኪ የስታይልና የፀጉር ትራንስፎርሜሽን
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            የፊት ቅርፅን ሳይቀይሩ የፀጉር፣ የአልባሳትና የሜካፕ ማሻሻያ ለታዋቂ የኢትዮጵያ ከዋክብት (Identity-Preserved Style Transformation)
          </p>
        </div>

        {/* Celebrity Selector Tabs */}
        <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 self-start md:self-auto">
          {CELEBRITIES.map((celeb, idx) => (
            <button
              key={celeb.id}
              onClick={() => {
                setActiveCelebIndex(idx);
                setSliderPosition(50);
                setIsAutoAnimating(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeCelebIndex === idx
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {celeb.gender === "female" ? "የሴት ከዋክብት (Female)" : "የወንድ ከዋክብት (Male)"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Before / After Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Column: Interactive Slider Container */}
        <div className="lg:col-span-7 space-y-3">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={(e) => {
              if (isDragging.current) handleMouseMove(e);
            }}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleMouseMove}
            className="relative aspect-[3/4] max-w-[420px] mx-auto rounded-3xl overflow-hidden border-2 border-rose-500/40 shadow-2xl cursor-ew-resize select-none group bg-slate-900"
          >
            {/* FULL IMAGE DISPLAY WITH SPLIT OVERLAY */}
            <img
              src={activeCeleb.fullImage}
              alt={activeCeleb.name}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* SLIDER HANDLE LINE */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 z-20 shadow-[0_0_15px_rgba(251,191,36,0.8)] flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 shadow-xl flex items-center justify-center -ml-3.5 border-2 border-white text-xs font-black">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Floating Top Badges */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-amber-300 border border-amber-400/30 z-10">
              BEFORE (በፊት)
            </div>
            <div className="absolute top-3 right-3 bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-rose-400/30 z-10">
              AFTER (በኋላ)
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-center z-10">
              <span className="text-[11px] font-black text-rose-300 block">
                የMaki Style አማካሪ ማሻሻያ | Maki Style Transformation
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {activeCeleb.name} — {activeCeleb.role}
              </span>
            </div>
          </div>

          {/* Interactive Controller Buttons below Slider */}
          <div className="flex items-center justify-between text-slate-400 text-[11px] px-2 max-w-[420px] mx-auto">
            <span className="flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              ጣቶችዎን በማንቀሳቀስ የቀደመውንና የአዲሱን ስታይል ያወዳድሩ
            </span>
            <button
              onClick={() => setIsAutoAnimating((prev) => !prev)}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 underline underline-offset-2"
            >
              <RefreshCw className={`w-3 h-3 ${isAutoAnimating ? "animate-spin" : ""}`} />
              {isAutoAnimating ? "እንቅስቃሴውን አቁም" : "አውቶ-ስላይደር አብራ"}
            </button>
          </div>
        </div>

        {/* Right Column: Transformation Details & Breakdown Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-black rounded-full border border-rose-500/30">
                የስታይል ለውጥ ዝርዝር (Transformation Specs)
              </span>
            </div>

            <h3 className="text-base font-black text-white">
              {activeCeleb.name}
            </h3>

            {/* Specs Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  የፀጉር ስታይል ለውጥ (Hairstyle Evolution)
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 line-through">{activeCeleb.beforeHair}</span>
                  <span className="text-amber-300">➜ {activeCeleb.afterHair}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  የአልባሳትና ፋሽን ለውጥ (Outfit Evolution)
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 line-through">{activeCeleb.beforeOutfit}</span>
                  <span className="text-rose-300">➜ {activeCeleb.afterOutfit}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {activeCeleb.gender === "female" ? "የሜካፕና ጌጣጌጥ ቅንጅት (Makeup & Jewelry)" : "የጺምና ፌድ ማስተካከያ (Beard & Hair Fade)"}
                </div>
                <p className="text-amber-200 text-[11px] font-bold">
                  ✨ {activeCeleb.makeupOrGrooming}
                </p>
              </div>
            </div>

            <blockquote className="text-[11px] text-slate-300 italic bg-rose-950/30 p-3 rounded-xl border-l-2 border-rose-500">
              "{activeCeleb.quoteAmharic}"
              <span className="block text-[9px] text-slate-400 not-italic mt-1">
                "{activeCeleb.quoteEnglish}"
              </span>
            </blockquote>
          </div>

          <div className="bg-gradient-to-r from-amber-500/20 to-rose-500/20 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-amber-200 block">
                እርስዎስ የራስዎን ስታይል መለወጥ ይፈልጋሉ?
              </span>
              <span className="text-[10px] text-slate-300 block">
                በካሜራዎ ፎቶ በማንሳት በሰከንዶች ውስጥ ለእርስዎ የሚሆን የፀጉርና የልብስ ስታይል ያግኙ።
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

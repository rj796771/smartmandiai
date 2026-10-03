import React from 'react';
import { ArrowRight, Sparkles, MapPin, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  onStartRecommendation: () => void;
  onExplorePrices: () => void;
  onOpenTour?: () => void;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({
  onStartRecommendation,
  onExplorePrices,
  onOpenTour,
  language
}) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-20">
      
      {/* Background Subtle Warm Ivory Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#D99A2B]/10 dark:bg-[#D99A2B]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header Text Block */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] shadow-sm text-xs font-bold uppercase tracking-wider text-[#183A2B] dark:text-[#D99A2B] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>
              {language === 'mr' 
                ? 'AgmarkNet + AI रियल-टाइम बाजार मूल्य विश्लेषण' 
                : language === 'hi' 
                ? 'AgmarkNet + AI वास्तविक समय मंडी भाव विश्लेषण' 
                : 'AgmarkNet Live Feed + AI Yield Maximizer'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope','Poppins',sans-serif] leading-[1.15]">
            {language === 'mr' ? (
              <>AgriPlus <span className="text-[#D99A2B]">AI</span> बाजार निर्णय प्रणाली</>
            ) : language === 'hi' ? (
              <>AgriPlus <span className="text-[#D99A2B]">AI</span> मंडी निर्णय प्रणाली</>
            ) : (
              <>AgriPlus <span className="text-[#D99A2B]">AI</span> Market Intelligence</>
            )}
          </h1>

          {/* Tagline Badge */}
          <div className="mt-4 inline-block bg-[#183A2B] text-[#FFFDF8] border border-[#D99A2B]/50 px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase shadow-sm">
            Smarter Markets. Better Decisions. Higher Returns.
          </div>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#667067] dark:text-[#B9C3BA] max-w-3xl mx-auto leading-relaxed font-medium">
            {language === 'mr' ? (
              'थेट बाजार भाव, AI अंदाज, वाहतूक खर्च विश्लेषण आणि विश्वासू खरेदीदारांच्या आधारे सर्वात जास्त निव्वळ नफा देणारी बाजारपेठ शोधा.'
            ) : language === 'hi' ? (
              'लाइव मंडी भाव, AI भविष्यवाणी, परिवहन लागत विश्लेषण और सत्यापित खरीदारों के माध्यम से अधिकतम शुद्ध लाभ देने वाली मंडी चुनें।'
            ) : (
              'Find the most profitable market destination using live AgmarkNet daily prices, AI forecast trends, transport cost calculations, and verified APMC buyers.'
            )}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartRecommendation}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#FFFDF8] bg-[#183A2B] hover:bg-[#28513A] active:scale-[0.98] transition-all shadow-md flex items-center justify-center space-x-3 group border border-[#D99A2B]/30"
            >
              <span>
                {language === 'mr' ? 'AI शिफारस मिळवा' : language === 'hi' ? 'AI सलाह प्राप्त करें' : 'Get AI Recommendation'}
              </span>
              <ArrowRight className="w-5 h-5 text-[#D99A2B] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExplorePrices}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#183A2B] dark:text-[#F5F2E9] bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] hover:bg-[#F8F5ED] dark:hover:bg-[#28513A] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <span>
                {language === 'mr' ? 'थेट बाजार भाव पहा' : language === 'hi' ? 'लाइव मंडी भाव देखें' : 'View Live Mandi Prices'}
              </span>
              <ChevronRight className="w-4 h-4 text-[#667067]" />
            </button>

            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#D99A2B] bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#D99A2B]/50 hover:bg-[#F8F5ED] transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4 text-[#D99A2B]" />
                <span>
                  {language === 'mr' ? 'क्विक टुर (Quick Tour)' : language === 'hi' ? 'क्विक टूर (Quick Tour)' : 'Quick App Tour'}
                </span>
              </button>
            )}
          </div>

        </div>

        {/* BENTO GRID SHOWCASE BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
          
          {/* Bento Tile 1: Top AI Recommendation Main Hero Card (col-span-8) */}
          <div className="md:col-span-8 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col justify-between space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-3 py-1 rounded-full inline-flex items-center space-x-1.5 border border-[#DDD9CF] dark:border-[#28513A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
                  <span>Top AI Market Recommendation</span>
                </span>
                <h2 className="font-['Manrope','Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] mt-3 mb-1">
                  Vashi APMC Market
                </h2>
                <p className="text-[#667067] dark:text-[#B9C3BA] text-sm sm:text-base flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#C8663D]" />
                  <span>Navi Mumbai • 142 km from Nashik</span>
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#183A2B] text-[#FFFDF8] p-4 rounded-2xl border border-[#D99A2B]/40 min-w-[170px]">
                <div className="text-xs text-[#D99A2B] font-bold uppercase">
                  Estimated Net Profit
                </div>
                <div className="text-3xl font-extrabold text-[#FFFDF8] font-['Manrope',sans-serif] mt-0.5">
                  ₹1,42,800
                </div>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/50">
                <div className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-1">
                  Market Price
                </div>
                <div className="text-xl font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                  ₹2,850 <span className="text-xs font-normal text-[#667067]">/ Quintal</span>
                </div>
              </div>

              <div className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/50">
                <div className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-1">
                  Transport Freight
                </div>
                <div className="text-xl font-bold text-[#C8663D] font-['Manrope',sans-serif]">
                  ₹12,400
                </div>
              </div>

              <div className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/50">
                <div className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-1">
                  Selling Score
                </div>
                <div className="text-xl font-bold text-[#D99A2B] font-['Manrope',sans-serif]">
                  96 / 100
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#DDD9CF] dark:border-[#28513A]/60">
              <div className="flex items-center gap-2 text-xs text-[#667067] dark:text-[#B9C3BA] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D99A2B] animate-pulse" />
                <span>Market demand is currently at seasonal peak in Navi Mumbai</span>
              </div>
              <button
                onClick={onStartRecommendation}
                className="w-full sm:w-auto bg-[#183A2B] hover:bg-[#28513A] text-[#FFFDF8] font-bold py-3 px-8 rounded-2xl transition-all text-xs uppercase tracking-wider border border-[#D99A2B]/40"
              >
                Calculate My Crop
              </button>
            </div>

          </div>

          {/* Bento Tile 2: Smart Selling Score Radial Badge (col-span-4) */}
          <div className="md:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col items-center justify-center text-center">
            
            <div className="relative mb-4">
              <svg className="w-32 h-32">
                <circle cx="64" cy="64" r="54" stroke="#DDD9CF" strokeWidth="10" fill="none" className="dark:stroke-[#28513A]" />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="#D99A2B"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="339"
                  strokeDashoffset="20"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">96</span>
                <span className="text-[10px] text-[#667067] font-bold uppercase">/ 100</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif] mb-1">
              High Selling Score
            </h3>
            <p className="text-[#667067] dark:text-[#B9C3BA] text-xs leading-relaxed max-w-xs">
              Optimal net profit margin calculated across fuel rates, APMC mandi fees, and transport duration.
            </p>

            <div className="mt-6 w-full pt-4 border-t border-[#DDD9CF] dark:border-[#28513A]/60">
              <div className="flex justify-between text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-2">
                <span>Confidence Level</span>
                <span className="text-[#D99A2B]">94%</span>
              </div>
              <div className="w-full bg-[#F8F5ED] dark:bg-[#101814] h-2 rounded-full overflow-hidden">
                <div className="bg-[#D99A2B] h-full w-[94%] rounded-full" />
              </div>
            </div>

          </div>

          {/* Bento Tile 3: Timeline Strategy Deep Forest Tile (col-span-4) */}
          <div className="md:col-span-4 bg-[#183A2B] rounded-[2rem] p-6 sm:p-8 text-[#FFFDF8] relative overflow-hidden flex flex-col justify-between space-y-4 border border-[#D99A2B]/30">
            
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A2B]">
                Market Timing
              </span>
              <h3 className="text-2xl font-bold font-['Manrope',sans-serif] mt-1 mb-2 italic">
                Hold 2 Days
              </h3>
              <p className="text-[#A8B89F] text-xs leading-relaxed mb-6">
                Historical arrivals data indicates a supply gap starting Thursday. Prices in Navi Mumbai predicted to rise by 4.2%.
              </p>

              {/* Sparkline Histogram */}
              <div className="flex items-end gap-1.5 h-14 mb-2">
                <div className="flex-1 bg-[#28513A] h-6 rounded-t-sm" />
                <div className="flex-1 bg-[#28513A] h-8 rounded-t-sm" />
                <div className="flex-1 bg-[#28513A] h-10 rounded-t-sm" />
                <div className="flex-1 bg-[#D99A2B] h-14 rounded-t-sm" />
                <div className="flex-1 bg-[#28513A] h-11 rounded-t-sm" />
                <div className="flex-1 bg-[#28513A] h-9 rounded-t-sm" />
              </div>
              <div className="text-[10px] text-[#A8B89F] flex justify-between uppercase font-bold">
                <span>Mon</span>
                <span className="text-[#D99A2B]">Wed (Peak)</span>
                <span>Fri</span>
              </div>
            </div>

          </div>

          {/* Bento Tile 4: Verified Buyer Card (col-span-4) */}
          <div className="md:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider">
                  Verified APMC Buyer
                </h4>
                <span className="text-[10px] font-bold text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#DDD9CF] dark:border-[#28513A]">
                  <CheckCircle2 className="w-3 h-3 text-[#D99A2B]" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#183A2B] text-[#D99A2B] flex items-center justify-center font-extrabold text-xl font-['Manrope',sans-serif] border border-[#D99A2B]/30">
                  SK
                </div>
                <div>
                  <div className="font-bold text-base text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                    Suresh Kumar
                  </div>
                  <div className="text-xs text-[#667067] dark:text-[#B9C3BA]">
                    Registered APMC Trader #4421
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="flex justify-between">
                  <span className="text-[#667067] dark:text-[#B9C3BA]">Reliability Rating</span>
                  <span className="font-bold text-[#183A2B] dark:text-[#D99A2B]">★ 4.9 (98%)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#667067] dark:text-[#B9C3BA]">Payment Terms</span>
                  <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">Direct Transfer / Cash</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#667067] dark:text-[#B9C3BA]">Monthly Volume</span>
                  <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">1,200 Tonnes</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onExplorePrices}
              className="w-full mt-6 py-3 border border-[#DDD9CF] dark:border-[#28513A] rounded-xl text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F8F5ED] dark:hover:bg-[#28513A] transition-all"
            >
              Browse Buyer Directory
            </button>
          </div>

          {/* Bento Tile 5: Live Market Monitor Card (col-span-4) */}
          <div className="md:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-base text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                  Live Market Rates
                </h4>
                <span className="text-[10px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase">
                  AgmarkNet Today
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A]/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D99A2B]" />
                    <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">Mumbai Vashi APMC</span>
                  </div>
                  <span className="font-bold text-[#183A2B] dark:text-[#D99A2B] font-['Manrope',sans-serif]">₹2,850/q</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A]/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28513A]" />
                    <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">Pune APMC</span>
                  </div>
                  <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">₹2,680/q</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A]/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C8663D]" />
                    <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">Nashik APMC</span>
                  </div>
                  <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">₹2,720/q</span>
                </div>
              </div>
            </div>

            <button
              onClick={onExplorePrices}
              className="w-full mt-4 py-3 bg-[#183A2B] hover:bg-[#28513A] text-xs font-bold text-[#FFFDF8] rounded-xl transition-all flex items-center justify-center space-x-1"
            >
              <span>Compare All 15+ Mandis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};


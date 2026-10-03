import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Language, SavedRecommendation } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  Store, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  Bookmark, 
  CloudSun,
  User,
  Plus
} from 'lucide-react';
import { SavedRecommendationsList } from './SavedRecommendationsList';

interface DashboardProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  savedList: SavedRecommendation[];
  onSelectSaved: (saved: SavedRecommendation) => void;
  onDeleteSaved: (id: string) => void;
  onClearAll: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  onNavigateTab,
  savedList,
  onSelectSaved,
  onDeleteSaved,
  onClearAll
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'mr' ? 'शुभ सकाळ' : language === 'hi' ? 'सुप्रभात' : 'Good Morning';
    } else if (hour < 17) {
      return language === 'mr' ? 'शुभ दुपार' : language === 'hi' ? 'नमस्कार' : 'Good Afternoon';
    }
    return language === 'mr' ? 'शुभ संध्याकाळ' : language === 'hi' ? 'शुभ संध्या' : 'Good Evening';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner Card */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#183A2B] via-[#10271D] to-[#0D1F17] text-[#FFFDF8] p-6 sm:p-10 card-shadow overflow-hidden border border-[#28513A]">
        {/* Subtle decorative background graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#D99A2B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFFDF8]/10 border border-[#FFFDF8]/20 text-xs font-bold text-[#D99A2B]">
            <Sparkles className="w-4 h-4 text-[#D99A2B]" />
            <span>AgriPlus AI Farmer Dashboard</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold font-['Manrope',sans-serif] tracking-tight">
              {getGreeting()}, <span className="text-[#D99A2B]">{user?.givenName || user?.name || 'Farmer'}</span>
            </h1>
            <p className="text-sm sm:text-base text-[#B9C3BA] font-medium leading-relaxed">
              {language === 'mr'
                ? 'तुमच्या पिकांचा जास्तीत जास्त निव्वळ नफा मिळवण्यासाठी आजचे बाजार भाव आणि AI शिफारसी तपासा.'
                : language === 'hi'
                ? 'अपनी फसल का अधिकतम शुद्ध लाभ प्राप्त करने के लिए आज के मंडी भाव और AI सिफारिशें देखें।'
                : 'Explore real-time AgmarkNet prices, compare net transport profits across Mandis, and connect with licensed buyers.'
              }
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('recommendation')}
              className="px-5 py-3 rounded-2xl bg-[#D99A2B] hover:bg-[#C88A20] text-[#183A2B] font-extrabold text-xs flex items-center space-x-2 transition-all shadow-md active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#183A2B]" />
              <span>{language === 'mr' ? 'नवीन AI शिफारस' : language === 'hi' ? 'नई AI सिफारिश' : 'New AI Recommendation'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('prices')}
              className="px-5 py-3 rounded-2xl bg-[#FFFDF8]/10 hover:bg-[#FFFDF8]/20 text-[#FFFDF8] border border-[#FFFDF8]/20 font-bold text-xs flex items-center space-x-2 transition-all"
            >
              <Store className="w-4 h-4 text-[#D99A2B]" />
              <span>{language === 'mr' ? 'बाजार भाव तपासा' : language === 'hi' ? 'मंडी भाव देखें' : 'View Market Prices'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] p-5 rounded-3xl border border-[#DDD9CF] dark:border-[#28513A] card-shadow space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667067] dark:text-[#B9C3BA]">
            <span>Bookmarked Reports</span>
            <Bookmark className="w-4 h-4 text-[#D99A2B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9]">
            {savedList.length}
          </div>
          <p className="text-[11px] text-[#667067] dark:text-[#B9C3BA]">Saved in your profile</p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] p-5 rounded-3xl border border-[#DDD9CF] dark:border-[#28513A] card-shadow space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667067] dark:text-[#B9C3BA]">
            <span>AgmarkNet Feed</span>
            <Store className="w-4 h-4 text-[#183A2B] dark:text-[#D99A2B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9]">
            Live APMC
          </div>
          <p className="text-[11px] text-[#183A2B] dark:text-[#D99A2B] font-bold">10+ Mandis Active</p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] p-5 rounded-3xl border border-[#DDD9CF] dark:border-[#28513A] card-shadow space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667067] dark:text-[#B9C3BA]">
            <span>Verified Buyers</span>
            <ShieldCheck className="w-4 h-4 text-[#D99A2B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9]">
            95%+ Trust
          </div>
          <p className="text-[11px] text-[#667067] dark:text-[#B9C3BA]">Direct phone & WhatsApp</p>
        </div>

        <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] p-5 rounded-3xl border border-[#DDD9CF] dark:border-[#28513A] card-shadow space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#667067] dark:text-[#B9C3BA]">
            <span>Weather Risk</span>
            <CloudSun className="w-4 h-4 text-[#183A2B] dark:text-[#D99A2B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9]">
            Optimal
          </div>
          <p className="text-[11px] text-[#667067] dark:text-[#B9C3BA]">Nashik Transit Corridor</p>
        </div>

      </div>

      {/* Feature Grid Quick Navigation Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
          {language === 'mr' ? 'शेतकरी टूल्स आणि वैशिष्ट्ये' : language === 'hi' ? 'किसान टूल्स और विशेषताएं' : 'Core Farmer Features'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <button
            onClick={() => onNavigateTab('recommendation')}
            className="text-left bg-[#FFFDF8] dark:bg-[#1E2D25] p-6 rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A] hover:border-[#D99A2B] dark:hover:border-[#D99A2B] card-shadow group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-[#183A2B] dark:text-[#D99A2B] mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-[#D99A2B]" />
            </div>
            <h4 className="text-base font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-1 group-hover:text-[#D99A2B] transition-colors flex items-center justify-between">
              <span>AI Market Recommendation</span>
              <ArrowRight className="w-4 h-4 text-[#667067] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed">
              Find which APMC mandi gives you highest net cash profit after deducting real transport and commission costs.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('prices')}
            className="text-left bg-[#FFFDF8] dark:bg-[#1E2D25] p-6 rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A] hover:border-[#183A2B] dark:hover:border-[#D99A2B] card-shadow group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-[#183A2B] dark:text-[#D99A2B] mb-4 group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6 text-[#183A2B] dark:text-[#D99A2B]" />
            </div>
            <h4 className="text-base font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-1 group-hover:text-[#183A2B] dark:group-hover:text-[#D99A2B] transition-colors flex items-center justify-between">
              <span>Live Market Prices</span>
              <ArrowRight className="w-4 h-4 text-[#667067] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed">
              Explore real-time APMC Mandi rates, daily arrivals in tonnes, and buyer counts across Maharashtra.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('calculator')}
            className="text-left bg-[#FFFDF8] dark:bg-[#1E2D25] p-6 rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A] hover:border-[#183A2B] dark:hover:border-[#D99A2B] card-shadow group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-[#183A2B] dark:text-[#D99A2B] mb-4 group-hover:scale-105 transition-transform">
              <Calculator className="w-6 h-6 text-[#183A2B] dark:text-[#D99A2B]" />
            </div>
            <h4 className="text-base font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-1 group-hover:text-[#183A2B] dark:group-hover:text-[#D99A2B] transition-colors flex items-center justify-between">
              <span>Profit Calculator</span>
              <ArrowRight className="w-4 h-4 text-[#667067] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed">
              Simulate transport costs, labor, and commission per quintal to calculate exact earnings before leaving farm.
            </p>
          </button>

        </div>
      </div>

      {/* Saved Recommendations History Section */}
      <div className="pt-2">
        <SavedRecommendationsList
          savedList={savedList}
          onSelectSaved={onSelectSaved}
          onDeleteSaved={onDeleteSaved}
          onClearAll={onClearAll}
          onStartNewSearch={() => onNavigateTab('recommendation')}
          language={language}
        />
      </div>

    </div>
  );
};

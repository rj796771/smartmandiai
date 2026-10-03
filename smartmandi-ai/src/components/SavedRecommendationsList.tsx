import React, { useState } from 'react';
import { SavedRecommendation, Language } from '../types';
import { formatDateByLanguage } from '../utils/dateUtils';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Sparkles, 
  Search
} from 'lucide-react';
import { POPULAR_CROPS } from '../data/mandisData';

interface SavedRecommendationsListProps {
  savedList: SavedRecommendation[];
  onSelectSaved: (saved: SavedRecommendation) => void;
  onDeleteSaved: (id: string) => void;
  onClearAll: () => void;
  onStartNewSearch: () => void;
  language: Language;
}

export const SavedRecommendationsList: React.FC<SavedRecommendationsListProps> = ({
  savedList,
  onSelectSaved,
  onDeleteSaved,
  onClearAll,
  onStartNewSearch,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter saved list based on search term (crop name or district)
  const filteredList = savedList.filter(item => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      item.input.cropName.toLowerCase().includes(term) ||
      item.input.farmerDistrict.toLowerCase().includes(term) ||
      item.result.recommendedMandi.name.toLowerCase().includes(term)
    );
  });

  const getCropIcon = (cropId: string) => {
    const crop = POPULAR_CROPS.find(c => c.id === cropId);
    return crop?.icon || '🌾';
  };

  const getSellAdviceLabel = (advice: string) => {
    switch (advice) {
      case 'SELL_TODAY':
        return {
          label: language === 'mr' ? 'आजच विक्री करा' : language === 'hi' ? 'आज ही बेचें' : 'SELL TODAY',
          color: 'bg-[#F8F5ED] text-[#183A2B] dark:bg-[#101814] dark:text-[#D99A2B] border-[#DDD9CF] dark:border-[#28513A]'
        };
      case 'WAIT_2_DAYS':
        return {
          label: language === 'mr' ? '२ दिवस वाट पाहा' : language === 'hi' ? '2 दिन प्रतीक्षा करें' : 'WAIT 2 DAYS',
          color: 'bg-[#F8F5ED] text-[#D99A2B] dark:bg-[#101814] dark:text-[#D99A2B] border-[#DDD9CF] dark:border-[#28513A]'
        };
      default:
        return {
          label: language === 'mr' ? '५ दिवस वाट पाहा' : language === 'hi' ? '5 दिन प्रतीक्षा करें' : 'WAIT 5 DAYS',
          color: 'bg-[#F8F5ED] text-[#C8663D] dark:bg-[#101814] dark:text-[#C8663D] border-[#DDD9CF] dark:border-[#28513A]'
        };
    }
  };

  return (
    <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 sm:p-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#183A2B] dark:text-[#D99A2B] text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 text-[#D99A2B]" />
            <span>{language === 'mr' ? 'साठवलेला इतिहास' : language === 'hi' ? 'सहेजा गया इतिहास' : 'Saved Recommendation History'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif] flex items-center space-x-2">
            <span>
              {language === 'mr' ? 'माझा इतिहास (My History)' : language === 'hi' ? 'मेरा इतिहास (My History)' : 'My History & Bookmarks'}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#D99A2B] border border-[#DDD9CF] dark:border-[#28513A] font-bold">
              {savedList.length} {savedList.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </h2>
          <p className="text-xs text-[#667067] dark:text-[#B9C3BA] mt-1">
            {language === 'mr'
              ? 'स्थानिक localStorage मध्ये साठवलेले जुने शोध व मिळालेले नफा अंदाज.'
              : language === 'hi'
              ? 'स्थानिक डिवाइस में सुरक्षित रखी गई पिछली रिपोर्ट और अनुमान।'
              : 'Bookmarked recommendations stored safely in your browser.'}
          </p>
        </div>

        {savedList.length > 0 && (
          <div className="flex items-center space-x-3">
            {confirmClear ? (
              <div className="flex items-center space-x-2 bg-[#F8F5ED] dark:bg-[#101814] p-2 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] text-xs">
                <span className="font-bold text-[#C8663D]">Clear all?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="px-2.5 py-1 bg-[#C8663D] text-white rounded-lg font-bold hover:bg-[#B5552C]"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] rounded-lg font-bold border border-[#DDD9CF]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3.5 py-2 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#C8663D] hover:bg-[#F0EBE0] text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'सर्व हटवा' : language === 'hi' ? 'सभी हटाएं' : 'Clear All'}</span>
              </button>
            )}

            <button
              onClick={onStartNewSearch}
              className="px-4 py-2 rounded-xl bg-[#183A2B] hover:bg-[#10271D] text-[#FFFDF8] text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span>{language === 'mr' ? 'नवीन शोध घ्या' : language === 'hi' ? 'नया खोजें' : '+ New Search'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      {savedList.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667067]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'पीक किंवा जिल्ह्यानुसार शोधा (उदा. Onion, Nashik)...'
                : language === 'hi'
                ? 'फसल या जिले के नाम से खोजें (उदा. Tomato, Pune)...'
                : 'Filter saved searches by crop or district name...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-xs font-medium text-[#202522] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#D99A2B]"
          />
        </div>
      )}

      {/* Empty State */}
      {savedList.length === 0 ? (
        <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-[#183A2B] dark:text-[#D99A2B]">
            <Bookmark className="w-8 h-8 text-[#D99A2B]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              {language === 'mr' ? 'कोणताही इतिहास साठवलेला नाही' : language === 'hi' ? 'कोई इतिहास सहेजा नहीं गया है' : 'No Saved Recommendations Yet'}
            </h3>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] mt-1 leading-relaxed">
              {language === 'mr'
                ? 'जेव्हा तुम्ही AI द्वारे बाजारपेठ आणि नफा शोधाल, तेव्हा रिझल्ट कार्डवर "Bookmark" बटण दाबून शोध साठवून ठेवू शकता.'
                : language === 'hi'
                ? 'जब आप AI बाज़ार खोजें, तो परिणाम पर "Bookmark" बटन दबाकर उसे सहेज सकते हैं।'
                : 'Bookmark your AI market recommendation results to access past searches anytime.'}
            </p>
          </div>
          <button
            onClick={onStartNewSearch}
            className="px-5 py-2.5 rounded-xl bg-[#183A2B] hover:bg-[#10271D] text-[#FFFDF8] font-bold text-xs inline-flex items-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D99A2B]" />
            <span>{language === 'mr' ? 'आत्ताच नवीन शोध घ्या' : language === 'hi' ? 'अभी नया खोजें' : 'Run AI Recommendation Search'}</span>
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-8 text-[#667067] text-xs">
          No saved recommendations match "{searchTerm}". Try another search term.
        </div>
      ) : (
        /* Saved List Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const adviceBadge = getSellAdviceLabel(item.result.sellAdvice);
            const cropIcon = getCropIcon(item.input.cropId);

            return (
              <div
                key={item.id}
                className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-5 border border-[#DDD9CF] dark:border-[#28513A] hover:border-[#D99A2B]/80 transition-all flex flex-col justify-between space-y-4 group relative"
              >
                {/* Card Top Info */}
                <div className="space-y-3">
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-2xl shadow-sm">
                        {cropIcon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#183A2B] dark:text-[#F5F2E9] text-base font-['Manrope',sans-serif]">
                          {item.input.cropName} ({item.input.quantityQuintals} Quintals)
                        </h4>
                        <div className="text-[11px] text-[#667067] dark:text-[#B9C3BA] flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#D99A2B]" />
                          <span>{item.input.farmerDistrict}, MH • {item.input.vehicleType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Advice Tag */}
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${adviceBadge.color}`}>
                      {adviceBadge.label}
                    </span>
                  </div>

                  {/* Result Metric Highlights */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDD9CF] dark:border-[#28513A]/60 text-xs">
                    <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] p-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A]">
                      <span className="text-[10px] font-bold text-[#667067] uppercase block">
                        Recommended Mandi
                      </span>
                      <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] truncate block">
                        {item.result.recommendedMandi.name}
                      </span>
                      <span className="text-[10px] text-[#667067]">
                        ₹{item.result.recommendedMandi.pricePerQuintal}/q
                      </span>
                    </div>

                    <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] p-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A]">
                      <span className="text-[10px] font-bold text-[#183A2B] dark:text-[#D99A2B] uppercase block">
                        Est. Net Cash Profit
                      </span>
                      <span className="font-extrabold text-[#183A2B] dark:text-[#D99A2B] text-sm font-['Manrope',sans-serif]">
                        ₹{item.result.breakdown.netProfit.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#667067] block font-semibold">
                        Score: {item.result.sellingScore}/100
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#DDD9CF] dark:border-[#28513A]/60 text-xs">
                  <span className="text-[11px] text-[#667067] flex items-center space-x-1 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>
                      {language === 'mr' ? 'साठवले: ' : language === 'hi' ? 'सहेजा गया: ' : 'Saved: '}
                      {formatDateByLanguage(item.createdAt, language, { includeTime: true })}
                    </span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onDeleteSaved(item.id)}
                      title="Delete from history"
                      className="p-1.5 rounded-lg text-[#667067] hover:text-[#C8663D] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectSaved(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#183A2B] hover:bg-[#10271D] text-[#FFFDF8] font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <span>{language === 'mr' ? 'तपशील पहा' : language === 'hi' ? 'विवरण देखें' : 'View Report'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

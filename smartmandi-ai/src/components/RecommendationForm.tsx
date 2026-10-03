import React, { useState } from 'react';
import { POPULAR_CROPS, MAHARASHTRA_DISTRICTS } from '../data/mandisData';
import { RecommendationInput, Language } from '../types';
import { Sparkles, MapPin, Calendar, Truck, Scale, Mic, ArrowRight } from 'lucide-react';

interface RecommendationFormProps {
  onSubmit: (input: RecommendationInput) => void;
  isLoading: boolean;
  language: Language;
  onOpenVoice: () => void;
}

export const RecommendationForm: React.FC<RecommendationFormProps> = ({
  onSubmit,
  isLoading,
  language,
  onOpenVoice
}) => {
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(30);
  const [farmerDistrict, setFarmerDistrict] = useState('Nashik');
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [vehicleType, setVehicleType] = useState<RecommendationInput['vehicleType']>('Small Truck (Pickup)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const crop = POPULAR_CROPS.find(c => c.id === selectedCropId) || POPULAR_CROPS[0];
    onSubmit({
      cropId: crop.id,
      cropName: crop.name,
      quantityQuintals: Number(quantityQuintals) || 10,
      farmerDistrict,
      harvestDate,
      vehicleType
    });
  };

  const getCropDisplayName = (crop: typeof POPULAR_CROPS[0]) => {
    if (language === 'mr') return `${crop.nameMr} (${crop.name})`;
    if (language === 'hi') return `${crop.nameHi} (${crop.name})`;
    return crop.name;
  };

  return (
    <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 sm:p-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#DDD9CF] dark:border-[#28513A]/60 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#D99A2B] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D99A2B]" />
            <span>Market Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope','Poppins',sans-serif] mt-1">
            {language === 'mr' ? 'पीक आणि बाजाराचे तपशील प्रविष्ट करा' : language === 'hi' ? 'फसल और मंडी विवरण दर्ज करें' : 'Get Smart Market Recommendation'}
          </h2>
          <p className="text-sm text-[#667067] dark:text-[#B9C3BA] mt-1">
            {language === 'mr' ? 'तुमच्या पिकासाठी सर्वात जास्त निव्वळ नफा देणारी बाजारपेठ शोधा' : language === 'hi' ? 'अपनी फसल के लिए सबसे अधिक शुद्ध लाभ देने वाली मंडी खोजें' : 'Enter crop details to calculate highest net profit after transport and fees.'}
          </p>
        </div>

        {/* Voice Input Assistant Prompt Button */}
        <button
          type="button"
          onClick={onOpenVoice}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-xs font-semibold text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F0EBE0] transition-colors"
        >
          <Mic className="w-4 h-4 text-[#D99A2B]" />
          <span>{language === 'mr' ? 'बोलून माहिती द्या' : language === 'hi' ? 'बोलकर भरें' : 'Voice Input'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* 1. Crop Selection Cards */}
        <div>
          <label className="block text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-3">
            {language === 'mr' ? '१. पीक निवडा (Select Crop)' : language === 'hi' ? '1. फसल चुनें (Select Crop)' : '1. Select Crop'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {POPULAR_CROPS.map((crop) => {
              const isSelected = selectedCropId === crop.id;
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#183A2B] dark:border-[#D99A2B] bg-[#183A2B] text-[#FFFDF8] shadow-sm'
                      : 'border-[#DDD9CF] dark:border-[#28513A]/80 hover:border-[#183A2B]/40 bg-[#F8F5ED] dark:bg-[#101814]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{crop.icon}</span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D99A2B]" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className={`font-bold text-xs truncate ${isSelected ? 'text-[#FFFDF8]' : 'text-[#183A2B] dark:text-[#F5F2E9]'}`}>
                      {getCropDisplayName(crop)}
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-[#A8B89F]' : 'text-[#667067] dark:text-[#B9C3BA]'}`}>
                      ₹{crop.defaultPricePerQuintal}/q avg
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Quantity & Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-[#D99A2B]" />
                <span>{language === 'mr' ? '२. प्रमाण (प्रमाण क्विंटलमध्ये)' : language === 'hi' ? '2. मात्रा (क्विंटल में)' : '2. Quantity (Quintals)'}</span>
              </span>
              <span className="text-xs font-medium text-[#667067] dark:text-[#B9C3BA]">100 kg = 1 Quintal</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10000"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] font-semibold focus:outline-none focus:ring-2 focus:ring-[#183A2B] transition-all"
                placeholder="e.g. 30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] bg-[#DDD9CF]/50 dark:bg-[#28513A] px-2.5 py-1 rounded-md">
                Quintal ({((quantityQuintals || 0) / 10).toFixed(1)} Tonne)
              </span>
            </div>
            {/* Quick Presets */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[11px] text-[#667067] dark:text-[#B9C3BA] font-medium">Quick:</span>
              {[10, 30, 50, 100].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantityQuintals(q)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md border font-semibold ${
                    quantityQuintals === q
                      ? 'bg-[#183A2B] text-[#FFFDF8] border-[#183A2B]'
                      : 'bg-[#F8F5ED] dark:bg-[#101814] border-[#DDD9CF] dark:border-[#28513A] text-[#183A2B] dark:text-[#F5F2E9]'
                  }`}
                >
                  {q} Q
                </button>
              ))}
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#C8663D]" />
              <span>{language === 'mr' ? '३. तुमचे ठिकाण (जिल्हा)' : language === 'hi' ? '3. आपका स्थान (जिला)' : '3. Farmer Location (District)'}</span>
            </label>
            <select
              value={farmerDistrict}
              onChange={(e) => setFarmerDistrict(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] font-semibold focus:outline-none focus:ring-2 focus:ring-[#183A2B] transition-all cursor-pointer"
            >
              {MAHARASHTRA_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}, Maharashtra
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#667067] dark:text-[#B9C3BA] mt-1.5">
              Distance and freight costs are calculated from this hub.
            </p>
          </div>

        </div>

        {/* 3. Harvest Date & Transport Vehicle Choice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-[#D99A2B]" />
              <span>{language === 'mr' ? '४. काढणीची तारीख / विक्री वेळ' : language === 'hi' ? '4. कटाई की तारीख / बिक्री समय' : '4. Harvest / Ready Date'}</span>
            </label>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] font-semibold focus:outline-none focus:ring-2 focus:ring-[#183A2B] transition-all"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] mb-2 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-[#D99A2B]" />
              <span>{language === 'mr' ? '५. वाहतुकीचे साधन' : language === 'hi' ? '5. वाहन प्रकार' : '5. Transport Vehicle'}</span>
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] font-semibold focus:outline-none focus:ring-2 focus:ring-[#183A2B] transition-all cursor-pointer"
            >
              <option value="Tractor">Tractor (1-3 Tonnes / 10-30 Q)</option>
              <option value="Small Truck (Pickup)">Small Pickup Truck (3-5 Tonnes / 30-50 Q)</option>
              <option value="Medium Truck (10-Ton)">Medium Truck (10 Tonnes / 100 Q)</option>
              <option value="Heavy Freight Truck">Heavy Freight Truck (15+ Tonnes)</option>
            </select>
          </div>

        </div>

        {/* Submit CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#FFFDF8] bg-[#183A2B] hover:bg-[#28513A] active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg border border-[#D99A2B]/40 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-[#D99A2B] border-t-transparent rounded-full animate-spin" />
                <span>Analyzing AgmarkNet Rates & Transit Logistics...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#D99A2B]" />
                <span className="font-['Manrope',sans-serif]">
                  {language === 'mr' ? 'सर्वोत्तम बाजारपेठ आणि नफा शोधा' : language === 'hi' ? 'सर्वश्रेष्ठ मंडी और मुनाफा खोजें' : 'Get Best Market & Profit Recommendation'}
                </span>
                <ArrowRight className="w-5 h-5 text-[#D99A2B]" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

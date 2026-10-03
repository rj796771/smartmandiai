import React, { useState } from 'react';
import { RecommendationResult, Language } from '../types';
import { 
  CheckCircle2, 
  MapPin, 
  Truck, 
  ArrowUpRight, 
  Clock, 
  Phone, 
  MessageSquare, 
  Download, 
  RotateCcw, 
  CloudRain, 
  Info,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { PriceChart } from './PriceChart';

interface RecommendationCardProps {
  result: RecommendationResult;
  onRecalculate: () => void;
  onDownloadPdf: () => void;
  onSaveRecommendation?: () => void;
  isSaved?: boolean;
  language: Language;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  result,
  onRecalculate,
  onDownloadPdf,
  onSaveRecommendation,
  isSaved = false,
  language
}) => {
  const [showCostBreakdown, setShowCostBreakdown] = useState(true);
  const [showAlternates, setShowAlternates] = useState(false);

  const { recommendedMandi, alternateMandis, sellingScore, sellAdvice, sellAdviceReason, sellAdviceConfidence, breakdown, recommendedBuyers, pricePredictionTrend, weatherRiskAlert, aiReasoningText } = result;

  const getSellAdviceBadge = () => {
    switch (sellAdvice) {
      case 'SELL_TODAY':
        return {
          label: language === 'mr' ? 'आजच विक्री करा (Sell Today)' : language === 'hi' ? 'आज ही बेचें (Sell Today)' : 'SELL TODAY',
          bg: 'bg-[#2E7D32] text-white',
          desc: sellAdviceReason
        };
      case 'WAIT_2_DAYS':
        return {
          label: language === 'mr' ? '२ दिवस वाट पाहा (Wait 2 Days)' : language === 'hi' ? '2 दिन प्रतीक्षा करें' : 'WAIT 2 DAYS',
          bg: 'bg-amber-500 text-white',
          desc: sellAdviceReason
        };
      case 'WAIT_5_DAYS':
        return {
          label: language === 'mr' ? '५ दिवस वाट पाहा (Wait 5 Days)' : language === 'hi' ? '5 दिन प्रतीक्षा करें' : 'WAIT 5 DAYS',
          bg: 'bg-blue-500 text-white',
          desc: sellAdviceReason
        };
      default:
        return {
          label: 'SELL TODAY',
          bg: 'bg-[#2E7D32] text-white',
          desc: sellAdviceReason
        };
    }
  };

  const adviceInfo = getSellAdviceBadge();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#1E2D25] card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D99A2B]" />
            <span className="font-['Manrope',sans-serif] tracking-wide">Market Decision Support Engine</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#667067] dark:text-[#B9C3BA]">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-[#183A2B] dark:text-[#F5F2E9]">
              📊 {result.dataSources?.priceSource || 'AgmarkNet Daily APMC Feed'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-[#183A2B] dark:text-[#F5F2E9]">
              🗺️ {result.dataSources?.distanceSource || 'GPS Freight Logistics Matrix'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          {onSaveRecommendation && (
            <button
              onClick={onSaveRecommendation}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
                isSaved
                  ? 'bg-[#183A2B] text-[#D99A2B] border border-[#D99A2B]/40'
                  : 'bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] border border-[#DDD9CF] dark:border-[#28513A] hover:bg-[#F0EBE0]'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#D99A2B]" />
                  <span>{language === 'mr' ? 'साठवले' : language === 'hi' ? 'सहेजा गया' : 'Bookmarked'}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#D99A2B]" />
                  <span>{language === 'mr' ? 'सेव्ह करा (Bookmark)' : language === 'hi' ? 'सहेजें (Bookmark)' : 'Bookmark Search'}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onRecalculate}
            className="text-[#667067] hover:text-[#183A2B] dark:hover:text-[#F5F2E9] flex items-center space-x-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#183A2B] dark:text-[#D99A2B]" />
            <span>Recalculate</span>
          </button>
          <button
            onClick={onDownloadPdf}
            className="px-4 py-1.5 rounded-xl bg-[#183A2B] hover:bg-[#28513A] text-[#FFFDF8] font-bold flex items-center space-x-1.5 shadow-sm border border-[#D99A2B]/30"
          >
            <Download className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>PDF Decision Report</span>
          </button>
        </div>
      </div>

      {/* BENTO GRID RECOMMENDATION DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bento Tile 1: Top Mandi Recommendation Hero (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col justify-between space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-3 py-1 rounded-full inline-flex items-center space-x-1.5 border border-[#D99A2B]/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D99A2B]" />
                <span>BEST MARKET RECOMMENDATION</span>
              </span>
              <h2 className="font-['Manrope','Poppins',sans-serif] text-3xl sm:text-4xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] mt-3 mb-1">
                {recommendedMandi.name}
              </h2>
              <p className="text-[#667067] dark:text-[#B9C3BA] text-sm flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-[#C8663D]" />
                <span>{recommendedMandi.district}, Maharashtra • {recommendedMandi.distanceKm} km distance</span>
              </p>
            </div>

            <div className="bg-[#183A2B] text-[#FFFDF8] p-4.5 rounded-2xl border border-[#D99A2B]/40 text-left sm:text-right min-w-[190px]">
              <span className="text-xs font-bold text-[#D99A2B] uppercase block">
                Estimated Net Profit
              </span>
              <div className="text-3xl font-extrabold text-[#FFFDF8] font-['Manrope',sans-serif] mt-0.5">
                ₹{breakdown.netProfit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/50">
              <div className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-1">
                Market Price
              </div>
              <div className="text-xl font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                ₹{recommendedMandi.pricePerQuintal.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-[#667067]"> / quintal</span>
              </div>
            </div>

            <div className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/50">
              <div className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-1">
                Transport Freight
              </div>
              <div className="text-xl font-bold text-[#C8663D] font-['Manrope',sans-serif]">
                ₹{breakdown.transportCost.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-[#F8F5ED] dark:bg-[#101814] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/50">
              <div className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-1">
                Selling Score
              </div>
              <div className="text-xl font-bold text-[#D99A2B] font-['Manrope',sans-serif]">
                {sellingScore} / 100
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-xs text-[#202522] dark:text-[#F5F2E9] font-medium leading-relaxed">
            <span className="font-bold text-[#183A2B] dark:text-[#D99A2B] block mb-1 uppercase tracking-wider">
              Market Intelligence Summary
            </span>
            <span>{aiReasoningText}</span>
          </div>

        </div>

        {/* Bento Tile 2: Smart Score Radial Meter Card (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col items-center justify-center text-center">
          
          <div className="relative mb-4">
            <svg className="w-36 h-36">
              <circle cx="72" cy="72" r="62" stroke="#DDD9CF" strokeWidth="12" fill="none" className="dark:stroke-[#28513A]" />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="#D99A2B"
                strokeWidth="12"
                fill="none"
                strokeDasharray="389"
                strokeDashoffset={389 - (389 * sellingScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">{sellingScore}</span>
              <span className="text-xs text-[#667067] font-bold uppercase">/ 100 Score</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif] mb-1">
            Selling Score Index
          </h3>
          <p className="text-[#667067] dark:text-[#B9C3BA] text-xs leading-relaxed max-w-xs">
            Net return score considering market price velocity, transport logistics costs, and APMC commission fees.
          </p>

          <div className="mt-6 w-full pt-4 border-t border-[#DDD9CF] dark:border-[#28513A]/60">
            <div className="flex justify-between text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase mb-2">
              <span>Decision Confidence</span>
              <span className="text-[#D99A2B]">{sellAdviceConfidence}%</span>
            </div>
            <div className="w-full bg-[#F8F5ED] dark:bg-[#101814] h-2 rounded-full overflow-hidden">
              <div className="bg-[#D99A2B] h-full rounded-full" style={{ width: `${sellAdviceConfidence}%` }} />
            </div>
          </div>

        </div>

        {/* Bento Tile 3: Timeline Strategy Deep Forest Card (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#183A2B] rounded-[2rem] p-6 sm:p-8 text-[#FFFDF8] relative overflow-hidden flex flex-col justify-between space-y-4 border border-[#D99A2B]/30">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D99A2B]">
              Market Timing Advisory
            </span>
            <div className="mt-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-[#D99A2B] text-[#183A2B]">
                {adviceInfo.label}
              </span>
            </div>
            <p className="text-[#A8B89F] text-xs leading-relaxed mt-2 mb-6">
              {adviceInfo.desc}
            </p>

            <div className="pt-2">
              <div className="flex items-end gap-2 h-14 mb-2">
                {pricePredictionTrend.map((pt, idx) => {
                  const hPercent = Math.max(20, Math.min(100, (pt.price / 3500) * 100));
                  return (
                    <div
                      key={idx}
                      style={{ height: `${hPercent}%` }}
                      className={`flex-1 rounded-t-sm ${pt.projected ? 'bg-[#D99A2B]' : 'bg-[#28513A]'}`}
                    />
                  );
                })}
              </div>
              <div className="text-[10px] text-[#A8B89F] flex justify-between uppercase font-bold">
                <span>Historical</span>
                <span>Today</span>
                <span className="text-[#D99A2B]">Forecast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Tile 4: Recommended APMC Buyer (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider">
                Recommended APMC Buyer
              </h4>
              <span className="text-[10px] font-bold text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#DDD9CF] dark:border-[#28513A]">
                <ShieldCheck className="w-3 h-3 text-[#D99A2B]" />
                <span>Verified</span>
              </span>
            </div>

            {recommendedBuyers.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#183A2B] text-[#D99A2B] flex items-center justify-center font-bold text-lg font-['Manrope',sans-serif] border border-[#D99A2B]/30">
                    {recommendedBuyers[0].name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                      {recommendedBuyers[0].name}
                    </div>
                    <div className="text-xs text-[#667067] dark:text-[#B9C3BA]">
                      {recommendedBuyers[0].businessName}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#202522] dark:text-[#F5F2E9]">
                  <div className="flex justify-between">
                    <span className="text-[#667067] dark:text-[#B9C3BA]">Trust Rating</span>
                    <span className="font-bold text-[#183A2B] dark:text-[#D99A2B]">★ {recommendedBuyers[0].trustScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667067] dark:text-[#B9C3BA]">Payment Speed</span>
                    <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">{recommendedBuyers[0].paymentTerms}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <a
                    href={`tel:${recommendedBuyers[0].phone}`}
                    className="flex-1 py-2.5 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] hover:bg-[#F0EBE0] text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#183A2B] dark:text-[#D99A2B]" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${recommendedBuyers[0].whatsapp}?text=${encodeURIComponent(`Hello ${recommendedBuyers[0].name}, I found your contact on AgriPlus AI.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-[#183A2B] hover:bg-[#28513A] text-[#FFFDF8] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm border border-[#D99A2B]/40"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#D99A2B]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bento Tile 5: Weather Transit Risk Advisory (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] p-6 sm:p-8 card-shadow border border-[#DDD9CF] dark:border-[#28513A]/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-[#C8663D] text-xs font-bold uppercase tracking-wider">
                <CloudRain className="w-4 h-4" />
                <span>Transit Weather Advisory</span>
              </div>
              <span className="text-[10px] font-semibold text-[#667067] dark:text-[#B9C3BA] bg-[#F8F5ED] dark:bg-[#101814] px-2 py-0.5 rounded-md border border-[#DDD9CF] dark:border-[#28513A]">
                {weatherRiskAlert.sourceLabel || 'IMD Weather Data'}
              </span>
            </div>
            <h4 className="font-bold text-base text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              {weatherRiskAlert.status === 'OPTIMAL' ? 'Clear Highways for Transport' : 'Precipitation Alert on Route'}
            </h4>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] mt-2 leading-relaxed">
              {weatherRiskAlert.summary}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-[#DDD9CF] dark:border-[#28513A]/60">
            <div className="bg-[#F8F5ED] dark:bg-[#101814] p-2 rounded-xl border border-[#DDD9CF]/60 dark:border-[#28513A]/40">
              <span className="text-[#667067] block text-[10px]">Temp</span>
              <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">{weatherRiskAlert.temperatureC}°C</span>
            </div>
            <div className="bg-[#F8F5ED] dark:bg-[#101814] p-2 rounded-xl border border-[#DDD9CF]/60 dark:border-[#28513A]/40">
              <span className="text-[#667067] block text-[10px]">Rain</span>
              <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">{weatherRiskAlert.rainProbability}%</span>
            </div>
            <div className="bg-[#F8F5ED] dark:bg-[#101814] p-2 rounded-xl border border-[#DDD9CF]/60 dark:border-[#28513A]/40">
              <span className="text-[#667067] block text-[10px]">Humidity</span>
              <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">{weatherRiskAlert.humidityPercent}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Financial Transparency Ledger Section */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 sm:p-8 space-y-4">
        <button
          onClick={() => setShowCostBreakdown(!showCostBreakdown)}
          className="w-full flex items-center justify-between text-left font-bold text-base text-[#183A2B] dark:text-[#F5F2E9] hover:opacity-80 transition-opacity"
        >
          <span className="flex items-center space-x-2 font-['Manrope',sans-serif]">
            <Info className="w-5 h-5 text-[#D99A2B]" />
            <span>Financial Profit & Loss Statement (निव्वळ नफा विवरण पत्रक)</span>
          </span>
          {showCostBreakdown ? <ChevronUp className="w-5 h-5 text-[#667067]" /> : <ChevronDown className="w-5 h-5 text-[#667067]" />}
        </button>

        {showCostBreakdown && (
          <div className="space-y-3 pt-3 border-t border-[#DDD9CF] dark:border-[#28513A]/60 text-sm">
            <div className="flex justify-between py-2 border-b border-[#DDD9CF] dark:border-[#28513A]/40">
              <span className="text-[#667067] dark:text-[#B9C3BA]">Gross Sales Revenue (बाजार भाव × क्विंटल)</span>
              <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">₹{breakdown.grossRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#DDD9CF] dark:border-[#28513A]/40 text-[#C8663D]">
              <span>(−) Transport Freight Charge ({recommendedMandi.distanceKm} km)</span>
              <span className="font-bold">− ₹{breakdown.transportCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#DDD9CF] dark:border-[#28513A]/40 text-[#667067]">
              <span>(−) APMC Mandi Fee ({recommendedMandi.commissionPercent}%)</span>
              <span className="font-bold">− ₹{breakdown.mandiCommission.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-extrabold text-[#183A2B] dark:text-[#D99A2B]">
              <span>(=) ESTIMATED NET CASH PROFIT</span>
              <span>₹{breakdown.netProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Price Trend Chart Block */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#183A2B] dark:text-[#F5F2E9] flex items-center space-x-2 font-['Manrope',sans-serif]">
          <TrendingUp className="w-5 h-5 text-[#D99A2B]" />
          <span>Historical & Forecasted Market Rates</span>
        </h3>
        <PriceChart data={pricePredictionTrend} />
      </div>

      {/* Market Comparison Table Section */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD9CF] dark:border-[#28513A]/60 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              {language === 'mr' ? 'बाजार तुलना तक्ता (Market Comparison)' : language === 'hi' ? 'मंडी तुलना तालिका (Market Comparison)' : 'Market Comparison Ledger'}
            </h3>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA]">
              Evaluated by AI based on Net Profit after deducting transport fuel and APMC charges.
            </p>
          </div>
          <span className="text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-3 py-1 rounded-full border border-[#DDD9CF] dark:border-[#28513A] self-start sm:self-auto">
            Sorted by Net Cash Earnings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F5ED] dark:bg-[#101814] border-b border-[#DDD9CF] dark:border-[#28513A] text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider">
                <th className="p-3 pl-4">Market</th>
                <th className="p-3">Price (₹/q)</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Transport</th>
                <th className="p-3">Net Profit</th>
                <th className="p-3 pr-4 text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CF] dark:divide-[#28513A]/40">
              {/* #1 Recommended Market Row */}
              <tr className="bg-[#F8F5ED]/90 dark:bg-[#101814]/90 border-l-4 border-l-[#D99A2B] font-semibold">
                <td className="p-3 pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-[#183A2B] dark:text-[#F5F2E9] text-sm font-['Manrope',sans-serif]">
                      {recommendedMandi.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-[#183A2B] bg-[#D99A2B] px-2 py-0.5 rounded-md">
                      BEST MARKET
                    </span>
                  </div>
                  <span className="text-[10px] text-[#667067]">{recommendedMandi.district}</span>
                </td>
                <td className="p-3">
                  <span className="font-extrabold text-[#183A2B] dark:text-[#F5F2E9] text-sm font-['Manrope',sans-serif]">
                    ₹{recommendedMandi.pricePerQuintal.toLocaleString('en-IN')}/q
                  </span>
                </td>
                <td className="p-3 text-[#202522] dark:text-[#F5F2E9]">
                  {recommendedMandi.distanceKm} km
                </td>
                <td className="p-3 text-[#C8663D] font-bold">
                  ₹{breakdown.transportCost.toLocaleString('en-IN')}
                </td>
                <td className="p-3 font-extrabold text-[#183A2B] dark:text-[#D99A2B] text-sm font-['Manrope',sans-serif]">
                  ₹{breakdown.netProfit.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-[#183A2B] text-[#D99A2B] border border-[#D99A2B]/40 shadow-sm">
                    {sellingScore}/100
                  </span>
                </td>
              </tr>

              {/* Alternate Mandi Rows */}
              {alternateMandis.map((mandi) => {
                const altRevenue = mandi.pricePerQuintal * (breakdown.grossRevenue / recommendedMandi.pricePerQuintal);
                const altTrans = Math.round((breakdown.grossRevenue / recommendedMandi.pricePerQuintal / 10) * mandi.distanceKm * mandi.transportRatePerKmPerTon);
                const altComm = Math.round(altRevenue * (mandi.commissionPercent / 100));
                const altNet = Math.max(0, altRevenue - altTrans - altComm);
                const altScore = Math.max(60, Math.round(sellingScore - ((breakdown.netProfit - altNet) / 1000) * 2));

                return (
                  <tr key={mandi.id} className="hover:bg-[#F8F5ED] dark:hover:bg-[#101814]/50 transition-colors text-[#202522] dark:text-[#F5F2E9]">
                    <td className="p-3 pl-4 font-bold text-[#183A2B] dark:text-[#F5F2E9]">
                      <div>{mandi.name}</div>
                      <span className="text-[10px] font-normal text-[#667067]">{mandi.district}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                        ₹{mandi.pricePerQuintal.toLocaleString('en-IN')}/q
                      </span>
                    </td>
                    <td className="p-3">{mandi.distanceKm} km</td>
                    <td className="p-3 text-[#C8663D]">₹{altTrans.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                      ₹{altNet.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] border border-[#DDD9CF] dark:border-[#28513A]">
                        {altScore}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};


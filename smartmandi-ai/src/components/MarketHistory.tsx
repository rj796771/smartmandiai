import React, { useState, useMemo } from 'react';
import { 
  POPULAR_CROPS, 
  SAMPLE_MANDIS 
} from '../data/mandisData';
import { Language } from '../types';
import { formatDateByLanguage, getDateFormatHint } from '../utils/dateUtils';
import { PriceAlertModal, PriceAlert } from './PriceAlertModal';
import { requestBrowserNotificationPermission, sendBrowserNotification } from '../utils/notificationUtils';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Building2, 
  Filter, 
  Sparkles, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Info, 
  Layers,
  Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

interface MarketHistoryProps {
  language: Language;
  onSelectCropForRec?: (cropId: string) => void;
}

// Generate 6-month weekly data generator for realistic pricing curves per crop
interface MonthlyPricePoint {
  month: string;
  monthFull: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalTonnes: number;
  lasalgaonPrice?: number;
  punePrice?: number;
  vashiPrice?: number;
  compareCropPrice?: number;
}

// Generate deterministic 24-week history for a given crop ID and mandi ID
const generateHistoricalData = (cropId: string, mandiId: string, compareCropId?: string, language: Language = 'en'): MonthlyPricePoint[] => {
  const monthLabels: Record<Language, string[]> = {
    mr: ['फेब्रुवारी 2026', 'मार्च 2026', 'एप्रिल 2026', 'मे 2026', 'जून 2026', 'जुलै 2026'],
    hi: ['फरवरी 2026', 'मार्च 2026', 'अप्रैल 2026', 'मई 2026', 'जून 2026', 'जुलाई 2026'],
    en: ['Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026']
  };
  const months = monthLabels[language] || monthLabels['en'];
  
  // Base parameters per crop
  const cropBasePrices: Record<string, number> = {
    onion: 2850,
    tomato: 2200,
    soybean: 4650,
    cotton: 7400,
    wheat: 2550,
    pomegranate: 9200,
    grapes: 6800,
    turmeric: 13500,
    sugarcane: 310,
    maize: 2150
  };

  const cropCompareBases: Record<string, number> = {
    onion: 2700,
    tomato: 2100,
    soybean: 4500,
    cotton: 7200,
    wheat: 2450,
    pomegranate: 8900,
    grapes: 6500,
    turmeric: 13000,
    sugarcane: 300,
    maize: 2050
  };

  const basePrice = cropBasePrices[cropId] || 3000;
  const compareBase = compareCropId ? (cropCompareBases[compareCropId] || 2500) : 0;

  // Multipliers for 6 months (Feb to Jul) to simulate seasonal peaks/valleys
  const seasonalMultipliers: Record<string, number[]> = {
    onion: [0.78, 0.85, 0.95, 1.10, 1.22, 1.15],
    tomato: [1.25, 1.10, 0.85, 0.75, 1.05, 1.30],
    soybean: [0.92, 0.96, 1.02, 1.08, 1.05, 0.98],
    cotton: [1.12, 1.08, 1.00, 0.94, 0.90, 0.96],
    wheat: [0.88, 1.15, 1.20, 1.10, 1.05, 1.02],
    pomegranate: [0.95, 1.05, 1.18, 1.25, 1.10, 0.98],
    grapes: [1.20, 1.28, 1.10, 0.82, 0.75, 0.88],
    turmeric: [0.90, 0.94, 1.05, 1.15, 1.24, 1.20],
    sugarcane: [1.00, 1.02, 1.01, 0.99, 0.98, 1.00],
    maize: [0.85, 0.92, 1.02, 1.12, 1.18, 1.10]
  };

  const multipliers = seasonalMultipliers[cropId] || [0.9, 0.95, 1.0, 1.05, 1.1, 1.05];

  // Mandi offset multiplier
  const mandiMultiplier = mandiId === 'vashi-mumbai-apmc' ? 1.12 : mandiId === 'pune-apmc-gultekdi' ? 1.06 : mandiId === 'lasalgaon-apmc' ? 0.98 : 1.0;

  return months.map((month, idx) => {
    const mult = multipliers[idx];
    const rawPrice = Math.round(basePrice * mult * mandiMultiplier);
    const minP = Math.round(rawPrice * 0.88);
    const maxP = Math.round(rawPrice * 1.12);
    const arrivals = Math.round(1200 + Math.sin(idx + 1) * 400 + (rawPrice / 10));

    const lasalgaonP = Math.round(basePrice * mult * 0.98);
    const puneP = Math.round(basePrice * mult * 1.06);
    const vashiP = Math.round(basePrice * mult * 1.12);

    let compareP: number | undefined = undefined;
    if (compareCropId && compareCropId !== 'none') {
      const compMults = seasonalMultipliers[compareCropId] || multipliers;
      compareP = Math.round(compareBase * compMults[idx] * mandiMultiplier);
    }

    return {
      month,
      monthFull: `${month} Price Index`,
      avgPrice: rawPrice,
      minPrice: minP,
      maxPrice: maxP,
      arrivalTonnes: arrivals,
      lasalgaonPrice: lasalgaonP,
      punePrice: puneP,
      vashiPrice: vashiP,
      compareCropPrice: compareP
    };
  });
};

export const MarketHistory: React.FC<MarketHistoryProps> = ({
  language,
  onSelectCropForRec
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [compareCropId, setCompareCropId] = useState<string>('none');
  const [showMandiComparison, setShowMandiComparison] = useState<boolean>(false);

  // Price Alert Modal state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(3000);

  const handleCreateAlert = (newAlert: PriceAlert) => {
    try {
      const stored = localStorage.getItem('agriplus_price_alerts') || localStorage.getItem('smartmandi_price_alerts');
      const alerts: PriceAlert[] = stored ? JSON.parse(stored) : [];
      alerts.unshift(newAlert);
      localStorage.setItem('agriplus_price_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetAlertForPeak = (price: number) => {
    setAlertTargetPrice(price);
    setIsAlertModalOpen(true);
  };

  const activeCropAlert = useMemo(() => {
    try {
      const stored = localStorage.getItem('agriplus_price_alerts') || localStorage.getItem('smartmandi_price_alerts');
      const alerts: PriceAlert[] = stored ? JSON.parse(stored) : [];
      return alerts.find(a => a.cropId === selectedCropId && a.active);
    } catch (e) {
      return undefined;
    }
  }, [selectedCropId, isAlertModalOpen]);

  const selectedCrop = useMemo(() => {
    return POPULAR_CROPS.find(c => c.id === selectedCropId) || POPULAR_CROPS[0];
  }, [selectedCropId]);

  const compareCrop = useMemo(() => {
    return POPULAR_CROPS.find(c => c.id === compareCropId);
  }, [compareCropId]);

  const rawHistoryData = useMemo(() => {
    return generateHistoricalData(selectedCropId, selectedMandiId, compareCropId, language);
  }, [selectedCropId, selectedMandiId, compareCropId, language]);

  const historyData = useMemo(() => {
    if (timeRange === '3m') {
      return rawHistoryData.slice(3);
    }
    return rawHistoryData;
  }, [rawHistoryData, timeRange]);

  // Analytics Math
  const analytics = useMemo(() => {
    if (!historyData.length) return null;
    const prices = historyData.map(d => d.avgPrice);
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    
    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const percentageChange = Number(((endPrice - startPrice) / startPrice * 100).toFixed(1));

    const highMonthObj = historyData.find(d => d.avgPrice === highPrice);
    const lowMonthObj = historyData.find(d => d.avgPrice === lowPrice);

    return {
      highPrice,
      highMonth: highMonthObj?.month || '',
      lowPrice,
      lowMonth: lowMonthObj?.month || '',
      avgPrice,
      percentageChange,
      isPositive: percentageChange >= 0
    };
  }, [historyData]);

  // Download CSV helper
  const handleExportCSV = () => {
    const headers = ['Month', 'Avg Price (₹/Quintal)', 'Min Price', 'Max Price', 'Arrivals (Tonnes)'];
    const rows = historyData.map(d => [
      d.month,
      d.avgPrice,
      d.minPrice,
      d.maxPrice,
      d.arrivalTonnes
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCrop.name}_Market_History_6Months.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cropDisplayName = language === 'mr' ? selectedCrop.nameMr : language === 'hi' ? selectedCrop.nameHi : selectedCrop.name;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner & Control Hub */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 card-shadow space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#D99A2B] text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>AgmarkNet Historical Trends & Price Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope','Poppins',sans-serif] flex items-center space-x-2">
              <span>{selectedCrop.icon}</span>
              <span>
                {language === 'mr' 
                  ? `${cropDisplayName} - बाजार इतिहास व भाव कल` 
                  : language === 'hi' 
                  ? `${cropDisplayName} - बाज़ार इतिहास और मूल्य रुझान` 
                  : `${selectedCrop.name} - 6-Month Market History`}
              </span>
            </h2>
            <p className="text-sm text-[#667067] dark:text-[#B9C3BA] mt-1">
              {language === 'mr'
                ? 'मागील ६ महिन्यांतील सरासरी भाव, आवक प्रमाण आणि हंगामी भावाचा आलेख.'
                : language === 'hi'
                ? 'पिछले 6 महीनों के औसत दाम, आवक की मात्रा और मौसमी बदलावों का संपूर्ण विश्लेषण।'
                : 'Track price volatility, arrival volumes, and seasonal peaks across Maharashtra APMC yards.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => {
                setAlertTargetPrice(analytics?.highPrice || selectedCrop.defaultPricePerQuintal);
                setIsAlertModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#D99A2B] hover:bg-[#C08520] text-[#183A2B] font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#183A2B]" />
              <span>
                {language === 'mr' ? 'भाव अलर्ट सेट करा' : language === 'hi' ? 'मूल्य अलर्ट सेट करें' : 'Set Price Alert'}
              </span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F0EBE0] font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#D99A2B]" />
              <span>
                {language === 'mr' ? 'CSV डाऊनलोड' : language === 'hi' ? 'CSV डाउनलोड' : 'Export CSV'}
              </span>
            </button>

            {onSelectCropForRec && (
              <button
                onClick={() => onSelectCropForRec(selectedCropId)}
                className="px-4 py-2.5 rounded-xl bg-[#183A2B] hover:bg-[#28513A] text-[#FFFDF8] font-bold text-xs flex items-center space-x-2 border border-[#D99A2B]/30 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D99A2B]" />
                <span>
                  {language === 'mr' ? 'या पिकासाठी AI सल्ला' : language === 'hi' ? 'इस फसल के लिए AI सलाह' : 'Get AI Advice'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-6 border-t border-[#DDD9CF] dark:border-[#28513A]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Select Crop */}
          <div>
            <label className="block text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider mb-1">
              {language === 'mr' ? 'पीक निवडा' : language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm font-bold text-[#183A2B] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#183A2B] cursor-pointer"
            >
              {POPULAR_CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {language === 'mr' ? c.nameMr : language === 'hi' ? c.nameHi : c.name} (Base: ₹{c.defaultPricePerQuintal}/q)
                </option>
              ))}
            </select>
          </div>

          {/* Select Mandi */}
          <div>
            <label className="block text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider mb-1">
              {language === 'mr' ? 'बाजार समिती' : language === 'hi' ? 'मंडी चुनें' : 'APMC Mandi'}
            </label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm font-medium text-[#183A2B] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#183A2B] cursor-pointer"
            >
              <option value="all">Maharashtra APMC Average</option>
              {SAMPLE_MANDIS.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.district})</option>
              ))}
            </select>
          </div>

          {/* Compare Crop Option */}
          <div>
            <label className="block text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider mb-1">
              {language === 'mr' ? 'दुसऱ्या पिकाशी तुलना' : language === 'hi' ? 'दूसरी फसल से तुलना' : 'Compare With Crop'}
            </label>
            <select
              value={compareCropId}
              onChange={(e) => setCompareCropId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm font-medium text-[#183A2B] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#183A2B] cursor-pointer"
            >
              <option value="none">-- No Comparison --</option>
              {POPULAR_CROPS.filter(c => c.id !== selectedCropId).map(c => (
                <option key={c.id} value={c.id}>
                  VS {c.icon} {language === 'mr' ? c.nameMr : language === 'hi' ? c.nameHi : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe & Chart Style Toggles */}
          <div>
            <label className="block text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider mb-1">
              {language === 'mr' ? 'कालावधी व आलेख प्रकार' : language === 'hi' ? 'समय अवधि और चार्ट प्रकार' : 'Timeframe & Style'}
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-[#F8F5ED] dark:bg-[#101814] p-1 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] w-full justify-between text-xs font-bold">
                <button
                  onClick={() => setTimeRange('3m')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${timeRange === '3m' ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] shadow-sm' : 'text-[#667067]'}`}
                >
                  3M
                </button>
                <button
                  onClick={() => setTimeRange('6m')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${timeRange === '6m' ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] shadow-sm' : 'text-[#667067]'}`}
                >
                  6M
                </button>
              </div>

              <div className="flex items-center bg-[#F8F5ED] dark:bg-[#101814] p-1 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] text-xs">
                <button
                  onClick={() => setChartType('area')}
                  title="Area Chart"
                  className={`p-1.5 rounded-lg ${chartType === 'area' ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] shadow-sm' : 'text-[#667067]'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('line')}
                  title="Line Chart"
                  className={`p-1.5 rounded-lg ${chartType === 'line' ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] shadow-sm' : 'text-[#667067]'}`}
                >
                  <LineChartIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Toggle Multi-Mandi Comparison Mode */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mandiCompareToggle"
              checked={showMandiComparison}
              onChange={(e) => setShowMandiComparison(e.target.checked)}
              className="w-4 h-4 rounded border-[#DDD9CF] text-[#183A2B] focus:ring-[#183A2B] cursor-pointer"
            />
            <label htmlFor="mandiCompareToggle" className="text-xs font-semibold text-[#202522] dark:text-[#F5F2E9] cursor-pointer flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span>
                {language === 'mr'
                  ? 'प्रमुख ३ बाजार समित्यांचे (Lasalgaon, Pune, Vashi) भाव एकत्र पहा'
                  : language === 'hi'
                  ? 'शीर्ष 3 मंडियों (Lasalgaon, Pune, Vashi) के दाम एक साथ देखें'
                  : 'Overlay Multi-Mandi Price Comparison (Lasalgaon vs Pune vs Vashi)'}
              </span>
            </label>
          </div>
        </div>

      </div>

      {/* Key Metric Snapshot Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider block">
                6-Month Peak Price
              </span>
              <button
                onClick={() => handleSetAlertForPeak(analytics.highPrice)}
                title="Set browser alert when price hits peak"
                className="p-1 rounded-lg bg-[#F8F5ED] dark:bg-[#101814] text-[#D99A2B] hover:bg-[#F0EBE0] transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#183A2B] dark:text-[#D99A2B] font-['Manrope',sans-serif]">
                ₹{analytics.highPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#667067] font-semibold">/q</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#667067] pt-0.5">
              <span>Recorded in {analytics.highMonth}</span>
              <button
                type="button"
                onClick={() => handleSetAlertForPeak(analytics.highPrice)}
                className="font-bold text-[#183A2B] dark:text-[#D99A2B] hover:underline"
              >
                + Alert at Peak
              </button>
            </div>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-1">
            <span className="text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider block">
              6-Month Lowest Price
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#C8663D] font-['Manrope',sans-serif]">
                ₹{analytics.lowPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#667067] font-semibold">/q</span>
            </div>
            <p className="text-[10px] font-medium text-[#667067]">
              Recorded in {analytics.lowMonth}
            </p>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-1">
            <span className="text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider block">
              6-Month Mean Average
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                ₹{analytics.avgPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#667067] font-semibold">/q</span>
            </div>
            <p className="text-[10px] font-medium text-[#667067]">
              Weighted APMC average
            </p>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-2xl p-4 border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow space-y-1">
            <span className="text-[11px] font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider block">
              6-Month Trend Shift
            </span>
            <div className="flex items-center space-x-1.5">
              {analytics.isPositive ? (
                <span className="inline-flex items-center text-[#183A2B] dark:text-[#D99A2B] text-xl font-extrabold font-['Manrope',sans-serif]">
                  <ArrowUpRight className="w-6 h-6 mr-0.5" />
                  +{analytics.percentageChange}%
                </span>
              ) : (
                <span className="inline-flex items-center text-[#C8663D] text-xl font-extrabold font-['Manrope',sans-serif]">
                  <ArrowDownRight className="w-6 h-6 mr-0.5" />
                  {analytics.percentageChange}%
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium text-[#667067]">
              Feb 2026 vs Jul 2026
            </p>
          </div>

        </div>
      )}

      {/* Primary Recharts Visualization Section */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 sm:p-8 space-y-6">
        
        {activeCropAlert && (
          <div className="bg-[#F8F5ED] dark:bg-[#101814] border border-[#D99A2B]/40 dark:border-[#28513A] rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-[#183A2B] dark:text-[#F5F2E9] shadow-sm">
            <div className="flex items-center space-x-2.5">
              <Bell className="w-4 h-4 text-[#D99A2B] flex-shrink-0" />
              <div>
                <span className="font-extrabold font-['Manrope',sans-serif]">Price Alert Active for {selectedCrop.name}:</span> Target threshold set at <span className="underline font-bold">₹{activeCropAlert.targetPrice}/Quintal</span> ({activeCropAlert.mandiName}).
              </div>
            </div>
            <button
              onClick={() => handleSetAlertForPeak(activeCropAlert.targetPrice)}
              className="text-xs font-bold text-[#D99A2B] hover:underline flex-shrink-0 ml-2 cursor-pointer"
            >
              Update Threshold
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD9CF] dark:border-[#28513A]/60 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              {showMandiComparison 
                ? 'APMC Price Trajectory Comparison (₹/Quintal)' 
                : compareCropId !== 'none'
                ? `Price Comparison: ${selectedCrop.name} vs ${compareCrop?.name} (₹/Quintal)`
                : `${selectedCrop.name} Monthly Price Index & Arrival Volumes`}
            </h3>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA]">
              {showMandiComparison
                ? 'Lasalgaon (Nashik) vs Pune Gultekdi vs Vashi Navi Mumbai APMC yards'
                : 'Interactive chart with hover inspect for prices and daily arrival volume.'}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-[#183A2B]" />
              <span className="text-[#202522] dark:text-[#F5F2E9]">
                {selectedCrop.name} Avg Price
              </span>
            </div>

            {compareCropId !== 'none' && compareCrop && (
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#D99A2B]" />
                <span className="text-[#202522] dark:text-[#F5F2E9]">
                  VS {compareCrop.name}
                </span>
              </div>
            )}

            {showMandiComparison && (
              <>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#D99A2B]" />
                  <span className="text-[#202522] dark:text-[#F5F2E9]">Pune APMC</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#C8663D]" />
                  <span className="text-[#202522] dark:text-[#F5F2E9]">Vashi APMC</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart Canvas Container */}
        <div className="w-full h-[360px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' && !showMandiComparison ? (
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvgPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#183A2B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#183A2B" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D99A2B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D99A2B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDD9CF" opacity={0.5} />
                <XAxis dataKey="month" stroke="#667067" fontSize={12} tickLine={false} />
                <YAxis stroke="#667067" fontSize={12} tickLine={false} unit="₹" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#183A2B', 
                    borderRadius: '1rem', 
                    border: '1px solid #28513A',
                    color: '#FFFDF8',
                    fontSize: '12px'
                  }} 
                  formatter={(val: any, name: any) => [`₹${val.toLocaleString('en-IN')}/quintal`, name]}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgPrice" 
                  name={`${selectedCrop.name} Avg Price`}
                  stroke="#183A2B" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAvgPrice)" 
                />
                {compareCropId !== 'none' && compareCrop && (
                  <Area 
                    type="monotone" 
                    dataKey="compareCropPrice" 
                    name={`${compareCrop.name} Avg Price`}
                    stroke="#D99A2B" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorCompare)" 
                  />
                )}
                {activeCropAlert && (
                  <ReferenceLine
                    y={activeCropAlert.targetPrice}
                    stroke="#D99A2B"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Target Threshold: ₹${activeCropAlert.targetPrice}/q`,
                      fill: '#D99A2B',
                      fontSize: 11,
                      fontWeight: 'bold',
                      position: 'insideTopRight'
                    }}
                  />
                )}
              </AreaChart>
            ) : showMandiComparison ? (
              <LineChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDD9CF" opacity={0.5} />
                <XAxis dataKey="month" stroke="#667067" fontSize={12} tickLine={false} />
                <YAxis stroke="#667067" fontSize={12} tickLine={false} unit="₹" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#183A2B', 
                    borderRadius: '1rem', 
                    border: '1px solid #28513A',
                    color: '#FFFDF8',
                    fontSize: '12px'
                  }} 
                  formatter={(val: any) => `₹${val.toLocaleString('en-IN')}/q`}
                />
                <Legend />
                <Line type="monotone" dataKey="lasalgaonPrice" name="Lasalgaon (Nashik)" stroke="#183A2B" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="punePrice" name="Pune APMC" stroke="#D99A2B" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="vashiPrice" name="Vashi (Mumbai)" stroke="#C8663D" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <LineChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDD9CF" opacity={0.5} />
                <XAxis dataKey="month" stroke="#667067" fontSize={12} tickLine={false} />
                <YAxis stroke="#667067" fontSize={12} tickLine={false} unit="₹" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#183A2B', 
                    borderRadius: '1rem', 
                    border: '1px solid #28513A',
                    color: '#FFFDF8',
                    fontSize: '12px'
                  }} 
                  formatter={(val: any) => `₹${val.toLocaleString('en-IN')}/q`}
                />
                <Line type="monotone" dataKey="avgPrice" name="Average Price" stroke="#183A2B" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="minPrice" name="Min Price" stroke="#667067" strokeDasharray="5 5" strokeWidth={2} />
                <Line type="monotone" dataKey="maxPrice" name="Max Price" stroke="#D99A2B" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {/* Arrival Volume Bar Chart & Seasonality Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Arrival Volume Histogram */}
        <div className="lg:col-span-2 bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow p-6 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              Monthly Daily Arrival Volumes (Tonnes)
            </h3>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA]">
              Correlating peak harvest arrivals with mandi supply pressure.
            </p>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDD9CF" opacity={0.5} />
                <XAxis dataKey="month" stroke="#667067" fontSize={12} tickLine={false} />
                <YAxis stroke="#667067" fontSize={12} tickLine={false} unit="T" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#183A2B', 
                    borderRadius: '0.8rem', 
                    color: '#FFFDF8',
                    fontSize: '12px'
                  }} 
                  formatter={(val: any) => [`${val} Tonnes`, 'Daily Arrival']}
                />
                <Bar dataKey="arrivalTonnes" fill="#183A2B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonality AI Insights Box */}
        <div className="bg-[#183A2B] text-[#FFFDF8] rounded-[2rem] p-6 card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden border border-[#28513A]">
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center space-x-2 text-[#D99A2B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Seasonality Intelligence</span>
            </div>

            <h4 className="text-lg font-extrabold font-['Manrope',sans-serif] leading-snug">
              {selectedCrop.icon} {selectedCrop.name} Price Pattern Analysis
            </h4>

            <p className="text-xs text-[#B9C3BA] leading-relaxed font-medium">
              {language === 'mr'
                ? `${cropDisplayName} पिकासाठी मागील ६ महिन्यांच्या ट्रेंडनुसार ${analytics?.highMonth || 'Jun'} मधील आवक कमी राहिल्याने सर्वोच्च भाव नोंदवले गेले.`
                : language === 'hi'
                ? `${cropDisplayName} फसल के लिए 6 महीने के ट्रेंड के अनुसार ${analytics?.highMonth || 'Jun'} में आवक कम होने से उच्चतम दाम मिले।`
                : `Based on 6-month historical data, ${selectedCrop.name} prices peaked in ${analytics?.highMonth || 'Jun'} due to tightened mandi arrivals from harvesting shifts.`}
            </p>

            <div className="pt-2 border-t border-[#28513A] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#B9C3BA]">Best Month to Sell:</span>
                <span className="font-bold text-[#D99A2B]">{analytics?.highMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#B9C3BA]">Peak Volatility Range:</span>
                <span className="font-bold text-white">
                  ₹{analytics?.lowPrice} — ₹{analytics?.highPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#B9C3BA]">Vashi vs Lasalgaon Gap:</span>
                <span className="font-bold text-[#D99A2B]">+12% Mumbai Premium</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectCropForRec && onSelectCropForRec(selectedCropId)}
            className="w-full py-3 rounded-xl bg-[#D99A2B] hover:bg-[#C08520] font-bold text-xs text-[#183A2B] transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer relative z-10"
          >
            <span>Simulate Crop Sale in AI Engine</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Month-by-Month Detailed Data Ledger Table */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow overflow-hidden">
        
        <div className="p-6 border-b border-[#DDD9CF] dark:border-[#28513A]/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              Month-by-Month Price & Arrival Ledger
            </h3>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA]">
              AgmarkNet verified historical ledger entries for {selectedCrop.name}.
            </p>
          </div>
          <span className="text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-3 py-1 rounded-full border border-[#DDD9CF] dark:border-[#28513A]">
            {historyData.length} Months Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8F5ED] dark:bg-[#101814] border-b border-[#DDD9CF] dark:border-[#28513A] text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider">
                <th className="p-4 pl-6">Month & Period</th>
                <th className="p-4">Average Price (₹/Quintal)</th>
                <th className="p-4">Monthly Range (Min - Max)</th>
                <th className="p-4">Daily Arrival Volume</th>
                <th className="p-4 pr-6 text-right">Trend Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CF] dark:divide-[#28513A]/40">
              {historyData.map((row, idx) => {
                const prevRow = idx > 0 ? historyData[idx - 1] : null;
                const priceDiff = prevRow ? row.avgPrice - prevRow.avgPrice : 0;
                const isUp = priceDiff >= 0;

                return (
                  <tr key={row.month} className="hover:bg-[#F8F5ED] dark:hover:bg-[#101814]/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                      {row.month}
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-[#183A2B] dark:text-[#D99A2B] font-['Manrope',sans-serif]">
                        ₹{row.avgPrice.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-[#202522] dark:text-[#F5F2E9]">
                      ₹{row.minPrice} — ₹{row.maxPrice}
                    </td>
                    <td className="p-4 text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9]">
                      {row.arrivalTonnes.toLocaleString('en-IN')} Tonnes / day
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {idx === 0 ? (
                        <span className="text-xs text-[#667067] font-medium">Base Month</span>
                      ) : isUp ? (
                        <span className="inline-flex items-center text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-2.5 py-1 rounded-lg border border-[#DDD9CF] dark:border-[#28513A]">
                          <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#D99A2B]" />
                          +₹{priceDiff}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-[#C8663D] bg-[#F8F5ED] dark:bg-[#101814] px-2.5 py-1 rounded-lg border border-[#DDD9CF] dark:border-[#28513A]">
                          <TrendingDown className="w-3.5 h-3.5 mr-1 text-[#C8663D]" />
                          -₹{Math.abs(priceDiff)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultCropId={selectedCropId}
        defaultMandiName={selectedMandiId !== 'all' ? SAMPLE_MANDIS.find(m => m.id === selectedMandiId)?.name : 'All Mandis in Maharashtra'}
        defaultPrice={alertTargetPrice}
        onAlertCreated={handleCreateAlert}
        language={language}
      />

    </div>
  );
};

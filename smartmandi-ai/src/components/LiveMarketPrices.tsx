import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_MANDIS, POPULAR_CROPS } from '../data/mandisData';
import { Language, MandiMarket } from '../types';
import { formatDateByLanguage } from '../utils/dateUtils';
import { Search, Filter, ArrowUpDown, Clock, Building2, Bell, Trash2, Mail, Phone, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { PriceAlertModal, PriceAlert } from './PriceAlertModal';
import { PriceAlertNotifier } from './PriceAlertNotifier';

interface LiveMarketPricesProps {
  onSelectMandiForCalc: (mandiName: string) => void;
  language: Language;
}

export const LiveMarketPrices: React.FC<LiveMarketPricesProps> = ({
  onSelectMandiForCalc,
  language
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'arrival_desc' | 'rating_desc'>('price_desc');

  // Live API States
  const [mandisList, setMandisList] = useState<MandiMarket[]>(SAMPLE_MANDIS);
  const [isFetching, setIsFetching] = useState(false);
  const [apiFeedLabel, setApiFeedLabel] = useState('AgmarkNet Verified APMC Feed');
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  // Fetch Mandis API
  const fetchMandiData = async () => {
    setIsFetching(true);
    setApiErrorMsg(null);
    try {
      const res = await fetch(`/api/mandis?crop=${selectedCrop}&district=${selectedDistrict}`);
      if (!res.ok) throw new Error('API feed non-ok status');
      const data = await res.json();
      if (data.markets && Array.isArray(data.markets)) {
        setMandisList(data.markets);
        setApiFeedLabel(data.lastUpdated || (data.isLive ? 'AgmarkNet Govt Live API Feed' : 'AgmarkNet APMC Feed (Demo Mode)'));
      }
    } catch (e) {
      console.warn('Live mandi fetch warning, using verified dataset:', e);
      setMandisList(SAMPLE_MANDIS);
      setApiFeedLabel('AgmarkNet APMC Feed (Offline Mode)');
      setApiErrorMsg('Network feed offline. Displaying verified local APMC market data.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMandiData();
  }, [selectedCrop, selectedDistrict]);

  // Alert Modal States
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetMandi, setAlertTargetMandi] = useState<string | undefined>(undefined);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number | undefined>(undefined);
  const [alertTargetCropId, setAlertTargetCropId] = useState<string>('onion');

  // LocalStorage state for saved price alerts
  const [savedAlerts, setSavedAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem('agriplus_price_alerts') || localStorage.getItem('smartmandi_price_alerts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriplus_price_alerts', JSON.stringify(savedAlerts));
    } catch (e) {
      console.error(e);
    }
  }, [savedAlerts]);

  const handleCreateAlert = (newAlert: PriceAlert) => {
    setSavedAlerts(prev => [newAlert, ...prev]);
  };

  const handleDeleteAlert = (alertId: string) => {
    setSavedAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleOpenAlertForMandi = (mandiName: string, price: number) => {
    setAlertTargetMandi(mandiName);
    setAlertTargetPrice(price);
    setIsAlertModalOpen(true);
  };

  const districts = useMemo(() => {
    const list = Array.from(new Set(SAMPLE_MANDIS.map(m => m.district)));
    return ['all', ...list];
  }, []);

  const filteredMandis = useMemo(() => {
    return mandisList.filter(mandi => {
      const matchesSearch = searchQuery === '' || 
        mandi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDistrict = selectedDistrict === 'all' || mandi.district.toLowerCase() === selectedDistrict.toLowerCase();

      return matchesSearch && matchesDistrict;
    }).sort((a, b) => {
      if (sortBy === 'price_desc') return b.pricePerQuintal - a.pricePerQuintal;
      if (sortBy === 'price_asc') return a.pricePerQuintal - b.pricePerQuintal;
      if (sortBy === 'arrival_desc') return b.dailyArrivalTonnes - a.dailyArrivalTonnes;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return 0;
    });
  }, [mandisList, searchQuery, selectedDistrict, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 card-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#D99A2B] text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{apiFeedLabel} • {formatDateByLanguage(new Date(), language, { includeTime: true })}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope','Poppins',sans-serif]">
              {language === 'mr' ? 'थेट कृषी उत्पन्न बाजार समिती (APMC) भाव' : language === 'hi' ? 'लाइव मंडी भाव (AgmarkNet Feed)' : 'Live Mandi Market Prices'}
            </h2>
            <p className="text-sm text-[#667067] dark:text-[#B9C3BA] mt-1">
              {language === 'mr' ? 'महाराष्ट्रातील प्रमुख बाजार समित्यांचे थेट दर, आवक व सुविधा' : language === 'hi' ? 'महाराष्ट्र की प्रमुख मंडियों के लाइव भाव, आवक और सुविधाएं' : 'Live commodity prices, daily arrivals, and facilities across top Maharashtra APMC mandis.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchMandiData}
              disabled={isFetching}
              className="px-3.5 py-2.5 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] hover:bg-[#F0EBE0] text-[#183A2B] dark:text-[#F5F2E9] border border-[#DDD9CF] dark:border-[#28513A] font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#D99A2B] ${isFetching ? 'animate-spin' : ''}`} />
              <span>{isFetching ? 'Refreshing Feed...' : 'Refresh Live Prices'}</span>
            </button>

            <button
              onClick={() => {
                setAlertTargetMandi(undefined);
                setAlertTargetPrice(undefined);
                setIsAlertModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#183A2B] hover:bg-[#28513A] text-[#FFFDF8] font-bold text-xs flex items-center space-x-2 shadow-sm border border-[#D99A2B]/30 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#D99A2B]" />
              <span className="font-['Manrope',sans-serif]">
                {language === 'mr' ? 'भाव अलर्ट मिळवा (Notify Me)' : language === 'hi' ? 'भाव अलर्ट प्राप्त करें (Notify Me)' : 'Set Price Alert (SMS/Email)'}
              </span>
              {savedAlerts.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D99A2B] text-[#183A2B] font-extrabold text-[10px] flex items-center justify-center">
                  {savedAlerts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Network Outage Fallback Banner */}
      {apiErrorMsg && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold block">Network Feed Fallback Active</span>
              <span className="opacity-90">{apiErrorMsg}</span>
            </div>
          </div>
          <button
            onClick={fetchMandiData}
            className="px-3 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 font-bold text-amber-900 dark:text-amber-100 hover:bg-amber-300 transition-colors"
          >
            Retry Feed
          </button>
        </div>
      )}

      {/* Price Alert Notifier & Monitor */}
      <PriceAlertNotifier
        alerts={savedAlerts}
        onToggleAlert={(id) => {
          setSavedAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
        }}
        onDeleteAlert={handleDeleteAlert}
        onSelectMandi={(mandi) => onSelectMandiForCalc(mandi)}
        language={language}
      />

      {/* Saved Active Price Alerts Pills */}
      {savedAlerts.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              <span>My Active Price Alerts ({savedAlerts.length})</span>
            </div>
            <span className="text-[11px] font-normal text-slate-500">Auto-monitored every 30s against AgmarkNet rates</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {savedAlerts.map(alert => (
              <div
                key={alert.id}
                className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
              >
                <span>{alert.cropIcon}</span>
                <span className="font-bold">{alert.cropName}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">≥ ₹{alert.targetPrice}/q</span>
                <span className="text-[10px] text-slate-400">({alert.mandiName})</span>

                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-0.5 rounded text-slate-400 hover:text-rose-600 transition-colors ml-1"
                  title="Remove alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 card-shadow">
        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#667067] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mandi, district..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm focus:outline-none focus:ring-2 focus:ring-[#183A2B] text-[#183A2B] dark:text-[#F5F2E9]"
            />
          </div>

          {/* Commodity Filter */}
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                if (e.target.value !== 'all') setAlertTargetCropId(e.target.value);
              }}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm focus:outline-none focus:ring-2 focus:ring-[#183A2B] text-[#183A2B] dark:text-[#F5F2E9] cursor-pointer font-medium"
            >
              <option value="all">All Crops & Produce</option>
              {POPULAR_CROPS.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.nameMr})</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm focus:outline-none focus:ring-2 focus:ring-[#183A2B] text-[#183A2B] dark:text-[#F5F2E9] cursor-pointer font-medium"
            >
              <option value="all">All Districts in Maharashtra</option>
              {districts.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#183A2B] text-[#183A2B] dark:text-[#F5F2E9] cursor-pointer font-medium"
            >
              <option value="price_desc">Highest Price First</option>
              <option value="price_asc">Lowest Price First</option>
              <option value="arrival_desc">Highest Daily Arrival</option>
              <option value="rating_desc">Highest Rated APMC</option>
            </select>
          </div>

        </div>
      </div>

      {/* Active Price Alerts Panel (If Any Configured) */}
      {savedAlerts.length > 0 && (
        <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#D99A2B]/40 dark:border-[#28513A] card-shadow p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] uppercase tracking-wider">
              <Bell className="w-4 h-4 text-[#D99A2B]" />
              <span>Your Active Mandi Price Alerts ({savedAlerts.length})</span>
            </div>
            <button
              onClick={() => {
                setAlertTargetMandi(undefined);
                setAlertTargetPrice(undefined);
                setIsAlertModalOpen(true);
              }}
              className="text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] hover:underline"
            >
              + Add New Alert
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {savedAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-start justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-[#183A2B] dark:text-[#F5F2E9] flex items-center space-x-1">
                    <span>{alert.cropIcon}</span>
                    <span>{alert.cropName}</span>
                    <span className="text-[#667067] font-normal">in {alert.mandiName}</span>
                  </div>
                  <div className="text-[#183A2B] dark:text-[#D99A2B] font-bold">
                    {alert.condition === 'above' && `Threshold: > ₹${alert.targetPrice}/q`}
                    {alert.condition === 'below' && `Threshold: < ₹${alert.targetPrice}/q`}
                    {alert.condition === 'daily' && `Daily Morning Digest`}
                  </div>
                  <div className="text-[10px] text-[#667067] flex items-center space-x-1">
                    {alert.contactType === 'email' ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3 text-[#D99A2B]" />}
                    <span>{alert.contactValue}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  title="Remove Alert"
                  className="p-1.5 rounded-lg text-[#667067] hover:text-[#C8663D] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table / Grid View */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8F5ED] dark:bg-[#101814] border-b border-[#DDD9CF] dark:border-[#28513A] text-xs font-bold text-[#667067] dark:text-[#B9C3BA] uppercase tracking-wider">
                <th className="p-4 pl-6">Mandi Market & District</th>
                <th className="p-4">Avg Price (₹/Quintal)</th>
                <th className="p-4">Price Range (Min - Max)</th>
                <th className="p-4">Daily Arrival</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Rating & Facilities</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CF] dark:divide-[#28513A]/40">
              {filteredMandis.map((mandi) => (
                <tr key={mandi.id} className="hover:bg-[#F8F5ED] dark:hover:bg-[#101814]/50 transition-colors">
                  
                  {/* Mandi & District */}
                  <td className="p-4 pl-6">
                    <div className="font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                      {mandi.name}
                    </div>
                    <div className="text-xs text-[#667067] dark:text-[#B9C3BA] flex items-center space-x-1 mt-0.5">
                      <span>{mandi.district}, {mandi.state}</span>
                      <span>•</span>
                      <span className="text-[#183A2B] dark:text-[#D99A2B] font-medium">{mandi.buyerCount} Buyers</span>
                    </div>
                  </td>

                  {/* Avg Price */}
                  <td className="p-4">
                    <div className="font-extrabold text-base text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                      ₹{mandi.pricePerQuintal.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-[#667067]">per 100 kg</span>
                  </td>

                  {/* Price Range */}
                  <td className="p-4 text-xs font-medium text-[#202522] dark:text-[#F5F2E9]">
                    ₹{mandi.minPrice} — ₹{mandi.maxPrice}
                  </td>

                  {/* Daily Arrival */}
                  <td className="p-4 text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9]">
                    {mandi.dailyArrivalTonnes.toLocaleString('en-IN')} Tonnes
                  </td>

                  {/* Commission */}
                  <td className="p-4 text-xs font-semibold text-[#667067] dark:text-[#B9C3BA]">
                    {mandi.commissionPercent}%
                  </td>

                  {/* Facilities */}
                  <td className="p-4">
                    <div className="flex items-center space-x-1 text-xs font-bold text-[#D99A2B]">
                      <span>★ {mandi.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mandi.facilities.slice(0, 2).map((fac, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#F5F2E9] border border-[#DDD9CF] dark:border-[#28513A]">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenAlertForMandi(mandi.name, mandi.pricePerQuintal)}
                      title="Set SMS/Email alert for this Mandi"
                      className="p-2 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F0EBE0] transition-all inline-flex items-center justify-center"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#D99A2B]" />
                    </button>

                    <button
                      onClick={() => onSelectMandiForCalc(mandi.name)}
                      className="px-3.5 py-2 rounded-xl bg-[#183A2B] hover:bg-[#28513A] text-[#FFFDF8] text-xs font-semibold transition-all border border-[#D99A2B]/30"
                    >
                      Calculate Profit
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultCropId={selectedCrop !== 'all' ? selectedCrop : alertTargetCropId}
        defaultMandiName={alertTargetMandi || 'All Mandis in Maharashtra'}
        defaultPrice={alertTargetPrice || 3000}
        onAlertCreated={handleCreateAlert}
        language={language}
      />

    </div>
  );
};


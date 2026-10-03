import React, { useState } from 'react';
import { Bell, X, CheckCircle2, Sparkles, Phone, Mail, Shield, AlertTriangle, Send, Smartphone } from 'lucide-react';
import { POPULAR_CROPS, SAMPLE_MANDIS } from '../data/mandisData';
import { Language } from '../types';
import { requestBrowserNotificationPermission, sendBrowserNotification, isBrowserNotificationGranted } from '../utils/notificationUtils';

export interface PriceAlert {
  id: string;
  cropId: string;
  cropName: string;
  cropIcon: string;
  mandiName: string;
  condition: 'above' | 'below' | 'daily';
  targetPrice: number;
  contactType: 'phone' | 'email' | 'both';
  contactValue: string;
  createdAt: string;
  active: boolean;
}

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCropId?: string;
  defaultMandiName?: string;
  defaultPrice?: number;
  onAlertCreated: (alert: PriceAlert) => void;
  language: Language;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  defaultCropId = 'onion',
  defaultMandiName = 'All Mandis in Maharashtra',
  defaultPrice = 3000,
  onAlertCreated,
  language
}) => {
  const [cropId, setCropId] = useState(defaultCropId);
  const [mandiName, setMandiName] = useState(defaultMandiName);
  const [condition, setCondition] = useState<'above' | 'below' | 'daily'>('above');
  const [targetPrice, setTargetPrice] = useState<number>(defaultPrice || 3000);
  const [contactType, setContactType] = useState<'phone' | 'email' | 'both'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const selectedCropObj = POPULAR_CROPS.find(c => c.id === cropId) || POPULAR_CROPS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    // Prompt for browser notification permission
    await requestBrowserNotificationPermission();

    const newAlert: PriceAlert = {
      id: 'alert-' + Date.now(),
      cropId,
      cropName: selectedCropObj.name,
      cropIcon: selectedCropObj.icon,
      mandiName,
      condition,
      targetPrice,
      contactType,
      contactValue,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      active: true
    };

    onAlertCreated(newAlert);
    setIsSuccess(true);

    // If target price is already exceeded or equal, trigger instant notification
    if (condition === 'above' && selectedCropObj.defaultPricePerQuintal >= targetPrice) {
      sendBrowserNotification(`🚨 Price Alert Exceeded: ${selectedCropObj.name}`, {
        body: `Market price in ${mandiName} is ₹${selectedCropObj.defaultPricePerQuintal}/q, exceeding target ₹${targetPrice}/q!`
      });
    }
  };

  const handleSendTestNotification = async () => {
    setTestNotificationSent(true);
    await requestBrowserNotificationPermission();

    sendBrowserNotification(`🚨 AgriPlus Test Alert: ${selectedCropObj.name}`, {
      body: `Test notification for ${selectedCropObj.name}. Target threshold of ₹${targetPrice}/q monitored.`
    });

    setTimeout(() => {
      setTestNotificationSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 card-shadow p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center space-x-2 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
                <Bell className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                <span>Price Alert Automation</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Poppins'] mt-1">
                {language === 'mr' ? 'थेट बाजार भाव अलर्ट सेट करा' : language === 'hi' ? 'लाइव मंडी भाव अलर्ट सेट करें' : 'Set Crop Price Threshold Alert'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'mr'
                  ? 'पिकाचे भाव तुमच्या अपेक्षेनुसार वाढल्यावर किंवा कमी झाल्यावर तात्काळ SMS/WhatsApp अलर्ट मिळवा.'
                  : language === 'hi'
                  ? 'फसल के दाम आपकी इच्छानुसार बढ़ने या घटने पर तुरंत अलर्ट प्राप्त करें।'
                  : 'Receive automated SMS, WhatsApp or Email notifications when AgmarkNet prices hit your target threshold.'}
              </p>
            </div>

            {/* Step 1: Crop & Mandi Selection */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Commodity & Target Mandi Market
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Select Produce
                  </label>
                  <select
                    value={cropId}
                    onChange={(e) => {
                      setCropId(e.target.value);
                      const crop = POPULAR_CROPS.find(c => c.id === e.target.value);
                      if (crop) setTargetPrice(crop.defaultPricePerQuintal);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {POPULAR_CROPS.map(crop => (
                      <option key={crop.id} value={crop.id}>
                        {crop.icon} {crop.name} ({crop.nameMr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    APMC Mandi
                  </label>
                  <select
                    value={mandiName}
                    onChange={(e) => setMandiName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="All Mandis in Maharashtra">All Mandis in Maharashtra</option>
                    {SAMPLE_MANDIS.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Trigger Condition & Target Price */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Price Condition & Threshold Rate
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center text-center ${
                    condition === 'above'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-[#16A34A] dark:text-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>📈 Price Rises Above</span>
                  <span className="text-[10px] font-normal opacity-75">Alert on high rate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center text-center ${
                    condition === 'below'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>📉 Price Drops Below</span>
                  <span className="text-[10px] font-normal opacity-75">Alert on dip</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCondition('daily')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center text-center ${
                    condition === 'daily'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#2563EB] dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>☀️ Daily Morning Summary</span>
                  <span className="text-[10px] font-normal opacity-75">8:00 AM daily digest</span>
                </button>
              </div>

              {condition !== 'daily' && (
                <div className="relative pt-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Target Rate (₹ / Quintal)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      required
                      className="w-full pl-8 pr-24 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-extrabold text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      / 100 kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>Current avg rate: ₹{selectedCropObj.defaultPricePerQuintal}/q</span>
                    <span>Quick: 
                      <button type="button" onClick={() => setTargetPrice(selectedCropObj.defaultPricePerQuintal + 300)} className="underline ml-1 font-bold text-[#2563EB]">
                        +₹300
                      </button>
                      <button type="button" onClick={() => setTargetPrice(selectedCropObj.defaultPricePerQuintal + 500)} className="underline ml-1 font-bold text-[#2563EB]">
                        +₹500
                      </button>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Delivery Channel & Phone / Email input */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                3. Send Alerts To
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setContactType('phone')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                    contactType === 'phone'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#2563EB] dark:text-blue-400'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile SMS / WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContactType('email')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                    contactType === 'email'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#2563EB] dark:text-blue-400'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Digest</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={contactType === 'email' ? 'email' : 'tel'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  required
                  placeholder={
                    contactType === 'email'
                      ? 'Enter email address (e.g. farmer@gmail.com)'
                      : 'Enter 10-digit mobile number (e.g. 98230XXXXX)'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>100% Free Service • No spam • Powered by AgmarkNet SMS Gateway</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 mt-4"
            >
              <Bell className="w-4 h-4" />
              <span>Activate Price Alert</span>
            </button>

          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#16A34A] dark:text-emerald-400 uppercase tracking-wider block">
                Alert Active
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Poppins'] mt-1">
                Price Alert Successfully Created!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                We will send an automated notification to <span className="font-bold text-slate-800 dark:text-slate-200">{contactValue}</span> as soon as <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCropObj.name}</span> in <span className="font-bold text-slate-800 dark:text-slate-200">{mandiName}</span> hits <span className="font-bold text-[#16A34A] dark:text-emerald-400">₹{targetPrice}/quintal</span>.
              </p>
            </div>

            {/* Test Trigger Button for User Verification */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Verification & Test Simulation</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Active</span>
              </div>
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Instant Test Alert to {contactType === 'email' ? 'Email' : 'Mobile'}</span>
              </button>

              {testNotificationSent && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 text-xs text-[#16A34A] font-semibold animate-in fade-in duration-200">
                  ⚡ Test notification dispatched to {contactValue}! Check simulated popup notification.
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Done & Return to Live Mandi Prices
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

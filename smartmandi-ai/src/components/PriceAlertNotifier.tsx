import React, { useState, useEffect } from 'react';
import { PriceAlert } from './PriceAlertModal';
import { 
  checkPriceAlerts, 
  requestBrowserNotificationPermission, 
  sendBrowserNotification, 
  isBrowserNotificationGranted 
} from '../utils/notificationUtils';
import { Language } from '../types';
import { Bell, BellRing, Sparkles, X, ChevronRight, TrendingUp, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PriceAlertNotifierProps {
  alerts: PriceAlert[];
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  onSelectMandi?: (mandiName: string) => void;
  language: Language;
}

export const PriceAlertNotifier: React.FC<PriceAlertNotifierProps> = ({
  alerts,
  onToggleAlert,
  onDeleteAlert,
  onSelectMandi,
  language
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [triggeredAlerts, setTriggeredAlerts] = useState<ReturnType<typeof checkPriceAlerts>>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Monitor price alerts whenever alerts list changes or periodically
  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setTriggeredAlerts([]);
      return;
    }

    const check = () => {
      const results = checkPriceAlerts(alerts);
      setTriggeredAlerts(results);

      // Trigger native browser notification for newly matched alerts
      results.forEach(item => {
        sendBrowserNotification(`🚨 Price Alert: ${item.alert.cropName} Exceeded Target!`, {
          body: `Current price in ${item.mandiName} is ₹${item.currentPrice}/q (Target was ₹${item.alert.targetPrice}/q). Click to view details.`,
          tag: item.alert.id
        });
      });
    };

    check();
    const interval = setInterval(check, 30000); // Re-check every 30 seconds
    return () => clearInterval(interval);
  }, [alerts]);

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      sendBrowserNotification('🔔 AgriPlus Notifications Active', {
        body: 'You will receive instant alerts when market prices hit your target price points.'
      });
    }
  };

  if (dismissed && triggeredAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Browser Notification Permission Banner if not granted */}
      {permission !== 'granted' && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 flex-shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base font-['Poppins']">
                {language === 'mr' ? 'ब्राउझर नोटिफिकेशन्स सुरू करा' : language === 'hi' ? 'ब्राउज़र नोटिफिकेशन चालू करें' : 'Enable Instant Browser Price Alerts'}
              </h4>
              <p className="text-xs text-blue-100 opacity-90">
                {language === 'mr'
                  ? 'जेव्हा तुमच्या पिकाचा बाजारभाव टार्गेट किमतीपेक्षा जास्त होईल तेव्हा लगेच अलर्ट मिळवा.'
                  : language === 'hi'
                  ? 'जब आपकी फसल का मंडी भाव लक्ष्य से अधिक हो, तब तुरंत स्क्रीन अलर्ट पाएं।'
                  : 'Get real-time browser notifications when market prices exceed your target threshold.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestPermission}
            className="px-4 py-2 rounded-xl bg-white text-[#2563EB] hover:bg-blue-50 font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{language === 'mr' ? 'नोटिफिकेशनला परवानगी द्या' : language === 'hi' ? 'अनुमति दें' : 'Allow Browser Alerts'}</span>
          </button>
        </div>
      )}

      {/* Active Triggered Price Alerts Banner */}
      {triggeredAlerts.length > 0 && !dismissed && (
        <div className="bg-emerald-500 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-emerald-400 space-y-3 relative overflow-hidden animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 text-xl">
                🚨
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  Target Price Exceeded Alert
                </span>
                <h4 className="text-base sm:text-lg font-extrabold font-['Poppins'] mt-1">
                  {triggeredAlerts[0].alert.cropIcon} {triggeredAlerts[0].alert.cropName} Price Hit ₹{triggeredAlerts[0].currentPrice}/Quintal!
                </h4>
              </div>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-black/10 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-emerald-50">
                Target set at <strong>₹{triggeredAlerts[0].alert.targetPrice}/q</strong> • Current Market Rate in <strong>{triggeredAlerts[0].mandiName}</strong> is <strong>₹{triggeredAlerts[0].currentPrice}/q</strong> (+₹{triggeredAlerts[0].currentPrice - triggeredAlerts[0].alert.targetPrice} above target).
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                Sent to: {triggeredAlerts[0].alert.contactValue} ({triggeredAlerts[0].alert.contactType}) • {triggeredAlerts[0].triggeredAt}
              </p>
            </div>

            {onSelectMandi && (
              <button
                onClick={() => onSelectMandi(triggeredAlerts[0].mandiName)}
                className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-900 font-bold text-xs flex items-center space-x-1 shadow-sm hover:bg-emerald-50 transition-colors flex-shrink-0"
              >
                <span>View Mandi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

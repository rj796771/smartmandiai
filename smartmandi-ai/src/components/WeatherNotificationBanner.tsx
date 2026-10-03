import React, { useState, useEffect } from 'react';
import { RecommendationResult, Language } from '../types';
import { 
  CloudRain, 
  Sun, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Thermometer, 
  Droplets, 
  Wind, 
  X, 
  ChevronRight, 
  MapPin, 
  RefreshCw,
  Truck,
  Sparkles
} from 'lucide-react';

interface WeatherNotificationBannerProps {
  recommendationResult?: RecommendationResult | null;
  farmerDistrict?: string;
  language: Language;
  onExploreRecommendation?: () => void;
}

// Preset regional weather profiles for Maharashtra districts
const REGIONAL_WEATHER_PROFILES: Record<string, {
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
  summary: string;
  summaryMr: string;
  summaryHi: string;
  temp: number;
  rainProb: number;
  humidity: number;
  advice: string;
  adviceMr: string;
  adviceHi: string;
}> = {
  'Nashik': {
    status: 'WARNING',
    summary: 'Isolated monsoon showers expected on Nashik-Mumbai transit routes within 24 hrs.',
    summaryMr: 'नाशिक-मुंबई महामार्गावर पुढील २४ तासांत अधूनमधून पाऊस पडण्याची शक्यता.',
    summaryHi: 'नासिक-मुंबई मार्ग पर अगले 24 घंटों में हल्की से मध्यम बारिश की संभावना।',
    temp: 27,
    rainProb: 65,
    humidity: 78,
    advice: 'Ensure produce is covered with double tarpaulin. Uncovered onions/tomatoes risk 5-8% moisture deduction at Vashi APMC.',
    adviceMr: 'कांदा आणि टोमॅटो ट्रॅक्टरवर प्लास्टिक ताडपत्रीने व्यवस्थित झाकूनच प्रवासाला निघा.',
    adviceHi: 'अपनी फसल को तिरपाल से अच्छी तरह ढकें ताकि नमी से नुकसान न हो।'
  },
  'Pune': {
    status: 'OPTIMAL',
    summary: 'Favorable transport weather across Pune, Satara & Solapur APMC corridors.',
    summaryMr: 'पुणे, सातारा आणि सोलापूर मार्गावर वाहतुकीसाठी हवामान उत्तम.',
    summaryHi: 'पुणे और आसपास की मंडियों के लिए मौसम बिल्कुल अनुकूल है।',
    temp: 29,
    rainProb: 15,
    humidity: 58,
    advice: 'Ideal harvest window. Road conditions clear for same-day delivery.',
    adviceMr: 'काढणी व वाहतुकीसाठी सर्वोत्तम वेळ. आजच मालाची रवानगी करा.',
    adviceHi: 'फसल की तुड़ाई और बाज़ार ले जाने का सबसे सही समय।'
  },
  'Ahmednagar': {
    status: 'ALERT',
    summary: 'Heavy rainfall alert & waterlogging risk on Ahmednagar-Pune state highway.',
    summaryMr: 'अहमदनगर-पुणे राज्य महामार्गावर मुसळधार पाऊस व पाणी साचण्याचा इशारा.',
    summaryHi: 'अहमदनगर मार्ग पर भारी बारिश और जलभराव का अलर्ट।',
    temp: 25,
    rainProb: 88,
    humidity: 92,
    advice: 'Delay night transport. Dispatches after 6:00 AM recommended with heavy vehicle freight.',
    adviceMr: 'रात्रीची वाहतूक टाळा. सकाळी ६ नंतरच माल वाहतूक सुरू करा.',
    adviceHi: 'रात के समय परिवहन से बचें, सुबह बारिश कम होने पर ही माल भेजें।'
  },
  'Solapur': {
    status: 'OPTIMAL',
    summary: 'Dry & warm weather. Excellent for pomegranate & onion drying/transport.',
    summaryMr: 'कोरडे व उष्ण हवामान. डाळिंब आणि कांदा वाळवण्यासाठी अनुकूल.',
    summaryHi: 'सूखा और गर्म मौसम। अनार और प्याज परिवहन के लिए उत्तम।',
    temp: 34,
    rainProb: 5,
    humidity: 42,
    advice: 'Ensure adequate ventilation in truck beds to prevent overheating.',
    adviceMr: 'उष्णतेमुळे फळे खराब होऊ नयेत म्हणून ट्रकमध्ये पुरेशी हवा खेळती ठेवा.',
    adviceHi: 'गर्म हवा से सुरक्षा के लिए ट्रक में सही वेंटिलेशन रखें।'
  },
  'Nagpur': {
    status: 'WARNING',
    summary: 'High humidity & thunderstorm warning in Vidarbha region APMC zones.',
    summaryMr: 'विदर्भ भागातील एपीएमसी मंडई परिसरात वादळी वाऱ्यासह पाऊस.',
    summaryHi: 'नागपुर और आसपास गरज के साथ बौछारें पड़ने की चेतावनी।',
    temp: 31,
    rainProb: 55,
    humidity: 82,
    advice: 'Store cotton and soybean in dry covered sheds before loading.',
    adviceMr: 'कापूस आणि सोयाबीन ओले होऊ नये म्हणून कोरड्या गोदामात झाकून ठेवा.',
    adviceHi: 'कपास और सोयाबीन को लोड करने से पहले सूखे शेड में रखें।'
  },
  'Jalgaon': {
    status: 'OPTIMAL',
    summary: 'Clear skies across Khandesh banana & pulse trading hubs.',
    summaryMr: 'खानदेश पट्ट्यात केळी व कडधान्य खरेदीसाठी हवामान स्वच्छ.',
    summaryHi: 'खानदेश क्षेत्र में मौसम साफ़ और परिवहन योग्य है।',
    temp: 32,
    rainProb: 10,
    humidity: 50,
    advice: 'Good market transit window for Jalgaon & Mumbai dispatches.',
    adviceMr: 'जळगाव व मुंबईकडे माल पाठवण्यासाठी हवामान अतिशय उत्तम.',
    adviceHi: 'माल भेजने के लिए रास्ते और मौसम पूरी तरह साफ़ हैं।'
  }
};

export const WeatherNotificationBanner: React.FC<WeatherNotificationBannerProps> = ({
  recommendationResult,
  farmerDistrict = 'Nashik',
  language,
  onExploreRecommendation
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(farmerDistrict || 'Nashik');
  const [liveWeather, setLiveWeather] = useState<{
    status: 'OPTIMAL' | 'WARNING' | 'ALERT' | 'MODERATE_RISK' | 'HIGH_RISK';
    summary: string;
    temperatureC: number;
    rainProbability: number;
    humidityPercent: number;
    isLive?: boolean;
    sourceLabel?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/weather?location=${encodeURIComponent(selectedDistrict)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setLiveWeather({
              status: data.agriculturalAlert?.status === 'MODERATE_RISK' ? 'WARNING' : 
                      data.agriculturalAlert?.status === 'HIGH_RISK' ? 'ALERT' : 
                      (data.rainfallProbability > 50 ? 'WARNING' : 'OPTIMAL'),
              summary: data.agriculturalAlert?.alertMessage || `${data.condition} in ${selectedDistrict}. Humidity ${data.humidityPercent}%.`,
              temperatureC: data.temperatureC,
              rainProbability: data.rainfallProbability,
              humidityPercent: data.humidityPercent,
              isLive: data.isLive,
              sourceLabel: data.sourceLabel
            });
          }
        }
      } catch (err) {
        console.warn('Weather API load error, using regional profile fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadWeather();
    return () => { isMounted = false; };
  }, [selectedDistrict]);

  // Derive weather risk profile
  const defaultProfile = REGIONAL_WEATHER_PROFILES[selectedDistrict] || REGIONAL_WEATHER_PROFILES['Nashik'];

  const weatherAlert = liveWeather || recommendationResult?.weatherRiskAlert || {
    status: defaultProfile.status,
    summary: defaultProfile.summary,
    temperatureC: defaultProfile.temp,
    rainProbability: defaultProfile.rainProb,
    humidityPercent: defaultProfile.humidity,
    sourceLabel: 'Demo Weather Data'
  };

  const currentSummary = language === 'mr'
    ? (defaultProfile.summaryMr || weatherAlert.summary)
    : language === 'hi'
    ? (defaultProfile.summaryHi || weatherAlert.summary)
    : weatherAlert.summary;

  const currentAdvice = language === 'mr'
    ? defaultProfile.adviceMr
    : language === 'hi'
    ? defaultProfile.adviceHi
    : defaultProfile.advice;

  if (dismissed) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setDismissed(false)}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-sm"
        >
          <CloudRain className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
          <span>
            {language === 'mr' 
              ? `हवामान इशारा: ${selectedDistrict}` 
              : language === 'hi' 
              ? `मौसम अलर्ट: ${selectedDistrict}` 
              : `Weather Alert: ${selectedDistrict}`}
          </span>
        </button>
      </div>
    );
  }

  const getStatusStyles = () => {
    switch (weatherAlert.status) {
      case 'ALERT':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800/80',
          icon: <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 animate-pulse" />,
          titleColor: 'text-rose-900 dark:text-rose-200',
          textColor: 'text-rose-800 dark:text-rose-300',
          badgeBg: 'bg-rose-600 text-white',
          label: language === 'mr' ? 'हाय अलर्ट: मुसळधार पाऊस' : language === 'hi' ? 'हाई अलर्ट: भारी बारिश' : 'HIGH RISK WEATHER ALERT'
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800/80',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
          titleColor: 'text-amber-900 dark:text-amber-200',
          textColor: 'text-amber-800 dark:text-amber-300',
          badgeBg: 'bg-amber-600 text-white',
          label: language === 'mr' ? 'हवामान इशारा: पाऊस व ओलावा' : language === 'hi' ? 'मौसम चेतावनी: बारिश का जोखिम' : 'REGIONAL TRANSIT WEATHER WARNING'
        };
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800/80',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
          titleColor: 'text-emerald-900 dark:text-emerald-200',
          textColor: 'text-emerald-800 dark:text-emerald-300',
          badgeBg: 'bg-emerald-600 text-white',
          label: language === 'mr' ? 'हवामान अनुकूल' : language === 'hi' ? 'मौसम साफ़' : 'OPTIMAL TRANSPORT WEATHER'
        };
    }
  };

  const style = getStatusStyles();

  return (
    <div className={`rounded-2xl border ${style.bg} p-4 sm:p-5 card-shadow transition-all relative overflow-hidden space-y-3`}>
      
      {/* Top Banner Row */}
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex items-start space-x-3">
          {style.icon}
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${style.badgeBg}`}>
                {style.label}
              </span>

              {/* District Switcher Dropdown */}
              <div className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <MapPin className="w-3 h-3 text-[#2563EB]" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-transparent font-bold cursor-pointer focus:outline-none"
                >
                  {Object.keys(REGIONAL_WEATHER_PROFILES).map(dist => (
                    <option key={dist} value={dist}>{dist} Region</option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className={`text-sm sm:text-base font-extrabold mt-1.5 font-['Poppins'] ${style.titleColor}`}>
              {currentSummary}
            </h4>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss alert"
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics & Farmer Actionable Tip Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-black/5 dark:border-white/10 text-xs">
        
        {/* Weather Parameters */}
        <div className="flex items-center justify-between sm:justify-start sm:space-x-4 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-1.5">
            <Thermometer className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{weatherAlert.temperatureC}°C</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{weatherAlert.rainProbability}% Rain</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Droplets className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{weatherAlert.humidityPercent}% RH</span>
          </div>
        </div>

        {/* Advisory Tip */}
        <div className="sm:col-span-2 flex items-center justify-between bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-black/5 dark:border-white/5 space-x-2">
          <div className="flex items-start space-x-2">
            <Truck className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
              <strong className="text-slate-900 dark:text-white">Action Advice: </strong>
              {currentAdvice}
            </p>
          </div>

          {onExploreRecommendation && (
            <button
              onClick={onExploreRecommendation}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[11px] whitespace-nowrap flex items-center space-x-1 flex-shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <span>Get Mandi Advice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Sprout, TrendingUp, ShieldCheck, Calculator, Mic, CheckCircle2, Compass, BarChart3 } from 'lucide-react';
import { Language } from '../types';

interface QuickTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  language: Language;
}

export const QuickTourModal: React.FC<QuickTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  language
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      id: 'welcome',
      tab: 'landing',
      icon: <Sprout className="w-8 h-8 text-[#2563EB] dark:text-blue-400" />,
      badge: language === 'mr' ? 'स्वागत आहे' : language === 'hi' ? 'स्वागत है' : 'Welcome Overview',
      title: language === 'mr' ? 'AgriPlus AI मध्ये आपले स्वागत आहे' : language === 'hi' ? 'AgriPlus AI में आपका स्वागत है' : 'Welcome to AgriPlus AI',
      subtitle: language === 'mr' ? 'शेतकऱ्यांसाठी सर्वाधिक नफा मिळवून देणारा डिजिटल साथी' : language === 'hi' ? 'किसान भाइयों के लिए अधिकतम मुनाफे का AI मंच' : 'Maximizing net profit for farmers & agri-entrepreneurs in Maharashtra.',
      description: language === 'mr'
        ? 'AgriPlus AI फक्त बाजार भाव दाखवत नाही, तर वाहतूक खर्च, मध्यस्थांचे कमिशन आणि हवामानाचा अंदाज यांचा विचार करून तुमच्या खिशात सर्वात जास्त निव्वळ पैसे देणारी मंडी शोधून देते.'
        : language === 'hi'
        ? 'AgriPlus AI केवल भाव नहीं दिखाता, बल्कि परिवहन लागत, मंडी कमीशन और मौसम का विश्लेषण करके आपको सबसे ज्यादा शुद्ध मुनाफा देने वाली मंडी बताता है।'
        : 'AgriPlus AI looks beyond raw market prices by factoring in distance matrix logistics, truck transport charges, APMC commissions, and seasonal price forecasts to show where you keep maximum cash in hand.',
      features: [
        language === 'mr' ? '१०+ प्रमुख बाजार समित्यांचे थेट दर' : language === 'hi' ? '10+ प्रमुख मंडियों के लाइव रेट्स' : 'Evaluates 10+ nearby APMC mandis',
        language === 'mr' ? 'वाहतूक खर्च व कमिशन वजा करून निव्वळ नफा' : language === 'hi' ? 'भाड़ा और कमीशन घटाकर शुद्ध बचत' : 'Net profit calculation after freight & fees',
        language === 'mr' ? 'मराठी व हिंदी आवाज सहाय्यक (Voice AI)' : language === 'hi' ? 'मराठी और हिंदी में वॉइस असिस्टेंट' : 'Multilingual Voice AI support (Marathi/Hindi/English)'
      ]
    },
    {
      id: 'ai_engine',
      tab: 'recommendation',
      icon: <Sparkles className="w-8 h-8 text-[#2563EB] dark:text-blue-400" />,
      badge: language === 'mr' ? 'मुख्य AI इंजिन' : language === 'hi' ? 'मुख्य AI इंजन' : 'Core AI Engine',
      title: language === 'mr' ? '१. AI मंडी शिफारस इंजिन' : language === 'hi' ? '1. AI मंडी सलाह इंजन' : '1. Primary AI Recommendation Engine',
      subtitle: language === 'mr' ? 'कुठे आणि केव्हा विकायचे? तात्काळ अचूक निर्णय' : language === 'hi' ? 'कहाँ और कब बेचें? तुरंत सटीक फैसला' : 'Answers "Where to sell?" and "Sell today or wait 3 days?".',
      description: language === 'mr'
        ? 'तुमचे पीक (कांदा, टोमॅटो, सोयाबीन इ.), वजन (क्विंटल) आणि तालुका निवडा. आमचे AI ५ सेकंदात सर्वात जास्त नफा देणारी मंडी, वाहतूक खर्च आणि १-९९ सेलिंग स्कोर जनरेट करते.'
        : language === 'hi'
        ? 'अपनी फसल (प्याज़, टमाटर, सोयाबीन आदि), वजन (क्विंटल) और लोकेशन चुनें। हमारा AI 5 सेकंड में सबसे ज्यादा मुनाफे वाली मंडी और सेलिंग स्कोर निकालता है।'
        : 'Select your crop, quantity in quintals, location, and vehicle. The AI analyzes AgmarkNet feeds to pinpoint the winning APMC market yard, breaks down gross revenue vs transport expense, and provides a 2-5 day price trend forecast.',
      features: [
        language === 'mr' ? 'आजच विकावे की २ दिवस थांबावे? शिफारस' : language === 'hi' ? 'आज बेचें या 2 दिन रुकें? सटीक सलाह' : 'Sell Today vs Wait 2-5 Days recommendation',
        language === 'mr' ? 'वाहतूक भाडे आणि कमिशनचे सविस्तर विवरण' : language === 'hi' ? 'परिवहन भाड़ा और कमीशन का पूरा ब्यौरा' : 'Transparent financial breakdown & net profit',
        language === 'mr' ? 'बुकमार्क करा आणि "My History" मध्ये पुन्हा पहा' : language === 'hi' ? 'सहेजें और "My History" में फिर देखें' : 'Bookmark searches & revisit anytime in "My History"',
        language === 'mr' ? 'PDF रिपोर्ट डाउनलोड करा किंवा शेअर करा' : language === 'hi' ? 'PDF रिपोर्ट डाउनलोड करें या शेयर करें' : 'One-click printable PDF report export'
      ]
    },
    {
      id: 'market_prices',
      tab: 'prices',
      icon: <TrendingUp className="w-8 h-8 text-[#2563EB] dark:text-blue-400" />,
      badge: language === 'mr' ? 'थेट बाजार भाव' : language === 'hi' ? 'लाइव मंडी भाव' : 'Live AgmarkNet Feeds',
      title: language === 'mr' ? '२. थेट बाजार भाव व SMS/Email अलर्ट' : language === 'hi' ? '2. लाइव मंडी भाव और SMS/Email अलर्ट' : '2. Live APMC Market Rates & "Notify Me" Alerts',
      subtitle: language === 'mr' ? 'महाराष्ट्रातील सर्व बाजार समित्यांचे अपडेटेड भाव' : language === 'hi' ? 'महाराष्ट्र की सभी मंडियों के ताज़ा रेट्स' : 'Real-time daily arrival ledgers & custom price threshold triggers.',
      description: language === 'mr'
        ? 'महाराष्ट्रातील नाशिक, सोलापूर, पुणे, जळगाव इ. बाजार समित्यांमधील दैनिक आवक आणि भाव पहा. भाव तुमच्या आवडीच्या दरावर पोहोचल्यावर तात्काळ SMS किंवा ईमेल अलर्ट मिळवा.'
        : language === 'hi'
        ? 'नाशिक, सोलापुर, पुणे, जलगांव की मंडियों के दैनिक भाव देखें। भाव आपके इच्छित स्तर पर पहुँचने पर SMS या ईमेल अलर्ट पाएं।'
        : 'Search and filter live commodity prices across Maharashtra APMC yards. Click "Notify Me" to set automated SMS or Email alerts whenever your preferred crop rate surges above a set target.',
      features: [
        language === 'mr' ? 'AgmarkNet द्वारे दर ५ मिनिटांनी अपडेटेड भाव' : language === 'hi' ? 'हर 5 मिनट में ताज़ा AgmarkNet रेट्स' : 'AgmarkNet official daily arrivals ledger',
        language === 'mr' ? 'तात्काळ SMS / Email भाव अलर्ट' : language === 'hi' ? 'तुरंत SMS / Email भाव अलर्ट' : 'Custom price threshold notifications (SMS/Email)',
        language === 'mr' ? 'जिल्हा व पिकांनुसार सुलभ फिल्टर' : language === 'hi' ? 'जिले और फसल के अनुसार आसान फिल्टर' : 'Search by mandi name, district, or crop'
      ]
    },
    {
      id: 'market_history',
      tab: 'history',
      icon: <BarChart3 className="w-8 h-8 text-[#2563EB] dark:text-blue-400" />,
      badge: language === 'mr' ? 'मागील ६ महिन्यांचा इतिहास' : language === 'hi' ? 'पिछले 6 महीनों का इतिहास' : '6-Month Price Analytics',
      title: language === 'mr' ? '३. बाजार इतिहास व ६ महिन्यांचे चार्ट' : language === 'hi' ? '3. बाज़ार इतिहास और 6 महीने के चार्ट' : '3. 6-Month Market History & Crop Price Charts',
      subtitle: language === 'mr' ? 'हंगामी भावाचा अंदाज व पिकांमधील परस्पर तुलना' : language === 'hi' ? 'मौसमी रुझान और फसलों में परस्पर तुलना' : 'Interactive price trend curves & multi-mandi overlays.',
      description: language === 'mr'
        ? 'पसंतीच्या पिकाचा ६ महिन्यांचा भाव आलेख, आवक प्रमाण आणि Lasalgaon, Pune व Vashi या प्रमुख बाजार समित्यांमधील दरांची थेट तुलना पहा.'
        : language === 'hi'
        ? 'अपनी पसंदीदा फसल का 6 महीने का मूल्य ग्राफ, आवक मात्रा और लासलगांव, पुणे व वाशी मंडियों के दामों की तुलना देखें।'
        : 'Analyze 6-month historical price trajectories, arrival volume histograms, and compare prices across top APMC mandis or against alternative crops.',
      features: [
        language === 'mr' ? '६ महिन्यांचे एरिया, लाईन व बार आलेख' : language === 'hi' ? '6 महीने के एरिया, लाइन और बार ग्राफ' : 'Interactive Area, Line & Bar price charts',
        language === 'mr' ? 'प्रमुख ३ बाजार समित्यांची तुलना' : language === 'hi' ? 'शीर्ष 3 मंडियों के दामों की तुलना' : 'Multi-mandi & crop vs crop comparison overlay',
        language === 'mr' ? 'CSV डेटा रिपोर्ट डाऊनलोड करा' : language === 'hi' ? 'CSV डेटा रिपोर्ट डाउनलोड करें' : 'One-click CSV historical data download'
      ]
    },
    {
      id: 'buyers',
      tab: 'buyers',
      icon: <ShieldCheck className="w-8 h-8 text-[#2563EB] dark:text-blue-400" />,
      badge: language === 'mr' ? 'विश्वासू खरेदीदार' : language === 'hi' ? 'सत्यापित खरीददार' : 'Verified Traders',
      title: language === 'mr' ? '३. APMC परवानाधारक खरेदीदार' : language === 'hi' ? '3. APMC लाइसेंसधारक खरीददार' : '3. Verified APMC Buyers & Direct Deals',
      subtitle: language === 'mr' ? 'मध्यस्थांशिवाय थेट संवाद व तात्काळ UPI पेमेंट' : language === 'hi' ? 'बिना बिचौलियों के सीधा संवाद और UPI भुगतान' : 'Direct phone & WhatsApp connection with trusted traders.',
      description: language === 'mr'
        ? '९५%+ व्हेरीफाईड ट्रस्ट स्कोर असलेल्या परवानाधारक व्यापाऱ्यांशी थेट फोन किंवा व्हॉट्सॲपवर संपर्क साधा. माल पोहोचताच तात्काळ ऑनलाईन UPI किंवा रोख पेमेंट.'
        : language === 'hi'
        ? '95%+ वेरिफाइड ट्रस्ट स्कोर वाले व्यापारियों से सीधे कॉल या WhatsApp पर बात करें। माल पहुँचते ही तुरंत UPI या नकद भुगतान पाएं।'
        : 'Skip middleman extortion by connecting directly with licensed APMC traders holding 95%+ verified trust ratings. Initiate call or WhatsApp chats with one tap for instant UPI settlement upon delivery.',
      features: [
        language === 'mr' ? 'परवानाधारक आणि पडताळलेले व्यापारी' : language === 'hi' ? 'लाइसेंस प्राप्त और वेरिफाइड व्यापारी' : 'APMC licensed & identity verified buyers',
        language === 'mr' ? 'थेट Call आणि WhatsApp बटण' : language === 'hi' ? 'सीधा Call और WhatsApp बटन' : 'One-click Call or WhatsApp chat launch',
        language === 'mr' ? 'व्यापाऱ्यांचे रेटिंग व मिळालेले रिव्ह्यू' : language === 'hi' ? 'व्यापारियों की रेटिंग और रिव्यु' : 'Community trust ratings & historical reliability'
      ]
    },
    {
      id: 'calculator_voice',
      tab: 'calculator',
      icon: <Calculator className="w-8 h-8 text-[#2563EB] dark:text-blue-400" />,
      badge: language === 'mr' ? 'नफा व आवाज सहाय्यक' : language === 'hi' ? 'कैलकुलेटर और वॉइस' : 'Calculator & Voice AI',
      title: language === 'mr' ? '४. नफा कॅल्क्युलेटर व व्हॉईस AI' : language === 'hi' ? '4. मुनाफा कैलकुलेटर और वॉइस AI' : '4. Net Profit Calculator & Voice Assistant',
      subtitle: language === 'mr' ? 'प्रत्येक खर्चाचे अचूक गणित आणि बोलून प्रश्न विचारण्याची सुविधा' : language === 'hi' ? 'हर खर्च का सटीक हिसाब और बोलकर सवाल पूछने की सुविधा' : 'Custom simulation tools and hands-free voice assistance.',
      description: language === 'mr'
        ? 'स्वतःच्या गाडीचा किंवा ट्रान्सपोर्टचा दर टाकून निव्वळ कमाई मोजा. तसेच वर दिलेल्या Mic बटणावर क्लिक करून मराठीत बोलून प्रश्न विचारा.'
        : language === 'hi'
        ? 'अपनी गाड़ी या ट्रांसपोर्ट का भाड़ा डालकर खुद शुद्ध बचत जोड़ें। साथ ही ऊपर Mic बटन दबाकर बोलकर सवाल पूछें।'
        : 'Simulate custom truck transport charges, loading fees, and commission rates. Additionally, tap the Voice Assistant mic anywhere in the app to speak your query hands-free in Marathi, Hindi, or English.',
      features: [
        language === 'mr' ? 'वाहतूक, हमाली व कमिशनचे कस्टम गणित' : language === 'hi' ? 'भाड़ा, हमाली और कमीशन का कस्टम हिसाब' : 'Customizable freight & loading fee inputs',
        language === 'mr' ? 'माईक दाबून बोलून उत्तर मिळवा' : language === 'hi' ? 'माइक दबाकर बोलकर उत्तर पाएं' : 'Hands-free multilingual speech interaction',
        language === 'mr' ? '100% मोफत आणि सुरक्षित' : language === 'hi' ? '100% मुफ्त और सुरक्षित' : '100% free and easy to use for all farmers'
      ]
    }
  ];

  const activeStep = tourSteps[currentStep];

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      onNavigateTab(tourSteps[nextIdx].tab);
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      onNavigateTab(tourSteps[prevIdx].tab);
    }
  };

  const handleJumpToTab = (tabName: string, idx: number) => {
    setCurrentStep(idx);
    onNavigateTab(tabName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[2.5rem] border border-slate-200/80 dark:border-slate-700/80 card-shadow p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Top Bar: Step Counter & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider block">
                Quick Tour Guide
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Dots Bar */}
        <div className="flex items-center justify-center space-x-1.5 my-4">
          {tourSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => handleJumpToTab(step.tab, idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-8 bg-[#2563EB] dark:bg-blue-500'
                  : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
              }`}
              title={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Content Body */}
        <div className="space-y-4 my-2">
          
          {/* Header Badge & Icon */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex-shrink-0">
              {activeStep.icon}
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                {activeStep.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
                {activeStep.title}
              </h3>
              <p className="text-xs font-bold text-[#2563EB] dark:text-blue-400 mt-0.5">
                {activeStep.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {activeStep.description}
          </p>

          {/* Key Feature Bullets */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Key Capabilities:
            </span>
            <div className="space-y-2">
              {activeStep.features.map((feat, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 mt-4">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'mr' ? 'मागे' : language === 'hi' ? 'पीछे' : 'Back'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {language === 'mr' ? 'रद्द करा' : language === 'hi' ? 'छोड़ें' : 'Skip Tour'}
            </button>

            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>
                {currentStep === tourSteps.length - 1
                  ? (language === 'mr' ? 'सुरू करा' : language === 'hi' ? 'शुरू करें' : 'Get Started')
                  : (language === 'mr' ? 'पुढील' : language === 'hi' ? 'आगे' : 'Next')}
              </span>
              {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

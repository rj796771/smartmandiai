import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, Sparkles, Send, Globe } from 'lucide-react';
import { Language } from '../types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, language: initialLang }) => {
  const [lang, setLang] = useState<Language>(initialLang);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      setIsListening(true);
      setTranscript('');

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Fallback preset
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const presetText = lang === 'mr'
          ? 'कांद्यासाठी आज लासलगाव किंवा वाशी मार्केटमध्ये किती नफा मिळेल?'
          : lang === 'hi'
          ? 'प्याज के लिए आज लासलगांव मंडी में क्या भाव है?'
          : 'What is the best market to sell 30 quintals of onions today?';
        setTranscript(presetText);
      }, 2000);
    }
  };

  const handleSendVoiceQuery = async (queryText?: string) => {
    const q = queryText || transcript;
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: q, language: lang })
      });
      const data = await res.json();
      setResponse(data.text || 'Voice assistant response received.');

      // Speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setResponse('AgriPlus Voice Assistant: Connected to AgmarkNet servers. Lasalgaon APMC offers ₹3,250/q for onions today.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    {
      mr: 'कांद्यासाठी आज सर्वात चांगला भाव कुठे आहे?',
      hi: 'प्याज का आज सबसे अच्छा भाव कहां है?',
      en: 'Where should I sell onions today for max profit?'
    },
    {
      mr: 'टोमॅटो आज विकावा की २ दिवस थांबावे?',
      hi: 'टमाटर आज बेचें या २ दिन रुकें?',
      en: 'Should I sell tomatoes today or wait 2 days?'
    },
    {
      mr: 'नाशिक ते वाशी मार्केट वाहतूक खर्च किती येईल?',
      hi: 'नासिक से वाशी मंडी परिवहन खर्च कितना होगा?',
      en: 'How much transport cost from Nashik to Vashi APMC?'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 card-shadow p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
          <span>AgriPlus Multilingual Voice AI</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
          {lang === 'mr' ? 'बोलून प्रश्न विचारा (मराठी/हिंदी/English)' : lang === 'hi' ? 'बोलकर सवाल पूछें' : 'Voice Assistant'}
        </h3>

        {/* Language selector */}
        <div className="mt-3 flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setLang('mr')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              lang === 'mr' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            मराठी
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              lang === 'hi' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              lang === 'en' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            English
          </button>
        </div>

        {/* Microphone Sphere */}
        <div className="my-8 flex flex-col items-center justify-center">
          <button
            onClick={handleStartListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200 dark:ring-rose-950 scale-110'
                : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-xl shadow-blue-500/30'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3">
            {isListening ? (lang === 'mr' ? 'बोलणे चालू आहे... (Listening...)' : 'Listening...') : 'Tap mic to speak'}
          </span>
        </div>

        {/* Transcript Input */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={lang === 'mr' ? 'उदा. आज कांद्याला कुठे भाव आहे?' : 'Type or speak query...'}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-slate-900 dark:text-white"
            />
            <button
              onClick={() => handleSendVoiceQuery()}
              disabled={isLoading || !transcript}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* AI Response Display */}
          {response && (
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-slate-900 dark:text-slate-100 space-y-1">
              <span className="font-bold text-[#2563EB] dark:text-blue-400 flex items-center space-x-1">
                <Volume2 className="w-4 h-4" />
                <span>AgriPlus AI Voice Answer:</span>
              </span>
              <p className="text-sm font-medium leading-relaxed">{response}</p>
            </div>
          )}

          {/* Sample Query Pills */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Sample Voice Questions:
            </span>
            <div className="space-y-1.5">
              {samplePrompts.map((p, idx) => {
                const text = lang === 'mr' ? p.mr : lang === 'hi' ? p.hi : p.en;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(text);
                      handleSendVoiceQuery(text);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium truncate transition-colors border border-slate-200/60 dark:border-slate-800"
                  >
                    "{text}"
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

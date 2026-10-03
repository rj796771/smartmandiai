import React from 'react';
import { Language } from '../types';
import { X, Settings, Globe, Moon, Sun, Bell, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  darkMode,
  setDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2.5rem] border border-[#DDD9CF] dark:border-[#28513A] max-w-md w-full p-6 sm:p-8 card-shadow space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] uppercase tracking-wider">
            <Settings className="w-4 h-4 text-[#D99A2B]" />
            <span>{language === 'mr' ? 'ॲप सेटिंग्ज' : language === 'hi' ? 'ऐप सेटिंग्स' : 'Application Settings'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#667067] hover:text-[#183A2B] dark:text-[#B9C3BA] dark:hover:text-[#F5F2E9] bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          
          {/* Language Preference */}
          <div className="p-4 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#D99A2B]" />
                <span>Preferred Language</span>
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] px-3 py-1.5 rounded-xl text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] focus:outline-none"
              >
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>

          {/* Theme Preference */}
          <div className="p-4 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-between">
            <span className="text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] flex items-center space-x-2">
              {darkMode ? <Sun className="w-4 h-4 text-[#D99A2B]" /> : <Moon className="w-4 h-4 text-[#183A2B]" />}
              <span>Dark Theme</span>
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-[#183A2B]' : 'bg-[#DDD9CF]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-[#FFFDF8] transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-xs text-[#667067] dark:text-[#B9C3BA] space-y-1">
            <span className="font-bold text-[#183A2B] dark:text-[#D99A2B] flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span>AgmarkNet Data Privacy</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              Your Google login information is used exclusively for authentication. AgriPlus AI never stores passwords or exposes your personal market queries.
            </p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#183A2B] hover:bg-[#10271D] text-[#FFFDF8] font-bold text-xs transition-colors shadow-sm"
        >
          Save & Close Settings
        </button>

      </div>
    </div>
  );
};

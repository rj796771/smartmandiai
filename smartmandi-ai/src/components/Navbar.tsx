import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Globe, Mic, Sparkles, Compass, Calendar, User, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { AgriPlusLogo } from './AgriPlusLogo';
import { Language } from '../types';
import { formatDateByLanguage } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenVoice: () => void;
  onOpenTour?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onOpenVoice,
  onOpenTour,
  onOpenProfile,
  onOpenSettings
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavText = (key: string) => {
    if (language === 'mr') {
      switch (key) {
        case 'landing': return 'मुख्यपृष्ठ';
        case 'dashboard': return 'डॅशबोर्ड';
        case 'recommendation': return 'AI शिफारस';
        case 'prices': return 'बाजार भाव';
        case 'history': return 'बाजार इतिहास';
        case 'buyers': return 'विश्वासू खरेदीदार';
        case 'calculator': return 'नफा कॅल्क्युलेटर';
        case 'about': return 'बद्दल';
        default: return key;
      }
    } else if (language === 'hi') {
      switch (key) {
        case 'landing': return 'मुख्य पृष्ठ';
        case 'dashboard': return 'डैशबोर्ड';
        case 'recommendation': return 'AI सिफारिश';
        case 'prices': return 'मंडी भाव';
        case 'history': return 'बाज़ार इतिहास';
        case 'buyers': return 'सत्यापित खरीददार';
        case 'calculator': return 'मुनाफा कैलकुलेटर';
        case 'about': return 'हमारे बारे में';
        default: return key;
      }
    }
    switch (key) {
      case 'landing': return 'Home';
      case 'dashboard': return 'Dashboard';
      case 'recommendation': return 'AI Recommendation';
      case 'prices': return 'Market Prices';
      case 'history': return 'Market History';
      case 'buyers': return 'Verified Buyers';
      case 'calculator': return 'Profit Calculator';
      case 'about': return 'About & Contact';
      default: return key;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#FFFDF8]/90 dark:bg-[#18251E]/90 border-b border-[#DDD9CF] dark:border-[#28513A]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center text-left focus:outline-none group"
        >
          <AgriPlusLogo size="md" showWordmark={true} />
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#F8F5ED] dark:bg-[#101814] p-1 rounded-2xl border border-[#DDD9CF] dark:border-[#28513A]/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'landing'
                ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#F5F2E9] shadow-sm font-bold border border-[#DDD9CF]/80 dark:border-[#28513A]/60'
                : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
            }`}
          >
            {getNavText('landing')}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${
                activeTab === 'dashboard'
                  ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#F5F2E9] shadow-sm font-bold border border-[#DDD9CF]/80 dark:border-[#28513A]/60'
                  : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span>{getNavText('dashboard')}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('recommendation')}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeTab === 'recommendation'
                ? 'bg-[#183A2B] text-[#D99A2B] shadow-sm font-bold border border-[#D99A2B]/40'
                : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>{getNavText('recommendation')}</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'prices'
                ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#F5F2E9] shadow-sm font-bold border border-[#DDD9CF]/80 dark:border-[#28513A]/60'
                : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
            }`}
          >
            {getNavText('prices')}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#F5F2E9] shadow-sm font-bold border border-[#DDD9CF]/80 dark:border-[#28513A]/60'
                : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
            }`}
          >
            {getNavText('history')}
          </button>

          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'buyers'
                ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#F5F2E9] shadow-sm font-bold border border-[#DDD9CF]/80 dark:border-[#28513A]/60'
                : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
            }`}
          >
            {getNavText('buyers')}
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'calculator'
                ? 'bg-[#FFFDF8] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#F5F2E9] shadow-sm font-bold border border-[#DDD9CF]/80 dark:border-[#28513A]/60'
                : 'text-[#667067] dark:text-[#B9C3BA] hover:text-[#183A2B] dark:hover:text-[#F5F2E9]'
            }`}
          >
            {getNavText('calculator')}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Tour Button */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="p-2 px-2.5 rounded-xl bg-[#F8F5ED] hover:bg-[#F0EBE0] dark:bg-[#1E2D25] dark:hover:bg-[#28513A] text-[#202522] dark:text-[#F5F2E9] border border-[#DDD9CF] dark:border-[#28513A] transition-all flex items-center space-x-1"
              title={language === 'mr' ? 'गाईड / टुर (Quick Tour)' : language === 'hi' ? 'गाइड / टूर (Quick Tour)' : 'App Tour Guide'}
            >
              <Compass className="w-4 h-4 text-[#D99A2B]" />
              <span className="text-xs font-bold hidden lg:inline">
                {language === 'mr' ? 'टूर' : language === 'hi' ? 'टूर' : 'Tour'}
              </span>
            </button>
          )}

          {/* Voice Mic Button */}
          <button
            onClick={onOpenVoice}
            className="p-2 px-2.5 sm:px-3 rounded-xl bg-[#F8F5ED] text-[#183A2B] dark:bg-[#1E2D25] dark:text-[#D99A2B] border border-[#DDD9CF] dark:border-[#28513A] hover:bg-[#F0EBE0] dark:hover:bg-[#28513A] transition-all flex items-center space-x-1.5"
            title="Voice Assistant (मराठी / हिंदी / English)"
          >
            <Mic className="w-4 h-4 text-[#D99A2B] animate-pulse" />
            <span className="text-xs font-bold hidden xl:inline">Voice Assistant</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-[#F8F5ED] dark:bg-[#1E2D25] rounded-xl p-0.5 border border-[#DDD9CF] dark:border-[#28513A] text-xs font-medium">
            <Globe className="w-3.5 h-3.5 ml-2 text-[#667067] hidden sm:inline" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent pl-1.5 pr-2 py-1 text-[#202522] dark:text-[#F5F2E9] focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-[#667067] hover:text-[#183A2B] dark:text-[#B9C3BA] dark:hover:text-[#F5F2E9] bg-[#F8F5ED] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#D99A2B]" /> : <Moon className="w-4 h-4 text-[#183A2B]" />}
          </button>

          {/* User Profile / Authenticated Menu vs Sign In Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2 pr-3 rounded-2xl bg-[#F8F5ED] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] hover:bg-[#F0EBE0] dark:hover:bg-[#28513A] transition-all"
              >
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-xl object-cover border border-[#D99A2B]" 
                  />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-[#183A2B] text-[#FFFDF8] flex items-center justify-center text-xs font-bold border border-[#D99A2B]">
                    {user.name.charAt(0)}
                  </div>
                )}
                
                <span className="text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] hidden sm:inline max-w-[100px] truncate">
                  Welcome, {user.givenName || user.name.split(' ')[0]}
                </span>

                <ChevronDown className={`w-3.5 h-3.5 text-[#667067] transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFDF8] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] card-shadow p-2 z-50 animate-fadeIn space-y-1">
                  <div className="px-3 py-2 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
                    <p className="text-xs font-extrabold text-[#183A2B] dark:text-[#F5F2E9] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-[#667067] dark:text-[#B9C3BA] truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F8F5ED] dark:hover:bg-[#101814] flex items-center space-x-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#D99A2B]" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#183A2B] dark:text-[#F5F2E9] hover:bg-[#F8F5ED] dark:hover:bg-[#101814] flex items-center space-x-2 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#D99A2B]" />
                    <span>Settings</span>
                  </button>

                  <div className="pt-1 border-t border-[#DDD9CF] dark:border-[#28513A]/60">
                    <button
                      onClick={async () => {
                        setIsProfileMenuOpen(false);
                        await logout();
                        setActiveTab('login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#C8663D] hover:bg-[#F8F5ED] dark:hover:bg-[#101814] flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-[#C8663D]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#183A2B] hover:bg-[#28513A] active:scale-[0.98] transition-all shadow-md"
            >
              <User className="w-3.5 h-3.5 mr-1.5 text-[#D99A2B]" />
              <span>{language === 'mr' ? 'साइन इन करा' : language === 'hi' ? 'साइन इन करें' : 'Sign In'}</span>
            </button>
          )}

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-[#F8F5ED] dark:bg-[#101814] border-t border-[#DDD9CF] dark:border-[#28513A]/50 overflow-x-auto text-xs space-x-1">
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium ${
              activeTab === 'dashboard' ? 'bg-[#183A2B] text-[#FFFDF8] font-semibold' : 'text-[#667067] dark:text-[#B9C3BA]'
            }`}
          >
            {getNavText('dashboard')}
          </button>
        )}
        <button
          onClick={() => setActiveTab('recommendation')}
          className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium ${
            activeTab === 'recommendation' ? 'bg-[#183A2B] text-[#D99A2B] font-semibold' : 'text-[#667067] dark:text-[#B9C3BA]'
          }`}
        >
          {getNavText('recommendation')}
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium ${
            activeTab === 'prices' ? 'bg-[#183A2B] text-[#FFFDF8] font-semibold' : 'text-[#667067] dark:text-[#B9C3BA]'
          }`}
        >
          {getNavText('prices')}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium ${
            activeTab === 'history' ? 'bg-[#183A2B] text-[#FFFDF8] font-semibold' : 'text-[#667067] dark:text-[#B9C3BA]'
          }`}
        >
          {getNavText('history')}
        </button>
        <button
          onClick={() => setActiveTab('buyers')}
          className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium ${
            activeTab === 'buyers' ? 'bg-[#183A2B] text-[#FFFDF8] font-semibold' : 'text-[#667067] dark:text-[#B9C3BA]'
          }`}
        >
          {getNavText('buyers')}
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium ${
            activeTab === 'calculator' ? 'bg-[#183A2B] text-[#FFFDF8] font-semibold' : 'text-[#667067] dark:text-[#B9C3BA]'
          }`}
        >
          {getNavText('calculator')}
        </button>
      </div>
    </header>
  );
};

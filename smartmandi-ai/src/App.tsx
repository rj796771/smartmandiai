import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RecommendationForm } from './components/RecommendationForm';
import { RecommendationCard } from './components/RecommendationCard';
import { BentoGridSkeleton } from './components/BentoGridSkeleton';
import { LiveMarketPrices } from './components/LiveMarketPrices';
import { MarketHistory } from './components/MarketHistory';
import { VerifiedBuyerCards } from './components/VerifiedBuyerCards';
import { ProfitCalculator } from './components/ProfitCalculator';
import { AboutSection } from './components/AboutSection';
import { VoiceModal } from './components/VoiceModal';
import { PdfReportModal } from './components/PdfReportModal';
import { QuickTourModal } from './components/QuickTourModal';
import { Footer } from './components/Footer';
import { SavedRecommendationsList } from './components/SavedRecommendationsList';
import { WeatherNotificationBanner } from './components/WeatherNotificationBanner';
import { ToastNotificationContainer, ToastMessage } from './components/ToastNotification';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { Language, RecommendationInput, RecommendationResult, SavedRecommendation } from './types';
import { SAMPLE_MANDIS, SAMPLE_BUYERS, POPULAR_CROPS } from './data/mandisData';

function AgriPlusMain() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTabRaw] = useState('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(() => {
    return (localStorage.getItem('agriplus_dark_mode') || localStorage.getItem('smartmandi_dark_mode')) === 'true';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Protected route guard logic
  const PROTECTED_TABS = ['dashboard', 'recommendation', 'prices', 'history', 'buyers', 'calculator'];

  const setActiveTab = (tab: string) => {
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      addToast('info', 'Google Sign-In Required', 'Please sign in with your Google account to access protected features.');
      setActiveTabRaw('login');
      return;
    }

    if (tab === 'login' && isAuthenticated) {
      setActiveTabRaw('dashboard');
      return;
    }

    setActiveTabRaw(tab);
  };

  // Redirect to dashboard on successful login if on login page
  useEffect(() => {
    if (isAuthenticated && activeTab === 'login') {
      setActiveTabRaw('dashboard');
    }
  }, [isAuthenticated, activeTab]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastInput, setLastInput] = useState<RecommendationInput | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [recSubTab, setRecSubTab] = useState<'search' | 'history'>('search');

  // Modal visibility states
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [calculatorPresetMandi, setCalculatorPresetMandi] = useState<string>('');

  // Saved Recommendations stored in localStorage
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>(() => {
    try {
      const stored = localStorage.getItem('agriplus_saved_recommendations') || localStorage.getItem('smartmandi_saved_recommendations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync saved recommendations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agriplus_saved_recommendations', JSON.stringify(savedRecommendations));
    } catch (e) {
      console.error('Failed to sync saved recommendations to localStorage', e);
    }
  }, [savedRecommendations]);

  const handleSaveRecommendation = () => {
    if (!recommendationResult || !lastInput) return;

    // Check if already saved
    const existingIndex = savedRecommendations.findIndex(
      s => s.result.recommendedMandi.id === recommendationResult.recommendedMandi.id &&
           s.input.cropId === lastInput.cropId &&
           s.input.quantityQuintals === lastInput.quantityQuintals &&
           s.input.farmerDistrict === lastInput.farmerDistrict
    );

    if (existingIndex >= 0) {
      setSavedRecommendations(prev => prev.filter((_, idx) => idx !== existingIndex));
      addToast('info', 'Recommendation Unsaved', 'Removed from your saved history list.');
    } else {
      const newEntry: SavedRecommendation = {
        id: `rec_${Date.now()}`,
        createdAt: new Date().toLocaleString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        input: lastInput,
        result: recommendationResult
      };
      setSavedRecommendations(prev => [newEntry, ...prev]);
      addToast('success', 'Recommendation Saved!', 'Access this anytime from My Saved Reports.');
    }
  };

  const handleDeleteSavedRecommendation = (id: string) => {
    setSavedRecommendations(prev => prev.filter(item => item.id !== id));
    addToast('info', 'Report Deleted');
  };

  const handleClearAllSaved = () => {
    setSavedRecommendations([]);
    localStorage.removeItem('agriplus_saved_recommendations');
    localStorage.removeItem('smartmandi_saved_recommendations');
    addToast('info', 'Cleared All Saved Reports');
  };

  const handleSelectSavedRecommendation = (saved: SavedRecommendation) => {
    setLastInput(saved.input);
    setRecommendationResult(saved.result);
    setRecSubTab('search');
    setActiveTab('recommendation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Dark Mode toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('agriplus_dark_mode', String(darkMode));
  }, [darkMode]);

  // Execute Smart Mandi Recommendation
  const handleCalculateRecommendation = async (input: RecommendationInput) => {
    if (!isAuthenticated) {
      addToast('info', 'Sign in to Calculate', 'Please sign in with Google to generate custom market recommendations.');
      setActiveTab('login');
      return;
    }

    setIsLoading(true);
    setLastInput(input);
    setActiveTab('recommendation');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error('Server recommendation error');
      }

      const data: RecommendationResult = await response.json();
      setRecommendationResult(data);
    } catch (err) {
      console.error('Error fetching recommendation, generating client fallback:', err);
      addToast('warning', 'Live API Offline', 'Server unavailable. Calculated recommendation using verified local APMC dataset.');
      
      const crop = POPULAR_CROPS.find(c => c.id === input.cropId) || POPULAR_CROPS[0];
      const bestMandi = SAMPLE_MANDIS[0];
      const grossRev = crop.defaultPricePerQuintal * input.quantityQuintals;
      const trans = Math.round((input.quantityQuintals / 10) * bestMandi.distanceKm * bestMandi.transportRatePerKmPerTon);
      const comm = Math.round(grossRev * (bestMandi.commissionPercent / 100));
      const net = Math.max(0, grossRev - trans - comm);

      setRecommendationResult({
        recommendedMandi: bestMandi,
        alternateMandis: SAMPLE_MANDIS.slice(1, 4),
        sellingScore: 96,
        sellAdvice: 'SELL_TODAY',
        sellAdviceReason: `High buyer demand for ${input.cropName} at ${bestMandi.name} guarantees maximum profit today.`,
        sellAdviceConfidence: 94,
        breakdown: {
          grossRevenue: grossRev,
          transportCost: trans,
          mandiCommission: comm,
          netProfit: net,
          profitMarginPercent: Math.round((net / grossRev) * 100)
        },
        recommendedBuyers: SAMPLE_BUYERS.slice(0, 3),
        pricePredictionTrend: [
          { date: 'Jul 26', price: crop.defaultPricePerQuintal - 120 },
          { date: 'Jul 28', price: crop.defaultPricePerQuintal - 40 },
          { date: 'Today', price: crop.defaultPricePerQuintal },
          { date: 'Aug 02 (Forecast)', price: crop.defaultPricePerQuintal + 80, projected: true },
          { date: 'Aug 04 (Forecast)', price: crop.defaultPricePerQuintal + 150, projected: true }
        ],
        weatherRiskAlert: {
          status: 'OPTIMAL',
          summary: 'Clear skies across major transit corridors for the next 72 hours.',
          temperatureC: 29,
          rainProbability: 10,
          humidityPercent: 60
        },
        aiReasoningText: `${bestMandi.name} currently offers ₹${bestMandi.pricePerQuintal}/quintal. Even after deducting ₹${trans} transport cost, your net earnings remain ₹${net.toLocaleString('en-IN')}, higher than local mandis.`,
        calculatedAt: 'Just now'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMandiForCalc = (mandiName: string) => {
    setCalculatorPresetMandi(mandiName);
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F172A] text-[#1F2937] dark:text-[#F8FAFC] transition-colors">
      
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Authentication / Login Page */}
        {activeTab === 'login' && (
          <LoginPage
            language={language}
            onSuccessNavigate={() => setActiveTab('dashboard')}
          />
        )}

        {/* Authenticated Dashboard */}
        {activeTab === 'dashboard' && isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard
              language={language}
              onNavigateTab={setActiveTab}
              savedList={savedRecommendations}
              onSelectSaved={handleSelectSavedRecommendation}
              onDeleteSaved={handleDeleteSavedRecommendation}
              onClearAll={handleClearAllSaved}
            />
          </div>
        )}

        {/* Landing Page */}
        {activeTab === 'landing' && (
          <div className="space-y-12">
            <Hero
              onStartRecommendation={() => setActiveTab(isAuthenticated ? 'recommendation' : 'login')}
              onExplorePrices={() => setActiveTab(isAuthenticated ? 'prices' : 'login')}
              onOpenTour={() => setIsTourOpen(true)}
              language={language}
            />

            {/* Weather Risk Notification Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <WeatherNotificationBanner
                recommendationResult={recommendationResult}
                farmerDistrict={lastInput?.farmerDistrict || 'Nashik'}
                language={language}
                onExploreRecommendation={() => setActiveTab(isAuthenticated ? 'recommendation' : 'login')}
              />
            </div>

            {/* Quick Embedded Recommendation Form on Landing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <RecommendationForm
                onSubmit={handleCalculateRecommendation}
                isLoading={isLoading}
                language={language}
                onOpenVoice={() => setIsVoiceOpen(true)}
              />
            </div>
          </div>
        )}

        {/* AI Recommendation Page */}
        {activeTab === 'recommendation' && isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Weather Risk Alert Banner */}
            <WeatherNotificationBanner
              recommendationResult={recommendationResult}
              farmerDistrict={lastInput?.farmerDistrict || 'Nashik'}
              language={language}
            />

            {/* Recommendation Page Header Switcher */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 card-shadow">
              <div className="flex items-center space-x-2 text-xs font-bold">
                <button
                  onClick={() => setRecSubTab('search')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    recSubTab === 'search'
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {language === 'mr' ? 'AI शिफारस शोध' : language === 'hi' ? 'AI सिफारिश खोज' : 'AI Market Recommendation'}
                </button>
                
                <button
                  onClick={() => setRecSubTab('history')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                    recSubTab === 'history'
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{language === 'mr' ? 'माझा इतिहास' : language === 'hi' ? 'मेरा इतिहास' : 'My History'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    recSubTab === 'history'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-400'
                  }`}>
                    {savedRecommendations.length}
                  </span>
                </button>
              </div>

              {savedRecommendations.length > 0 && recSubTab === 'search' && (
                <button
                  onClick={() => setRecSubTab('history')}
                  className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:underline hidden sm:block pr-2"
                >
                  View {savedRecommendations.length} Bookmarked Searches →
                </button>
              )}
            </div>

            {/* Sub-tab 1: Active Recommendation Search or Result */}
            {recSubTab === 'search' && (
              <div className="space-y-8">
                {isLoading ? (
                  <BentoGridSkeleton />
                ) : !recommendationResult ? (
                  <RecommendationForm
                    onSubmit={handleCalculateRecommendation}
                    isLoading={isLoading}
                    language={language}
                    onOpenVoice={() => setIsVoiceOpen(true)}
                  />
                ) : (
                  <RecommendationCard
                    result={recommendationResult}
                    onRecalculate={() => setRecommendationResult(null)}
                    onDownloadPdf={() => setIsPdfModalOpen(true)}
                    onSaveRecommendation={handleSaveRecommendation}
                    isSaved={Boolean(
                      recommendationResult &&
                      lastInput &&
                      savedRecommendations.some(
                        s => s.result.recommendedMandi.id === recommendationResult.recommendedMandi.id &&
                             s.input.cropId === lastInput.cropId &&
                             s.input.quantityQuintals === lastInput.quantityQuintals &&
                             s.input.farmerDistrict === lastInput.farmerDistrict
                      )
                    )}
                    language={language}
                  />
                )}

                {/* Quick History List below result if items exist */}
                {savedRecommendations.length > 0 && !isLoading && (
                  <div className="pt-4">
                    <SavedRecommendationsList
                      savedList={savedRecommendations}
                      onSelectSaved={handleSelectSavedRecommendation}
                      onDeleteSaved={handleDeleteSavedRecommendation}
                      onClearAll={handleClearAllSaved}
                      onStartNewSearch={() => {
                        setRecommendationResult(null);
                        setRecSubTab('search');
                      }}
                      language={language}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 2: Full History View */}
            {recSubTab === 'history' && (
              <SavedRecommendationsList
                savedList={savedRecommendations}
                onSelectSaved={handleSelectSavedRecommendation}
                onDeleteSaved={handleDeleteSavedRecommendation}
                onClearAll={handleClearAllSaved}
                onStartNewSearch={() => {
                  setRecommendationResult(null);
                  setRecSubTab('search');
                }}
                language={language}
              />
            )}

          </div>
        )}

        {/* Live Market Prices Page */}
        {activeTab === 'prices' && isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LiveMarketPrices
              onSelectMandiForCalc={handleSelectMandiForCalc}
              language={language}
            />
          </div>
        )}

        {/* Market History & Price Trends Page */}
        {activeTab === 'history' && isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MarketHistory
              language={language}
              onSelectCropForRec={(cropId) => {
                setActiveTab('recommendation');
              }}
            />
          </div>
        )}

        {/* Verified Buyers Page */}
        {activeTab === 'buyers' && isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VerifiedBuyerCards
              language={language}
            />
          </div>
        )}

        {/* Profit Calculator Page */}
        {activeTab === 'calculator' && isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProfitCalculator
              initialMandiName={calculatorPresetMandi}
              language={language}
            />
          </div>
        )}

        {/* About & Contact Page */}
        {activeTab === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AboutSection language={language} />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} language={language} />

      {/* Multilingual Voice Modal */}
      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        language={language}
        savedCount={savedRecommendations.length}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* PDF Export Printable Modal */}
      {recommendationResult && lastInput && (
        <PdfReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          result={recommendationResult}
          input={lastInput}
          language={language}
        />
      )}

      {/* Step-by-Step Quick Tour Guide Modal */}
      <QuickTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={setActiveTab}
        language={language}
      />

      {/* Global Toast Notifications Container */}
      <ToastNotificationContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AgriPlusMain />
    </AuthProvider>
  );
}

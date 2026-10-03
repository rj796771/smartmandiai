import React, { useState } from 'react';
import { AgriPlusLogo } from './AgriPlusLogo';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Scale,
  Users,
  Lock
} from 'lucide-react';

interface LoginPageProps {
  language: Language;
  onSuccessNavigate?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ language, onSuccessNavigate }) => {
  const { loginWithGoogle, isLoading, authError, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    clearError();
    try {
      await loginWithGoogle();
      if (onSuccessNavigate) {
        onSuccessNavigate();
      }
    } catch (err) {
      console.error('Login page error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand Narrative & Benefits */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-xs font-bold text-[#183A2B] dark:text-[#D99A2B]">
            <Sparkles className="w-4 h-4 text-[#D99A2B]" />
            <span>{language === 'mr' ? 'शेतकरी पोर्टल ॲक्सेस' : language === 'hi' ? 'किसान पोर्टल एक्सेस' : 'Farmer Portal Access'}</span>
          </div>

          <div className="space-y-2">
            <AgriPlusLogo size="xl" showWordmark={true} />
            <p className="text-[#C8663D] dark:text-[#D99A2B] font-bold text-base sm:text-lg font-['Manrope',sans-serif]">
              Smarter Markets. Better Decisions. Higher Returns.
            </p>
          </div>

          <p className="text-sm text-[#667067] dark:text-[#B9C3BA] leading-relaxed font-medium max-w-lg">
            {language === 'mr'
              ? 'महाराष्ट्रातील शेतकऱ्यांसाठी तयार केलेले खास पोर्टल. सर्वोत्तम मंडी निवडून पिकांचा निव्वळ नफा वाढवा आणि थेट विश्वासू खरेदीदारांशी संपर्क साधा.'
              : language === 'hi'
              ? 'महाराष्ट्र के किसानों के लिए समर्पित पोर्टल। अपनी उपज के लिए सर्वोत्तम मंडी चुनें, शुद्ध लाभ की गणना करें और सत्यापित खरीददारों से जुड़ें।'
              : 'Empowering farmers in Maharashtra to make data-driven market decisions, discover maximum net cash profits, and connect directly with APMC-licensed buyers.'
            }
          </p>

          {/* Key Feature Checkpoints */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-lg bg-[#F8F5ED] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#D99A2B]" />
              </div>
              <div>
                <span className="font-bold text-xs text-[#183A2B] dark:text-[#F5F2E9] block">
                  {language === 'mr' ? 'AI नफा शिफारस व अंदाज' : language === 'hi' ? 'AI लाभ सिफारिश एवं पूर्वानुमान' : 'AI Net Profit & Price Forecasting'}
                </span>
                <span className="text-[11px] text-[#667067] dark:text-[#B9C3BA]">
                  Real-time transport and commission calculations across 10+ nearby Mandis.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-lg bg-[#F8F5ED] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#D99A2B]" />
              </div>
              <div>
                <span className="font-bold text-xs text-[#183A2B] dark:text-[#F5F2E9] block">
                  {language === 'mr' ? 'साठवलेला शोध व अहवाल इतिहास' : language === 'hi' ? 'सहेजा गया इतिहास एवं रिपोर्ट' : 'Personal Saved History & Reports'}
                </span>
                <span className="text-[11px] text-[#667067] dark:text-[#B9C3BA]">
                  Save your crop market searches and download official PDF price quotes.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-lg bg-[#F8F5ED] dark:bg-[#1E2D25] text-[#183A2B] dark:text-[#D99A2B] mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#D99A2B]" />
              </div>
              <div>
                <span className="font-bold text-xs text-[#183A2B] dark:text-[#F5F2E9] block">
                  {language === 'mr' ? 'विश्वासू APMC खरेदीदार डायरेक्टरी' : language === 'hi' ? 'सत्यापित APMC खरीददार डायरेक्टरी' : 'Verified APMC Buyer Network'}
                </span>
                <span className="text-[11px] text-[#667067] dark:text-[#B9C3BA]">
                  Direct phone & WhatsApp contact with 95%+ trust score licensed buyers.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Google Sign-In Card */}
        <div className="md:col-span-5">
          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2.5rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 card-shadow space-y-6 relative overflow-hidden">
            
            {/* Top Security Banner */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-[#183A2B] dark:text-[#D99A2B]">
                <Lock className="w-7 h-7 text-[#D99A2B]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                {language === 'mr' ? 'खात्यामध्ये लॉग इन करा' : language === 'hi' ? 'खाते में साइन इन करें' : 'Sign in to AgriPlus AI'}
              </h3>
              <p className="text-xs text-[#667067] dark:text-[#B9C3BA]">
                {language === 'mr' ? 'तुमच्या सुरक्षित Google खात्याद्वारे प्रवेश करा' : language === 'hi' ? 'अपने सुरक्षित Google खाते से साइन इन करें' : 'Use your secure Google Account to continue'}
              </p>
            </div>

            {/* Error Notification Banner */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-xs text-[#C8663D] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-[#C8663D] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block mb-0.5">Authentication Notice</span>
                  <span>{authError}</span>
                </div>
              </div>
            )}

            {/* Official Google Sign-In Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isSigningIn}
                className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-[#101814] text-[#3c4043] dark:text-[#E2E8F0] border border-[#dadce0] dark:border-[#28513A] hover:bg-[#f8f9fa] dark:hover:bg-[#18251E] font-medium text-sm flex items-center justify-center space-x-3 transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading || isSigningIn ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-[#183A2B] border-t-transparent rounded-full animate-spin" />
                    <span className="font-bold text-xs text-[#183A2B] dark:text-[#D99A2B]">
                      Signing you in...
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Official Google G Logo SVG */}
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-bold text-sm text-[#202522] dark:text-[#F5F2E9]">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#667067] dark:text-[#B9C3BA] space-y-1">
                <p>No password needed. Instant & automatic registration.</p>
                <div className="flex items-center justify-center space-x-1 text-[10px] text-[#183A2B] dark:text-[#D99A2B] font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D99A2B]" />
                  <span>100% Secure Official OAuth Authorization</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-4 border-t border-[#DDD9CF] dark:border-[#28513A]/60 text-[11px] text-[#667067] dark:text-[#B9C3BA] text-center">
              By signing in, you agree to AgriPlus AI's farmer data privacy and AgmarkNet terms of service.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

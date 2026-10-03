import React, { useState } from 'react';
import { AgriPlusLogo } from './AgriPlusLogo';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';

interface LoginPageProps {
  language: Language;
  onSuccessNavigate?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ language, onSuccessNavigate }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    loginWithDemo, 
    isLoading, 
    authError, 
    providerNotConfigured, 
    callbackUrl,
    supabaseProjectUrl,
    clearError 
  } = useAuth();
  
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    clearError();
    setEmailStatusMessage(null);
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

  const handleDemoSignIn = async () => {
    setIsSigningIn(true);
    clearError();
    try {
      await loginWithDemo();
      if (onSuccessNavigate) {
        onSuccessNavigate();
      }
    } catch (err) {
      console.error('Demo sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSigningIn(true);
    clearError();
    setEmailStatusMessage(null);

    const res = await loginWithEmail(email, password || undefined);
    if (res.message) {
      setEmailStatusMessage(res.message);
    }
    setIsSigningIn(false);
  };

  const copyCallbackUrl = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2.5rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 card-shadow space-y-5 relative overflow-hidden">
            
            {/* Top Security Banner */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] flex items-center justify-center text-[#183A2B] dark:text-[#D99A2B]">
                <Lock className="w-6 h-6 text-[#D99A2B]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                {language === 'mr' ? 'खात्यामध्ये लॉग इन करा' : language === 'hi' ? 'खाते में साइन इन करें' : 'Sign in to AgriPlus AI'}
              </h3>
              <p className="text-xs text-[#667067] dark:text-[#B9C3BA]">
                {language === 'mr' ? 'तुमच्या सुरक्षित Google खात्याद्वारे प्रवेश करा' : language === 'hi' ? 'अपने सुरक्षित Google खाते से साइन इन करें' : 'Connected to Supabase Authentication'}
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

            {/* Supabase Provider Setup Assistant (Shown if Google OAuth is not yet toggled on in Supabase Dashboard) */}
            {providerNotConfigured && (
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60 text-xs space-y-2.5 text-[#183A2B] dark:text-[#F5F2E9]">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>How to Enable Google in Supabase:</span>
                </div>

                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#475467] dark:text-[#CBD5E1]">
                  <li>
                    Open your{' '}
                    <a
                      href="https://supabase.com/dashboard/project/mhnszbxwfmpgidttpwyd/auth/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-[#183A2B] dark:text-amber-300 inline-flex items-center gap-0.5"
                    >
                      Supabase Providers Dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Click <strong>Google</strong> and toggle <strong>Enable Google provider</strong> to ON.</li>
                  <li>
                    Copy your Redirect Callback URL:
                    <div className="mt-1 flex items-center bg-white dark:bg-[#101814] p-1.5 rounded-lg border border-[#DDD9CF] dark:border-[#28513A] font-mono text-[10px] break-all">
                      <span className="flex-1 truncate">{callbackUrl}</span>
                      <button
                        onClick={copyCallbackUrl}
                        type="button"
                        className="ml-2 px-2 py-0.5 rounded bg-[#183A2B] text-white hover:bg-[#28513A] flex items-center gap-1 font-sans text-[10px]"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </li>
                  <li>Paste your Google Client ID & Secret from Google Cloud Console and click <strong>Save</strong>.</li>
                </ol>

                <div className="pt-1 text-[11px] text-[#667067] dark:text-[#94A3B8]">
                  💡 <em>You can also test the entire platform immediately using the Instant Farmer Access button below!</em>
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
                      Connecting to Google...
                    </span>
                  </div>
                ) : (
                  <>
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

              {/* Instant 1-Click Access for Immediate Testing */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isLoading || isSigningIn}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#F8F5ED] dark:bg-[#18251E] text-[#183A2B] dark:text-[#D99A2B] border border-[#DDD9CF] dark:border-[#28513A] hover:bg-[#F0EBE0] dark:hover:bg-[#28513A]/50 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#D99A2B]" />
                <span>Instant Farmer Access (1-Click Test)</span>
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-[#DDD9CF] dark:border-[#28513A]"></div>
                <span className="px-3 text-[10px] uppercase font-bold text-[#667067] dark:text-[#B9C3BA]">or email</span>
                <div className="flex-1 border-t border-[#DDD9CF] dark:border-[#28513A]"></div>
              </div>

              {/* Email Authentication Toggle */}
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#183A2B] dark:text-[#D99A2B] hover:underline flex items-center justify-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Sign in with Email & Password</span>
                </button>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-2.5 pt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-[#183A2B] dark:text-[#F5F2E9] focus:outline-none focus:ring-1 focus:ring-[#D99A2B]"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (optional for magic link)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-[#183A2B] dark:text-[#F5F2E9] focus:outline-none focus:ring-1 focus:ring-[#D99A2B]"
                  />
                  {emailStatusMessage && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {emailStatusMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || isSigningIn}
                    className="w-full py-2 px-3 rounded-xl bg-[#183A2B] hover:bg-[#28513A] text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>Continue with Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              <div className="text-[11px] text-center text-[#667067] dark:text-[#B9C3BA] space-y-1 pt-1">
                <div className="flex items-center justify-center space-x-1 text-[10px] text-[#183A2B] dark:text-[#D99A2B] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D99A2B]" />
                  <span>Powered by Supabase Secure Authentication</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t border-[#DDD9CF] dark:border-[#28513A]/60 text-[11px] text-[#667067] dark:text-[#B9C3BA] text-center">
              By signing in, you agree to AgriPlus AI's farmer data privacy and AgmarkNet terms of service.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

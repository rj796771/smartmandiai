import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { 
  X, 
  LogOut, 
  ShieldCheck, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Bookmark,
  Sparkles
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  savedCount?: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  savedCount = 0
}) => {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2.5rem] border border-[#DDD9CF] dark:border-[#28513A] max-w-md w-full p-6 sm:p-8 card-shadow space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#183A2B] dark:text-[#D99A2B] uppercase tracking-wider">
            <User className="w-4 h-4 text-[#D99A2B]" />
            <span>{language === 'mr' ? 'माझे प्रोफाइल' : language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'Farmer Profile'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#667067] hover:text-[#183A2B] dark:text-[#B9C3BA] dark:hover:text-[#F5F2E9] bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center space-x-4">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl border-2 border-[#DDD9CF] dark:border-[#28513A] object-cover shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#183A2B] text-[#FFFDF8] flex items-center justify-center text-2xl font-bold border-2 border-[#D99A2B]">
              {user.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1 overflow-hidden">
            <h3 className="text-lg font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif] truncate">
              {user.name}
            </h3>
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] truncate flex items-center space-x-1">
              <Mail className="w-3 h-3 text-[#D99A2B] flex-shrink-0" />
              <span>{user.email}</span>
            </p>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#F8F5ED] dark:bg-[#101814] border border-[#DDD9CF] dark:border-[#28513A] text-[10px] font-bold text-[#183A2B] dark:text-[#D99A2B]">
              <ShieldCheck className="w-3 h-3 text-[#D99A2B]" />
              <span>Google Account Verified</span>
            </span>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="space-y-3 bg-[#F8F5ED] dark:bg-[#101814] p-4 rounded-2xl border border-[#DDD9CF] dark:border-[#28513A] text-xs">
          <div className="flex justify-between py-1 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
            <span className="text-[#667067] dark:text-[#B9C3BA]">Authentication Provider</span>
            <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">Google OAuth 2.0</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#DDD9CF] dark:border-[#28513A]/60">
            <span className="text-[#667067] dark:text-[#B9C3BA]">Saved Market Reports</span>
            <span className="font-bold text-[#183A2B] dark:text-[#D99A2B]">{savedCount} Reports</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#667067] dark:text-[#B9C3BA]">Last Signed In</span>
            <span className="font-bold text-[#183A2B] dark:text-[#F5F2E9]">
              {user.loginAt ? new Date(user.loginAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Today'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-[#F8F5ED] hover:bg-[#F0EBE0] dark:bg-[#101814] dark:hover:bg-[#18251E] text-[#C8663D] border border-[#DDD9CF] dark:border-[#28513A] font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#C8663D]" />
            <span>{language === 'mr' ? 'साइन आउट करा (Sign Out)' : language === 'hi' ? 'साइन आउट करें (Sign Out)' : 'Sign Out of Account'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

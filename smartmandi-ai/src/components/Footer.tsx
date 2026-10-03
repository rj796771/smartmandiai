import React from 'react';
import { Shield } from 'lucide-react';
import { AgriPlusLogo } from './AgriPlusLogo';
import { Language } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, language }) => {
  return (
    <footer className="mt-16 bg-[#FFFDF8] dark:bg-[#101814] border-t border-[#DDD9CF] dark:border-[#28513A] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#DDD9CF] dark:border-[#28513A]/80">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <AgriPlusLogo size="lg" showWordmark={true} showTagline={true} />
            <p className="text-xs text-[#667067] dark:text-[#B9C3BA] leading-relaxed font-medium mt-2">
              Helping farmers and rural entrepreneurs in Maharashtra sell crops smarter by calculating maximum net profit.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] uppercase tracking-wider mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-[#667067] dark:text-[#B9C3BA] font-medium">
              <li>
                <button onClick={() => setActiveTab('recommendation')} className="hover:text-[#183A2B] dark:hover:text-[#D99A2B] transition-colors">
                  AI Recommendation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('prices')} className="hover:text-[#183A2B] dark:hover:text-[#D99A2B] transition-colors">
                  Live AgmarkNet Mandi Prices
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('buyers')} className="hover:text-[#183A2B] dark:hover:text-[#D99A2B] transition-colors">
                  Verified APMC Buyers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calculator')} className="hover:text-[#183A2B] dark:hover:text-[#D99A2B] transition-colors">
                  Net Profit Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Commodities */}
          <div>
            <h4 className="text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] uppercase tracking-wider mb-3">
              Top Commodities
            </h4>
            <ul className="space-y-2 text-xs text-[#667067] dark:text-[#B9C3BA] font-medium">
              <li>Onion (कांदा / प्याज)</li>
              <li>Tomato (टोमॅटो / टमाटर)</li>
              <li>Soybean (सोयाबीन)</li>
              <li>Cotton (कापूस / कपास)</li>
              <li>Grapes & Pomegranate (द्राक्षे / डाळिंब)</li>
            </ul>
          </div>

          {/* Transparency & Data Notice */}
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-[#F8F5ED] dark:bg-[#1E2D25] border border-[#DDD9CF] dark:border-[#28513A] text-xs text-[#667067] dark:text-[#B9C3BA]">
              <span className="font-bold block text-[#183A2B] dark:text-[#F5F2E9] flex items-center space-x-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-[#D99A2B]" />
                <span>Data Transparency</span>
              </span>
              <span className="leading-relaxed">All prices are synced with official AgmarkNet feeds and APMC market yard arrival registers across Maharashtra.</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667067] dark:text-[#B9C3BA] gap-4">
          <p>© {new Date().getFullYear()} AgriPlus AI. Built for Farmers in Maharashtra & India.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('about')} className="hover:underline font-semibold text-[#183A2B] dark:text-[#F5F2E9]">About & Contact</button>
            <span>•</span>
            <span className="text-[#183A2B] dark:text-[#D99A2B] font-bold">100% Free for Farmers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


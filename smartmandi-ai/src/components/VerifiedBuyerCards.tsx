import React, { useState } from 'react';
import { SAMPLE_BUYERS, POPULAR_CROPS } from '../data/mandisData';
import { Language } from '../types';
import { ShieldCheck, Phone, MessageSquare, Star, Search, MapPin, CheckCircle2 } from 'lucide-react';

interface VerifiedBuyerCardsProps {
  language: Language;
}

export const VerifiedBuyerCards: React.FC<VerifiedBuyerCardsProps> = ({ language }) => {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuyers = SAMPLE_BUYERS.filter(buyer => {
    const matchesCrop = selectedCrop === 'all' || buyer.productsPurchased.some(p => p.toLowerCase().includes(selectedCrop.toLowerCase()));
    const matchesSearch = searchQuery === '' || 
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 sm:p-8 card-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#183A2B] dark:text-[#D99A2B] text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#D99A2B]" />
              <span>APMC & FPC Verified Buyers Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
              {language === 'mr' ? 'विश्वासू व पडताळणी केलेले खरेदीदार' : language === 'hi' ? 'सत्यापित एवं विश्वसनीय खरीददार' : 'Verified Buyers Directory'}
            </h2>
            <p className="text-sm text-[#667067] dark:text-[#B9C3BA] mt-1">
              Connect directly with verified wholesale buyers, exporters, and FPC procurement hubs with 100% payment guarantee.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] bg-[#F8F5ED] dark:bg-[#101814] p-3.5 rounded-2xl border border-[#DDD9CF] dark:border-[#28513A]">
            <CheckCircle2 className="w-5 h-5 text-[#D99A2B]" />
            <span>Zero Brokerage • Spot Cash / UPI Payment</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-6 border-t border-[#DDD9CF] dark:border-[#28513A]/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#667067] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyer name, company, or district..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#202522] dark:text-[#F5F2E9] text-sm focus:outline-none focus:ring-2 focus:ring-[#D99A2B]"
            />
          </div>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#DDD9CF] dark:border-[#28513A] bg-[#F8F5ED] dark:bg-[#101814] text-[#202522] dark:text-[#F5F2E9] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D99A2B] cursor-pointer"
          >
            <option value="all">All Commodities</option>
            {POPULAR_CROPS.map(c => (
              <option key={c.id} value={c.name}>{c.name} ({c.nameMr})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuyers.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-[#FFFDF8] dark:bg-[#1E2D25] rounded-[2rem] border border-[#DDD9CF] dark:border-[#28513A]/80 p-6 card-shadow hover:border-[#D99A2B]/60 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#183A2B] dark:text-[#D99A2B] bg-[#F8F5ED] dark:bg-[#101814] px-2.5 py-0.5 rounded-full mb-2 border border-[#DDD9CF] dark:border-[#28513A]">
                    <ShieldCheck className="w-3 h-3 text-[#D99A2B]" />
                    <span>Verified APMC Licensee</span>
                  </span>
                  <h3 className="text-lg font-bold text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope',sans-serif]">
                    {buyer.name}
                  </h3>
                  <p className="text-xs text-[#667067] dark:text-[#B9C3BA] font-medium">
                    {buyer.businessName}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm font-extrabold text-[#D99A2B] justify-end">
                    <Star className="w-4 h-4 fill-[#D99A2B]" />
                    <span>{buyer.rating}</span>
                  </div>
                  <span className="text-[10px] text-[#667067] block mt-0.5">
                    {buyer.completedDealsCount}+ Deals Done
                  </span>
                </div>
              </div>

              {/* Location & Trust */}
              <div className="mt-4 pt-3 border-t border-[#DDD9CF] dark:border-[#28513A]/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#202522] dark:text-[#F5F2E9]">
                  <span className="flex items-center space-x-1 text-[#667067]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{buyer.district}, {buyer.state}</span>
                  </span>
                  <span className="font-extrabold text-[#183A2B] dark:text-[#D99A2B]">
                    {buyer.trustScore}/100 Trust
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] text-[#202522] dark:text-[#F5F2E9] font-medium border border-[#DDD9CF]/60 dark:border-[#28513A]/60">
                  <span className="text-[10px] text-[#667067] uppercase tracking-wider block font-bold">Payment Guarantee</span>
                  <span>{buyer.paymentTerms}</span>
                </div>

                {/* Purchased crops pills */}
                <div>
                  <span className="text-[10px] text-[#667067] uppercase tracking-wider block font-bold mb-1">Products Buying</span>
                  <div className="flex flex-wrap gap-1">
                    {buyer.productsPurchased.map((prod, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F8F5ED] dark:bg-[#101814] text-[#183A2B] dark:text-[#D99A2B] border border-[#DDD9CF] dark:border-[#28513A] font-semibold">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              <a
                href={`tel:${buyer.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-[#F8F5ED] dark:bg-[#101814] hover:bg-[#F0EBE0] dark:hover:bg-[#28513A]/40 text-xs font-bold text-[#183A2B] dark:text-[#F5F2E9] flex items-center justify-center space-x-1.5 transition-colors border border-[#DDD9CF] dark:border-[#28513A]"
              >
                <Phone className="w-3.5 h-3.5 text-[#D99A2B]" />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${buyer.whatsapp}?text=${encodeURIComponent(`Namaste ${buyer.name}, I found your contact on AgriPlus AI. I have produce ready for sale.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#183A2B] hover:bg-[#10271D] text-[#FFFDF8] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D99A2B]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

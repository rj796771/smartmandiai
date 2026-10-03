import React from 'react';
import { RecommendationResult, RecommendationInput, Language } from '../types';
import { formatDateByLanguage } from '../utils/dateUtils';
import { X, Printer, CheckCircle2, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { AgriPlusLogoIcon } from './AgriPlusLogo';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RecommendationResult;
  input: RecommendationInput;
  language: Language;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  result,
  input,
  language
}) => {
  if (!isOpen) return null;

  const { recommendedMandi, sellingScore, sellAdvice, breakdown, recommendedBuyers, calculatedAt, aiReasoningText } = result;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-gray-900 w-full max-w-3xl rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Top Actions (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            PDF Export Preview
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md hover:bg-[#1D4ED8] transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT SHEET CONTENT */}
        <div className="pt-6 space-y-6 print-card">
          
          {/* Official Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-[#2563EB] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center p-2">
                <AgriPlusLogoIcon className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 font-['Poppins']">
                  AgriPlus <span className="text-[#2563EB]">AI</span>
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  Official Decision Support & Net Profit Report • Smarter Markets. Better Decisions.
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500">
              <p className="font-bold text-gray-900">Report Ref: #AP-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p>Generated: {formatDateByLanguage(calculatedAt || new Date(), language, { includeTime: true })}</p>
            </div>
          </div>

          {/* Farmer Input Summary */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block font-medium">Crop Produce</span>
              <span className="font-bold text-gray-900 text-sm">{input.cropName}</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Quantity</span>
              <span className="font-bold text-gray-900 text-sm">{input.quantityQuintals} Quintals ({(input.quantityQuintals/10).toFixed(1)} T)</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Farmer Origin</span>
              <span className="font-bold text-gray-900 text-sm">{input.farmerDistrict}, MH</span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">Transport Mode</span>
              <span className="font-bold text-gray-900 text-sm">{input.vehicleType}</span>
            </div>
          </div>

          {/* Recommended Mandi Header Box */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-[#2E7D32] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-[#2E7D32] uppercase tracking-wider block">
                #1 Recommended Market Destination
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 font-['Poppins']">
                {recommendedMandi.name} ({recommendedMandi.district})
              </h2>
              <p className="text-xs text-emerald-800 font-medium mt-0.5">
                Distance: {recommendedMandi.distanceKm} km • AgmarkNet Verified Price: ₹{recommendedMandi.pricePerQuintal}/quintal
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 block">Smart Score</span>
              <span className="text-3xl font-black text-[#2E7D32]">{sellingScore}/100</span>
            </div>
          </div>

          {/* Net Profit Ledger */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              Financial Breakdown & Net Profit Ledger
            </h3>
            <table className="w-full text-xs text-left border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 font-bold text-gray-700">
                <tr>
                  <th className="p-2.5">Line Item Description</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2.5 font-medium">Gross Revenue ({input.quantityQuintals} q × ₹{recommendedMandi.pricePerQuintal})</td>
                  <td className="p-2.5 text-right font-bold text-gray-900">₹{breakdown.grossRevenue.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="text-amber-700">
                  <td className="p-2.5">(−) Transport Freight Fee ({recommendedMandi.distanceKm} km)</td>
                  <td className="p-2.5 text-right font-bold">− ₹{breakdown.transportCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="text-gray-600">
                  <td className="p-2.5">(−) APMC Mandi Commission ({recommendedMandi.commissionPercent}%)</td>
                  <td className="p-2.5 text-right font-bold">− ₹{breakdown.mandiCommission.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-emerald-50 text-base font-extrabold text-[#2E7D32]">
                  <td className="p-3">FINAL ESTIMATED NET PROFIT CASH IN HAND</td>
                  <td className="p-3 text-right">₹{breakdown.netProfit.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Justification */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-900 block mb-1">AI Recommendation Summary:</span>
            <p className="text-gray-700 leading-relaxed">{aiReasoningText}</p>
          </div>

          {/* Verified Buyers Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              Recommended APMC Verified Buyers
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {recommendedBuyers.slice(0, 2).map((buyer) => (
                <div key={buyer.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                  <span className="font-bold text-gray-900 block">{buyer.name}</span>
                  <span className="text-gray-500 block text-[11px]">{buyer.businessName}</span>
                  <span className="text-[#2E7D32] font-semibold block mt-1">Phone: {buyer.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex justify-between items-center">
            <span>Generated via AgriPlus AI • Official AgmarkNet Data Integration</span>
            <span>Page 1 of 1</span>
          </div>

        </div>

      </div>
    </div>
  );
};

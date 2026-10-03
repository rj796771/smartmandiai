import React from 'react';

interface PricePoint {
  date: string;
  price: number;
  projected?: boolean;
}

interface PriceChartProps {
  data: PricePoint[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const prices = data.map(d => d.price);
  const maxPrice = Math.max(...prices, 100);
  const minPrice = Math.min(...prices, 0);
  const range = maxPrice - minPrice || 1;

  return (
    <div className="bg-gray-50 dark:bg-slate-900/80 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 p-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
        <span>Historical & Projected Price Trend (₹/quintal)</span>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <span>Actual AgmarkNet</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>AI Projected</span>
          </span>
        </div>
      </div>

      <div className="h-40 flex items-end justify-between space-x-1.5 sm:space-x-3 pt-6 pb-2 px-1">
        {data.map((item, idx) => {
          const heightPercent = Math.max(15, Math.min(100, ((item.price - minPrice + (range * 0.2)) / (range * 1.3)) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap z-20 pointer-events-none">
                ₹{item.price}
              </div>

              {/* Price text over bar */}
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                ₹{item.price}
              </span>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg transition-all ${
                  item.projected
                    ? 'bg-gradient-to-t from-amber-500/80 to-amber-400 border-t-2 border-dashed border-amber-300'
                    : 'bg-gradient-to-t from-[#2563EB] to-blue-500'
                }`}
              />

              {/* Date label */}
              <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                {item.date.replace(' (Forecast)', '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

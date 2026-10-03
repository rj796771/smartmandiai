import React from 'react';

interface BentoGridSkeletonProps {
  className?: string;
  title?: string;
}

export const BentoGridSkeleton: React.FC<BentoGridSkeletonProps> = ({
  title = "Analyzing AgmarkNet Feed & Distance Matrices..."
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner Notice Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-6 rounded-2xl bg-white dark:bg-slate-800 card-shadow border border-slate-200/80 dark:border-slate-700/80 gap-3">
        <div className="flex items-center space-x-3 text-xs font-bold w-full sm:w-auto">
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 animate-pulse flex-shrink-0" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-64 animate-pulse" />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="h-8 bg-slate-100 dark:bg-slate-700/60 rounded-xl w-24 animate-pulse" />
          <div className="h-8 bg-blue-100 dark:bg-blue-900/50 rounded-xl w-28 animate-pulse" />
        </div>
      </div>

      {/* Main 12-Column Bento Grid Layout Mirror */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bento Tile 1: Hero Top Recommendation Tile (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 card-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-6 relative overflow-hidden">
          
          {/* Shimmer sweep effect overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/40 dark:via-slate-700/20 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-3 w-full sm:w-2/3">
              <div className="h-6 bg-emerald-100/80 dark:bg-emerald-950/60 rounded-full w-48 animate-pulse border border-emerald-200/50 dark:border-emerald-800/40" />
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-100 dark:bg-slate-700/60 rounded-lg w-1/2 animate-pulse" />
            </div>

            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 w-full sm:w-auto sm:min-w-[200px] text-right space-y-2">
              <div className="h-3 bg-emerald-200/80 dark:bg-emerald-800/60 rounded w-24 ml-auto animate-pulse" />
              <div className="h-8 bg-emerald-300/80 dark:bg-emerald-700/60 rounded-lg w-32 ml-auto animate-pulse" />
            </div>
          </div>

          {/* 3 Metric Summary Skeleton Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
                <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded-lg w-28 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Why this market wins AI Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 space-y-2">
            <div className="h-4 bg-emerald-200/80 dark:bg-emerald-800/60 rounded w-36 animate-pulse" />
            <div className="h-3 bg-emerald-100 dark:bg-emerald-900/40 rounded w-full animate-pulse" />
            <div className="h-3 bg-emerald-100 dark:bg-emerald-900/40 rounded w-4/5 animate-pulse" />
          </div>
        </div>

        {/* Bento Tile 2: Score Radial Meter Card (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 card-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          
          <div className="w-36 h-36 rounded-full border-8 border-slate-100 dark:border-slate-700 border-t-emerald-500 animate-spin flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700/60 animate-pulse" />
          </div>

          <div className="space-y-2 w-full">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4 mx-auto animate-pulse" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded-lg w-5/6 mx-auto animate-pulse" />
          </div>

          <div className="mt-4 w-full pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
              <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded w-10 animate-pulse" />
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500/60 h-full w-2/3 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Timeline Strategy Card (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-slate-900 dark:bg-[#0B0F19] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between space-y-4 border border-slate-800">
          <div className="space-y-3">
            <div className="h-3 bg-emerald-500/40 rounded w-28 animate-pulse" />
            <div className="h-7 bg-slate-800 rounded-xl w-48 animate-pulse" />
          </div>

          <div className="space-y-3 my-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-pulse flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-700 rounded w-24 animate-pulse" />
                  <div className="h-2 bg-slate-800 rounded w-36 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-10 bg-emerald-950/80 border border-emerald-800/60 rounded-xl w-full animate-pulse" />
        </div>

        {/* Bento Tile 4: Verified Buyer Card (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 card-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
              <div className="h-5 bg-emerald-100 dark:bg-emerald-950/80 rounded-full w-20 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 animate-pulse flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-24 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-20 animate-pulse" />
                <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded w-16 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-24 animate-pulse" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="flex-1 h-10 bg-emerald-500/80 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Bento Tile 5: Weather Transit Risk Advisory (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 card-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="h-3 bg-amber-200 dark:bg-amber-900/60 rounded w-28 animate-pulse" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-xl w-48 animate-pulse" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-full animate-pulse" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-4/5 animate-pulse" />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1.5">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-10 mx-auto animate-pulse" />
                <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-12 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Financial Transparency Ledger Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 card-shadow p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-xl w-72 animate-pulse" />
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/60">
              <div className="h-4 bg-slate-100 dark:bg-slate-700/60 rounded w-48 animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Movement Chart Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 card-shadow p-6 sm:p-8 space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-xl w-64 animate-pulse" />
        
        <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 h-56 flex items-end justify-between gap-4">
          {[40, 65, 80, 95, 70].map((h, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-10 animate-pulse" />
              <div 
                className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-t-lg animate-pulse transition-all"
                style={{ height: `${h}%` }}
              />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-14 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Status Indicator Footer */}
      <div className="text-center py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        <span>{title}</span>
      </div>

    </div>
  );
};

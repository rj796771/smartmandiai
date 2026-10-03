import React from 'react';

interface AgriPlusLogoProps {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  variant?: 'full' | 'header' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AgriPlusLogoIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Deep Forest Ring/Swoosh */}
      <path 
        d="M 160 110 C 165 155, 125 185, 75 180 C 25 175, 5 125, 20 75 C 32 35, 75 10, 115 15 C 135 17, 150 25, 160 38" 
        stroke="#183A2B" 
        strokeWidth="14" 
        strokeLinecap="round" 
      />
      {/* Data/Circuit Lines in Forest Green & Harvest Gold */}
      <path d="M 35 110 L 60 110 L 80 85" stroke="#28513A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="35" cy="110" r="6" fill="#D99A2B" />
      <path d="M 45 80 L 65 80 L 85 55" stroke="#28513A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="45" cy="80" r="6" fill="#28513A" />
      <path d="M 60 55 L 75 55 L 90 35" stroke="#28513A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="60" cy="55" r="6" fill="#28513A" />

      {/* Bar Graph Columns */}
      <rect x="95" y="115" width="14" height="40" rx="4" fill="#28513A" />
      <rect x="117" y="95" width="14" height="60" rx="4" fill="#183A2B" />
      <rect x="139" y="75" width="14" height="80" rx="4" fill="#D99A2B" />

      {/* Growth Trend Line */}
      <path d="M 90 100 L 115 80 L 150 50" stroke="#183A2B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="115" cy="80" r="5" fill="#183A2B" />
      <circle cx="150" cy="50" r="6" fill="#D99A2B" />

      {/* Sweeping Natural Leaf in Forest & Gold Accent */}
      <path 
        d="M 55 160 C 90 165, 145 155, 165 115 C 160 145, 125 175, 70 170 C 60 169, 50 165, 55 160 Z" 
        fill="#28513A" 
      />
      <path 
        d="M 65 162 C 105 130, 145 105, 175 95 C 130 110, 85 138, 65 162 Z" 
        fill="#183A2B" 
      />
      <path d="M 75 155 C 110 135, 140 115, 160 102" stroke="#D99A2B" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
};

export const AgriPlusLogo: React.FC<AgriPlusLogoProps> = ({
  className = "",
  showWordmark = true,
  showTagline = false,
  variant = 'header',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16'
  };

  return (
    <div className={`flex items-center space-x-2.5 group cursor-pointer ${className}`}>
      <AgriPlusLogoIcon className={`${sizeClasses[size]} w-auto flex-shrink-0 transition-transform duration-300 group-hover:scale-105`} />
      
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#183A2B] dark:text-[#F5F2E9] font-['Manrope','Poppins',sans-serif]">
              Agri<span className="text-[#D99A2B]">Plus</span>
            </span>
            <span className="bg-[#183A2B] dark:bg-[#28513A] text-[#D99A2B] text-[10px] sm:text-xs font-black tracking-wider px-1.5 py-0.5 rounded-md uppercase border border-[#D99A2B]/40 shadow-sm">
              AI
            </span>
          </div>
          {showTagline && (
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#667067] dark:text-[#B9C3BA] uppercase mt-1">
              Smarter Markets. Better Decisions. Higher Returns.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

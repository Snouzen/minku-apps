import React from 'react';

interface SlideFooterBrandWaveProps {
  className?: string;
  slogan?: string;
}

export default function SlideFooterBrandWave({
  className = "",
  slogan = "Passion In Every Grain",
}: SlideFooterBrandWaveProps) {
  return (
    <div className={`absolute -bottom-3 -right-10 w-[490px] h-[74px] pointer-events-none z-10 select-none ${className}`}>
      <svg viewBox="0 0 490 74" className="w-full h-full" preserveAspectRatio="none">
        {/* Lighter blue accent wave outline */}
        <path d="M 0,74 C 85,20 200,0 490,0 L 490,74 Z" fill="#6ba4d9" opacity="0.65" />
        {/* Main brand blue swoosh wave */}
        <path d="M 20,74 C 102,26 215,8 490,8 L 490,74 Z" fill="#1b4d89" />
      </svg>
      {slogan && (
        <div className="absolute bottom-3.5 right-14 text-white font-bold italic tracking-wide text-[21px] drop-shadow-sm font-sans whitespace-nowrap">
          {slogan}
        </div>
      )}
    </div>
  );
}

import React from "react";

interface BkpsdmLogoProps {
  variant?: "colored" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BkpsdmLogo({
  variant = "colored",
  size = "md",
  className = "",
}: BkpsdmLogoProps) {
  // Determine dimensions
  const dimensions = {
    sm: { textBk: "text-lg", textDairi: "text-[9px]", padY: "py-0.5" },
    md: { textBk: "text-2xl", textDairi: "text-xs", padY: "py-1" },
    lg: { textBk: "text-5xl", textDairi: "text-lg", padY: "py-2" },
  };

  const currentDim = dimensions[size];

  // Pick colors based on variant
  const isLight = variant === "light";
  
  const textColorBk = isLight ? "text-cyan-300" : "text-[#0089a3]"; // teal for "bk"
  const textColorPsdm = isLight ? "text-white" : "text-[#2e3131]"; // dark gray/white for "psdm"
  const textColorDairi = isLight ? "logo-dairi-text-light" : "logo-dairi-text-colored"; // custom classes to override aggressive .font-display

  return (
    <div className={`inline-flex items-center ${className} select-none`} id="bkpsdm-logo-container">
      {/* Text and Accent lines */}
      <div className="flex flex-col justify-center leading-none relative">
        {/* Top-Right Decorative Corner Bracket above bkpsdm */}
        {size === "lg" && (
          <div className="absolute top-[-5px] right-[-15px] w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr" />
        )}
        {size === "md" && (
          <div className="absolute top-[-2px] right-[-8px] w-3 h-3 border-t-[2.5px] border-r-[2.5px] border-orange-500 rounded-tr" />
        )}
        {size === "sm" && (
          <div className="absolute top-[-1px] right-[-4px] w-2 h-2 border-t-[1.8px] border-r-[1.8px] border-orange-500 rounded-tr" />
        )}

        {/* letters "bkpsdm" */}
        <div className={`font-black tracking-tight ${currentDim.textBk} font-sans flex items-baseline`} style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.1)" }}>
          <span className={textColorBk}>bk</span>
          <span className={textColorPsdm}>psdm</span>
        </div>

        {/* Horizontal Orange Separator */}
        <div className={`w-full h-[3px] bg-orange-500 ${currentDim.padY === "py-2" ? "my-1" : "my-0.5"} rounded`} />

        {/* Subtitle "Kabupaten Dairi" */}
        <div className={`${currentDim.textDairi} font-extrabold tracking-wide font-display ${textColorDairi}`}>
          Kabupaten Dairi
        </div>
      </div>
    </div>
  );
}

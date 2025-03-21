import React from "react";
import { MusicIcon } from "lucide-react";

interface EnergyStarsProps {
  totalStars: number;
  activeStars: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EnergyStars: React.FC<EnergyStarsProps> = ({
  totalStars = 5,
  activeStars,
  className,
  size = "md",
}) => {
  // Determine star size based on the size prop
  const starSizeClass = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      {Array.from({ length: totalStars }).map((_, index) => (
        <div key={index} className="relative flex items-center justify-center">
          <div className={`relative ${starSizeClass} rounded-full border border-solid border-white flex items-center justify-center`}>
            <MusicIcon
              className={`${
                index < activeStars 
                  ? "text-white filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" 
                  : "text-gray-600 opacity-60"
              } ${size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

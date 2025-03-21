import { LockIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "./card";
import { Progress } from "./progress";

// Types for character variations
interface CharacterVariation {
  id: number;
  unlocked: boolean;
  image?: string;
  label?: string;
}

// Types for special items
interface SpecialItem {
  id: number;
  unlocked: boolean;
  image?: string;
}

// Props interface for the CharacterPanel component
export interface CharacterPanelProps {
  name: string;
  level: number;
  currentExp: number;
  maxExp: number;
  variations: CharacterVariation[];
  specialItems: SpecialItem[];
  className?: string;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  name,
  level,
  currentExp,
  maxExp,
  variations,
  specialItems,
  className,
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentExp / maxExp) * 100;

  return (
    <Card className={`flex flex-col w-[172px] h-[393px] items-center gap-0.5 rounded-[14px] overflow-hidden backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)] border-none bg-transparent ${className || ""}`}>
      <CardContent className="p-0 w-full flex flex-col items-center gap-0.5">
        {/* Character name */}
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Good_Times-BoldItalic',Helvetica] font-bold italic text-white text-sm tracking-[0] leading-[normal]">
          {name}
        </div>

        {/* Level info */}
        <div className="flex items-end justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-[157px] mt-[-1.00px] [font-family:'Good_Times-Light',Helvetica] font-light text-white text-xs tracking-[0] leading-[normal]">
            level {level}
          </div>

          <div className="w-[157px] ml-[-142px] [font-family:'Good_Times-Light',Helvetica] font-light text-[7px] text-right relative text-white tracking-[0] leading-[normal]">
            {currentExp}/{maxExp}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex h-[5px] items-center gap-2.5 relative self-stretch w-full bg-[#00000099] rounded-[90px] overflow-hidden border border-solid border-white">
          <Progress
            value={progressPercentage}
            className="h-full rounded-[90px] [background:linear-gradient(90deg,rgba(103,1,255,1)_0%,rgba(75,117,209,1)_50%,rgba(176,192,255,1)_100%)]"
          />
        </div>

        {/* Character variations grid */}
        <div className="flex flex-col items-center justify-center gap-0.5 relative self-stretch w-full flex-[0_0_auto]">
          {/* First row - Character variations */}
          <div className="inline-flex items-start justify-center gap-[7px] relative flex-[0_0_auto]">
            {variations.map((variation) => (
              <div
                key={variation.id}
                className="relative w-7 h-7 rounded-lg border border-solid border-white overflow-hidden"
                style={
                  variation.unlocked && variation.image
                    ? {
                        backgroundImage: `url(${variation.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50% 50%",
                      }
                    : { backgroundColor: "#00000080" }
                }
              >
                {variation.unlocked ? (
                  variation.label && (
                    <div className="absolute h-[17px] top-[5px] left-[7px] [font-family:'Good_Times-BoldItalic',Helvetica] italic font-bold text-white text-sm tracking-[0] leading-[normal]">
                      {variation.label}
                    </div>
                  )
                ) : (
                  <LockIcon className="absolute w-[17px] h-[17px] top-1 left-[5px] text-white" />
                )}
              </div>
            ))}
          </div>

          {/* Second row - Special items */}
          <div className="inline-flex items-start justify-center gap-[7px] relative flex-[0_0_auto]">
            {specialItems.map((item) => (
              <div
                key={item.id}
                className="relative w-7 h-7 rounded-lg border border-solid border-white overflow-hidden bg-[#00000080] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]"
              >
                {item.unlocked ? (
                  item.image && (
                    <img
                      className={`absolute ${item.id === 9 ? "w-[17px] h-[27px] top-0 left-1.5" : "w-4 h-[26px] top-px left-1.5"} object-cover`}
                      alt="Item image"
                      src={item.image}
                    />
                  )
                ) : (
                  <LockIcon className="absolute w-[17px] h-[17px] top-1 left-[5px] text-white" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

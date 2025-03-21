import { PointsDisplay } from "./points-display";
import { cn } from "../../lib/utils";

interface QuestCardProps {
  title: string;
  subtitle: string;
  completed: string;
  bgColor: string;
  isCompleted: boolean;
  backgroundImage: string;
  index: number;
  className?: string;
}

export function QuestCard({
  title,
  subtitle,
  completed,
  bgColor,
  isCompleted,
  backgroundImage,
  index,
  className,
}: QuestCardProps) {
  // Determine background color values based on the bgColor
  const bgColorValues = bgColor === "bg-[#0071c1]" 
    ? { rgba: "0,113,193", rgb: "rgb(0,113,193)" } 
    : { rgba: "0,175,81", rgb: "rgb(0,175,81)" };

  // Background color for the progress bar (same as the card color)
  const progressBarBgColor = bgColor === "bg-[#0071c1]" ? "bg-[#0071c1]" : "bg-[#007536]";
  
  // Always use green for the progress bar
  const progressBarColor = "bg-[#00af51]";
  
  // If completed, show the green version
  const cardBgColor = isCompleted ? "bg-[#00af51]" : bgColor;
  
  // Parse the completion text to get the progress percentage
  const progressRegex = /(\d+)\/(\d+)/;
  const match = completed.match(progressRegex);
  let progressPercentage = 100; // Default to 100% if format doesn't match
  
  if (match && match.length === 3) {
    const [, current, total] = match;
    progressPercentage = Math.min(100, Math.max(0, (parseInt(current) / parseInt(total)) * 100));
  }
  
  return (
    <div
      className={cn(
        "flex flex-col min-w-[289px] h-[90px] items-start justify-center relative self-stretch w-full",
        className
      )}
    >
      <div className="flex h-[65px] items-center relative self-stretch w-full">
        {/* Left side with title and subtitle */}
        <div
          className={`flex flex-col h-[65px] items-start gap-[15px] px-0 py-[7px] relative flex-1 grow ${cardBgColor} rounded-[14px_0px_0px_0px] overflow-hidden`}
        >
          <div className="inline-flex flex-col items-start gap-0.5 px-3 py-0 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              {title}
            </div>
            <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Right side with background image and points */}
        <div
          className={`flex flex-col min-w-[150px] h-[65px] items-end relative flex-1 grow rounded-[0px_14px_0px_0px] overflow-hidden [background:linear-gradient(180deg,rgba(${bgColorValues.rgba},0)_0%,${bgColorValues.rgb}100%)] ${backgroundImage} bg-cover bg-[50%_50%]`}
        >
          <div className="inline-flex items-start justify-end relative overflow-hidden">
            <PointsDisplay
              points="100"
              frameStyle="rounded-bl"
            />
          </div>
        </div>
      </div>

      {/* Progress bar at the bottom */}
      <div className="relative self-stretch w-full">
        {/* Background progress bar (same as the card color) */}
        <div className={`absolute inset-0 ${progressBarBgColor} rounded-[0px_0px_14px_14px]`}></div>
        
        {/* Foreground progress bar (lighter green) */}
        <div 
          className={`absolute top-0 bottom-0 left-0 ${progressBarColor} rounded-[0px_0px_14px_14px]`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {/* Text container (preserving exact styling from original) */}
        <div className={`flex items-center justify-center gap-2.5 px-[13px] py-0 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_14px_14px] overflow-hidden`} style={{ zIndex: 1 }}>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[9px] tracking-[0] leading-[normal]">
            {completed}
          </div>
        </div>
      </div>

      {/* Completed overlay */}
      {isCompleted && (
        <img
          className="absolute w-[52px] h-[43px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          alt="Quest clear check"
          src="https://c.animaapp.com/sVl5C9mT/img/quest-clear-check.svg"
        />
      )}
    </div>
  );
}

import { cn } from "../../lib/utils";

interface PointsDisplayProps {
  points: string | number;
  className?: string;
  iconSrc?: string;
  frameStyle?: "default" | "rounded-bl" | "rounded";
}

export function PointsDisplay({
  points,
  className,
  iconSrc = "https://c.animaapp.com/RpQYClm9/img/coins-1.svg",
  frameStyle = "default"
}: PointsDisplayProps) {
  // Determine frame styling based on the frameStyle prop
  const frameStyleClasses = {
    "default": "rounded-lg",
    "rounded-bl": "rounded-bl-lg",
    "rounded": "rounded-lg"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-[9px] px-[5px] py-0 bg-[#ffffffb2] relative flex-[0_0_auto]",
        frameStyleClasses[frameStyle],
        className
      )}
    >
      <img className="w-3.5 h-3.5" alt="Coins" src={iconSrc} />
      <div className="mt-[-1.00px] text-black text-[15px] whitespace-nowrap w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold tracking-[0] leading-normal">
        {points}
      </div>
    </div>
  );
}

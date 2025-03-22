import React from "react";
import { Progress } from "./progress";

interface QuestCardNewProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  image: string;
  index: number;
  className?: string;
  onNavigate?: (path: string) => void; // ナビゲーション関数をプロパティとして受け取る
}

export const QuestCardNew: React.FC<QuestCardNewProps> = ({
  title,
  description,
  progress,
  total,
  reward,
  completed,
  image,
  index,
  className,
  onNavigate,
}) => {
  // Calculate progress percentage
  const progressPercentage = (progress / total) * 100;
  
  const handleClick = () => {
    if (onNavigate) {
      onNavigate('/home');
    }
  };
  
  return (
    <div 
      className={`flex flex-wrap h-[75px] items-end justify-center gap-[0px_6px] relative self-stretch w-full ${completed ? "bg-[#00af51]" : "bg-[#0071c1]"} rounded-[14px] overflow-hidden border-0 ${className || ""} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="p-0 w-full h-full relative">
        {/* Title and Description */}
        <div className="inline-flex items-start gap-0.5 px-3 py-[3px] left-0 flex-col absolute top-0">
          <div className="w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-normal whitespace-nowrap">
            {title}
          </div>
          <div className="w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-normal whitespace-nowrap">
            {description}
          </div>
        </div>

        {/* Right Image with Reward */}
        <div
          className="flex w-[158px] h-[75px] items-end right-0 rounded-[0px_14px_0px_0px] overflow-hidden bg-cover bg-[50%_50%] flex-col absolute top-0"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="inline-flex h-[17px] items-start justify-end relative overflow-hidden">
            <div className="inline-flex items-center justify-center gap-[9px] px-[5px] py-0 relative flex-[0_0_auto] mb-[-1.00px] bg-[#ffffffb2] rounded-[0px_0px_0px_9px]">
              <img
                className="w-3.5 h-3.5"
                alt="Coins"
                src={`https://c.animaapp.com/15WuGcx7/img/coins-${index + 1 === 3 ? 4 : index + 2}.svg`}
              />
              <div className="mt-[-1.00px] text-black text-[15px] whitespace-nowrap w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold tracking-[0] leading-normal">
                {reward}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2.5 absolute bottom-0 left-0 w-full">
          <Progress
            value={progressPercentage}
            className={`h-[11px] w-full bg-transparent`}
            indicatorClassName="bg-[#00af51]"
          />
        </div>

        {/* Completion Text */}
        <div className="absolute h-[11px] top-16 left-0 right-0 text-center [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[9px] tracking-[0] leading-normal">
          {progress}/{total} completed
        </div>

        {/* Completed Check Mark */}
        {completed && (
          <img
            className="absolute w-[52px] h-[43px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            alt="Quest clear check"
            src="https://c.animaapp.com/15WuGcx7/img/quest-clear-check.svg"
          />
        )}
      </div>
    </div>
  );
};

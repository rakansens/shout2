import React from "react";
import { CoinsIcon } from "lucide-react";

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  className,
}) => {
  return (
    <div className={`w-60 gap-1.5 overflow-hidden flex items-center ${className || ""}`}>
      <div className="inline-flex items-center justify-center gap-[9px] px-[5px] py-0 relative flex-[0_0_auto] bg-[#ffffffb2] rounded-[0px_0px_9px_0px]">
        <CoinsIcon className="w-[19px] h-[19px] text-black" />
        <div className="mt-[-1.00px] text-black text-2xl relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold tracking-[0] leading-[normal]">
          {price}
        </div>
      </div>
    </div>
  );
};

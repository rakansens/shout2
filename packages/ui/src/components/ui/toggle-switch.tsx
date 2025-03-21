import * as React from "react";
import { Card, CardContent } from "./card";

interface ToggleSwitchProps {
  id: string;
  label?: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  showLabel?: boolean;
  gradientColors?: {
    start: string;
    middle: string;
    end: string;
  };
}

export const ToggleSwitch = ({
  id,
  label,
  value,
  onChange,
  className = "",
  showLabel = true,
  gradientColors = {
    start: "rgb(102.88,1.47,255)",
    middle: "rgb(74.96,117.37,208.87)",
    end: "rgb(176.09,191.87,255)"
  }
}: ToggleSwitchProps): JSX.Element => {
  const [isOn, setIsOn] = React.useState<boolean>(value);
  
  // Update internal value when prop changes
  React.useEffect(() => {
    setIsOn(value);
  }, [value]);
  
  // Generate gradient background
  const gradientBackground = `linear-gradient(180deg, ${gradientColors.start} 0%, ${gradientColors.middle} 49.5%, ${gradientColors.end} 100%)`;
  
  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-2.5 relative ${className}`}>
      {showLabel && label && (
        <label
          htmlFor={id}
          className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-[normal] whitespace-nowrap select-none"
        >
          {label}
        </label>
      )}

      <div className="inline-flex items-start gap-1 px-[19px] py-0 relative flex-[0_0_auto]">
        <Card 
          className="flex w-[149px] items-center justify-center gap-2.5 py-1.5 px-0 relative bg-[#00000099] rounded-[90px] overflow-hidden border border-solid border-white cursor-pointer select-none"
          onClick={handleToggle}
        >
          <div 
            className="absolute w-[79px] h-9 top-0 rounded-[90px] transition-all duration-300 ease-in-out" 
            style={{ 
              left: isOn ? "70px" : "0px",
              background: gradientBackground
            }} 
          />

          <CardContent className="p-0 w-full flex justify-center z-10 pointer-events-none">
            <div className="relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap select-none">
              {isOn ? "on" : "off"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

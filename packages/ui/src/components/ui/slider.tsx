import * as React from "react";
import { Card, CardContent } from "./card";

interface SliderProps {
  id: string;
  label?: string;
  value: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange?: (value: number | string) => void;
  className?: string;
  showLabel?: boolean;
  readOnly?: boolean;
  gradientColors?: {
    start: string;
    middle: string;
    end: string;
  };
}

export const Slider = ({
  id,
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
  className = "",
  showLabel = true,
  readOnly = false,
  gradientColors = {
    start: "rgb(102.88,1.47,255)",
    middle: "rgb(74.96,117.37,208.87)",
    end: "rgb(176.09,191.87,255)"
  }
}: SliderProps): JSX.Element => {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = React.useState<number | string>(value);
  
  // Update internal value when prop changes
  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  // Calculate percentage for numeric values
  const getPercentage = () => {
    if (typeof currentValue === "number") {
      const range = max - min;
      return ((currentValue - min) / range) * 100;
    }
    return 0;
  };
  
  // Calculate the width of the gradient fill
  const fillWidth = typeof currentValue === "number" ? `${getPercentage()}%` : "0%";
  
  // Handle click/touch to set value
  const handleInteraction = (clientX: number) => {
    if (readOnly || typeof currentValue !== "number" || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, position / rect.width));
    
    // Calculate new value based on min, max, and step
    const range = max - min;
    let newValue = min + percentage * range;
    
    // Apply step if provided
    if (step > 0) {
      newValue = Math.round(newValue / step) * step;
    }
    
    // Ensure value is within bounds
    newValue = Math.max(min, Math.min(max, newValue));
    
    setCurrentValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    handleInteraction(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (readOnly) return;
    handleInteraction(e.touches[0].clientX);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleInteraction(e.touches[0].clientX);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };
  
  // Format the display value
  const displayValue = typeof currentValue === "number" 
    ? `${currentValue}${unit}` 
    : currentValue;
  
  // Generate gradient background
  const gradientBackground = `linear-gradient(180deg, ${gradientColors.start} 0%, ${gradientColors.middle} 49.5%, ${gradientColors.end} 100%)`;
  
  // Prevent default on pointer events to avoid text selection
  const preventDefaultHandler = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`flex flex-col items-start gap-2.5 relative w-full flex-[0_0_auto] ${className}`}>
      {showLabel && label && (
        <label
          htmlFor={id}
          className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-[normal] whitespace-nowrap select-none"
        >
          {label}
        </label>
      )}

      <div className="flex items-start gap-1 px-[19px] py-0 relative w-full flex-[0_0_auto]">
        <Card 
          ref={sliderRef}
          className={`flex items-center justify-center gap-2.5 px-[230px] py-1.5 relative flex-1 grow bg-[#00000099] overflow-hidden border border-solid border-white h-9 rounded-[90px] ${!readOnly ? 'cursor-pointer' : ''} select-none`}
          onMouseDown={!readOnly ? handleMouseDown : undefined}
          onTouchStart={!readOnly ? handleTouchStart : undefined}
          onMouseUp={preventDefaultHandler}
          onMouseMove={preventDefaultHandler}
          onClick={preventDefaultHandler}
        >
          <div 
            className="absolute h-9 top-0 left-0 rounded-[90px]" 
            style={{ 
              width: fillWidth,
              background: gradientBackground
            }} 
          />

          <CardContent className="p-0 z-10 pointer-events-none">
            {!readOnly && (
              <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap select-none">
                {displayValue}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

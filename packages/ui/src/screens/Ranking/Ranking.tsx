import { GlobeIcon, StarIcon } from "lucide-react";
import { WeeklyRankSection } from "./sections/WeeklyRankSection/WeeklyRankSection";
import { useScreenAnimation } from "../../hooks/useScreenAnimation";
import { useScreenEntryExit } from "../../hooks/useScreenEntryExit";
import { useNavigationAnimation } from "../../contexts/NavigationAnimationContext";
import { useEffect } from "react";
import "../../styles/screen-animations.css";

export const Ranking = (): JSX.Element => {
  useScreenAnimation();
  const { isLoaded, isExiting } = useScreenEntryExit();
  const { setIsHeaderHidden, setIsNavigationHidden } = useNavigationAnimation();
  
  // Effect to handle header and navigation visibility on entry
  useEffect(() => {
    if (isLoaded && !isExiting) {
      // Show header and navigation with a slight delay for smooth entry
      const timer = setTimeout(() => {
        setIsHeaderHidden(false);
        setIsNavigationHidden(false);
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoaded, isExiting, setIsHeaderHidden, setIsNavigationHidden]);
  
  // Effect to handle header and navigation visibility on exit
  useEffect(() => {
    if (isExiting) {
      setIsHeaderHidden(true);
      setIsNavigationHidden(true);
    }
  }, [isExiting, setIsHeaderHidden, setIsNavigationHidden]);
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="fixed top-[90px] left-0 right-0 z-40 flex flex-col items-center w-full">
      {/* Fixed icons section */}
      <div className={`flex items-center gap-[23px] w-full justify-center ${isExiting ? 'rankings-icons-animate-exit' : isLoaded ? 'rankings-icons-animate-entry' : 'opacity-0'}`}>
          <StarIcon className="w-[45px] h-[45px] text-white" />
          <GlobeIcon className="w-10 h-10 text-white" />
        </div>

        {/* Weekly text */}
        <div className={`w-full px-4 text-left [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-[normal] whitespace-nowrap ${isExiting ? 'rankings-title-animate-exit' : isLoaded ? 'rankings-title-animate-entry' : 'opacity-0'}`}>
          weekly
        </div>
      </div>

      {/* Fixed container with scrollable content */}
      <div className="fixed top-[170px] bottom-[78px] left-0 right-0 overflow-hidden flex flex-col items-center w-full">
        <div className="w-full h-full overflow-y-auto px-4">
          <div className="flex flex-col items-start gap-2.5 py-2.5 w-full">
            {/* Sections with staggered animations */}
            {Array.from({ length: 14 }).map((_, index) => (
              <div 
                key={index}
                className={`w-full ${isExiting ? 'rankings-section-animate-exit' : isLoaded ? 'rankings-section-animate-entry' : 'opacity-0'}`}
                style={{ 
                  animationDelay: isExiting 
                    ? `${0.1 + (13 - index) * 0.05}s` // Reverse order for exit
                    : `${0.3 + index * 0.05}s` // Staggered delay for entry
                }}
              >
                <WeeklyRankSection />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

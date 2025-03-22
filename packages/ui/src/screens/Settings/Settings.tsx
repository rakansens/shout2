import { Card, CardContent } from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";
import { ToggleSwitch } from "../../components/ui/toggle-switch";
import { useState, useEffect } from "react";
import { useScreenAnimation } from "../../hooks/useScreenAnimation";
import { useScreenEntryExit } from "../../hooks/useScreenEntryExit";
import { useNavigationAnimation } from "../../contexts/NavigationAnimationContext";
import { LanguageSelectionModal } from "../../components/Settings/LanguageSelectionModal";
import { LanguageButton } from "../../components/ui/language-button";
import "../../styles/screen-animations.css";

export const Settings = (): JSX.Element => {
  useScreenAnimation();
  const { isLoaded, isExiting } = useScreenEntryExit();
  const { setIsHeaderHidden, setIsNavigationHidden } = useNavigationAnimation();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

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

  // Define settings data for mapping
  const [sliderValues, setSliderValues] = useState({
    "song-volume": 30,
    "effects-volume": 30,
    "latency-adjust": 100,
    "paddle-adjust": -100,
    "language": "english"
  });

  // Define toggle states
  const [toggleValues, setToggleValues] = useState({
    "vibration": true,
    "notifications": true
  });

  // Define settings data for mapping
  const sliderSettings = [
    { id: "song-volume", label: "song volume", unit: "%" },
    { id: "effects-volume", label: "effects volume", unit: "%" },
    { id: "latency-adjust", label: "latency adjust", unit: "ms" },
    { id: "paddle-adjust", label: "paddle adjust", unit: "" },
  ];

  const toggleSettings = [
    { id: "vibration", label: "vibration" },
    { id: "notifications", label: "notifications" },
  ];

  const handleSliderChange = (id: string, value: number | string) => {
    setSliderValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleToggleChange = (id: string, value: boolean) => {
    setToggleValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLanguageSelect = (language: string) => {
    handleSliderChange("language", language);
  };

  return (
    <div className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full grow mb-20 mt-10">
      <div className="flex flex-col items-start gap-[13px] px-4 py-[18px] relative self-stretch w-full flex-[0_0_auto]">
        
        {/* Settings title */}
        <div 
          className={`w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-normal whitespace-nowrap mb-4 ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
          style={{ animationDelay: isExiting ? '0.1s' : '0.1s' }}
        >
          settings
        </div>
        
        {/* Language selection */}
        <div 
          className={`w-full mb-6 ${isExiting ? 'settings-card-animate-exit' : isLoaded ? 'settings-card-animate-entry' : 'opacity-0'}`}
          style={{ animationDelay: isExiting ? '0.15s' : '0.15s' }}
        >
          <div className="mb-2">
            <span className="text-white [font-family:'Good_Times-Book',Helvetica] text-sm tracking-wider">
              language
            </span>
          </div>
          <LanguageButton 
            language={sliderValues.language as string} 
            onClick={() => setIsLanguageModalOpen(true)} 
          />
        </div>
        
        {/* Slider settings */}
        <div 
          className={`w-full ${isExiting ? 'settings-card-animate-exit' : isLoaded ? 'settings-card-animate-entry' : 'opacity-0'}`}
          style={{ animationDelay: isExiting ? '0.2s' : '0.2s' }}
        >
          <Card className="bg-transparent border-0 text-white mb-6">
            <CardContent className="p-4">
              {sliderSettings.map((setting, index) => (
                <div 
                  key={setting.id} 
                  className={`mb-6 last:mb-0 ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
                  style={{ 
                    animationDelay: isExiting 
                      ? `${0.25 + (sliderSettings.length - 1 - index) * 0.05}s` 
                      : `${0.25 + index * 0.05}s` 
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="[font-family:'Good_Times-Book',Helvetica] text-sm tracking-wider">
                      {setting.label}
                    </span>
                    <span className="text-sm">
                      {sliderValues[setting.id as keyof typeof sliderValues]}
                      {setting.unit}
                    </span>
                  </div>
                  <Slider
                    id={setting.id}
                    min={setting.id === "paddle-adjust" ? -200 : 0}
                    max={setting.id === "paddle-adjust" ? 200 : 100}
                    step={1}
                    value={sliderValues[setting.id as keyof typeof sliderValues] as number}
                    unit={setting.unit}
                    onChange={(value) => handleSliderChange(setting.id, value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Toggle settings */}
        <div 
          className={`w-full ${isExiting ? 'settings-card-animate-exit' : isLoaded ? 'settings-card-animate-entry' : 'opacity-0'}`}
          style={{ animationDelay: isExiting ? '0.3s' : '0.3s' }}
        >
          <Card className="bg-transparent border-0 text-white">
            <CardContent className="p-4">
              {toggleSettings.map((setting, index) => (
                <div 
                  key={setting.id} 
                  className={`flex justify-between items-center mb-4 last:mb-0 ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
                  style={{ 
                    animationDelay: isExiting 
                      ? `${0.35 + (toggleSettings.length - 1 - index) * 0.05}s` 
                      : `${0.35 + index * 0.05}s` 
                  }}
                >
                  <span className="[font-family:'Good_Times-Book',Helvetica] text-sm tracking-wider">
                    {setting.label}
                  </span>
                  <ToggleSwitch
                    id={setting.id}
                    value={toggleValues[setting.id as keyof typeof toggleValues]}
                    onChange={(value) => handleToggleChange(setting.id, value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Version info */}
        <div 
          className={`text-center w-full mt-6 text-gray-500 text-xs ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
          style={{ animationDelay: isExiting ? '0.4s' : '0.8s' }}
        >
          Version 1.0.0
        </div>
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onOpenChange={setIsLanguageModalOpen}
        currentLanguage={sliderValues.language as string}
        onSelectLanguage={handleLanguageSelect}
      />
    </div>
  );
};

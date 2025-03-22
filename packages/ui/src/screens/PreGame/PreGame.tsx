import { ChevronLeftIcon, ShareIcon, ThumbsUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Song } from "../../components/Song";
import { useScreenAnimation } from "../../hooks/useScreenAnimation";
import { useNavigationAnimation } from "../../contexts/NavigationAnimationContext";
import { useScreenEntryExit } from "../../hooks/useScreenEntryExit";
import { LanguageSelectionModal } from "../../components/Settings/LanguageSelectionModal";
import "../../styles/screen-animations.css";

// Data for the creator
const creatorData = {
  username: "creator123",
  followers: "9,999 followers",
  likes: "9.9k",
  timeAgo: "1 year ago",
  description: "this is a test description..\nmulti-line\nskdjslkdjf",
};

// Data for comments
const commentsData = {
  count: "999 comments",
};

export const PreGame = (): JSX.Element => {
  // Use the screen animation hook
  useScreenAnimation();
  
  // Get animation states from the entry/exit hook
  const { isLoaded, isExiting, navigateWithExitAnimation } = useScreenEntryExit();
  
  // Get navigation functions from context
  const { 
    setIsHeaderHidden,
    setIsNavigationHidden
  } = useNavigationAnimation();

  // State for language selection
  const [currentLanguage, setCurrentLanguage] = useState("english");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Function to handle language selection
  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  // Use useEffect to handle the animation on component mount
  useEffect(() => {
    // Wait a small delay to show the header (but keep navigation hidden)
    const timer = setTimeout(() => {
      setIsHeaderHidden(false);
      setIsNavigationHidden(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [setIsHeaderHidden, setIsNavigationHidden]);

  // Handle back button click
  const handleBackClick = () => {
    // Go back to the Play screen with exit animation
    navigateWithExitAnimation("/play");
  };

  // Function to handle starting the game
  const handleStartGame = () => {
    // Step 1: Hide the header
    setIsHeaderHidden(true);
    
    // Step 2: Navigate to Game with both header and navigation hidden
    navigateWithExitAnimation("/game", { 
      hideHeader: true, 
      hideNavigation: true 
    });
  };

  // Instead of dynamic margins that change during animation, use fixed positioning and padding
  // This prevents layout shifts during header animation
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Main Content Area with fixed padding to prevent layout shifts */}
      <div className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full pt-[90px] pb-[76px]">
        {/* Back Button - Always in the same position */}
        <div 
          className={`fixed top-[80px] left-[30px] z-50 ${isExiting ? 'pregame-back-animate-exit' : isLoaded ? 'pregame-back-animate-entry' : 'opacity-0'}`}
          style={{ animationDelay: '0s' }}
        >
          <button
            className="bg-[#00000080] rounded-full p-2.5 hover:bg-[#000000b3] transition-colors shadow-md"
            onClick={handleBackClick}
          >
            <ChevronLeftIcon className="w-7 h-7 text-white" />
          </button>
        </div>
        
        <div className="flex flex-col items-start gap-2.5 px-4 py-[18px] relative flex-1 self-stretch w-full">
          <Card 
            className={`flex-col items-center w-full flex-[0_0_auto] flex relative self-stretch border-0 ${isExiting ? 'pregame-card-animate-exit' : isLoaded ? 'pregame-card-animate-entry' : 'opacity-0'}`}
            style={{ animationDelay: isExiting ? '0.2s' : '0.2s' }}
          >
            {/* Song Card */}
            <Song 
              tall={true} 
              onClick={handleStartGame}
            />
            
            {/* Creator Info */}
            <CardContent 
              className={`flex-col items-start gap-2 px-4 py-4 w-full flex-[0_0_auto] rounded-[14px_14px_0px_0px] overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] [background:linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.78)_75%,rgba(0,0,0,0)_100%)] flex relative self-stretch p-0 ${isExiting ? 'pregame-info-animate-exit' : isLoaded ? 'pregame-info-animate-entry' : 'opacity-0'}`}
              style={{ animationDelay: isExiting ? '0.3s' : '0.3s' }}
            >
              <div className="items-center justify-between px-2 py-2 w-full flex-[0_0_auto] rounded-[14px] overflow-hidden flex relative self-stretch">
                <div 
                  className={`inline-flex items-center gap-[13px] px-2 py-2.5 relative flex-[0_0_auto] ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
                  style={{ animationDelay: isExiting ? '0.35s' : '0.35s' }}
                >
                  <Avatar className="w-[52px] h-[52px] bg-[#d9d9d9] rounded-[26px]">
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>

                  <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-[normal]">
                      {creatorData.username}
                    </div>

                    <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                      {creatorData.followers}
                    </div>
                  </div>
                </div>

                <div 
                  className={`inline-flex items-center gap-2.5 relative flex-[0_0_auto] ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
                  style={{ animationDelay: isExiting ? '0.4s' : '0.4s' }}
                >
                  <Button
                    variant="ghost"
                    className="inline-flex items-center gap-[5px] px-2 py-0.5 relative flex-[0_0_auto] bg-[#616161] rounded-[90px] overflow-hidden h-auto"
                  >
                    <ThumbsUpIcon className="relative w-6 h-6 text-white" />
                    <div className="relative w-fit [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                      {creatorData.likes}
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center relative flex-[0_0_auto] p-0 h-7 w-7 bg-[#616161] rounded-[14px]"
                  >
                    <ShareIcon className="w-[22px] h-[22px] text-white" />
                  </Button>
                </div>
              </div>

              <div 
                className={`relative w-fit ml-4 [font-family:'Good_Times-Book',Helvetica] font-normal text-[#ffffff80] text-xs tracking-[0] leading-[normal] whitespace-nowrap ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
                style={{ animationDelay: isExiting ? '0.45s' : '0.45s' }}
              >
                {creatorData.timeAgo}
              </div>

              <div 
                className={`relative w-fit ml-4 ml-2 [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
                style={{ animationDelay: isExiting ? '0.5s' : '0.5s' }}
              >
                {creatorData.description.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < creatorData.description.split("\n").length - 1 && (
                      <br />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div 
            className={`flex-col items-start gap-2 px-4 py-4 flex-1 w-full grow backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] [background:linear-gradient(180deg,rgba(60,75,200,0.25)_0%,rgba(58,72,193,0.7)_14%,rgba(47,58,155,0.56)_82%,rgba(29,37,98,0)_100%)] flex relative self-stretch ${isExiting ? 'pregame-comments-animate-exit' : isLoaded ? 'pregame-comments-animate-entry' : 'opacity-0'}`}
            style={{ animationDelay: isExiting ? '0.3s' : '0.6s' }}
          >
            <div 
              className={`mt-[-1.00px] ml-2 relative w-fit [font-family:'Good_Times-Book',Helvetica] font-normal text-[#ffffff80] text-xs tracking-[0] leading-[normal] whitespace-nowrap ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
              style={{ animationDelay: isExiting ? '0.35s' : '0.65s' }}
            >
              {commentsData.count}
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-2.5 px-0 py-0 w-full flex-[0_0_auto] flex relative self-stretch">
              <Avatar className="w-[40px] h-[40px] bg-[#d9d9d9] rounded-[20px]">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Input 
                className="flex-1 h-10 bg-[#00000080] border-0 text-white placeholder:text-[#ffffff80]" 
                placeholder="Add a comment..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Black overlay for transition - appears when isExiting is true */}
      <div 
        className={`fixed inset-0 bg-black z-[100] transition-opacity duration-500 ${isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDelay: isExiting ? '0ms' : '0ms' }}
      />

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onOpenChange={setIsLanguageModalOpen}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </div>
  );
};

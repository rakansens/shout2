'use client';

import { SearchIcon } from "lucide-react";
import { Input } from "../../components/ui/input";
import { EventCarousel, CarouselItem } from "../../components/Carousel/EventCarousel";
import { Song } from "../../components/Song";
import { useUnifiedScreenAnimation } from "../../hooks/useUnifiedScreenAnimation";
import { useUnifiedScreenEntryExit } from "../../hooks/useUnifiedScreenEntryExit";
import { useNavigationAnimation } from "../../contexts/NavigationAnimationContext";
import React, { useEffect, MouseEvent } from "react";
import "../../styles/screen-animations.css";
import { usePathname } from "next/navigation";

// Data for genre cards
const genreCards = [
  { 
    id: 1, 
    name: "POP", 
    image: "https://c.animaapp.com/xTS05oxV/img/feature-song.png" 
  },
  { 
    id: 2, 
    name: "ROCK", 
    image: "https://c.animaapp.com/RpQYClm9/img/genre-item-3@2x.png" 
  },
  { 
    id: 3, 
    name: "ELECTRONIC", 
    image: "https://c.animaapp.com/RpQYClm9/img/genre-item-3@2x.png" 
  },
  { 
    id: 4, 
    name: "HIP HOP", 
    image: "https://c.animaapp.com/RpQYClm9/img/genre-item-3@2x.png" 
  },
];

// Data for banner slides
const bannerSlides: CarouselItem[] = [
  {
    id: 1,
    title: "THis is a test",
    description: "Play the latest songs from Ed Sheeran and earn points daily. The rest is a test of the auto positioning. AND ON AND ON AND ON AND ON AND ON.",
    points: "100",
    backgroundImage: "https://c.animaapp.com/sVl5C9mT/img/feature-banner.png",
    badgeType: "new event"
  },
  {
    id: 2,
    title: "song name (color)",
    description: "This is another featured song with a different style.",
    points: "100",
    backgroundImage: "https://c.animaapp.com/sVl5C9mT/img/feature-banner.png",
    badgeType: "popular"
  },
  {
    id: 3,
    title: "Featured Song",
    description: "Check out this amazing new release and earn rewards!",
    points: "150",
    backgroundImage: "https://c.animaapp.com/sVl5C9mT/img/feature-banner.png",
    badgeType: "trending"
  }
];

export const Play = (): JSX.Element => {
  // 現在のパスを取得
  const pathname = usePathname();
  
  // Use the screen animation hook to ensure proper transition handling
  useUnifiedScreenAnimation(pathname);
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
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
  
  // Handler for song click to navigate to PreGame
  const handleSongClick = (e: MouseEvent<HTMLDivElement>) => {
    // Step 1: Hide both header and navigation
    // Step 2: Navigate to PreGame with songId
    // Note: Step 3 (show header only) will be handled in the PreGame component
    // デフォルトでは'1'を使用
    const songId = '1';
    navigateWithExitAnimation(`/pregame/${songId}`, { 
      hideHeader: true, 
      hideNavigation: true 
    });
  };
  
  return (
    <div>
      {/* Main Content */}
      <div className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full grow mb-20 mt-10">
        <div className="flex flex-col items-start gap-[13px] px-4 py-[18px] relative self-stretch w-full flex-[0_0_auto]">
          {/* Event Carousel */}
          <div className={`w-full ${isExiting ? 'play-carousel-animate-exit' : isLoaded ? 'play-carousel-animate-entry' : 'opacity-0'}`}>
            <EventCarousel items={bannerSlides} autoPlayInterval={4000} />
          </div>
          
           {/* Featured Song Section */}
           <div className="flex flex-col items-start gap-2.5 px-0 py-2.5 self-stretch w-full relative flex-[0_0_auto]">
            <div className={`w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-normal whitespace-nowrap ${isExiting ? 'play-title-animate-exit' : isLoaded ? 'play-title-animate-entry' : 'opacity-0'}`}>
              featured songs
            </div>

            <div 
              className={`relative w-full cursor-pointer ${isExiting ? 'play-song-animate-exit' : isLoaded ? 'play-song-animate-entry' : 'opacity-0'}`} 
              onClick={handleSongClick}
              style={{ animationDelay: isExiting ? '0.2s' : '0.3s' }}
            >
              <Song />
            </div>
          </div>

         {/* Recent Uploads Section */}
          <div className="flex flex-col items-start gap-2.5 px-0 py-2.5 self-stretch w-full relative flex-[0_0_auto]">
            <div className={`w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-normal whitespace-nowrap ${isExiting ? 'play-title-animate-exit' : isLoaded ? 'play-title-animate-entry' : 'opacity-0'}`} 
              style={{ animationDelay: isExiting ? '0.15s' : '0.4s' }}
            >
              recent uploads
            </div>

            <div 
              className={`relative w-full cursor-pointer ${isExiting ? 'play-song-animate-exit' : isLoaded ? 'play-song-animate-entry' : 'opacity-0'}`} 
              onClick={handleSongClick}
              style={{ animationDelay: isExiting ? '0.25s' : '0.5s' }}
            >
              <Song compact={true} />
            </div>
            
            {/* Premium Song */}
            <div 
              className={`relative w-full cursor-pointer mt-2 ${isExiting ? 'play-song-animate-exit' : isLoaded ? 'play-song-animate-entry' : 'opacity-0'}`} 
              onClick={handleSongClick}
              style={{ animationDelay: isExiting ? '0.3s' : '0.6s' }}
            >
              <Song compact={true} isPremium={true} />
            </div>
          </div>

          {/* Genre Section */}
          <div className="flex flex-col items-start gap-2.5 px-0 py-2.5 self-stretch w-full relative flex-[0_0_auto]">
            <div className={`w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-normal whitespace-nowrap ${isExiting ? 'play-title-animate-exit' : isLoaded ? 'play-title-animate-entry' : 'opacity-0'}`}
              style={{ animationDelay: isExiting ? '0.2s' : '0.7s' }}
            >
              genres
            </div>

            {/* Genre Cards Grid */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {genreCards.map((genre, index) => (
                <div 
                  key={genre.id} 
                  className={`relative cursor-pointer ${isExiting ? 'scale-animate-exit' : isLoaded ? 'scale-animate-entry' : 'opacity-0'}`}
                  style={{ 
                    animationDelay: isExiting 
                      ? `${0.35 + (genreCards.length - 1 - index) * 0.05}s` 
                      : `${0.8 + index * 0.05}s` 
                  }}
                >
                  <div className="relative rounded-[10px] overflow-hidden">
                    <img 
                      src={genre.image} 
                      alt={genre.name} 
                      className="w-full h-[90px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="[font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-base tracking-[0.96px] leading-[normal]">
                        {genre.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className={`relative w-full mt-4 ${isExiting ? 'animate-exit' : isLoaded ? 'animate-entry' : 'opacity-0'}`}
            style={{ animationDelay: isExiting ? '0.5s' : '1s' }}
          >
            <div className="relative">
              <Input
                placeholder="Search songs..."
                className="pl-10 pr-4 py-2 bg-[#1C1C1E] border-[#2C2C2E] text-white rounded-full"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

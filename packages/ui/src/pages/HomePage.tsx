'use client';

// このファイルは、共通のホームページコンポーネントです。
// packages/ui/src/screens/Home/Home.tsxをNext.js互換に変換したものです。

import { QuestCardNew } from "../components/ui/quest-card-new";
import { EventCarousel, CarouselItem } from "../components/Carousel/EventCarousel";
import { useNextScreenAnimation } from "../hooks/useNextScreenAnimation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useNextNavigation } from "../contexts/NextNavigationContext";
import { CharacterPanel } from "../components/ui/character-panel";
import "../styles/home-animations.css";

// テーマの型定義
export type Theme = 'blue' | 'green';

// ホームページコンポーネントのプロパティ
interface HomePageProps {
  theme?: Theme;
  bannerSlides?: CarouselItem[];
  quests?: any[];
  characterData?: any;
}

// Data for banner carousel
const defaultBannerSlides: CarouselItem[] = [
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

// Data for quests to enable mapping
const defaultQuests = [
  {
    id: 1,
    title: "join x",
    description: "this id jhgjyfouyv",
    progress: 1,
    total: 3,
    reward: 100,
    completed: false,
    image: "https://c.animaapp.com/15WuGcx7/img/quest-right-3@2x.png",
  },
  {
    id: 2,
    title: "join x",
    description: "this id jhgjyfouyv",
    progress: 3,
    total: 3,
    reward: 150,
    completed: true,
    image: "https://c.animaapp.com/15WuGcx7/img/quest-right-2@2x.png",
  },
  {
    id: 3,
    title: "join x",
    description: "this id jhgjyfouyv",
    progress: 2,
    total: 3,
    reward: 200,
    completed: false,
    image: "https://c.animaapp.com/15WuGcx7/img/quest-right-3@2x.png",
  },
];

// Character data
const defaultCharacterData = {
  name: "hina shiratori",
  level: 14,
  currentExp: 13142,
  maxExp: 14000,
  variations: [
    {
      id: 1,
      unlocked: true,
      image:
        "https://c.animaapp.com/Eh5hssUH/img/idol-lvl-variation-1@2x.png",
    },
    {
      id: 2,
      unlocked: true,
      image:
        "https://c.animaapp.com/Eh5hssUH/img/idol-lvl-variation-1@2x.png",
    },
    { id: 3, unlocked: true, label: "5" },
    { id: 4, unlocked: false },
    { id: 5, unlocked: false },
  ],
  specialItems: [
    { id: 6, unlocked: false },
    { id: 7, unlocked: false },
    { id: 8, unlocked: false },
    {
      id: 9,
      unlocked: true,
      image: "https://c.animaapp.com/Eh5hssUH/img/image-3@2x.png",
    },
    {
      id: 10,
      unlocked: true,
      image: "https://c.animaapp.com/Eh5hssUH/img/image-4@2x.png",
    },
  ],
};

export function HomePage({
  theme = 'blue',
  bannerSlides = defaultBannerSlides,
  quests = defaultQuests,
  characterData = defaultCharacterData
}: HomePageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pathname = usePathname();
  const { navigateWithAnimation, setIsHeaderHidden, setIsNavigationHidden } = useNextNavigation();
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useNextScreenAnimation();

  // Trigger animations after component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Clean up exit animation timeout if component unmounts
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

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

  // Custom navigation function with exit animations
  const navigateWithExitAnimation = useCallback((to: string, options?: { hideHeader?: boolean; hideNavigation?: boolean }) => {
    // Don't navigate if already exiting
    if (isExiting) return;
    
    // Start exit animations
    setIsExiting(true);
    
    // Explicitly hide header and navigation
    setIsHeaderHidden(true);
    setIsNavigationHidden(true);
    
    // Wait for exit animations to complete before navigating
    exitTimeoutRef.current = setTimeout(() => {
      // Use the context's navigation function with explicit options to keep elements hidden during transition
      navigateWithAnimation(to, { 
        hideHeader: true, 
        hideNavigation: true,
        ...options 
      });
    }, 700); // Slightly longer than the longest exit animation to account for hero image
  }, [isExiting, navigateWithAnimation, setIsHeaderHidden, setIsNavigationHidden]);

  // Override global click handler for navigation buttons
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navButton = target.closest('[data-path]') as HTMLElement;
      
      if (navButton) {
        const path = navButton.getAttribute('data-path');
        if (path && path !== pathname) {
          e.preventDefault();
          e.stopPropagation();
          navigateWithExitAnimation(path);
          return true; // Signal that we've handled this
        }
      }
      return false; // Not handled
    };
    
    // Add our handler
    document.addEventListener('click', handleClick, true); // Use capture phase
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname, navigateWithExitAnimation]);

  // テーマに基づくスタイルの設定
  const themeStyles = {
    bgColor: theme === 'blue' ? 'bg-[#0071c1]' : 'bg-[#007536]',
    textColor: 'text-white',
    accentColor: theme === 'blue' ? 'text-blue-300' : 'text-green-300',
  };

  return (
    <div className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full grow mb-20 mt-10">
      <div className="flex flex-col items-start gap-[13px] px-4 py-[18px] relative self-stretch w-full flex-[0_0_auto]">

        <div className="flex flex-col items-center gap-[30px] px-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
          {/* Character Section */}
          <div className={`flex h-[393px] items-start justify-between relative self-stretch w-full ${isExiting ? 'character-animate-exit' : isLoaded ? 'character-animate-entry' : 'opacity-0'}`}>
            {/* Character image */}
            <img
              className="relative w-[367px] object-cover"
              alt="Idol character"
              src="https://c.animaapp.com/Eh5hssUH/img/idol-img@2x.png"
            />

            {/* Character info panel */}
            <CharacterPanel
              name={characterData.name}
              level={characterData.level}
              currentExp={characterData.currentExp}
              maxExp={characterData.maxExp}
              variations={characterData.variations}
              specialItems={characterData.specialItems}
              className="relative"
            />
          </div>

          {/* Event Carousel with animation */}
          <div className={`w-full ${isExiting ? 'carousel-animate-exit' : isLoaded ? 'carousel-animate-entry' : 'opacity-0'}`}>
            <EventCarousel items={bannerSlides} autoPlayInterval={4000} />
          </div>

          {/* Featured Quests Section */}
          <div className="flex flex-col items-start gap-1.5 px-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
            <h2 className={`relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[15px] tracking-[5.10px] leading-[normal] whitespace-nowrap ${isExiting ? 'quest-title-animate-exit' : isLoaded ? 'quest-title-animate' : 'opacity-0'}`}>
              featured quests
            </h2>

            {/* Quest Cards with staggered animations */}
            {quests.map((quest, index) => (
              <div 
                key={quest.id} 
                className={`w-full ${isExiting ? 'quest-animate-exit' : isLoaded ? 'quest-animate-entry' : 'opacity-0'}`}
                data-quest-id={quest.id}
              >
                <QuestCardNew
                  title={quest.title}
                  description={quest.description}
                  progress={quest.progress}
                  total={quest.total}
                  reward={quest.reward}
                  completed={quest.completed}
                  image={quest.image}
                  index={index}
                  className="mb-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

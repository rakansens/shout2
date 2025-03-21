'use client';

import React from "react";
import { StarIcon, MusicIcon, Gamepad2Icon, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNextScreenEntryExit } from "../../hooks/useNextScreenEntryExit";
import { useAnimationSettings } from "../../contexts/AnimationSettingsContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { GlitterStar } from "../ui/glitter-star";

interface SongProps {
  id?: string;
  compact?: boolean;
  tall?: boolean;
  hidePlayButton?: boolean;
  isPremium?: boolean;
  onClick?: () => void;
}

export const Song = ({ id = '1', compact = false, tall = false, hidePlayButton = false, isPremium = false, onClick }: SongProps): JSX.Element => {
  const router = useRouter();
  const { navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled } = useAnimationSettings();
  
  // Determine height based on props
  let height = "h-[258px]";
  if (compact) height = "h-[68px]";
  if (tall) height = "h-[364px]";

  // Handle play button click
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    // Navigate to PreGame screen first
    if (animationsEnabled) {
      navigateWithExitAnimation(`/pregame?songId=${id}`);
    } else {
      router.push(`/pregame?songId=${id}`);
    }
  };

  return (
    <Card 
      className={`w-full ${height} rounded-[14px] overflow-hidden p-0 bg-[url(https://c.animaapp.com/xTS05oxV/img/feature-song.png)] bg-cover bg-[50%_50%] flex flex-col justify-between border-0 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-0 space-y-0">
        <div className="justify-between px-2.5 py-0 w-full bg-[#4b4edccc] rounded-[14px_14px_0px_0px] overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] flex items-center">
          <div className="gap-2 px-0 py-1 flex-1 grow flex items-center">
            <div className="flex flex-col w-[17px] items-center justify-center relative">
              <div className="relative w-[19px] h-[19px] ml-[-1.00px] mr-[-1.00px] rounded-[9.5px] border border-solid border-white" />
              {isPremium ? (
                <div className="absolute w-[13px] h-[13px] top-[3px] left-[2px]">
                  <Ticket
                    className="text-white"
                    size={13}
                    strokeWidth={2}
                  />
                </div>
              ) : (
                <MusicIcon
                  className="absolute w-[13px] h-[13px] top-0.5 left-px text-white"
                />
              )}
            </div>
            <div className="relative w-fit [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
              {isPremium ? "premium song" : "song name (color is genre)"}
            </div>
          </div>
          <div className="inline-flex flex-col items-center justify-center pt-1 pb-0 px-0 relative">
            <StarIcon className="relative w-[34.61px] h-[33.21px] text-white fill-white" />
            <div className="absolute h-[19px] top-3.5 left-3.2 [font-family:'Good_Times-Heavy',Helvetica] font-normal text-[#3c43bd] text-base tracking-[0] leading-[normal] whitespace-nowrap">
              {isPremium ? "10" : "5"}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`p-0 ${compact ? 'hidden' : 'flex-grow'} flex items-center justify-center`}>
        {tall && !hidePlayButton && (
          <div 
            className="p-0 flex-grow flex items-center justify-center cursor-pointer" 
            data-component-name="_c9"
            onClick={handlePlayClick}
          >
            <img
              className="relative w-[109.5px] h-[118.17px]"
              alt="Polygon"
              src="https://c.animaapp.com/rasA7xoN/img/polygon-3.svg"
              data-component-name="Song"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 w-full">
        <div className="flex items-center justify-between px-[18px] py-0 w-full bg-[#00000080] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px) brightness(100%)]">
          <div className="inline-flex items-center gap-2.5">
            <Avatar className="w-[21px] h-[21px] bg-[#d9d9d9] rounded-[10.5px]">
              <AvatarFallback className="bg-[#d9d9d9]">P</AvatarFallback>
            </Avatar>
            <div className="[font-family:'Good_Times-Light',Helvetica] font-light text-white text-[13px] tracking-[0] leading-[normal]">
              player123
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-1.5 py-1.5">
            <Gamepad2Icon className="w-[19px] h-[19px] text-white" />
            <div className="mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
              {isPremium ? "200" : "100"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Song;

// このファイルは、共通の結果表示ページコンポーネントです。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon,
  RefreshCcwIcon,
  Share2Icon,
  ThumbsUpIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@shout2/ui/src/components/ui/avatar";
import { Button } from "@shout2/ui/src/components/ui/button";
import { Card, CardContent } from "@shout2/ui/src/components/ui/card";
import { Input } from "@shout2/ui/src/components/ui/input";
import { Progress } from "@shout2/ui/src/components/ui/progress";
import MainLayout from "@shout2/ui/src/components/MainLayout/MainLayout";
import { Song } from "@shout2/ui/src/components/Song/Song";

interface ResultPageProps {
  theme?: 'blue' | 'green';
}

export function ResultPage({ theme = 'blue' }: ResultPageProps) {
  const router = useRouter();

  // テーマカラーの設定
  const primaryColor = theme === 'green' ? 'green' : 'blue';
  const buttonBgColor = theme === 'green' ? 'bg-[#00af51] hover:bg-[#00af51]/90' : 'bg-[#00b1f1] hover:bg-[#00b1f1]/90';
  const secondaryButtonBgColor = theme === 'green' ? 'bg-[#6f30a0] hover:bg-[#6f30a0]/90' : 'bg-[#7030a0] hover:bg-[#7030a0]/90';

  // Player data
  const playerData = {
    name: "player123",
    title: "RHYTHM MASTER",
    avatar: "",
    stars: 99,
    coins: 9999,
  };

  // Song data
  const songData = {
    name: "song name (color is genre)",
    rating: 5,
    likes: "9.9k",
    playerScore: 100,
  };

  // Performance data
  const performanceData = {
    accuracy: "99.99%",
    progressValue: 40, // Percentage of progress bar filled
    hits: 9999,
    perfectHits: 9999,
    misses: 9999,
    finalScore: 9999,
    maxCombo: 9999,
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full overflow-y-auto">
        <div className="flex flex-col items-start px-4 py-[18px] pb-8 relative self-stretch w-full flex-[0_0_auto]">
          {/* Song Card */}
          <Song tall={true} hidePlayButton={true} />

          {/* Like and Share Section */}
          <div className="flex-col items-start gap-2 px-2.5 py-[7px] w-full flex-[0_0_auto] rounded-[14px_14px_0px_0px] overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] [background:linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.78)_75%,rgba(0,0,0,0)_100%)] flex relative self-stretch">
            <div className="items-center justify-around gap-2.5 px-0 py-1.5 w-full flex-[0_0_auto] rounded-[14px] overflow-hidden flex relative self-stretch">
              <div className="flex items-center justify-between relative flex-1 grow">
                <Button
                  variant="ghost"
                  className="inline-flex items-center gap-[5px] px-2 py-0.5 relative flex-[0_0_auto] bg-[#616161] rounded-[90px] overflow-hidden hover:bg-[#616161]/90"
                >
                  <ThumbsUpIcon className="w-6 h-6 text-white" />
                  <div className="relative w-fit [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                    {songData.likes}
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="relative w-7 h-7 bg-[#616161] rounded-[14px] p-0 hover:bg-[#616161]/90"
                >
                  <Share2Icon className="w-[22px] h-[22px] text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Stats Section */}
          <Card className="flex flex-col items-center gap-[34px] px-[26px] py-4 relative self-stretch w-full flex-[0_0_auto] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] [background:linear-gradient(180deg,rgba(60,75,200,0.25)_0%,rgba(58,72,193,0.7)_14%,rgba(47,58,155,0.56)_82%,rgba(29,37,98,0)_100%)] border-0">
            <CardContent className="p-0 w-full">
              <div className="inline-flex flex-col items-center gap-[3px] relative flex-[0_0_auto] w-full">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  accuracy
                </div>

                <div className="relative w-fit opacity-[0.99] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-[40px] tracking-[0] leading-[normal] whitespace-nowrap">
                  {performanceData.accuracy}
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[#00000099] rounded-[90px] overflow-hidden border border-solid border-white mt-8">
                <Progress 
                  value={parseFloat(performanceData.accuracy.replace('%', ''))} 
                  className="h-[10.67px] rounded-[90px] bg-[#00000099] border-0" 
                  indicatorClassName="bg-[#00af51]"
                />
              </div>

              {/* Performance Stats */}
              <div className="flex items-center justify-between px-4 py-0 relative self-stretch w-full flex-[0_0_auto] mt-8">
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="text-2xl relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white tracking-[0] leading-[normal]">
                    {performanceData.hits.toLocaleString()}
                  </div>

                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    hit
                  </div>
                </div>

                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="text-2xl relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white tracking-[0] leading-[normal]">
                    {performanceData.perfectHits.toLocaleString()}
                  </div>

                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    perfect hit
                  </div>
                </div>

                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="text-2xl relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white tracking-[0] leading-[normal]">
                    {performanceData.misses.toLocaleString()}
                  </div>

                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    miss
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-16 py-0 relative self-stretch w-full flex-[0_0_auto] mt-8">
                {/* Final Score and Max Combo */}
                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="text-4xl whitespace-nowrap relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white tracking-[0] leading-[normal]">
                    {performanceData.finalScore.toLocaleString()}
                  </div>

                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    final score
                  </div>
                </div>

                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                  <div className="text-4xl whitespace-nowrap relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white tracking-[0] leading-[normal]">
                    {performanceData.maxCombo.toLocaleString()}
                  </div>

                  <div className="relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    max combo
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto] mt-8">
                <Avatar className="w-[52px] h-[52px] bg-[#d9d9d9] rounded-[26px]">
                  <AvatarFallback>
                    {playerData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="inline-flex flex-col items-start justify-center relative flex-[0_0_auto] mr-[-11.99px] w-full">
                  <Input
                    placeholder="add comment"
                    className="border-0 border-b border-white/60 rounded-none bg-transparent [font-family:'Good_Times-Book',Helvetica] font-normal text-[#ffffff99] text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

         {/* Action Buttons */}
         <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] mt-4 mb-8">
            <Button 
              className={`inline-flex items-center justify-center gap-[19px] px-11 py-3 relative flex-[0_0_auto] ${buttonBgColor}`}
              onClick={() => router.push("/game")}
            >
              <RefreshCcwIcon className="w-6 h-6" />
              <span className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                replay
              </span>
            </Button>

            <Button 
              className={`inline-flex items-center justify-center gap-[19px] px-[63px] py-3 relative flex-[0_0_auto] ${secondaryButtonBgColor}`}
              onClick={() => router.push("/play")}
            >
              <span className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                next
              </span>
              <ArrowRightIcon className="w-6 h-6" />
            </Button>
          </div> 
        </div>
      </div>
    </MainLayout>
  );
}

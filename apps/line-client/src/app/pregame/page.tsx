'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { PreGame } from '@shout2/ui/src/components/PreGame';
import { ArrowLeftIcon } from 'lucide-react';

export default function PreGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get('songId') || '1';
  const { isLoaded, isExiting, navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled } = useAnimationSettings();
  
  // 戻るボタンのハンドラ
  const handleBack = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/play');
    } else {
      router.push('/play');
    }
  };
  
  // プレイボタンのハンドラ
  const handlePlay = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation(`/game?songId=${songId}`);
    } else {
      router.push(`/game?songId=${songId}`);
    }
  };
  
  return (
    <MainLayout>
      <Header>
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={handleBack}
            className={`text-white p-2 rounded-full hover:bg-green-700/50 transition-all ${isLoaded && animationsEnabled ? 'pregame-back-animate-entry' : ''}`}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="text-white text-xl font-bold">曲の詳細</div>
          <div className="w-10"></div> {/* スペーサー */}
        </div>
      </Header>
      
      <PreGame
        songId={songId}
        themeColor="green" // LINEクライアント用
        onBack={handleBack}
        onPlay={handlePlay}
        isLoaded={isLoaded}
        isExiting={isExiting}
        animationsEnabled={animationsEnabled}
      />
    </MainLayout>
  );
}

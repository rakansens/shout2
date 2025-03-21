// このファイルは、クエスト完了画面です。
// クエスト完了時の視覚効果とアニメーションを表示します。

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlitterStar } from '@shout2/ui/src/components/ui/glitter-star';
import { EnergyStars } from '@shout2/ui/src/components/ui/energy-stars';
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';

export default function QuestComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded } = useNextScreenEntryExit();
  const [showStars, setShowStars] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [targetPoints, setTargetPoints] = useState(0);
  
  // URLパラメータからクエスト情報を取得
  const questId = searchParams.get('id') || '';
  const questTitle = searchParams.get('title') || 'クエスト';
  const questPoints = parseInt(searchParams.get('points') || '100', 10);
  
  useEffect(() => {
    // アニメーション効果
    setShowStars(true);
    setTargetPoints(questPoints);
    
    // エネルギーレベルを徐々に上げる
    const energyInterval = setInterval(() => {
      setEnergyLevel(prev => {
        if (prev >= 5) {
          clearInterval(energyInterval);
          return 5;
        }
        return prev + 1;
      });
    }, 500);
    
    // ポイントを徐々に増やす
    const pointsInterval = setInterval(() => {
      setPoints(prev => {
        if (prev >= questPoints) {
          clearInterval(pointsInterval);
          return questPoints;
        }
        return prev + Math.ceil(questPoints / 20);
      });
    }, 100);
    
    return () => {
      clearInterval(energyInterval);
      clearInterval(pointsInterval);
    };
  }, [questPoints]);
  
  const handleContinue = () => {
    router.push('/quests');
  };
  
  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-green-900 to-black">
        {/* キラキラエフェクト */}
        {showStars && (
          <>
            <GlitterStar size={20} style={{ top: '20%', left: '20%' }} className="animate-[pulse_1.5s_ease-in-out_infinite]" />
            <GlitterStar size={15} style={{ top: '30%', right: '25%' }} className="animate-[pulse_2s_ease-in-out_infinite]" />
            <GlitterStar size={25} style={{ bottom: '40%', left: '30%' }} className="animate-[pulse_1.8s_ease-in-out_infinite]" />
            <GlitterStar size={18} style={{ top: '15%', left: '60%' }} className="animate-[pulse_2.2s_ease-in-out_infinite]" />
            <GlitterStar size={22} style={{ bottom: '30%', right: '20%' }} className="animate-[pulse_1.7s_ease-in-out_infinite]" />
          </>
        )}
        
        <div className={`bg-gray-800/60 rounded-lg p-8 max-w-md w-full mx-4 backdrop-blur-md ${isLoaded ? 'scale-animate-entry' : ''}`}>
          <h1 className="text-3xl font-bold text-center text-white mb-6">クエスト完了！</h1>
          
          <div className="text-center mb-8">
            <div className="text-xl font-medium text-white mb-2">{questTitle}</div>
            <div className="text-4xl font-bold text-yellow-400 mb-4">+{points} pts</div>
          </div>
          
          {/* エネルギー表示 */}
          <div className="mb-8">
            <p className="text-center text-white mb-2">エネルギー獲得！</p>
            <div className="flex justify-center">
              <EnergyStars totalStars={5} activeStars={energyLevel} size="lg" />
            </div>
          </div>
          
          <button
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            続ける
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

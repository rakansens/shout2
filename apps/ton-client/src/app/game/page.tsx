'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// ゲーム関連のコンポーネントをインポート
import { GameScore, TimingIndicator, GameControls } from '@shout2/ui/src/components/Game';
import { Header } from '@shout2/ui/src/components/Header/Header';
import type { TimingRating } from '@shout2/ui/src/components/Game/TimingIndicator';

// ダミーの曲データ
interface SongData {
  id: string;
  title: string;
  artist: string;
  difficulty: number;
  bpm: number;
  duration: number;
  backgroundImage: string;
}

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get('songId');
  const { isLoaded, isExiting, navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled } = useAnimationSettings();
  
  // ゲーム状態
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [songData, setSongData] = useState<SongData | null>(null);
  
  // ゲームプレイ状態
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [currentRating, setCurrentRating] = useState<TimingRating>(null);
  const [showRatingAnimation, setShowRatingAnimation] = useState(false);

  // 曲データの取得
  useEffect(() => {
    const fetchSongData = async () => {
      try {
        // APIエンドポイントが実装されるまでのダミーデータ
        const dummySong: SongData = {
          id: songId || '1',
          title: 'Cosmic Rhythm',
          artist: 'DJ Galaxy',
          difficulty: 4,
          bpm: 128,
          duration: 180, // 3分
          backgroundImage: 'https://placehold.co/1920x1080/darkblue/white?text=Cosmic+Rhythm'
        };
        
        setSongData(dummySong);
        
        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const response = await fetch(`/api/songs/${songId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('曲データの取得に失敗しました。');
        }

        const data = await response.json();
        setSongData(data.song);
        */
        
        // ロード完了
        setIsLoading(false);
        
        // ゲーム開始時のスコアをリセット
        setScore(0);
        setCombo(0);
        setMaxCombo(0);
        setAccuracy(0);
        
      } catch (error: any) {
        console.error('Song data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
        setIsLoading(false);
      }
    };

    fetchSongData();
  }, [songId]);

  // ゲームの一時停止/再開
  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // ゲームの終了（プレイ画面に戻る）
  const handleExit = useCallback(() => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/play');
    } else {
      router.push('/play');
    }
  }, [animationsEnabled, navigateWithExitAnimation, router]);

  // デモ用：ランダムなタイミング評価を表示（実際のゲームロジックでは置き換える）
  const showRandomRating = useCallback(() => {
    if (isPaused) return;
    
    const ratings: TimingRating[] = ['perfect', 'great', 'good', 'miss'];
    const randomIndex = Math.floor(Math.random() * ratings.length);
    const rating = ratings[randomIndex];
    
    setCurrentRating(rating);
    setShowRatingAnimation(true);
    
    // スコアとコンボの更新
    if (rating === 'perfect') {
      setScore(prev => prev + 100);
      setCombo(prev => prev + 1);
    } else if (rating === 'great') {
      setScore(prev => prev + 80);
      setCombo(prev => prev + 1);
    } else if (rating === 'good') {
      setScore(prev => prev + 50);
      setCombo(prev => prev + 1);
    } else if (rating === 'miss') {
      setCombo(0);
    }
    
    // 最大コンボの更新
    setMaxCombo(prev => Math.max(prev, combo + (rating !== 'miss' ? 1 : 0)));
    
    // 精度の更新（デモ用の簡易計算）
    const accuracyValues: Record<string, number> = { perfect: 1, great: 0.8, good: 0.5, miss: 0 };
    const currentAccuracyValue = rating ? accuracyValues[rating] || 0 : 0;
    setAccuracy(prev => (prev * 0.9) + (currentAccuracyValue * 0.1)); // 移動平均
    
    // アニメーション終了後にリセット
    setTimeout(() => {
      setShowRatingAnimation(false);
    }, 500);
  }, [isPaused, combo]);

  // デモ用：定期的にランダムな評価を表示
  useEffect(() => {
    if (isLoading || isPaused) return;
    
    const interval = setInterval(() => {
      showRandomRating();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLoading, isPaused, showRandomRating]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/play')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            曲選択に戻る
          </button>
        </div>
      </div>
    );
  }

  if (!songData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">曲データが見つかりません。</p>
          <button
            onClick={() => router.push('/play')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            曲選択に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen w-full relative overflow-hidden ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}
      style={{
        backgroundImage: `url(${songData.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* ヘッダー（一時停止中のみ表示） */}
      {isPaused && (
        <Header title={songData.title}>
          <div className="text-white text-xl font-bold">{songData.title}</div>
        </Header>
      )}
      
      {/* ゲームコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen p-4">
        {/* 上部：スコア表示 */}
        <div className="w-full max-w-md mt-4">
          <GameScore
            score={score}
            combo={combo}
            maxCombo={maxCombo}
            accuracy={accuracy}
          />
        </div>
        
        {/* 中央：ゲームプレイエリア */}
        <div className="flex-1 w-full flex items-center justify-center">
          {/* タイミング評価表示 */}
          <TimingIndicator
            rating={currentRating}
            showAnimation={showRatingAnimation}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
          
          {/* 一時停止中のオーバーレイ */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center">
              <div className="text-white text-4xl font-bold">PAUSED</div>
            </div>
          )}
        </div>
        
        {/* 下部：ゲームコントロール */}
        <div className="w-full max-w-md mb-8">
          <GameControls
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onExit={handleExit}
          />
        </div>
      </div>
    </div>
  );
}

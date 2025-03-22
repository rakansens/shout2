// このファイルは、共通のプレイ結果ページコンポーネントです。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUnifiedScreenEntryExit } from '@shout2/ui/src/hooks/useUnifiedScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';

// 楽曲情報のインターフェース
interface SongInfo {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  duration: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  bpm: number;
  category: string;
  releaseDate: string;
  description?: string;
  playCount: number;
  rating: number;
}

// ゲームの結果のインターフェース
interface GameResult {
  score: number;
  maxCombo: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  accuracy: number;
  rank: string; // S, A, B, C, D
  songId: string;
  playDate: string;
  earnedPoints: number;
  newHighScore: boolean;
}

interface PlayPageProps {
  theme?: 'blue';
}

export function PlayPage({ theme = 'blue' }: PlayPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // テーマカラーの設定（青系のみ）
  const primaryColor = 'blue';
  const bgGradient = 'bg-gradient-to-b from-blue-900 to-black';
  const buttonBgColor = 'bg-blue-600 hover:bg-blue-700';
  const borderColor = 'border-blue-500';
  const textColor = 'text-blue-500';

  // URLからsongIdとplayIdを取得
  const getIdsFromUrl = () => {
    // Next.jsのパスからIDを抽出
    const segments = pathname.split('/');
    const playIndex = segments.findIndex(segment => segment === 'play');
    if (playIndex !== -1 && playIndex < segments.length - 1) {
      return {
        songId: segments[playIndex + 1],
        playId: segments[playIndex + 2] || null
      };
    }
    return { songId: null, playId: null };
  };

  const { songId, playId } = getIdsFromUrl();

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      if (!songId) {
        setError('楽曲IDが見つかりません。');
        setIsLoading(false);
        return;
      }

      try {
        // APIエンドポイントが実装されるまでのダミーデータ
        // 実際のAPIが実装されたら、このダミーデータは削除してください
        const dummySongInfo: SongInfo = {
          id: songId,
          title: 'サンプル楽曲',
          artist: 'サンプルアーティスト',
          coverImage: 'https://placehold.co/300x300/gray/white?text=Cover',
          duration: 210, // 秒
          difficulty: 'normal',
          bpm: 120,
          category: 'J-POP',
          releaseDate: '2025-01-15',
          description: 'これはサンプル楽曲の説明文です。実際のAPIが実装されたら、このダミーデータは削除されます。',
          playCount: 1250,
          rating: 4.5
        };

        const dummyGameResult: GameResult = {
          score: 85420,
          maxCombo: 124,
          perfect: 98,
          great: 45,
          good: 12,
          miss: 5,
          accuracy: 92.5,
          rank: 'A',
          songId: songId,
          playDate: new Date().toISOString(),
          earnedPoints: 850,
          newHighScore: true
        };

        setSongInfo(dummySongInfo);
        setGameResult(dummyGameResult);
        
        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const songResponse = await fetch(`/api/songs/${songId}`);
        if (!songResponse.ok) {
          throw new Error('楽曲情報の取得に失敗しました。');
        }
        const songData = await songResponse.json();
        setSongInfo(songData);

        const resultResponse = await fetch(`/api/plays/${playId || 'latest'}?songId=${songId}`);
        if (!resultResponse.ok) {
          throw new Error('プレイ結果の取得に失敗しました。');
        }
        const resultData = await resultResponse.json();
        setGameResult(resultData);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [songId, playId, pathname]);

  // 戻るボタンハンドラー
  const handleBack = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/home');
    } else {
      router.push('/home');
    }
  };

  // リトライハンドラー
  const handleRetry = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation(`/game/${songId}`);
    } else {
      router.push(`/game/${songId}`);
    }
  };

  // 共有ハンドラー
  const handleShare = () => {
    setShowShareModal(true);
  };

  // 共有モーダルを閉じるハンドラー
  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  // SNS共有ハンドラー
  const handleShareToSNS = (platform: 'twitter' | 'facebook' | 'line') => {
    if (!gameResult || !songInfo) return;
    
    let shareUrl = '';
    const shareText = `${songInfo.title}を${gameResult.score}点でクリアしました！ランク: ${gameResult.rank}`;
    const appUrl = window.location.origin;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'line':
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  // 難易度表示関数
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡単';
      case 'normal': return '普通';
      case 'hard': return '難しい';
      case 'expert': return '専門家';
      default: return difficulty;
    }
  };

  // 難易度色関数
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'normal': return 'text-blue-500';
      case 'hard': return 'text-orange-500';
      case 'expert': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ローディング画面
  if (isLoading) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className={`w-16 h-16 border-4 ${borderColor} border-t-transparent rounded-full animate-spin`}></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  // エラー画面
  if (error) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className={`w-full ${buttonBgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  // データがない場合
  if (!songInfo || !gameResult) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">データが見つかりません</h1>
          <p className="text-gray-400 mb-4">プレイ結果の取得に失敗しました。</p>
          <button
            onClick={handleBack}
            className={`w-full ${buttonBgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Header>
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-white text-xl font-bold">プレイ結果</div>
        </div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        <div className="px-4 mb-6">
          {/* 楽曲情報 */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <img
                src={songInfo.coverImage}
                alt={songInfo.title}
                className="w-24 h-24 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl font-bold text-white mb-1">{songInfo.title}</h1>
                <p className="text-gray-400 mb-2">{songInfo.artist}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                    {songInfo.category}
                  </span>
                  <span className={`bg-gray-700 ${getDifficultyColor(songInfo.difficulty)} text-xs px-2 py-1 rounded`}>
                    {getDifficultyText(songInfo.difficulty)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 結果サマリー */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-300">プレイ日時</div>
              <div className="text-white">{formatDate(gameResult.playDate)}</div>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className={`text-6xl font-bold ${
                gameResult.rank === 'S' ? 'text-yellow-500' :
                gameResult.rank === 'A' ? 'text-green-500' :
                gameResult.rank === 'B' ? 'text-blue-500' :
                gameResult.rank === 'C' ? 'text-purple-500' :
                'text-red-500'
              }`}>
                {gameResult.rank}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm mb-1">スコア</div>
                <div className="text-xl font-bold text-white">{gameResult.score}</div>
                {gameResult.newHighScore && (
                  <div className="text-yellow-500 text-xs mt-1">新記録！</div>
                )}
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm mb-1">精度</div>
                <div className="text-xl font-bold text-white">{gameResult.accuracy.toFixed(2)}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm mb-1">最大コンボ</div>
                <div className="text-xl font-bold text-white">{gameResult.maxCombo}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm mb-1">獲得ポイント</div>
                <div className="text-xl font-bold text-white">{gameResult.earnedPoints}</div>
              </div>
            </div>
          </div>
          
          {/* 詳細結果 */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">詳細結果</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-500">PERFECT</span>
                </div>
                <span className="text-white font-bold">{gameResult.perfect}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-blue-500">GREAT</span>
                </div>
                <span className="text-white font-bold">{gameResult.great}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-yellow-500">GOOD</span>
                </div>
                <span className="text-white font-bold">{gameResult.good}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-red-500">MISS</span>
                </div>
                <span className="text-white font-bold">{gameResult.miss}</span>
              </div>
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRetry}
              className={`${buttonBgColor} text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              リトライ
            </button>
            
            <button
              onClick={handleShare}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              結果を共有
            </button>
            
            <button
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
      
      {/* 共有モーダル */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">結果を共有</h2>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleShareToSNS('twitter')}
                className="w-full bg-[#1DA1F2] hover:bg-[#1a94e0] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitterで共有
              </button>
              
              <button
                onClick={() => handleShareToSNS('facebook')}
                className="w-full bg-[#4267B2] hover:bg-[#3b5998] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebookで共有
              </button>
              
              <button
                onClick={() => handleShareToSNS('line')}
                className="w-full bg-[#06C755] hover:bg-[#05b54d] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                LINEで共有
              </button>
            </div>
            
            <button
              onClick={handleCloseShareModal}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

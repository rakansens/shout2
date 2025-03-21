// このファイルは、TON（Telegram）クライアントのランキング画面です。

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';

// ランキングのインターフェース
interface RankingUser {
  id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  isCurrentUser: boolean;
}

// ランキングのタイプ
type RankingType = 'weekly' | 'monthly' | 'allTime';

export default function Rankings() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled, animationSpeed } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [rankingType, setRankingType] = useState<RankingType>('weekly');

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          // 認証されていない場合はトップページにリダイレクト
          router.push('/');
          return;
        }

        // APIエンドポイントが実装されるまでのダミーデータ
        // 実際のAPIが実装されたら、このダミーデータは削除してください
        const dummyRankings: RankingUser[] = [
          {
            id: '1',
            username: 'player1',
            avatar: 'https://placehold.co/100x100/blue/white?text=P1',
            score: 9500,
            rank: 1,
            isCurrentUser: false
          },
          {
            id: '2',
            username: 'player2',
            avatar: 'https://placehold.co/100x100/blue/white?text=P2',
            score: 8200,
            rank: 2,
            isCurrentUser: false
          },
          {
            id: '3',
            username: 'H1ro5', // 現在のユーザー
            avatar: 'https://placehold.co/100x100/blue/white?text=You',
            score: 7800,
            rank: 3,
            isCurrentUser: true
          },
          {
            id: '4',
            username: 'player4',
            avatar: 'https://placehold.co/100x100/blue/white?text=P4',
            score: 7500,
            rank: 4,
            isCurrentUser: false
          },
          {
            id: '5',
            username: 'player5',
            avatar: 'https://placehold.co/100x100/blue/white?text=P5',
            score: 7200,
            rank: 5,
            isCurrentUser: false
          },
          {
            id: '6',
            username: 'player6',
            avatar: 'https://placehold.co/100x100/blue/white?text=P6',
            score: 6800,
            rank: 6,
            isCurrentUser: false
          },
          {
            id: '7',
            username: 'player7',
            avatar: 'https://placehold.co/100x100/blue/white?text=P7',
            score: 6500,
            rank: 7,
            isCurrentUser: false
          },
          {
            id: '8',
            username: 'player8',
            avatar: 'https://placehold.co/100x100/blue/white?text=P8',
            score: 6200,
            rank: 8,
            isCurrentUser: false
          },
          {
            id: '9',
            username: 'player9',
            avatar: 'https://placehold.co/100x100/blue/white?text=P9',
            score: 5900,
            rank: 9,
            isCurrentUser: false
          },
          {
            id: '10',
            username: 'player10',
            avatar: 'https://placehold.co/100x100/blue/white?text=P10',
            score: 5600,
            rank: 10,
            isCurrentUser: false
          }
        ];

        setRankings(dummyRankings);

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const response = await fetch(`/api/rankings/${rankingType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('ランキングデータの取得に失敗しました。');
        }

        const data = await response.json();
        setRankings(data.rankings || []);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, rankingType]);

  // ランキングタイプの変更
  const handleRankingTypeChange = (type: RankingType) => {
    setRankingType(type);
    setIsLoading(true);
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    if (animationsEnabled) {
      navigateWithExitAnimation(path);
    } else {
      router.push(path);
    }
  };

  // プロフィールクリック処理
  const handleProfileClick = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/profile');
    } else {
      router.push('/profile');
    }
  };

  // ユーザープロフィールクリック処理
  const handleUserClick = (userId: string) => {
    if (animationsEnabled) {
      navigateWithExitAnimation(`/profile/${userId}`);
    } else {
      router.push(`/profile/${userId}`);
    }
  };

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
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Header onProfileClick={handleProfileClick}>
        <div className="text-white text-xl font-bold">ランキング</div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        {/* ランキングタイプ選択 */}
        <div className={`flex justify-center mb-6 px-4 ${isLoaded && animationsEnabled ? 'rankings-header-animate-entry' : ''}`}>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => handleRankingTypeChange('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                rankingType === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              週間
            </button>
            <button
              type="button"
              onClick={() => handleRankingTypeChange('monthly')}
              className={`px-4 py-2 text-sm font-medium ${
                rankingType === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              月間
            </button>
            <button
              type="button"
              onClick={() => handleRankingTypeChange('allTime')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                rankingType === 'allTime'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              総合
            </button>
          </div>
        </div>

        {/* ランキングリスト */}
        <div className="px-4">
          <div className={`bg-gray-800/50 rounded-lg overflow-hidden ${isLoaded && animationsEnabled ? 'rankings-section-animate-entry delay-1' : ''}`}>
            <div className="px-4 py-3 bg-gray-900/50">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-300">
                <div className="col-span-2 text-center">順位</div>
                <div className="col-span-6">ユーザー</div>
                <div className="col-span-4 text-right">スコア</div>
              </div>
            </div>
            <ul className="divide-y divide-gray-700">
              {rankings.map((user, index) => (
                <li 
                  key={user.id}
                  className={`px-4 py-3 ${user.isCurrentUser ? 'bg-blue-900/30' : ''} ${isLoaded && animationsEnabled ? `animate-entry delay-${index + 2}` : ''}`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2 text-center">
                      {user.rank <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          user.rank === 1 ? 'bg-yellow-500' : 
                          user.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
                        } text-white font-bold`}>
                          {user.rank}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">{user.rank}</span>
                      )}
                    </div>
                    <div className="col-span-6 flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-medium">
                        {user.username}
                        {user.isCurrentUser && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">あなた</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-4 text-right font-bold text-lg">
                      {user.score.toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <Navigation 
        currentPath={pathname} 
        onNavigate={handleNavigation} 
      />
    </MainLayout>
  );
}

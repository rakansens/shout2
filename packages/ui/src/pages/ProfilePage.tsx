// このファイルは、共通のプロフィールページコンポーネントです。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUnifiedScreenEntryExit } from '@shout2/ui/src/hooks/useUnifiedScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';

// ユーザー情報のインターフェース
interface UserInfo {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  level: number;
  exp: number;
  joinedAt: string;
}

// 実績のインターフェース
interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

// 統計情報のインターフェース
interface Stats {
  questsCompleted: number;
  eventsParticipated: number;
  pointsEarned: number;
  rank: number;
}

interface ProfilePageProps {
  theme?: 'blue' | 'green';
}

export function ProfilePage({ theme = 'blue' }: ProfilePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<'achievements' | 'stats'>('achievements');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  // テーマカラーの設定
  const primaryColor = theme === 'green' ? 'green' : 'blue';
  const bgGradient = theme === 'green' 
    ? 'bg-gradient-to-b from-green-900 to-black' 
    : 'bg-gradient-to-b from-blue-900 to-black';
  const buttonBgColor = theme === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';
  const tabActiveBgColor = theme === 'green' ? 'bg-green-600' : 'bg-blue-600';
  const progressBarColor = theme === 'green' ? 'bg-green-500' : 'bg-blue-500';
  const borderColor = theme === 'green' ? 'border-green-500' : 'border-blue-500';

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
        const dummyUserInfo: UserInfo = {
          id: '1',
          username: 'user123',
          displayName: 'テストユーザー',
          avatarUrl: 'https://placehold.co/100x100/gray/white?text=User',
          bio: 'これはテストユーザーのプロフィールです。自己紹介文をここに表示します。',
          level: 15,
          exp: 1500,
          joinedAt: '2025-01-15T00:00:00Z'
        };

        const dummyAchievements: Achievement[] = [
          {
            id: '1',
            name: '初めてのクエスト',
            description: '最初のクエストを完了しました',
            image: 'https://placehold.co/60x60/gold/black?text=Quest',
            isUnlocked: true,
            unlockedAt: '2025-01-16T10:30:00Z'
          },
          {
            id: '2',
            name: '5つのクエスト',
            description: '5つのクエストを完了しました',
            image: 'https://placehold.co/60x60/gold/black?text=5+Quests',
            isUnlocked: true,
            unlockedAt: '2025-01-20T15:45:00Z'
          },
          {
            id: '3',
            name: '10つのクエスト',
            description: '10つのクエストを完了しました',
            image: 'https://placehold.co/60x60/gold/black?text=10+Quests',
            isUnlocked: false
          },
          {
            id: '4',
            name: '初めてのイベント',
            description: '最初のイベントに参加しました',
            image: 'https://placehold.co/60x60/silver/black?text=Event',
            isUnlocked: true,
            unlockedAt: '2025-01-18T20:15:00Z'
          },
          {
            id: '5',
            name: 'ソーシャル連携',
            description: 'ソーシャルメディアと連携しました',
            image: 'https://placehold.co/60x60/silver/black?text=Social',
            isUnlocked: false
          },
          {
            id: '6',
            name: 'レベル10達成',
            description: 'レベル10に到達しました',
            image: 'https://placehold.co/60x60/gold/black?text=Lv.10',
            isUnlocked: true,
            unlockedAt: '2025-02-05T12:20:00Z'
          },
          {
            id: '7',
            name: 'レベル20達成',
            description: 'レベル20に到達しました',
            image: 'https://placehold.co/60x60/gold/black?text=Lv.20',
            isUnlocked: false
          },
          {
            id: '8',
            name: '初めての購入',
            description: 'ストアで初めてアイテムを購入しました',
            image: 'https://placehold.co/60x60/silver/black?text=Shop',
            isUnlocked: true,
            unlockedAt: '2025-01-25T09:10:00Z'
          }
        ];

        const dummyStats: Stats = {
          questsCompleted: 8,
          eventsParticipated: 3,
          pointsEarned: 1250,
          rank: 42
        };

        setUserInfo(dummyUserInfo);
        setAchievements(dummyAchievements);
        setStats(dummyStats);
        setBioText(dummyUserInfo.bio || '');

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const userResponse = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('ユーザー情報の取得に失敗しました。');
        }

        const userData = await userResponse.json();
        setUserInfo(userData);
        setBioText(userData.bio || '');

        const achievementsResponse = await fetch('/api/users/me/achievements', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!achievementsResponse.ok) {
          throw new Error('実績情報の取得に失敗しました。');
        }

        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);

        const statsResponse = await fetch('/api/users/me/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!statsResponse.ok) {
          throw new Error('統計情報の取得に失敗しました。');
        }

        const statsData = await statsResponse.json();
        setStats(statsData);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // タブ切り替えハンドラー
  const handleTabChange = (tab: 'achievements' | 'stats') => {
    setActiveTab(tab);
  };

  // 自己紹介編集開始ハンドラー
  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  // 自己紹介保存ハンドラー
  const handleSaveBio = async () => {
    try {
      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: bioText,
        }),
      });

      if (!response.ok) {
        throw new Error('自己紹介の更新に失敗しました。');
      }
      */

      // ダミーの更新処理
      if (userInfo) {
        setUserInfo({
          ...userInfo,
          bio: bioText,
        });
      }
      
      setIsEditingBio(false);
    } catch (error: any) {
      console.error('Update bio error:', error);
      alert(error.message || '自己紹介の更新中にエラーが発生しました。');
    }
  };

  // 自己紹介キャンセルハンドラー
  const handleCancelBio = () => {
    setBioText(userInfo?.bio || '');
    setIsEditingBio(false);
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    if (animationsEnabled) {
      navigateWithExitAnimation(path);
    } else {
      router.push(path);
    }
  };

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 経験値バーの計算
  const calculateExpPercentage = (exp: number, level: number) => {
    // レベルに応じた必要経験値の計算（仮の計算式）
    const requiredExp = level * 100;
    const currentLevelExp = exp % requiredExp;
    return Math.min(100, Math.floor((currentLevelExp / requiredExp) * 100));
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className={`w-16 h-16 border-4 ${borderColor} border-t-transparent rounded-full animate-spin`}></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className={`w-full ${buttonBgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">ユーザー情報が見つかりません</h1>
          <p className="text-gray-400 mb-4">ユーザー情報の取得に失敗しました。再度ログインしてください。</p>
          <button
            onClick={() => router.push('/')}
            className={`w-full ${buttonBgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  const expPercentage = calculateExpPercentage(userInfo.exp, userInfo.level);

  return (
    <MainLayout>
      <Header>
        <div className="text-white text-xl font-bold">プロフィール</div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        {/* ユーザー情報 */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="relative">
                <img
                  src={userInfo.avatarUrl || 'https://placehold.co/100x100/gray/white?text=User'}
                  alt={userInfo.displayName || userInfo.username}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                />
                <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${primaryColor === 'green' ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {userInfo.level}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold text-white">{userInfo.displayName || userInfo.username}</h2>
                <p className="text-gray-400 text-sm">@{userInfo.username}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>レベル {userInfo.level}</span>
                    <span>次のレベルまで</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`${progressBarColor} rounded-full h-2`}
                      style={{ width: `${expPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">自己紹介</h3>
                {!isEditingBio && (
                  <button
                    onClick={handleEditBio}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    編集
                  </button>
                )}
              </div>
              
              {isEditingBio ? (
                <div>
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded p-2 mb-2"
                    rows={3}
                    maxLength={200}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelBio}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className={`px-3 py-1 ${buttonBgColor} text-white rounded text-sm`}
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm">
                  {userInfo.bio || '自己紹介はまだ設定されていません。'}
                </p>
              )}
            </div>
            
            <div className="text-gray-400 text-sm">
              {formatDate(userInfo.joinedAt)}に参加
            </div>
          </div>
        </div>
        
        {/* タブ切り替え */}
        <div className="px-4 mb-4">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => handleTabChange('achievements')}
              className={`flex-1 py-2 text-center font-medium ${
                activeTab === 'achievements'
                  ? `${tabActiveBgColor} text-white`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              実績
            </button>
            <button
              onClick={() => handleTabChange('stats')}
              className={`flex-1 py-2 text-center font-medium ${
                activeTab === 'stats'
                  ? `${tabActiveBgColor} text-white`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              統計
            </button>
          </div>
        </div>
        
        {/* タブコンテンツ */}
        <div className="px-4">
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-gray-800/50 rounded-lg p-3 ${
                    !achievement.isUnlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={achievement.image}
                      alt={achievement.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-3">
                      <h3 className="text-white font-medium text-sm">{achievement.name}</h3>
                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <p className="text-gray-400 text-xs">
                          {formatDate(achievement.unlockedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {achievement.description}
                  </p>
                  {!achievement.isUnlocked && (
                    <div className="mt-2 text-gray-500 text-xs font-medium">
                      未獲得
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'stats' && stats && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-gray-400 text-sm mb-1">完了クエスト</h3>
                  <p className="text-white text-xl font-bold">{stats.questsCompleted}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-gray-400 text-sm mb-1">参加イベント</h3>
                  <p className="text-white text-xl font-bold">{stats.eventsParticipated}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-gray-400 text-sm mb-1">獲得ポイント</h3>
                  <p className="text-white text-xl font-bold">{stats.pointsEarned}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-gray-400 text-sm mb-1">ランキング</h3>
                  <p className="text-white text-xl font-bold">{stats.rank}位</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-white font-medium mb-2">最近の活動</h3>
                <div className="space-y-2">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <p className="text-white text-sm">クエスト「初めての訪問」を完了</p>
                      <p className="text-gray-400 text-xs">3日前</p>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <p className="text-white text-sm">「レベル10達成」の実績を獲得</p>
                      <p className="text-gray-400 text-xs">1週間前</p>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <p className="text-white text-sm">イベント「春の音楽祭」に参加</p>
                      <p className="text-gray-400 text-xs">2週間前</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Navigation 
        currentPath={pathname} 
        onNavigate={handleNavigation} 
      />
    </MainLayout>
  );
}

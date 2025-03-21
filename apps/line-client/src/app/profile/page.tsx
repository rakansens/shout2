// このファイルは、LINE クライアントのプロフィール画面です。

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';

// ユーザー情報のインターフェース
interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  joinDate: string;
  bio: string;
  stats: {
    questsCompleted: number;
    eventsParticipated: number;
    pointsEarned: number;
    rank: number;
  };
  achievements: Achievement[];
}

// 実績のインターフェース
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  isUnlocked: boolean;
}

export default function Profile() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [activeTab, setActiveTab] = useState<'achievements' | 'stats'>('achievements');

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
        const dummyProfile: UserProfile = {
          id: '1',
          username: 'LINEユーザー',
          avatar: 'https://placehold.co/300x300/green/white?text=LINE',
          level: 12,
          exp: 1200,
          nextLevelExp: 1800,
          joinDate: '2025-02-10',
          bio: 'LINEクライアントのユーザーです。音楽とアニメが好きで、友達と一緒にゲームをするのが趣味です。',
          stats: {
            questsCompleted: 35,
            eventsParticipated: 5,
            pointsEarned: 6200,
            rank: 8
          },
          achievements: [
            {
              id: '1',
              title: 'ファーストステップ',
              description: '初めてのクエストを完了しました',
              icon: '🏆',
              dateEarned: '2025-02-11',
              isUnlocked: true
            },
            {
              id: '2',
              title: 'クエストマスター',
              description: '10個のクエストを完了しました',
              icon: '🎯',
              dateEarned: '2025-02-20',
              isUnlocked: true
            },
            {
              id: '3',
              title: 'イベントチャンピオン',
              description: '5つのイベントに参加しました',
              icon: '🎪',
              dateEarned: '2025-03-15',
              isUnlocked: true
            },
            {
              id: '4',
              title: 'ポイントコレクター',
              description: '5000ポイントを獲得しました',
              icon: '💰',
              dateEarned: '2025-03-10',
              isUnlocked: true
            },
            {
              id: '5',
              title: 'レベルアップマスター',
              description: 'レベル10に到達しました',
              icon: '⭐',
              dateEarned: '2025-03-05',
              isUnlocked: true
            },
            {
              id: '6',
              title: 'トップランカー',
              description: 'ランキングでトップ10に入りました',
              icon: '🏅',
              dateEarned: '2025-03-18',
              isUnlocked: true
            },
            {
              id: '7',
              title: 'コレクター',
              description: '10個のアイテムを購入しました',
              icon: '🛒',
              dateEarned: '',
              isUnlocked: false
            },
            {
              id: '8',
              title: 'レジェンド',
              description: 'レベル20に到達しました',
              icon: '👑',
              dateEarned: '',
              isUnlocked: false
            }
          ]
        };

        setProfile(dummyProfile);
        setEditedBio(dummyProfile.bio);

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('プロフィールデータの取得に失敗しました。');
        }

        const data = await response.json();
        setProfile(data.profile);
        setEditedBio(data.profile.bio);
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

  // プロフィール編集の開始
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // プロフィール編集の保存
  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: editedBio,
        }),
      });

      if (!response.ok) {
        throw new Error('プロフィールの更新に失敗しました。');
      }

      const data = await response.json();
      */

      // ダミーの更新処理
      setProfile({
        ...profile,
        bio: editedBio
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Update error:', error);
      alert(error.message || 'プロフィールの更新中にエラーが発生しました。');
    }
  };

  // プロフィール編集のキャンセル
  const handleCancelEdit = () => {
    if (profile) {
      setEditedBio(profile.bio);
    }
    setIsEditing(false);
  };

  // タブ切り替え
  const handleTabChange = (tab: 'achievements' | 'stats') => {
    setActiveTab(tab);
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // プロフィールクリック処理
  const handleProfileClick = () => {
    // 既にプロフィールページにいるので何もしない
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900 to-black text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900 to-black text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">プロフィールデータが見つかりません。</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            トップページに戻る
          </button>
        </div>
      </div>
    );
  }

  // 経験値のパーセンテージを計算
  const expPercentage = (profile.exp / profile.nextLevelExp) * 100;

  return (
    <MainLayout>
      <Header onProfileClick={handleProfileClick}>
        <div className="text-white text-xl font-bold">プロフィール</div>
      </Header>
      
      <div className="min-h-screen pb-20 pt-24">
        {/* プロフィールヘッダー */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                <img 
                  src={profile.avatar} 
                  alt={profile.username} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold text-white">{profile.username}</h1>
                  {!isEditing && (
                    <button
                      onClick={handleEditProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                    >
                      編集
                    </button>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                    Lv.{profile.level}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(profile.joinDate).toLocaleDateString('ja-JP')}から参加
                  </span>
                </div>
              </div>
            </div>

            {/* 経験値バー */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>EXP: {profile.exp}/{profile.nextLevelExp}</span>
                <span>{expPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${expPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* 自己紹介 */}
            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-300 mb-2">自己紹介</h2>
              {isEditing ? (
                <div>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    maxLength={200}
                  ></textarea>
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="px-4 mb-4">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => handleTabChange('achievements')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'achievements'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              実績
            </button>
            <button
              onClick={() => handleTabChange('stats')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'stats'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-gray-300'
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
              {profile.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`bg-gray-800/50 rounded-lg p-3 ${
                    !achievement.isUnlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{achievement.icon}</span>
                    <h3 className="font-medium text-white">{achievement.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                  {achievement.isUnlocked ? (
                    <p className="text-xs text-gray-500">
                      獲得日: {new Date(achievement.dateEarned).toLocaleDateString('ja-JP')}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">未獲得</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">完了クエスト</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.questsCompleted}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">参加イベント</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.eventsParticipated}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">獲得ポイント</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.pointsEarned.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">現在のランク</h3>
                  <p className="text-2xl font-bold text-white">{profile.stats.rank}位</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">活動履歴</h3>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">
                    このセクションでは、ユーザーの活動履歴やプレイパターンの分析が表示されます。
                    APIが実装されたら、実際のデータに置き換えられます。
                  </p>
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';
import { Song } from '@shout2/ui/src/components/Song';

interface SongData {
  id: string;
  title: string;
  artist: string;
  isPremium: boolean;
  points: number;
  stars: number;
}

export default function Play() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<SongData[]>([]);

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
        setSongs([
          {
            id: '1',
            title: 'ポップソング',
            artist: 'アーティスト1',
            isPremium: false,
            points: 100,
            stars: 5
          },
          {
            id: '2',
            title: 'ロックソング',
            artist: 'アーティスト2',
            isPremium: false,
            points: 150,
            stars: 4
          },
          {
            id: '3',
            title: 'プレミアムソング',
            artist: 'アーティスト3',
            isPremium: true,
            points: 200,
            stars: 10
          }
        ]);

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        // 楽曲データの取得
        const songsResponse = await fetch('/api/songs', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!songsResponse.ok) {
          throw new Error('楽曲データの取得に失敗しました。');
        }

        const songsData = await songsResponse.json();
        setSongs(songsData.data.songs || []);
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

  // 楽曲クリック処理
  const handleSongClick = (songId: string) => {
    if (animationsEnabled) {
      navigateWithExitAnimation(`/game?songId=${songId}`);
    } else {
      router.push(`/game?songId=${songId}`);
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
        <div className="text-white text-xl font-bold">楽曲</div>
      </Header>
      
      <div className={`min-h-screen pb-20 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">楽曲一覧</h2>
          <div className="space-y-4">
            {songs.map((song, index) => (
              <div key={song.id} className={`${isLoaded && animationsEnabled ? `song-animate-entry delay-${index + 1}` : ''}`}>
                <Song
                  tall
                  isPremium={song.isPremium}
                  onClick={() => handleSongClick(song.id)}
                />
              </div>
            ))}
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

// このファイルは、LINE クライアントのホーム画面です。

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';
import { QuestCard } from '@shout2/ui/src/components/ui/quest-card';
import { CharacterPanel } from '@shout2/ui/src/components/ui/character-panel';
import { EventCarousel } from '@shout2/ui/src/components/Carousel/EventCarousel';

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  image?: string;
}

interface Character {
  name: string;
  level: number;
  currentExp: number;
  maxExp: number;
  image: string;
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [events, setEvents] = useState<any[]>([]);

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
        setQuests([
          {
            id: '1',
            title: 'デイリーログイン',
            description: '毎日ログインして報酬をゲット',
            progress: 1,
            total: 1,
            reward: 10,
            completed: true,
            image: 'https://placehold.co/100x100/green/white?text=Login'
          },
          {
            id: '2',
            title: 'フレンド招待',
            description: '友達を招待してポイントをゲット',
            progress: 2,
            total: 5,
            reward: 50,
            completed: false,
            image: 'https://placehold.co/100x100/green/white?text=Invite'
          },
          {
            id: '3',
            title: 'プロフィール設定',
            description: 'プロフィールを完成させよう',
            progress: 3,
            total: 5,
            reward: 30,
            completed: false,
            image: 'https://placehold.co/100x100/green/white?text=Profile'
          }
        ]);

        setCharacter({
          name: 'LINEユーザー',
          level: 5,
          currentExp: 350,
          maxExp: 500,
          image: 'https://placehold.co/200x200/green/white?text=Avatar'
        });

        setEvents([
          {
            id: '1',
            title: '春のキャンペーン',
            description: '期間限定イベント開催中！',
            points: '100',
            backgroundImage: 'https://placehold.co/800x400/green/white?text=Spring+Event',
            badgeType: 'イベント'
          },
          {
            id: '2',
            title: 'ポイント2倍キャンペーン',
            description: '今週末はポイント2倍！',
            points: '200',
            backgroundImage: 'https://placehold.co/800x400/darkgreen/white?text=Double+Points',
            badgeType: 'キャンペーン'
          },
          {
            id: '3',
            title: '新機能リリース',
            description: '新しい機能が追加されました',
            points: '50',
            backgroundImage: 'https://placehold.co/800x400/forestgreen/white?text=New+Features',
            badgeType: 'お知らせ'
          }
        ]);

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        // クエストデータの取得
        const questsResponse = await fetch('/api/quests', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!questsResponse.ok) {
          throw new Error('クエストデータの取得に失敗しました。');
        }

        const questsData = await questsResponse.json();
        setQuests(questsData.data.quests || []);

        // キャラクターデータの取得
        const characterResponse = await fetch('/api/character', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!characterResponse.ok) {
          throw new Error('キャラクターデータの取得に失敗しました。');
        }

        const characterData = await characterResponse.json();
        setCharacter(characterData.data.character || null);

        // イベントデータの取得
        const eventsResponse = await fetch('/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました。');
        }

        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data.events || []);
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

  // クエスト進捗の更新
  const handleQuestProgress = async (questId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push('/');
        return;
      }

      // APIエンドポイントが実装されるまでのダミー処理
      // 実際のAPIが実装されたら、このダミー処理は削除してください
      setQuests(quests.map(quest => 
        quest.id === questId 
          ? { 
              ...quest, 
              progress: Math.min(quest.progress + 1, quest.total), 
              completed: quest.progress + 1 >= quest.total 
            } 
          : quest
      ));

      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch(`/api/quests/${questId}/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('クエスト進捗の更新に失敗しました。');
      }

      const data = await response.json();
      
      // クエストリストを更新
      setQuests(quests.map(quest => 
        quest.id === questId 
          ? { 
              ...quest, 
              progress: data.data.progress, 
              completed: data.data.completed 
            } 
          : quest
      ));
      */

    } catch (error: any) {
      console.error('Quest progress error:', error);
      setError(error.message || 'クエスト進捗の更新中にエラーが発生しました。');
    }
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // プロフィールクリック処理
  const handleProfileClick = () => {
    router.push('/profile');
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

  // ダミーのキャラクターバリエーションとアイテム
  const characterVariations = [
    { id: 1, unlocked: true, image: 'https://placehold.co/28x28/green/white?text=A', label: 'A' },
    { id: 2, unlocked: true, image: 'https://placehold.co/28x28/green/white?text=B', label: 'B' },
    { id: 3, unlocked: false },
    { id: 4, unlocked: false },
  ];

  const specialItems = [
    { id: 1, unlocked: true, image: 'https://placehold.co/16x26/gold/white?text=I' },
    { id: 2, unlocked: false },
    { id: 3, unlocked: false },
    { id: 4, unlocked: false },
  ];

  return (
    <MainLayout>
      <Header onProfileClick={handleProfileClick}>
        <div className="text-white text-xl font-bold">Shout2</div>
      </Header>
      
      <div className="min-h-screen pb-20">
        {/* キャラクターセクション */}
        {character && (
          <div className="p-4 mb-6">
            <CharacterPanel
              name={character.name}
              level={character.level}
              currentExp={character.currentExp}
              maxExp={character.maxExp}
              variations={characterVariations}
              specialItems={specialItems}
            />
          </div>
        )}

        {/* イベントカルーセル */}
        {events.length > 0 && (
          <div className="px-4 mb-6">
            <h2 className="text-lg font-bold mb-2">イベント</h2>
            <EventCarousel items={events} />
          </div>
        )}

        {/* クエストセクション */}
        <div className="px-4">
          <h2 className="text-lg font-bold mb-2">クエスト</h2>
          <div className="space-y-4">
            {quests.map((quest, index) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                subtitle={quest.description}
                completed={`${quest.progress}/${quest.total}`}
                bgColor="bg-[#007536]"
                isCompleted={quest.completed}
                backgroundImage={quest.image || ''}
                index={index}
              />
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

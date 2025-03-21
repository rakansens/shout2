// このファイルは、TON（Telegram）クライアントのホーム画面です。

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

    } catch (error: any) {
      console.error('Quest progress error:', error);
      setError(error.message || 'クエスト進捗の更新中にエラーが発生しました。');
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white pb-20">
      {/* キャラクターセクション */}
      {character && (
        <div className="p-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
            <div className="relative w-24 h-24 mr-4">
              {character.image && (
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{character.name}</h2>
              <p className="text-sm text-gray-300">レベル {character.level}</p>
              <div className="mt-2 bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(character.currentExp / character.maxExp) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                EXP: {character.currentExp} / {character.maxExp}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* イベントカルーセル */}
      {events.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-lg font-bold mb-2">イベント</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4">
              {events.map((event, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-80 h-40 bg-gray-800 rounded-lg overflow-hidden relative"
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-300">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* クエストセクション */}
      <div className="px-4">
        <h2 className="text-lg font-bold mb-2">クエスト</h2>
        <div className="space-y-4">
          {quests.map((quest) => (
            <div 
              key={quest.id} 
              className="bg-gray-800/50 rounded-lg p-4"
            >
              <div className="flex items-center">
                {quest.image && (
                  <div className="w-16 h-16 mr-4 rounded overflow-hidden">
                    <img
                      src={quest.image}
                      alt={quest.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold">{quest.title}</h3>
                  <p className="text-sm text-gray-300">{quest.description}</p>
                  <div className="mt-2 flex items-center">
                    <div className="flex-1 bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${quest.completed ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs whitespace-nowrap">
                      {quest.progress}/{quest.total}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-center">
                  <span className="text-yellow-400 font-bold">{quest.reward}</span>
                  <span className="text-xs text-gray-400">ポイント</span>
                  {!quest.completed && (
                    <button
                      onClick={() => handleQuestProgress(quest.id)}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                      進める
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

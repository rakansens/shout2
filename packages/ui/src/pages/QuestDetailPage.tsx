// このファイルは、共通のクエスト詳細ページコンポーネントです。
// Next.js互換のナビゲーションとアニメーションを使用しています。

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUnifiedScreenEntryExit } from '@shout2/ui/src/hooks/useUnifiedScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Progress } from '@shout2/ui/src/components/ui/progress';

// クエスト情報のインターフェース
interface QuestInfo {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  image: string;
  tasks: QuestTask[];
  expiresAt?: string;
}

// クエストタスクのインターフェース
interface QuestTask {
  id: string;
  description: string;
  completed: boolean;
  progress?: number;
  total?: number;
}

interface QuestDetailPageProps {
  theme?: 'blue';
}

export function QuestDetailPage({ theme = 'blue' }: QuestDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questInfo, setQuestInfo] = useState<QuestInfo | null>(null);
  
  // テーマカラーの設定（青系のみ）
  const primaryColor = 'blue';
  const bgGradient = 'bg-gradient-to-b from-blue-900 to-black';
  const buttonBgColor = 'bg-blue-600 hover:bg-blue-700';
  const borderColor = 'border-blue-500';
  const textColor = 'text-blue-500';

  // URLからquestIdを取得
  const getQuestIdFromUrl = () => {
    // Next.jsのパスからIDを抽出
    const segments = pathname.split('/');
    const questsIndex = segments.findIndex(segment => segment === 'quests');
    if (questsIndex !== -1 && questsIndex < segments.length - 1) {
      return segments[questsIndex + 1];
    }
    return null;
  };

  const questId = getQuestIdFromUrl();

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      if (!questId) {
        setError('クエストIDが見つかりません。');
        setIsLoading(false);
        return;
      }

      try {
        // APIエンドポイントが実装されるまでのダミーデータ
        // 実際のAPIが実装されたら、このダミーデータは削除してください
        const dummyQuestInfo: QuestInfo = {
          id: questId,
          title: 'デイリーミッション',
          description: '毎日のタスクをこなして報酬をゲット！',
          progress: 2,
          total: 5,
          reward: 100,
          completed: false,
          image: 'https://c.animaapp.com/15WuGcx7/img/feature-song.png',
          tasks: [
            {
              id: '1',
              description: '1曲プレイする',
              completed: true
            },
            {
              id: '2',
              description: '友達を1人招待する',
              completed: true
            },
            {
              id: '3',
              description: 'プロフィールを更新する',
              completed: false
            },
            {
              id: '4',
              description: '3曲連続でプレイする',
              completed: false,
              progress: 1,
              total: 3
            },
            {
              id: '5',
              description: 'ランキングで上位10位以内に入る',
              completed: false
            }
          ],
          expiresAt: new Date(Date.now() + 86400000).toISOString() // 24時間後
        };

        setQuestInfo(dummyQuestInfo);
        
        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const response = await fetch(`/api/quests/${questId}`);
        if (!response.ok) {
          throw new Error('クエスト情報の取得に失敗しました。');
        }
        const data = await response.json();
        setQuestInfo(data);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [questId, pathname]);

  // タスク完了ハンドラー
  const handleCompleteTask = async (taskId: string) => {
    if (!questInfo) return;
    
    try {
      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch(`/api/quests/${questId}/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('タスク完了の処理に失敗しました。');
      }

      const result = await response.json();
      */

      // ダミーのタスク完了処理
      const updatedTasks = questInfo.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: true };
        }
        return task;
      });
      
      const completedTasksCount = updatedTasks.filter(task => task.completed).length;
      const isQuestCompleted = completedTasksCount === questInfo.total;
      
      setQuestInfo({
        ...questInfo,
        tasks: updatedTasks,
        progress: completedTasksCount,
        completed: isQuestCompleted
      });
      
      if (isQuestCompleted) {
        // クエスト完了時の処理
        alert(`おめでとうございます！クエストを完了し、${questInfo.reward}ポイントを獲得しました！`);
      }
    } catch (error: any) {
      console.error('Task completion error:', error);
      alert(error.message || 'タスク完了の処理中にエラーが発生しました。');
    }
  };

  // 戻るボタンハンドラー
  const handleBack = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/home');
    } else {
      router.push('/home');
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

  // 残り時間計算関数
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return '期限切れ';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}時間${diffMins}分`;
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
  if (!questInfo) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">クエスト情報が見つかりません</h1>
          <p className="text-gray-400 mb-4">クエスト情報の取得に失敗しました。</p>
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
          <div className="text-white text-xl font-bold">クエスト詳細</div>
        </div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        <div className="px-4 mb-6">
          {/* クエスト情報 */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div 
                className="w-24 h-24 rounded-lg mb-4 md:mb-0 md:mr-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${questInfo.image})` }}
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl font-bold text-white mb-1">{questInfo.title}</h1>
                <p className="text-gray-400 mb-3">{questInfo.description}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-sm font-bold">{questInfo.reward} ポイント</span>
                  </div>
                  
                  {questInfo.expiresAt && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400 text-sm">残り {getTimeRemaining(questInfo.expiresAt)}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-xs">進捗状況</span>
                    <span className="text-white text-xs font-medium">{questInfo.progress}/{questInfo.total}</span>
                  </div>
                  <Progress 
                    value={(questInfo.progress / questInfo.total) * 100} 
                    className="h-2 bg-gray-700"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* タスク一覧 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h2 className="text-lg font-bold text-white mb-4">タスク</h2>
            
            <div className="space-y-4">
              {questInfo.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-lg ${task.completed ? 'bg-blue-900/30' : 'bg-gray-700/30'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${task.completed ? 'bg-blue-500' : 'bg-gray-600'} flex items-center justify-center mr-3`}>
                      {task.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${task.completed ? 'text-gray-300 line-through' : 'text-white'}`}>
                        {task.description}
                      </p>
                      
                      {task.progress !== undefined && task.total !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-xs">進捗</span>
                            <span className="text-white text-xs">{task.progress}/{task.total}</span>
                          </div>
                          <Progress 
                            value={(task.progress / task.total) * 100} 
                            className="h-1.5 bg-gray-700"
                            indicatorClassName="bg-blue-500"
                          />
                        </div>
                      )}
                    </div>
                    
                    {!task.completed && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="ml-2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300"
                      >
                        完了
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {questInfo.completed && (
              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg text-center">
                <h3 className="text-lg font-bold text-white mb-2">クエスト完了！</h3>
                <p className="text-gray-300 mb-3">おめでとうございます！すべてのタスクを完了しました。</p>
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-bold">{questInfo.reward} ポイント獲得！</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// このファイルは、共通のプレゲームページコンポーネントです。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUnifiedScreenEntryExit } from '@shout2/ui/src/hooks/useUnifiedScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { PreGame } from '@shout2/ui/src/components/PreGame';

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

// コメント情報のインターフェース
interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface PreGamePageProps {
  theme?: 'blue';
}

export function PreGamePage({ theme = 'blue' }: PreGamePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // テーマカラーの設定（青系のみ）
  const primaryColor = 'blue';
  const bgGradient = 'bg-gradient-to-b from-blue-900 to-black';
  const buttonBgColor = 'bg-blue-600 hover:bg-blue-700';
  const borderColor = 'border-blue-500';

  // URLからsongIdを取得
  const getSongIdFromUrl = () => {
    // Next.jsのパスからIDを抽出
    const segments = pathname.split('/');
    const pregameIndex = segments.findIndex(segment => segment === 'pregame');
    if (pregameIndex !== -1 && pregameIndex < segments.length - 1) {
      return segments[pregameIndex + 1];
    }
    return null;
  };

  const songId = getSongIdFromUrl();

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

        const dummyComments: Comment[] = [
          {
            id: '1',
            userId: '101',
            username: 'ユーザー1',
            avatarUrl: 'https://placehold.co/50x50/blue/white?text=U1',
            content: 'とても良い曲ですね！何度も聴いています。',
            createdAt: '2025-03-10T10:30:00Z',
            likes: 15,
            isLiked: true
          },
          {
            id: '2',
            userId: '102',
            username: 'ユーザー2',
            avatarUrl: 'https://placehold.co/50x50/green/white?text=U2',
            content: 'リズムが心地よくて、ついつい口ずさんでしまいます。',
            createdAt: '2025-03-12T15:45:00Z',
            likes: 8,
            isLiked: false
          },
          {
            id: '3',
            userId: '103',
            username: 'ユーザー3',
            avatarUrl: 'https://placehold.co/50x50/red/white?text=U3',
            content: 'この曲のメロディーラインが好きです。アーティストの他の曲も聴いてみたいと思います。',
            createdAt: '2025-03-15T09:20:00Z',
            likes: 12,
            isLiked: false
          },
          {
            id: '4',
            userId: '104',
            username: 'ユーザー4',
            avatarUrl: 'https://placehold.co/50x50/purple/white?text=U4',
            content: 'ゲームでプレイするのが楽しみです！難易度はちょうど良いですね。',
            createdAt: '2025-03-18T14:10:00Z',
            likes: 5,
            isLiked: true
          }
        ];

        setSongInfo(dummySongInfo);
        setComments(dummyComments);

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const songResponse = await fetch(`/api/songs/${songId}`);
        if (!songResponse.ok) {
          throw new Error('楽曲情報の取得に失敗しました。');
        }
        const songData = await songResponse.json();
        setSongInfo(songData);

        const commentsResponse = await fetch(`/api/songs/${songId}/comments`);
        if (!commentsResponse.ok) {
          throw new Error('コメントの取得に失敗しました。');
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments || []);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [songId, pathname]);

  // コメント投稿ハンドラー
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !songId) return;
    
    setIsSubmitting(true);
    
    try {
      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch(`/api/songs/${songId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          content: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error('コメントの投稿に失敗しました。');
      }

      const newComment = await response.json();
      */

      // ダミーの新規コメント
      const newComment: Comment = {
        id: `new-${Date.now()}`,
        userId: 'current-user',
        username: '自分',
        avatarUrl: 'https://placehold.co/50x50/orange/white?text=Me',
        content: commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false
      };

      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (error: any) {
      console.error('Comment submit error:', error);
      alert(error.message || 'コメントの投稿中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // いいねハンドラー
  const handleLike = async (commentId: string) => {
    try {
      // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
      /*
      const response = await fetch(`/api/songs/${songId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('いいねの処理に失敗しました。');
      }

      const result = await response.json();
      */

      // ダミーのいいね処理
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    } catch (error: any) {
      console.error('Like error:', error);
      alert(error.message || 'いいねの処理中にエラーが発生しました。');
    }
  };

  // プレイボタンハンドラー
  const handlePlay = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation(`/game/${songId}`);
    } else {
      router.push(`/game/${songId}`);
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

  // 時間フォーマット関数
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            onClick={handleBack}
            className={`w-full ${buttonBgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!songInfo) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">楽曲情報が見つかりません</h1>
          <p className="text-gray-400 mb-4">楽曲情報の取得に失敗しました。</p>
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
          <div className="text-white text-xl font-bold">楽曲詳細</div>
        </div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        {/* 楽曲情報 */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <img
                src={songInfo.coverImage}
                alt={songInfo.title}
                className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-white mb-1">{songInfo.title}</h1>
                <p className="text-gray-400 mb-2">{songInfo.artist}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                    {songInfo.category}
                  </span>
                  <span className={`bg-gray-700 ${getDifficultyColor(songInfo.difficulty)} text-xs px-2 py-1 rounded`}>
                    {getDifficultyText(songInfo.difficulty)}
                  </span>
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                    {formatDuration(songInfo.duration)}
                  </span>
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                    BPM {songInfo.bpm}
                  </span>
                </div>
                <div className="flex justify-center md:justify-start items-center gap-4 mb-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{songInfo.playCount} 回再生</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{songInfo.rating.toFixed(1)}</span>
                  </div>
                </div>
                {songInfo.description && (
                  <p className="text-gray-300 text-sm">{songInfo.description}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <button
                onClick={handlePlay}
                className={`${buttonBgColor} text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 flex items-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                プレイする
              </button>
            </div>
          </div>
        </div>
        
        {/* コメントセクション */}
        <div className="px-4">
          <h2 className="text-xl font-bold text-white mb-4">コメント</h2>
          
          {/* コメント投稿フォーム */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1 bg-gray-700 text-white rounded-l p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className={`${buttonBgColor} text-white px-4 rounded-r focus:outline-none focus:shadow-outline transition duration-300 ${
                  isSubmitting || !commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                投稿
              </button>
            </div>
          </form>
          
          {/* コメント一覧 */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start">
                    <img
                      src={comment.avatarUrl || 'https://placehold.co/50x50/gray/white?text=User'}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium text-white">{comment.username}</h3>
                        <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center text-xs ${
                          comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        } transition duration-300`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-400">まだコメントはありません。最初のコメントを投稿しましょう！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

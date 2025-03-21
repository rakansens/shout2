'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';
import { useAnimationSettings } from '@shout2/ui/src/contexts/AnimationSettingsContext';

// 個別にコンポーネントをインポート
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Card, CardContent, CardFooter, CardHeader } from '@shout2/ui/src/components/ui/card';
import { Button } from '@shout2/ui/src/components/ui/button';
import { Avatar, AvatarFallback } from '@shout2/ui/src/components/ui/avatar';
import { StarIcon, MusicIcon, Gamepad2Icon, ArrowLeftIcon } from 'lucide-react';

interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: string;
}

interface SongData {
  id: string;
  title: string;
  artist: string;
  isPremium: boolean;
  points: number;
  stars: number;
  comments: Comment[];
}

export default function PreGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get('songId') || '1';
  const { isLoaded, isExiting, navigateWithExitAnimation } = useNextScreenEntryExit();
  const { animationsEnabled } = useAnimationSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [song, setSong] = useState<SongData | null>(null);
  const [newComment, setNewComment] = useState('');

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
        setSong({
          id: songId,
          title: songId === '1' ? 'ポップソング' : songId === '2' ? 'ロックソング' : 'プレミアムソング',
          artist: songId === '1' ? 'アーティスト1' : songId === '2' ? 'アーティスト2' : 'アーティスト3',
          isPremium: songId === '3',
          points: songId === '3' ? 200 : songId === '2' ? 150 : 100,
          stars: songId === '3' ? 10 : songId === '2' ? 4 : 5,
          comments: [
            {
              id: '1',
              username: 'user123',
              content: 'この曲は最高！リズムが良くて楽しい！',
              timestamp: '2025-03-20T15:30:00Z'
            },
            {
              id: '2',
              username: 'gamer456',
              content: 'ちょっと難しいけど、やりがいがある。',
              timestamp: '2025-03-19T12:45:00Z'
            }
          ]
        });

        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        // 楽曲データの取得
        const songResponse = await fetch(`/api/songs/${songId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!songResponse.ok) {
          throw new Error('楽曲データの取得に失敗しました。');
        }

        const songData = await songResponse.json();
        setSong(songData.data.song || null);
        */

      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, songId]);

  // 戻るボタンのハンドラ
  const handleBack = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/play');
    } else {
      router.push('/play');
    }
  };

  // プレイボタンのハンドラ
  const handlePlay = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation(`/game?songId=${songId}`);
    } else {
      router.push(`/game?songId=${songId}`);
    }
  };

  // コメント送信ハンドラ
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // 実際のAPIが実装されたら、ここでコメントを送信する
    // 今はダミーデータを追加するだけ
    if (song) {
      const newCommentObj: Comment = {
        id: `temp-${Date.now()}`,
        username: 'あなた',
        content: newComment,
        timestamp: new Date().toISOString()
      };
      
      setSong({
        ...song,
        comments: [newCommentObj, ...song.comments]
      });
      
      setNewComment('');
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

  if (error || !song) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error || '楽曲データが見つかりませんでした。'}</p>
          <button
            onClick={() => router.push('/play')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            楽曲選択に戻る
          </button>
        </div>
      </div>
    );
  }

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MainLayout>
      <Header>
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={handleBack}
            className={`text-white p-2 rounded-full hover:bg-blue-700/50 transition-all ${isLoaded && animationsEnabled ? 'pregame-back-animate-entry' : ''}`}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="text-white text-xl font-bold">曲の詳細</div>
          <div className="w-10"></div> {/* スペーサー */}
        </div>
      </Header>
      
      <div className={`min-h-screen pb-20 ${isLoaded && animationsEnabled ? 'animate-entry' : ''} ${isExiting && animationsEnabled ? 'animate-exit' : ''}`}>
        <div className="p-4">
          {/* 楽曲カード */}
          <Card 
            className={`w-full h-[258px] rounded-[14px] overflow-hidden p-0 bg-[url(https://c.animaapp.com/xTS05oxV/img/feature-song.png)] bg-cover bg-[50%_50%] flex flex-col justify-between border-0 mb-6 ${isLoaded && animationsEnabled ? 'pregame-card-animate-entry' : ''}`}
          >
            <CardHeader className="p-0 space-y-0">
              <div className="justify-between px-2.5 py-0 w-full bg-[#4b4edccc] rounded-[14px_14px_0px_0px] overflow-hidden backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] flex items-center">
                <div className="gap-2 px-0 py-1 flex-1 grow flex items-center">
                  <div className="flex flex-col w-[17px] items-center justify-center relative">
                    <div className="relative w-[19px] h-[19px] ml-[-1.00px] mr-[-1.00px] rounded-[9.5px] border border-solid border-white" />
                    {song.isPremium ? (
                      <div className="absolute w-[13px] h-[13px] top-[3px] left-[2px]">
                        <MusicIcon
                          className="text-white"
                          size={13}
                          strokeWidth={2}
                        />
                      </div>
                    ) : (
                      <MusicIcon
                        className="absolute w-[13px] h-[13px] top-0.5 left-px text-white"
                      />
                    )}
                  </div>
                  <div className="relative w-fit [font-family:'Good_Times-Book',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    {song.title}
                  </div>
                </div>
                <div className="inline-flex flex-col items-center justify-center pt-1 pb-0 px-0 relative">
                  <StarIcon className="relative w-[34.61px] h-[33.21px] text-white fill-white" />
                  <div className="absolute h-[19px] top-3.5 left-3.2 [font-family:'Good_Times-Heavy',Helvetica] font-normal text-[#3c43bd] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    {song.stars}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-grow flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-white text-2xl font-bold mb-2">{song.title}</h2>
                <p className="text-white/80 text-lg">{song.artist}</p>
              </div>
            </CardContent>

            <CardFooter className="p-0 w-full">
              <div className="flex items-center justify-between px-[18px] py-0 w-full bg-[#00000080] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px) brightness(100%)]">
                <div className="inline-flex items-center gap-2.5">
                  <Avatar className="w-[21px] h-[21px] bg-[#d9d9d9] rounded-[10.5px]">
                    <AvatarFallback className="bg-[#d9d9d9]">P</AvatarFallback>
                  </Avatar>
                  <div className="[font-family:'Good_Times-Light',Helvetica] font-light text-white text-[13px] tracking-[0] leading-[normal]">
                    player123
                  </div>
                </div>
                <div className="inline-flex items-center justify-center gap-1.5 py-1.5">
                  <Gamepad2Icon className="w-[19px] h-[19px] text-white" />
                  <div className="mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    {song.points}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* 曲の情報 */}
          <div className={`mb-6 ${isLoaded && animationsEnabled ? 'pregame-info-animate-entry' : ''}`}>
            <h2 className="text-xl font-bold mb-3">曲の情報</h2>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">アーティスト</p>
                  <p className="text-white">{song.artist}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">難易度</p>
                  <p className="text-white">{song.isPremium ? '高い' : '普通'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">獲得可能ポイント</p>
                  <p className="text-white">{song.points}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">評価</p>
                  <p className="text-white flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1 inline" />
                    {song.stars}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* コメント欄 */}
          <div className={`mb-6 ${isLoaded && animationsEnabled ? 'pregame-comments-animate-entry' : ''}`}>
            <h2 className="text-xl font-bold mb-3">コメント</h2>
            
            {/* コメント入力フォーム */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <textarea
                className="w-full bg-gray-700 text-white rounded-lg p-3 mb-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="コメントを入力..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  送信
                </Button>
              </div>
            </div>
            
            {/* コメント一覧 */}
            <div className="space-y-4">
              {song.comments.length === 0 ? (
                <p className="text-gray-400 text-center py-4">まだコメントはありません。最初のコメントを投稿しましょう！</p>
              ) : (
                song.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback className="bg-blue-600">{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold">{comment.username}</p>
                        <p className="text-gray-400 text-xs">{formatDate(comment.timestamp)}</p>
                      </div>
                    </div>
                    <p className="text-white">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* プレイボタン */}
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-bold rounded-lg"
              onClick={handlePlay}
            >
              プレイする
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

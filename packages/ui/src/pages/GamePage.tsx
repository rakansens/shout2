// このファイルは、共通のゲームページコンポーネントです。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

'use client';

import React, { useEffect, useState, useRef } from 'react';
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

// ゲームの状態を表す列挙型
enum GameState {
  LOADING,
  COUNTDOWN,
  PLAYING,
  PAUSED,
  COMPLETED,
  ERROR
}

// ノートの種類を表す列挙型
enum NoteType {
  TAP,
  HOLD,
  SWIPE_LEFT,
  SWIPE_RIGHT,
  SWIPE_UP,
  SWIPE_DOWN
}

// ノートのインターフェース
interface Note {
  id: number;
  type: NoteType;
  time: number; // ミリ秒単位
  duration?: number; // ホールドノートの場合の長さ（ミリ秒）
  lane: number; // レーン（0-3）
  hit?: boolean; // ヒットしたかどうか
  score?: number; // 獲得スコア
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
}

interface GamePageProps {
  theme?: 'blue' | 'green';
}

export function GamePage({ theme = 'blue' }: GamePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isExiting, navigateWithExitAnimation } = useUnifiedScreenEntryExit(pathname);
  const { animationsEnabled } = useAnimationSettings();
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [great, setGreat] = useState(0);
  const [good, setGood] = useState(0);
  const [miss, setMiss] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ゲームキャンバスの参照
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // アニメーションフレームの参照
  const animationFrameRef = useRef<number | null>(null);
  // ゲーム開始時間の参照
  const gameStartTimeRef = useRef<number | null>(null);
  // 一時停止時間の参照
  const pauseTimeRef = useRef<number | null>(null);
  // 一時停止前の経過時間の参照
  const pausedElapsedTimeRef = useRef<number>(0);
  
  // テーマカラーの設定
  const primaryColor = theme === 'green' ? 'green' : 'blue';
  const bgGradient = theme === 'green' 
    ? 'bg-gradient-to-b from-green-900 to-black' 
    : 'bg-gradient-to-b from-blue-900 to-black';
  const buttonBgColor = theme === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';
  const borderColor = theme === 'green' ? 'border-green-500' : 'border-blue-500';
  const textColor = theme === 'green' ? 'text-green-500' : 'text-blue-500';

  // URLからsongIdを取得
  const getSongIdFromUrl = () => {
    // Next.jsのパスからIDを抽出
    const segments = pathname.split('/');
    const gameIndex = segments.findIndex(segment => segment === 'game');
    if (gameIndex !== -1 && gameIndex < segments.length - 1) {
      return segments[gameIndex + 1];
    }
    return null;
  };

  const songId = getSongIdFromUrl();

  // 楽曲情報の取得
  useEffect(() => {
    const fetchSongInfo = async () => {
      if (!songId) {
        setError('楽曲IDが見つかりません。');
        setGameState(GameState.ERROR);
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

        setSongInfo(dummySongInfo);

        // ダミーのノートデータを生成
        const dummyNotes: Note[] = [];
        const songDurationMs = dummySongInfo.duration * 1000;
        const notesCount = Math.floor(songDurationMs / 500); // 約500ミリ秒ごとにノート

        for (let i = 0; i < notesCount; i++) {
          const noteTime = 3000 + (i * 500); // 3秒のカウントダウン後から開始
          const noteType = Math.floor(Math.random() * 6) as NoteType;
          const lane = Math.floor(Math.random() * 4);
          
          const note: Note = {
            id: i,
            type: noteType,
            time: noteTime,
            lane: lane,
            hit: false
          };
          
          // ホールドノートの場合は長さを設定
          if (noteType === NoteType.HOLD) {
            note.duration = Math.floor(Math.random() * 1000) + 500; // 500〜1500ミリ秒
          }
          
          dummyNotes.push(note);
        }
        
        setNotes(dummyNotes);
        
        // 実際のAPIリクエストは以下のようになります（APIが実装されたら有効化）
        /*
        const songResponse = await fetch(`/api/songs/${songId}`);
        if (!songResponse.ok) {
          throw new Error('楽曲情報の取得に失敗しました。');
        }
        const songData = await songResponse.json();
        setSongInfo(songData);

        const notesResponse = await fetch(`/api/songs/${songId}/notes`);
        if (!notesResponse.ok) {
          throw new Error('ノートデータの取得に失敗しました。');
        }
        const notesData = await notesResponse.json();
        setNotes(notesData.notes || []);
        */

        // カウントダウン開始
        setGameState(GameState.COUNTDOWN);
        
      } catch (error: any) {
        console.error('Data fetch error:', error);
        setError(error.message || 'データの取得中にエラーが発生しました。');
        setGameState(GameState.ERROR);
      }
    };

    fetchSongInfo();
  }, [songId, pathname]);

  // カウントダウン処理
  useEffect(() => {
    if (gameState !== GameState.COUNTDOWN) return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState(GameState.PLAYING);
          gameStartTimeRef.current = Date.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [gameState]);

  // ゲームループ
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const gameLoop = (timestamp: number) => {
      if (!gameStartTimeRef.current) return;
      
      // 経過時間の計算
      const elapsedTime = pausedElapsedTimeRef.current + (Date.now() - gameStartTimeRef.current);
      setCurrentTime(elapsedTime);
      
      // キャンバスの描画
      drawGame(elapsedTime);
      
      // ノートの判定
      checkNotes(elapsedTime);
      
      // ゲーム終了判定
      if (songInfo && elapsedTime >= songInfo.duration * 1000) {
        endGame();
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, songInfo]);

  // キャンバスの描画
  const drawGame = (elapsedTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスのクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景の描画
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // レーンの描画
    const laneWidth = canvas.width / 4;
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = i % 2 === 0 ? '#333333' : '#444444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, 0);
      ctx.lineTo(i * laneWidth, canvas.height);
      ctx.stroke();
    }
    
    // ノートの描画
    const noteHeight = 20;
    const noteSpeed = 0.2; // ピクセル/ミリ秒
    
    notes.forEach(note => {
      if (note.hit) return; // ヒット済みのノートはスキップ
      
      const timeToNote = note.time - elapsedTime;
      if (timeToNote < -500) return; // 画面外のノートはスキップ
      
      const yPos = canvas.height - (timeToNote * noteSpeed);
      if (yPos < -noteHeight) return; // 画面外のノートはスキップ
      
      const xPos = note.lane * laneWidth;
      
      // ノートの種類に応じた描画
      switch (note.type) {
        case NoteType.TAP:
          ctx.fillStyle = '#00aaff';
          ctx.fillRect(xPos, yPos, laneWidth, noteHeight);
          break;
        case NoteType.HOLD:
          const holdDuration = note.duration || 0;
          const holdHeight = holdDuration * noteSpeed;
          ctx.fillStyle = '#ffaa00';
          ctx.fillRect(xPos, yPos - holdHeight, laneWidth, holdHeight + noteHeight);
          break;
        case NoteType.SWIPE_LEFT:
          ctx.fillStyle = '#ff00aa';
          ctx.fillRect(xPos, yPos, laneWidth, noteHeight);
          // 左向き矢印の描画
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(xPos + laneWidth * 0.8, yPos + noteHeight * 0.2);
          ctx.lineTo(xPos + laneWidth * 0.2, yPos + noteHeight * 0.5);
          ctx.lineTo(xPos + laneWidth * 0.8, yPos + noteHeight * 0.8);
          ctx.fill();
          break;
        case NoteType.SWIPE_RIGHT:
          ctx.fillStyle = '#ff00aa';
          ctx.fillRect(xPos, yPos, laneWidth, noteHeight);
          // 右向き矢印の描画
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(xPos + laneWidth * 0.2, yPos + noteHeight * 0.2);
          ctx.lineTo(xPos + laneWidth * 0.8, yPos + noteHeight * 0.5);
          ctx.lineTo(xPos + laneWidth * 0.2, yPos + noteHeight * 0.8);
          ctx.fill();
          break;
        case NoteType.SWIPE_UP:
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(xPos, yPos, laneWidth, noteHeight);
          // 上向き矢印の描画
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(xPos + laneWidth * 0.2, yPos + noteHeight * 0.8);
          ctx.lineTo(xPos + laneWidth * 0.5, yPos + noteHeight * 0.2);
          ctx.lineTo(xPos + laneWidth * 0.8, yPos + noteHeight * 0.8);
          ctx.fill();
          break;
        case NoteType.SWIPE_DOWN:
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(xPos, yPos, laneWidth, noteHeight);
          // 下向き矢印の描画
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(xPos + laneWidth * 0.2, yPos + noteHeight * 0.2);
          ctx.lineTo(xPos + laneWidth * 0.5, yPos + noteHeight * 0.8);
          ctx.lineTo(xPos + laneWidth * 0.8, yPos + noteHeight * 0.2);
          ctx.fill();
          break;
      }
    });
    
    // 判定ライン
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.stroke();
  };

  // ノートの判定
  const checkNotes = (elapsedTime: number) => {
    const updatedNotes = [...notes];
    let updatedScore = score;
    let updatedCombo = combo;
    let updatedPerfect = perfect;
    let updatedGreat = great;
    let updatedGood = good;
    let updatedMiss = miss;
    
    updatedNotes.forEach(note => {
      if (note.hit) return; // ヒット済みのノートはスキップ
      
      const timeDiff = Math.abs(note.time - elapsedTime);
      
      // ミス判定（500ミリ秒以上の差）
      if (elapsedTime > note.time + 500) {
        note.hit = true;
        note.score = 0;
        updatedCombo = 0;
        updatedMiss++;
      }
    });
    
    setNotes(updatedNotes);
    setScore(updatedScore);
    setCombo(updatedCombo);
    setMaxCombo(Math.max(maxCombo, updatedCombo));
    setPerfect(updatedPerfect);
    setGreat(updatedGreat);
    setGood(updatedGood);
    setMiss(updatedMiss);
  };

  // タップ処理
  const handleTap = (laneIndex: number) => {
    if (gameState !== GameState.PLAYING) return;
    
    const elapsedTime = pausedElapsedTimeRef.current + (Date.now() - (gameStartTimeRef.current || 0));
    const updatedNotes = [...notes];
    let updatedScore = score;
    let updatedCombo = combo;
    let updatedPerfect = perfect;
    let updatedGreat = great;
    let updatedGood = good;
    
    // 判定対象のノートを探す
    const targetNote = updatedNotes.find(note => 
      !note.hit && 
      note.lane === laneIndex && 
      Math.abs(note.time - elapsedTime) < 500
    );
    
    if (targetNote) {
      targetNote.hit = true;
      
      const timeDiff = Math.abs(targetNote.time - elapsedTime);
      
      // 判定（PERFECT: 50ms以内, GREAT: 100ms以内, GOOD: 200ms以内）
      if (timeDiff <= 50) {
        targetNote.score = 100;
        updatedScore += 100;
        updatedCombo++;
        updatedPerfect++;
      } else if (timeDiff <= 100) {
        targetNote.score = 80;
        updatedScore += 80;
        updatedCombo++;
        updatedGreat++;
      } else if (timeDiff <= 200) {
        targetNote.score = 50;
        updatedScore += 50;
        updatedCombo++;
        updatedGood++;
      } else {
        targetNote.score = 0;
      }
      
      setNotes(updatedNotes);
      setScore(updatedScore);
      setCombo(updatedCombo);
      setMaxCombo(Math.max(maxCombo, updatedCombo));
      setPerfect(updatedPerfect);
      setGreat(updatedGreat);
      setGood(updatedGood);
    }
  };

  // スワイプ処理
  const handleSwipe = (laneIndex: number, direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameState !== GameState.PLAYING) return;
    
    const elapsedTime = pausedElapsedTimeRef.current + (Date.now() - (gameStartTimeRef.current || 0));
    const updatedNotes = [...notes];
    let updatedScore = score;
    let updatedCombo = combo;
    let updatedPerfect = perfect;
    let updatedGreat = great;
    let updatedGood = good;
    
    // 判定対象のノートを探す
    let targetNoteType: NoteType;
    switch (direction) {
      case 'left': targetNoteType = NoteType.SWIPE_LEFT; break;
      case 'right': targetNoteType = NoteType.SWIPE_RIGHT; break;
      case 'up': targetNoteType = NoteType.SWIPE_UP; break;
      case 'down': targetNoteType = NoteType.SWIPE_DOWN; break;
    }
    
    const targetNote = updatedNotes.find(note => 
      !note.hit && 
      note.lane === laneIndex && 
      note.type === targetNoteType &&
      Math.abs(note.time - elapsedTime) < 500
    );
    
    if (targetNote) {
      targetNote.hit = true;
      
      const timeDiff = Math.abs(targetNote.time - elapsedTime);
      
      // 判定（PERFECT: 50ms以内, GREAT: 100ms以内, GOOD: 200ms以内）
      if (timeDiff <= 50) {
        targetNote.score = 100;
        updatedScore += 100;
        updatedCombo++;
        updatedPerfect++;
      } else if (timeDiff <= 100) {
        targetNote.score = 80;
        updatedScore += 80;
        updatedCombo++;
        updatedGreat++;
      } else if (timeDiff <= 200) {
        targetNote.score = 50;
        updatedScore += 50;
        updatedCombo++;
        updatedGood++;
      } else {
        targetNote.score = 0;
      }
      
      setNotes(updatedNotes);
      setScore(updatedScore);
      setCombo(updatedCombo);
      setMaxCombo(Math.max(maxCombo, updatedCombo));
      setPerfect(updatedPerfect);
      setGreat(updatedGreat);
      setGood(updatedGood);
    }
  };

  // ホールド処理
  const handleHoldStart = (laneIndex: number) => {
    if (gameState !== GameState.PLAYING) return;
    
    const elapsedTime = pausedElapsedTimeRef.current + (Date.now() - (gameStartTimeRef.current || 0));
    const updatedNotes = [...notes];
    
    // 判定対象のノートを探す
    const targetNote = updatedNotes.find(note => 
      !note.hit && 
      note.lane === laneIndex && 
      note.type === NoteType.HOLD &&
      Math.abs(note.time - elapsedTime) < 500
    );
    
    if (targetNote) {
      // ホールド開始時の処理
      // 実際のゲームではここでホールド状態を管理する
    }
  };

  const handleHoldEnd = (laneIndex: number) => {
    if (gameState !== GameState.PLAYING) return;
    
    // ホールド終了時の処理
    // 実際のゲームではここでホールド状態の判定を行う
  };

  // 一時停止処理
  const handlePause = () => {
    if (gameState === GameState.PLAYING) {
      setGameState(GameState.PAUSED);
      pauseTimeRef.current = Date.now();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
      if (pauseTimeRef.current) {
        pausedElapsedTimeRef.current += Date.now() - pauseTimeRef.current;
      }
      gameStartTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // ゲームループ（一時停止から再開用）
  const gameLoop = (timestamp: number) => {
    if (!gameStartTimeRef.current) return;
    
    const elapsedTime = pausedElapsedTimeRef.current + (Date.now() - gameStartTimeRef.current);
    setCurrentTime(elapsedTime);
    
    drawGame(elapsedTime);
    checkNotes(elapsedTime);
    
    if (songInfo && elapsedTime >= songInfo.duration * 1000) {
      endGame();
      return;
    }
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // ゲーム終了処理
  const endGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // 精度の計算
    const totalNotes = perfect + great + good + miss;
    const accuracy = totalNotes > 0 
      ? ((perfect * 100 + great * 80 + good * 50) / (totalNotes * 100)) * 100 
      : 0;
    
    // ランクの決定
    let rank = 'D';
    if (accuracy >= 95) rank = 'S';
    else if (accuracy >= 90) rank = 'A';
    else if (accuracy >= 80) rank = 'B';
    else if (accuracy >= 70) rank = 'C';
    
    // 結果の設定
    const result: GameResult = {
      score,
      maxCombo,
      perfect,
      great,
      good,
      miss,
      accuracy,
      rank
    };
    
    setGameResult(result);
    setGameState(GameState.COMPLETED);
    
    // 結果の送信（APIが実装されたら有効化）
    /*
    fetch(`/api/songs/${songId}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(result),
    });
    */
  };

  // リトライ処理
  const handleRetry = () => {
    // 状態のリセット
    setGameState(GameState.COUNTDOWN);
    setCountdown(3);
    setCurrentTime(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfect(0);
    setGreat(0);
    setGood(0);
    setMiss(0);
    setGameResult(null);
    
    // ノートのリセット
    if (notes.length > 0) {
      const resetNotes = notes.map(note => ({
        ...note,
        hit: false,
        score: undefined
      }));
      setNotes(resetNotes);
    }
    
    // 時間のリセット
    gameStartTimeRef.current = null;
    pauseTimeRef.current = null;
    pausedElapsedTimeRef.current = 0;
  };

  // 戻るボタンハンドラー
  const handleBack = () => {
    // アニメーションフレームのキャンセル
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (animationsEnabled) {
      navigateWithExitAnimation('/pregame/' + songId);
    } else {
      router.push('/pregame/' + songId);
    }
  };

  // 結果画面から戻るハンドラー
  const handleBackToHome = () => {
    if (animationsEnabled) {
      navigateWithExitAnimation('/home');
    } else {
      router.push('/home');
    }
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

  // 時間フォーマット関数
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ローディング画面
  if (gameState === GameState.LOADING) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className={`w-16 h-16 border-4 ${borderColor} border-t-transparent rounded-full animate-spin`}></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  // エラー画面
  if (gameState === GameState.ERROR) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className={`w-full ${buttonBgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  // カウントダウン画面
  if (gameState === GameState.COUNTDOWN) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        {songInfo && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{songInfo.title}</h1>
            <p className="text-xl text-gray-300">{songInfo.artist}</p>
            <div className="flex justify-center items-center mt-4">
              <span className={`${getDifficultyColor(songInfo.difficulty)} font-medium mr-2`}>
                {getDifficultyText(songInfo.difficulty)}
              </span>
              <span className="text-gray-400">BPM {songInfo.bpm}</span>
            </div>
          </div>
        )}
        
        <div className="text-9xl font-bold mb-8 animate-pulse">
          {countdown}
        </div>
        
        <p className="text-xl text-gray-300">準備してください...</p>
      </div>
    );
  }

  // ゲームプレイ画面
  if (gameState === GameState.PLAYING) {
    return (
      <div className={`min-h-screen ${bgGradient} text-white`}>
        {/* ヘッダー */}
        <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-10 p-2 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-white p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold">{songInfo?.title}</h1>
            <p className="text-sm text-gray-300">{songInfo?.artist}</p>
          </div>
          
          <button
            onClick={handlePause}
            className="text-white p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        
        {/* スコア表示 */}
        <div className="fixed top-16 left-0 right-0 bg-black/30 p-2 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-300">スコア</p>
            <p className="text-xl font-bold">{score}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-300">コンボ</p>
            <p className="text-xl font-bold">{combo}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-300">時間</p>
            <p className="text-xl font-bold">{formatTime(currentTime)} / {songInfo ? formatTime(songInfo.duration * 1000) : '0:00'}</p>
          </div>
        </div>
        
        {/* ゲームキャンバス */}
        <canvas
          ref={canvasRef}
          className="w-full h-screen"
          width={400}
          height={600}
        />
        
        {/* タッチエリア */}
        <div className="fixed bottom-0 left-0 right-0 h-24 flex">
          {[0, 1, 2, 3].map(lane => (
            <div
              key={lane}
              className="flex-1 border-r border-gray-800 last:border-r-0"
              onTouchStart={() => handleTap(lane)}
              onMouseDown={() => handleTap(lane)}
            />
          ))}
        </div>
      </div>
    );
  }

  // 一時停止画面
  if (gameState === GameState.PAUSED) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800/80 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">一時停止</h1>
          
          <div className="space-y-4">
            <button
              onClick={handlePause}
              className={`w-full ${buttonBgColor} text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              続ける
            </button>
            
            <button
              onClick={handleRetry}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              リトライ
            </button>
            
            <button
              onClick={handleBack}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 結果画面
  if (gameState === GameState.COMPLETED && gameResult) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
        <div className="max-w-md w-full bg-gray-800/80 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2 text-center">結果</h1>
          
          {songInfo && (
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{songInfo.title}</h2>
              <p className="text-gray-400">{songInfo.artist}</p>
            </div>
          )}
          
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
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-300">スコア:</span>
              <span className="font-bold">{gameResult.score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">最大コンボ:</span>
              <span className="font-bold">{gameResult.maxCombo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">精度:</span>
              <span className="font-bold">{gameResult.accuracy.toFixed(2)}%</span>
            </div>
            <div className="h-px bg-gray-700 my-2"></div>
            <div className="flex justify-between">
              <span className="text-green-500">PERFECT:</span>
              <span className="font-bold">{gameResult.perfect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-500">GREAT:</span>
              <span className="font-bold">{gameResult.great}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-500">GOOD:</span>
              <span className="font-bold">{gameResult.good}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500">MISS:</span>
              <span className="font-bold">{gameResult.miss}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className={`w-full ${buttonBgColor} text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              リトライ
            </button>
            
            <button
              onClick={handleBackToHome}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // デフォルト（通常は表示されない）
  return (
    <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${bgGradient} text-white`}>
      <p>ゲーム状態が不明です。</p>
    </div>
  );
}

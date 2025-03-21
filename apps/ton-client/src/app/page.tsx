// このファイルは、TON（Telegram）クライアントのホームページです。

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Telegramプラットフォームの検出
  useEffect(() => {
    const detectPlatform = () => {
      try {
        // Telegramの検出
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
          setIsTelegram(true);
          // 認証済みの場合はホーム画面に遷移
          if (localStorage.getItem('auth_token')) {
            router.push('/home');
            return;
          }
          // 認証が必要な場合は認証処理を行う
          handleTelegramAuth();
        } else {
          setError('このアプリはTelegram Mini Appとして実行する必要があります。');
        }
      } catch (error) {
        console.error('Platform detection error:', error);
        setError('プラットフォームの検出中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    detectPlatform();
  }, [router]);

  // Telegram認証処理
  const handleTelegramAuth = async () => {
    try {
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        const initData = window.Telegram.WebApp.initData;
        
        if (!initData) {
          setError('Telegram認証データが見つかりません。');
          setIsLoading(false);
          return;
        }

        // 認証APIを呼び出す
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || '認証に失敗しました。');
        }

        // 認証トークンを保存
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ホーム画面に遷移
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Telegram auth error:', error);
      setError(error.message || 'Telegram認証中にエラーが発生しました。');
      setIsLoading(false);
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
          <p className="text-sm opacity-75">
            このアプリはTelegram Mini Appとして実行する必要があります。Telegramアプリ内からアクセスしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Shout2</h1>
        <p className="mb-4">Telegram Mini Appとして実行されています。認証処理中...</p>
        <button
          onClick={handleTelegramAuth}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          再認証
        </button>
      </div>
    </div>
  );
}

// Telegramオブジェクトの型定義
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

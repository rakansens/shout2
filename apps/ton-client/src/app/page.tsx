// このファイルは、TON（Telegram）クライアントのホームページです。

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { init, retrieveLaunchParams } from '@telegram-apps/sdk';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // デバッグ情報を追加する関数
  const addDebugInfo = (info: string) => {
    console.log(info);
    setDebugInfo(prev => prev + '\n' + info);
  };

  // Telegram Mini App SDKの初期化と検出
  useEffect(() => {
    const initTelegramApp = async () => {
      try {
        addDebugInfo('Initializing Telegram Mini App SDK...');
        
        // 環境情報をログに記録
        addDebugInfo(`User Agent: ${navigator.userAgent}`);
        addDebugInfo(`Window Location: ${window.location.href}`);
        
        // SDKを初期化
        init();
        addDebugInfo('SDK initialized successfully');
        
        try {
          // Telegramオブジェクトの存在確認
          if (typeof window !== 'undefined' && window.Telegram) {
            addDebugInfo('Telegram object exists in window');
            if (window.Telegram.WebApp) {
              addDebugInfo('Telegram.WebApp exists');
              addDebugInfo(`Telegram.WebApp.initData: ${window.Telegram.WebApp.initData ? 'exists' : 'missing'}`);
              addDebugInfo(`Telegram.WebApp.version: ${window.Telegram.WebApp.version || 'unknown'}`);
              addDebugInfo(`Telegram.WebApp.platform: ${window.Telegram.WebApp.platform || 'unknown'}`);
            } else {
              addDebugInfo('Telegram.WebApp does not exist');
            }
          } else {
            addDebugInfo('Telegram object does not exist in window');
          }
          
          // 起動パラメータを取得（エラーが発生しなければTelegram Mini Appとして実行されている）
          const params = retrieveLaunchParams();
          addDebugInfo('Launch params retrieved successfully');
          addDebugInfo(`Launch params: ${JSON.stringify(params)}`);
          addDebugInfo(`Platform: ${params.platform}`);
          addDebugInfo(`Color scheme: ${params.colorScheme}`);
          
          addDebugInfo('Running as Telegram Mini App');
          setIsTelegram(true);
          
          // 認証済みの場合はホーム画面に遷移
          if (localStorage.getItem('auth_token')) {
            addDebugInfo('Auth token found in localStorage, redirecting to home');
            router.push('/home');
            return;
          }
          
          // 認証が必要な場合は認証処理を行う
          addDebugInfo('No auth token found, starting authentication process');
          handleTelegramAuth();
        } catch (launchError: any) {
          addDebugInfo(`Failed to retrieve launch params: ${launchError.message || 'Unknown error'}`);
          console.error('Failed to retrieve launch params:', launchError);
          setError('このアプリはTelegram Mini Appとして実行する必要があります。');
        }
      } catch (error: any) {
        addDebugInfo(`Telegram Mini App initialization error: ${error.message || 'Unknown error'}`);
        console.error('Telegram Mini App initialization error:', error);
        setError('Telegram Mini Appの初期化中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    initTelegramApp();
  }, [router]);

  // Telegram認証処理
  const handleTelegramAuth = async () => {
    try {
      addDebugInfo('Starting Telegram authentication');
      
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        const initData = window.Telegram.WebApp.initData;
        addDebugInfo(`Telegram.WebApp.initData: ${initData ? 'exists' : 'missing'}`);
        
        if (!initData) {
          addDebugInfo('Telegram authentication data not found');
          setError('Telegram認証データが見つかりません。');
          setIsLoading(false);
          return;
        }

        // 認証APIを呼び出す
        addDebugInfo('Calling authentication API');
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData }),
        });

        addDebugInfo(`Auth API response status: ${response.status}`);
        const data = await response.json();
        addDebugInfo(`Auth API response data: ${JSON.stringify(data)}`);

        if (!response.ok) {
          throw new Error(data.error?.message || '認証に失敗しました。');
        }

        // 認証トークンを保存
        addDebugInfo('Authentication successful, saving token');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ホーム画面に遷移
        addDebugInfo('Redirecting to home page');
        router.push('/home');
      } else {
        addDebugInfo('Telegram.WebApp not available for authentication');
        setError('Telegram認証に必要なオブジェクトが見つかりません。');
      }
    } catch (error: any) {
      addDebugInfo(`Telegram auth error: ${error.message || 'Unknown error'}`);
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
          <p className="text-sm opacity-75 mb-4">
            このアプリはTelegram Mini Appとして実行する必要があります。Telegramアプリ内からアクセスしてください。
          </p>
          <div className="mt-4 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-60">
            <pre>{debugInfo}</pre>
          </div>
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
        <div className="mt-4 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-60">
          <pre>{debugInfo}</pre>
        </div>
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
        version?: string;
        platform?: string;
        [key: string]: any; // その他のプロパティも許可
      };
    };
  }
}

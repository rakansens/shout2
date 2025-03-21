// このファイルは、TON（Telegram）クライアントのホームページです。

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WebApp from '@twa-dev/sdk';

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
        
        // WebAppオブジェクトの存在確認
        if (WebApp.isExpanded !== undefined) {
          addDebugInfo('WebApp SDK is available');
          
          // WebAppの情報を記録
          addDebugInfo(`WebApp initData: ${WebApp.initData ? 'exists' : 'missing'}`);
          addDebugInfo(`WebApp version: ${WebApp.version || 'unknown'}`);
          addDebugInfo(`WebApp platform: ${WebApp.platform || 'unknown'}`);
          addDebugInfo(`WebApp colorScheme: ${WebApp.colorScheme || 'unknown'}`);
          
          // Telegram Mini Appとして実行されていることを確認
          if (WebApp.initData) {
            addDebugInfo('Running as Telegram Mini App');
            setIsTelegram(true);
            
            // Telegram WebAppに準備完了を通知
            WebApp.ready();
            addDebugInfo('WebApp.ready() called');
            
            // 認証済みの場合はホーム画面に遷移
            if (localStorage.getItem('auth_token')) {
              addDebugInfo('Auth token found in localStorage, redirecting to home');
              router.push('/home');
              return;
            }
            
            // 認証が必要な場合は認証処理を行う
            addDebugInfo('No auth token found, starting authentication process');
            handleTelegramAuth();
          } else {
            addDebugInfo('WebApp initData is missing');
            setError('Telegram Mini Appの初期化データが見つかりません。');
          }
        } else {
          addDebugInfo('WebApp SDK is not available');
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
      
      if (WebApp.initData) {
        addDebugInfo(`WebApp initData: ${WebApp.initData}`);
        
        // ユーザー情報を取得
        try {
          const user = WebApp.initDataUnsafe?.user;
          if (user) {
            addDebugInfo(`User info: ${JSON.stringify(user)}`);
          } else {
            addDebugInfo('User info not available');
          }
        } catch (e: any) {
          addDebugInfo(`Error parsing user info: ${e.message}`);
        }

        // 認証APIを呼び出す
        addDebugInfo('Calling authentication API');
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: WebApp.initData }),
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
        addDebugInfo('WebApp initData is missing for authentication');
        setError('Telegram認証に必要なデータが見つかりません。');
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

// WebAppの型定義（@twa-dev/sdkの型定義を補完）
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          [key: string]: any;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        version?: string;
        platform?: string;
        colorScheme?: string;
        [key: string]: any;
      };
    };
  }
}

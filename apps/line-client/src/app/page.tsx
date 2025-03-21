// このファイルは、LINE クライアントのホームページです。

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLine, setIsLine] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LINEプラットフォームの検出とコードの取得
  useEffect(() => {
    const detectPlatform = async () => {
      try {
        // LINEの検出
        if (typeof window !== 'undefined' && window.liff) {
          setIsLine(true);
          
          // LIFFの初期化
          await window.liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' });
          
          // 認証済みの場合はホーム画面に遷移
          if (localStorage.getItem('auth_token')) {
            router.push('/home');
            return;
          }

          // 認証コードがURLに含まれている場合は認証処理を行う
          const code = searchParams.get('code');
          if (code) {
            await handleLineAuth(code);
          } else {
            // LINEログインを開始
            if (window.liff.isLoggedIn()) {
              // すでにログインしている場合はIDトークンを取得して認証
              const idToken = window.liff.getIDToken();
              await handleLineIdTokenAuth(idToken);
            } else {
              // ログインしていない場合はログイン画面にリダイレクト
              window.liff.login();
            }
          }
        } else {
          setError('このアプリはLINE Mini Appとして実行する必要があります。');
        }
      } catch (error) {
        console.error('Platform detection error:', error);
        setError('プラットフォームの検出中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    detectPlatform();
  }, [router, searchParams]);

  // LINE認証コードを使用した認証処理
  const handleLineAuth = async (code: string) => {
    try {
      // 認証APIを呼び出す
      const response = await fetch('/api/auth/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          redirectUri: window.location.origin 
        }),
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
    } catch (error: any) {
      console.error('LINE auth error:', error);
      setError(error.message || 'LINE認証中にエラーが発生しました。');
      setIsLoading(false);
    }
  };

  // LINE IDトークンを使用した認証処理
  const handleLineIdTokenAuth = async (idToken: string) => {
    try {
      // 認証APIを呼び出す
      const response = await fetch('/api/auth/line/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
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
    } catch (error: any) {
      console.error('LINE ID token auth error:', error);
      setError(error.message || 'LINE認証中にエラーが発生しました。');
      setIsLoading(false);
    }
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
          <p className="text-sm opacity-75">
            このアプリはLINE Mini Appとして実行する必要があります。LINEアプリ内からアクセスしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-900 to-black text-white">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Shout2</h1>
        <p className="mb-4">LINE Mini Appとして実行されています。認証処理中...</p>
        <button
          onClick={() => window.liff?.login()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          LINEでログイン
        </button>
      </div>
    </div>
  );
}

// LIFFオブジェクトの型定義
declare global {
  interface Window {
    liff?: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: () => void;
      logout: () => void;
      getIDToken: () => string;
    };
  }
}

// このファイルは、管理者パネルのホームページです。

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 認証状態の確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // トークンの検証
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
          router.push('/admin/dashboard');
        } else {
          // トークンが無効な場合はログアウト
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError('認証状態の確認中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'ログインに失敗しました。');
      }

      // 認証トークンを保存
      localStorage.setItem('admin_token', data.token);
      setIsAuthenticated(true);

      // ダッシュボードに遷移
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'ログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">読み込み中...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900 to-black text-white">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">リダイレクト中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900 to-black text-white">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Shout2 管理者パネル</h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="********"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
            >
              {isLoading ? '処理中...' : 'ログイン'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

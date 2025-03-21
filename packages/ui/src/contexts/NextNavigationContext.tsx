'use client';

// このファイルは、Next.js用のナビゲーションアニメーションコンテキストを提供します。
// React RouterのNavigationAnimationContextをNext.js向けに書き換えたものです。

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// コンテキストの型定義
interface NextNavigationContextType {
  isAnimating: boolean;
  navigateWithAnimation: (path: string, options?: { hideHeader?: boolean; hideNavigation?: boolean }) => void;
  isHeaderHidden: boolean;
  isNavigationHidden: boolean;
  setIsHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

// デフォルト値を持つコンテキストの作成
const NextNavigationContext = createContext<NextNavigationContextType>({
  isAnimating: false,
  navigateWithAnimation: () => {},
  isHeaderHidden: false,
  isNavigationHidden: false,
  setIsHeaderHidden: () => {},
  setIsNavigationHidden: () => {},
});

// コンテキストを使用するためのフック
export const useNextNavigation = () => useContext(NextNavigationContext);

// プロバイダーコンポーネント
export const NextNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // アニメーション状態
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  
  // Next.jsのルーター
  const router = useRouter();
  const pathname = usePathname();
  
  // タイムアウト参照
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // パスの変更を監視して表示/非表示を制御
  useEffect(() => {
    // 特定のルートに基づいて表示/非表示を設定
    const isPreGameScreen = pathname === '/pregame';
    
    if (isPreGameScreen) {
      // PreGameコンポーネントに任せる
    } else if (pathname === '/') {
      // タイトル画面
      setIsHeaderHidden(true);
      setIsNavigationHidden(true);
    } else {
      // その他の画面では、明示的に設定されていない限り両方表示
      const state = window.history.state;
      if (state?.keepHeaderHidden !== true) {
        setIsHeaderHidden(false);
      }
      if (state?.keepNavigationHidden !== true) {
        setIsNavigationHidden(false);
      }
    }
  }, [pathname]);
  
  // アニメーション状態の変更をログに記録
  useEffect(() => {
    console.log(`[NAV] Animation state: ${isAnimating ? 'ACTIVE' : 'INACTIVE'}`);
  }, [isAnimating]);
  
  // パス変更をデバッグ
  useEffect(() => {
    console.log(`[NAV DEBUG] Location changed to: ${pathname}`);
  }, [pathname]);
  
  // コンテキスト値をデバッグ
  console.log("[NAV CONTEXT VALUES]", { isAnimating, currentPath: pathname, isHeaderHidden, isNavigationHidden });

  // アニメーション付きナビゲーション関数
  const navigateWithAnimation = (
    path: string, 
    options?: { hideHeader?: boolean; hideNavigation?: boolean }
  ) => {
    // 既に同じパスにいる場合は何もしない
    if (path === pathname) {
      console.log(`[NAV] Already at ${path}, not navigating`);
      return;
    }

    // 既存のタイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // アニメーション開始
    console.log(`[NAV] Starting animation to ${path}`);
    setIsAnimating(true);
    
    // 非表示オプションが提供されていれば適用
    if (options?.hideHeader !== undefined) {
      setIsHeaderHidden(options.hideHeader);
    }
    if (options?.hideNavigation !== undefined) {
      setIsNavigationHidden(options.hideNavigation);
    }
    
    // 要素を非表示にするアニメーションが完了するのを待ってからナビゲート
    timeoutRef.current = setTimeout(() => {
      // ナビゲート
      console.log(`[NAV] Now navigating to ${path}`);
      
      // Next.jsのルーターを使用してナビゲート
      router.push(path);
      
      // コンポーネントがマウントされるのを待ってから要素を再表示
      timeoutRef.current = setTimeout(() => {
        console.log(`[NAV] Animation complete, showing elements`);
        setIsAnimating(false);
      }, 400); // コンポーネントのマウントを待つ時間
    }, 350); // 非表示アニメーションの完了を待つ時間
  };

  return (
    <NextNavigationContext.Provider value={{ 
      isAnimating, 
      navigateWithAnimation,
      isHeaderHidden,
      isNavigationHidden,
      setIsHeaderHidden,
      setIsNavigationHidden
    }}>
      {children}
    </NextNavigationContext.Provider>
  );
};

'use client';

// このファイルは、統合されたナビゲーションコンテキストを提供します。
// React RouterとNext.jsの両方に対応しています。

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

// コンテキストの型定義
interface UnifiedNavigationContextType {
  isAnimating: boolean;
  navigateWithAnimation: (path: string, options?: { hideHeader?: boolean; hideNavigation?: boolean }) => void;
  isHeaderHidden: boolean;
  isNavigationHidden: boolean;
  setIsHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

// デフォルト値を持つコンテキストの作成
const UnifiedNavigationContext = createContext<UnifiedNavigationContextType>({
  isAnimating: false,
  navigateWithAnimation: () => {},
  isHeaderHidden: false,
  isNavigationHidden: false,
  setIsHeaderHidden: () => {},
  setIsNavigationHidden: () => {},
});

// コンテキストを使用するためのフック
export const useNavigation = () => useContext(UnifiedNavigationContext);

// Next.js用のプロバイダーコンポーネント
interface NavigationProviderProps {
  children: ReactNode;
  router: any; // Next.jsのuseRouterまたはReact RouterのuseNavigate
  pathname: string; // Next.jsのusePathnameまたはReact RouterのuseLocation.pathname
  isNextJs?: boolean; // Next.jsかどうかのフラグ
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  router, 
  pathname,
  isNextJs = true 
}) => {
  // アニメーション状態
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  
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
    const isPreGameScreen = pathname.includes('/pregame');
    
    if (isPreGameScreen) {
      // PreGameコンポーネントに任せる
    } else if (pathname === '/') {
      // タイトル画面
      setIsHeaderHidden(true);
      setIsNavigationHidden(true);
    } else {
      // その他の画面では、明示的に設定されていない限り両方表示
      if (isNextJs) {
        const state = window.history.state;
        if (state?.keepHeaderHidden !== true) {
          setIsHeaderHidden(false);
        }
        if (state?.keepNavigationHidden !== true) {
          setIsNavigationHidden(false);
        }
      } else {
        // React Routerの場合
        const state = (window as any).history.state?.usr;
        if (state?.keepHeaderHidden !== true) {
          setIsHeaderHidden(false);
        }
        if (state?.keepNavigationHidden !== true) {
          setIsNavigationHidden(false);
        }
      }
    }
  }, [pathname, isNextJs]);
  
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
      
      if (isNextJs) {
        // Next.jsのルーターを使用してナビゲート
        router.push(path);
      } else {
        // React Routerのナビゲート
        router(path, { 
          state: { 
            animated: true,
            keepHeaderHidden: options?.hideHeader || isHeaderHidden,
            keepNavigationHidden: options?.hideNavigation || isNavigationHidden
          } 
        });
      }
      
      // コンポーネントがマウントされるのを待ってから要素を再表示
      timeoutRef.current = setTimeout(() => {
        console.log(`[NAV] Animation complete, showing elements`);
        setIsAnimating(false);
      }, 400); // コンポーネントのマウントを待つ時間
    }, 350); // 非表示アニメーションの完了を待つ時間
  };

  return (
    <UnifiedNavigationContext.Provider value={{ 
      isAnimating, 
      navigateWithAnimation,
      isHeaderHidden,
      isNavigationHidden,
      setIsHeaderHidden,
      setIsNavigationHidden
    }}>
      {children}
    </UnifiedNavigationContext.Provider>
  );
};

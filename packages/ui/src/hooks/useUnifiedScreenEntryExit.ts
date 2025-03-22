'use client';

// このファイルは、統合されたスクリーン遷移アニメーションフックを提供します。
// React RouterとNext.jsの両方に対応しています。

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '../contexts/UnifiedNavigationContext';

/**
 * 統合されたスクリーン遷移アニメーションフック
 * 画面の入場/退場アニメーションを管理します
 * @param pathname 現在のパス（Next.jsのusePathnameまたはReact RouterのuseLocation.pathname）
 * @returns アニメーション状態とナビゲーション関数を含むオブジェクト
 */
export const useUnifiedScreenEntryExit = (pathname: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { navigateWithAnimation } = useNavigation();
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // コンポーネントマウント後にエントリーアニメーションを開始
  useEffect(() => {
    // DOMの準備を待つための小さな遅延
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // コンポーネントがアンマウントされる場合、退場アニメーションのタイムアウトをクリア
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  // 退場アニメーション付きのカスタムナビゲーション関数
  const navigateWithExitAnimation = useCallback((
    to: string, 
    options?: { hideHeader?: boolean; hideNavigation?: boolean }
  ) => {
    // 既に退場中の場合はナビゲートしない
    if (isExiting) return;
    
    console.log(`[NAV DEBUG] Starting exit animation to ${to}`);
    
    // 退場アニメーションを開始
    setIsExiting(true);
    
    // 退場アニメーションが完了するのを待ってからナビゲート
    exitTimeoutRef.current = setTimeout(() => {
      // コンテキストのナビゲーション関数を使用
      navigateWithAnimation(to, options);
      
      // ナビゲーション後に退場状態をリセット
      setTimeout(() => {
        console.log(`[NAV DEBUG] Resetting exit state after navigation to ${to}`);
        setIsExiting(false);
      }, 100);
    }, 600); // 最も長い退場アニメーションよりも少し長く
  }, [isExiting, navigateWithAnimation]);

  // ナビゲーションボタンのグローバルクリックハンドラーをオーバーライド
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navButton = target.closest('[data-path]') as HTMLElement;
      
      if (navButton) {
        const path = navButton.getAttribute('data-path');
        if (path && path !== pathname) {
          e.preventDefault();
          e.stopPropagation();
          navigateWithExitAnimation(path);
          return true; // 処理したことを示す
        }
      }
      return false; // 処理しなかった
    };
    
    // キャプチャフェーズでハンドラーを追加
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname, navigateWithExitAnimation]);

  return {
    isLoaded,
    isExiting,
    navigateWithExitAnimation
  };
};

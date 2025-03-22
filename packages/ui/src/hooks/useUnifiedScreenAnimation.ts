'use client';

// このファイルは、統合されたスクリーンアニメーションフックを提供します。
// React RouterとNext.jsの両方に対応しています。

import { useEffect } from 'react';
import { useNavigation } from '../contexts/UnifiedNavigationContext';

/**
 * 統合されたスクリーンアニメーションフック
 * 画面がマウント/アンマウントされる際にアニメーション状態を適切に管理します
 * @param pathname 現在のパス（Next.jsのusePathnameまたはReact RouterのuseLocation.pathname）
 * @returns アニメーション状態と現在のパスを含むオブジェクト
 */
export const useUnifiedScreenAnimation = (pathname: string) => {
  const { isAnimating } = useNavigation();
  
  // 画面がマウントされたときにイベントを発火
  useEffect(() => {
    // カスタムイベントを発火してスクリーンの表示を通知
    window.dispatchEvent(new CustomEvent('screenEnteredView', { 
      detail: { path: pathname } 
    }));
    
    // クリーンアップ関数
    return () => {
      // 画面が離れるときにイベントを発火
      window.dispatchEvent(new CustomEvent('screenLeavingView', {
        detail: { path: pathname }
      }));
    };
  }, [pathname, isAnimating]);

  return {
    currentPath: pathname,
    isAnimating
  };
};

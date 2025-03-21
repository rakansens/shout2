// このファイルは、Next.js用のスクリーンアニメーションフックを提供します。
// React RouterのuseScreenAnimationをNext.js向けに書き換えたものです。

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNextNavigation } from '../contexts/NextNavigationContext';

/**
 * Next.js用のスクリーンアニメーションフック
 * 画面がマウント/アンマウントされる際にアニメーション状態を適切に管理します
 */
export const useNextScreenAnimation = () => {
  const pathname = usePathname();
  const { isAnimating } = useNextNavigation();
  
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

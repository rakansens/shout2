// このファイルは、アニメーション付きレイアウトコンポーネントを提供します。
// Next.jsのページ遷移時にアニメーション効果を適用します。

import React, { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AnimatedLayoutProps {
  children: ReactNode;
  transitionClassName?: string;
  exitClassName?: string;
  duration?: number;
}

/**
 * アニメーション付きレイアウトコンポーネント
 * ページ遷移時にフェードイン/フェードアウトなどのアニメーション効果を適用します
 * 
 * @param children 子要素
 * @param transitionClassName エントリーアニメーションのクラス名（デフォルト: 'animate-entry'）
 * @param exitClassName 退場アニメーションのクラス名（デフォルト: 'animate-exit'）
 * @param duration アニメーション時間（ミリ秒、デフォルト: 500）
 */
export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ 
  children, 
  transitionClassName = 'animate-entry',
  exitClassName = 'animate-exit',
  duration = 500
}) => {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  
  // パスが変更されたときにアニメーションを適用
  useEffect(() => {
    if (pathname) {
      // 退場アニメーションを開始
      setTransitionStage('fadeOut');
      
      // アニメーション完了後に子要素を更新
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [pathname, children, duration]);
  
  return (
    <div className={`transition-opacity duration-${duration} ${
      transitionStage === 'fadeIn' ? transitionClassName : exitClassName
    }`}>
      {displayChildren}
    </div>
  );
};

/**
 * アニメーション付きコンポーネントラッパー
 * 個別のコンポーネントにアニメーション効果を適用します
 */
export const AnimatedComponent: React.FC<AnimatedLayoutProps & { delay?: number }> = ({
  children,
  transitionClassName = 'animate-entry',
  exitClassName = 'animate-exit',
  duration = 500,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // マウント後に表示アニメーションを開始
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [delay]);
  
  return (
    <div className={`transition-opacity duration-${duration} ${
      isVisible ? transitionClassName : 'opacity-0'
    }`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

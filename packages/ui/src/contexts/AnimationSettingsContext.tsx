'use client';

// このファイルは、アニメーション設定を管理するコンテキストを提供します。
// アプリケーション全体でアニメーションの有効/無効や速度を制御します。

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// アニメーション速度の型
type AnimationSpeed = 'slow' | 'normal' | 'fast';

// コンテキストの型定義
interface AnimationSettingsContextType {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  animationSpeed: AnimationSpeed;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
}

// デフォルト値を持つコンテキストの作成
const AnimationSettingsContext = createContext<AnimationSettingsContextType>({
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
  animationSpeed: 'normal',
  setAnimationSpeed: () => {},
});

// コンテキストを使用するためのフック
export const useAnimationSettings = () => useContext(AnimationSettingsContext);

/**
 * アニメーション設定プロバイダーコンポーネント
 * アプリケーション全体でアニメーション設定を管理します
 */
export const AnimationSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // アニメーション有効/無効の状態
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // アニメーション速度の状態
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('normal');
  
  // ローカルストレージから設定を読み込む
  useEffect(() => {
    // アニメーション有効/無効の設定を読み込む
    const storedAnimationsEnabled = localStorage.getItem('animationsEnabled');
    if (storedAnimationsEnabled !== null) {
      setAnimationsEnabled(storedAnimationsEnabled === 'true');
    }
    
    // アニメーション速度の設定を読み込む
    const storedAnimationSpeed = localStorage.getItem('animationSpeed') as AnimationSpeed;
    if (storedAnimationSpeed && ['slow', 'normal', 'fast'].includes(storedAnimationSpeed)) {
      setAnimationSpeed(storedAnimationSpeed);
    }
    
    // prefers-reduced-motion メディアクエリをチェック
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimationsEnabled(false);
    }
  }, []);
  
  // アニメーション有効/無効の設定変更時にローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('animationsEnabled', animationsEnabled.toString());
    
    // アニメーション無効時はdisabledクラスをbody要素に追加
    if (!animationsEnabled) {
      document.body.classList.add('animations-disabled');
    } else {
      document.body.classList.remove('animations-disabled');
    }
  }, [animationsEnabled]);
  
  // アニメーション速度の設定変更時にローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('animationSpeed', animationSpeed);
    
    // アニメーション速度に応じてCSSカスタムプロパティを設定
    const speedMultiplier = animationSpeed === 'slow' ? 1.5 : animationSpeed === 'fast' ? 0.7 : 1;
    document.documentElement.style.setProperty('--animation-speed-multiplier', speedMultiplier.toString());
  }, [animationSpeed]);
  
  return (
    <AnimationSettingsContext.Provider value={{
      animationsEnabled,
      setAnimationsEnabled,
      animationSpeed,
      setAnimationSpeed,
    }}>
      {children}
    </AnimationSettingsContext.Provider>
  );
};

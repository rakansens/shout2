import React, { useEffect } from 'react';
import ParticleBackground from '../Background/ParticleBackground';
import { useNextNavigation } from '../../contexts/NextNavigationContext';
import { useAnimationSettings } from '../../contexts/AnimationSettingsContext';
import '../../styles/headerNav.css';
import '../../styles/combined-animation.css';

interface MainLayoutProps {
  children: React.ReactNode;
  fullscreen?: boolean;
}

// メインレイアウトコンポーネント - アニメーション機能を統合
const MainLayout: React.FC<MainLayoutProps> = ({ children, fullscreen = false }) => {
  const { isAnimating, isHeaderHidden, isNavigationHidden } = useNextNavigation();
  const { animationsEnabled } = useAnimationSettings();

  // ヘッダーとナビゲーションの要素を特定
  useEffect(() => {
    const headerElement = document.querySelector('.header-component');
    const navigationElement = document.querySelector('.navigation-component');

    if (headerElement) {
      headerElement.classList.add('header-animate');
      if (isHeaderHidden || isAnimating) {
        headerElement.classList.add('animate-out');
      } else {
        headerElement.classList.remove('animate-out');
      }
    }

    if (navigationElement) {
      navigationElement.classList.add('nav-animate');
      if (isNavigationHidden || isAnimating) {
        navigationElement.classList.add('animate-out');
      } else {
        navigationElement.classList.remove('animate-out');
      }
    }
  }, [isAnimating, isHeaderHidden, isNavigationHidden]);

  return (
    <main 
      id="mainLayout" 
      className={`flex flex-col min-h-screen justify-between relative bg-[url(https://c.animaapp.com/sVl5C9mT/img/home.png)] bg-cover bg-[50%_50%] bg-fixed w-full ${fullscreen ? 'h-screen' : ''} ${!animationsEnabled ? 'animations-disabled' : ''}`}
    >
      <ParticleBackground />
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;

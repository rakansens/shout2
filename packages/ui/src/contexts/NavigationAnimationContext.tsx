'use client';

// このファイルは、ナビゲーションアニメーションコンテキストを提供します。
// Next.jsのルーティングを使用するように修正しました。

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define the context type
interface NavigationAnimationContextType {
  isAnimating: boolean;
  navigateWithAnimation: (path: string, options?: { hideHeader?: boolean; hideNavigation?: boolean }) => void;
  isHeaderHidden: boolean;
  isNavigationHidden: boolean;
  setIsHeaderHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with default values
const NavigationAnimationContext = createContext<NavigationAnimationContextType>({
  isAnimating: false,
  navigateWithAnimation: () => {},
  isHeaderHidden: false,
  isNavigationHidden: false,
  setIsHeaderHidden: () => {},
  setIsNavigationHidden: () => {},
});

// Hook to use the context
export const useNavigationAnimation = () => useContext(NavigationAnimationContext);

// Provider component
export const NavigationAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  
  // Next.jsのルーター
  const router = useRouter();
  const pathname = usePathname();
  
  // Reference to keep track of timeouts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Effect to handle setting visibility based on location
  useEffect(() => {
    // Handle visibility for specific routes
    const isPreGameScreen = pathname?.includes('/pregame');
    
    // When navigating to PreGame, don't automatically change 
    // visibility - we'll handle it in the component 
    if (isPreGameScreen) {
      // Don't set anything here, let the PreGame component handle it
    } else if (pathname === '/') {
      // Title screen
      setIsHeaderHidden(true);
      setIsNavigationHidden(true);
    } else {
      // For other screens, show both by default unless explicitly set
      const state = window.history.state;
      if (state?.keepHeaderHidden !== true) {
        setIsHeaderHidden(false);
      }
      if (state?.keepNavigationHidden !== true) {
        setIsNavigationHidden(false);
      }
    }
  }, [pathname]);
  
  // Log animating state changes
  useEffect(() => {
    console.log(`[NAV] Animation state: ${isAnimating ? 'ACTIVE' : 'INACTIVE'}`);
  }, [isAnimating]);
  
  // Debug navigation state changes
  useEffect(() => {
    console.log(`[NAV DEBUG] Location changed to: ${pathname}`);
  }, [pathname]);
  
  // Debug value in console
  console.log("[NAV CONTEXT VALUES]", { isAnimating, currentPath: pathname, isHeaderHidden, isNavigationHidden });

  // Function to navigate with animation
  const navigateWithAnimation = (
    path: string, 
    options?: { hideHeader?: boolean; hideNavigation?: boolean }
  ) => {
    // Don't do anything if already on this path
    if (path === pathname) {
      console.log(`[NAV] Already at ${path}, not navigating`);
      return;
    }

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Start animation
    console.log(`[NAV] Starting animation to ${path}`);
    setIsAnimating(true);
    
    // Apply hide options if provided
    if (options?.hideHeader !== undefined) {
      setIsHeaderHidden(options.hideHeader);
    }
    if (options?.hideNavigation !== undefined) {
      setIsNavigationHidden(options.hideNavigation);
    }
    
    // Wait for animation to hide elements before navigating
    timeoutRef.current = setTimeout(() => {
      // Navigate with state to indicate this was an animated navigation
      // and preserve header/navigation hidden state
      console.log(`[NAV] Now navigating to ${path}`);
      
      // Next.jsのルーターを使用してナビゲート
      router.push(path);
      
      // Wait for component to mount before showing elements again
      timeoutRef.current = setTimeout(() => {
        console.log(`[NAV] Animation complete, showing elements`);
        setIsAnimating(false);
      }, 400); // Wait longer to ensure component has mounted
    }, 350); // Wait for hide animation to complete
  };

  return (
    <NavigationAnimationContext.Provider value={{ 
      isAnimating, 
      navigateWithAnimation,
      isHeaderHidden,
      isNavigationHidden,
      setIsHeaderHidden,
      setIsNavigationHidden
    }}>
      {children}
    </NavigationAnimationContext.Provider>
  );
};

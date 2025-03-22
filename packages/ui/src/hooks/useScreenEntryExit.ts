'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationAnimation } from '../contexts/NavigationAnimationContext';

/**
 * Custom hook to handle screen entry and exit animations
 * @returns Object containing animation states and navigation function
 */
export const useScreenEntryExit = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pathname = usePathname();
  const { navigateWithAnimation } = useNavigationAnimation();
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger entry animation after component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Clean up exit animation timeout if component unmounts
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  // Custom navigation function with exit animations
  const navigateWithExitAnimation = useCallback((
    to: string, 
    options?: { hideHeader?: boolean; hideNavigation?: boolean }
  ) => {
    // Don't navigate if already exiting
    if (isExiting) return;
    
    // Start exit animations
    setIsExiting(true);
    
    // Wait for exit animations to complete before navigating
    exitTimeoutRef.current = setTimeout(() => {
      // Use the context's navigation function
      navigateWithAnimation(to, options);
    }, 600); // Slightly longer than the longest exit animation
  }, [isExiting, navigateWithAnimation]);

  // Override global click handler for navigation buttons
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
          return true; // Signal that we've handled this
        }
      }
      return false; // Not handled
    };
    
    // Add our handler
    document.addEventListener('click', handleClick, true); // Use capture phase
    
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

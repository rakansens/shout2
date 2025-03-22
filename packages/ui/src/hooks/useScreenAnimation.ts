'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationAnimation } from '../contexts/NavigationAnimationContext';

/**
 * Custom hook to ensure screens properly handle animation states
 * This helps ensure that animation states are reset appropriately when screens mount
 */
export const useScreenAnimation = () => {
  const pathname = usePathname();
  const { isAnimating } = useNavigationAnimation();
  
  // When screens mount, log the info for debugging
  useEffect(() => {
    // Add event listener for the screenEnteredView custom event
    window.dispatchEvent(new CustomEvent('screenEnteredView', { 
      detail: { path: pathname } 
    }));
    
    return () => {
      // Clean up or notify when screen is leaving
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

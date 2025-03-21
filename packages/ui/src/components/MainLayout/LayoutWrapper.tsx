import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Navigation } from '../Navigation/Navigation';
import MainLayout from './MainLayout';
import '../../styles/headerNav.css';
import '../../styles/combined-animation.css';
import { useNavigationAnimation } from '../../contexts/NavigationAnimationContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// This component stays mounted across route changes and handles the animations
const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHeaderHidden, isNavigationHidden } = useNavigationAnimation();
  
  // Animation control states
  const [headerHidden, setHeaderHidden] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  
  // Refs for direct DOM access
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Refs to track timeouts
  const hideTimeoutRef = useRef<number | null>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const navigateTimeoutRef = useRef<number | null>(null);

  // Check if current path is the Title screen
  const isTitleScreen = location.pathname === '/';

  // Update local state based on context values
  useEffect(() => {
    setHeaderHidden(isHeaderHidden || isTitleScreen);
    setNavHidden(isNavigationHidden || isTitleScreen);
  }, [isHeaderHidden, isNavigationHidden, isTitleScreen]);

  // Watch for route changes to clear timeouts
  useEffect(() => {
    // Always clear any pending timeouts when route changes
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    
    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;
    }
  }, [location.pathname]);

  // Handle animations during navigation
  const navigateWithAnimation = useCallback((to: string) => {
    // Don't navigate to the same path
    if (to === location.pathname) return;
    
    if (headerRef.current && navRef.current) {
      // Apply transition styles
      headerRef.current.style.transition = 'opacity 500ms linear, transform 500ms linear';
      navRef.current.style.transition = 'opacity 500ms linear, transform 500ms linear';
      headerRef.current.style.opacity = '0';
      navRef.current.style.opacity = '0';
      headerRef.current.style.transform = 'translateY(-100px)';
      navRef.current.style.transform = 'translateY(100px)';
      
      // Add animation classes
      headerRef.current.classList.add('animate-out');
      navRef.current.classList.add('animate-out');
      
      // Update React state
      setHeaderHidden(true);
      setNavHidden(true);
      
      // Wait for animation to complete, then navigate
      setTimeout(() => {
        navigate(to);
        
        // After navigation completes, animate elements back in
        setTimeout(() => {
          if (headerRef.current && navRef.current) {
            // Reset styles to show elements
            headerRef.current.style.opacity = '1';
            navRef.current.style.opacity = '1';
            headerRef.current.style.transform = 'translateY(0)';
            navRef.current.style.transform = 'translateY(0)';
            
            // Remove animation classes
            headerRef.current.classList.remove('animate-out');
            navRef.current.classList.remove('animate-out');
            
            // Update state
            setHeaderHidden(false);
            setNavHidden(false);
          }
        }, 100);
      }, 500); 
    }
  }, [location.pathname, navigate]);

  // Expose navigation function for Navigation component and global use
  useEffect(() => {
    // Make the direct navigation function available globally for testing
    (window as any).directNavigate = navigateWithAnimation;
    
    // Global click handler for navigation
    const handleGlobalClick = (e: MouseEvent) => {
      // Find closest button with data-path attribute
      const target = e.target as HTMLElement;
      const navButton = target.closest('[data-path]') as HTMLElement;
      
      if (navButton) {
        const path = navButton.getAttribute('data-path');
        if (path && path !== location.pathname) {
          e.preventDefault();
          e.stopPropagation();
          navigateWithAnimation(path);
        }
      }
    };
    
    // Add the global click handler
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      (window as any).directNavigate = undefined;
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [location.pathname, navigateWithAnimation]);

  return (
    <MainLayout>
      {/* Main content with route changes */}
      <div className={`w-full ${isTitleScreen ? "" : "pt-10 pb-16"}`}>
        {children}
      </div>
      
      {/* Persistent header with animations - hide on Title screen */}
      {!isTitleScreen && (
        <header 
          ref={headerRef}
          className={`header-animate ${headerHidden ? 'animate-out' : ''}`}
        >
          <Header />
        </header>
      )}

      {/* Persistent navigation with animations - hide on Title screen */}
      {!isTitleScreen && (
        <div 
          ref={navRef}
          className={`nav-animate ${navHidden ? 'animate-out' : ''}`}
        >
          <Navigation />
        </div>
      )}
    </MainLayout>
  );
};

export default LayoutWrapper;

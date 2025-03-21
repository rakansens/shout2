import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Reference to keep track of timeouts
  const timeoutRef = useRef<number | null>(null);
  
  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Effect to handle setting visibility based on location
  useEffect(() => {
    // Handle visibility for specific routes
    const isPreGameScreen = location.pathname === '/pregame';
    
    // When navigating to PreGame, don't automatically change 
    // visibility - we'll handle it in the component 
    if (isPreGameScreen) {
      // Don't set anything here, let the PreGame component handle it
    } else if (location.pathname === '/') {
      // Title screen
      setIsHeaderHidden(true);
      setIsNavigationHidden(true);
    } else {
      // For other screens, show both by default unless explicitly set
      if (location.state?.keepHeaderHidden !== true) {
        setIsHeaderHidden(false);
      }
      if (location.state?.keepNavigationHidden !== true) {
        setIsNavigationHidden(false);
      }
    }
  }, [location]);
  
  // Log animating state changes
  useEffect(() => {
    console.log(`[NAV] Animation state: ${isAnimating ? 'ACTIVE' : 'INACTIVE'}`);
  }, [isAnimating]);
  
  // Debug navigation state changes
  useEffect(() => {
    console.log(`[NAV DEBUG] Location changed to: ${location.pathname}`);
  }, [location]);
  
  // Debug value in console
  console.log("[NAV CONTEXT VALUES]", { isAnimating, currentPath: location.pathname, isHeaderHidden, isNavigationHidden });

  // Function to navigate with animation
  const navigateWithAnimation = (
    path: string, 
    options?: { hideHeader?: boolean; hideNavigation?: boolean }
  ) => {
    // Don't do anything if already on this path
    if (path === location.pathname) {
      console.log(`[NAV] Already at ${path}, not navigating`);
      return;
    }

    // Clear any existing timeouts
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
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
    timeoutRef.current = window.setTimeout(() => {
      // Navigate with state to indicate this was an animated navigation
      // and preserve header/navigation hidden state
      console.log(`[NAV] Now navigating to ${path}`);
      navigate(path, { 
        state: { 
          animated: true,
          keepHeaderHidden: options?.hideHeader || isHeaderHidden,
          keepNavigationHidden: options?.hideNavigation || isNavigationHidden
        } 
      });
      
      // Wait for component to mount before showing elements again
      timeoutRef.current = window.setTimeout(() => {
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

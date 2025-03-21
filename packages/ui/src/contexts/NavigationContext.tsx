import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

interface NavigationContextType {
  isTransitioning: boolean;
  navigateWithTransition: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isTransitioning: false,
  navigateWithTransition: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useRouterNavigate();

  // Function to handle navigation with transition
  const navigateWithTransition = (path: string) => {
    // Step 1: Hide components
    setIsTransitioning(true);
    
    // Step 2: Wait a bit, then navigate
    setTimeout(() => {
      navigate(path);
      
      // Step 3: Wait for navigation to complete, then show components
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Time to wait after navigation
    }, 300); // Time to wait before navigation
  };

  return (
    <NavigationContext.Provider
      value={{
        isTransitioning,
        navigateWithTransition
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

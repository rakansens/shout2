import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationAnimation } from '../../contexts/NavigationAnimationContext';

export const Game = (): JSX.Element => {
  const navigate = useNavigate();
  // Get the navigation animation context to control header and navigation visibility
  const { setIsHeaderHidden, setIsNavigationHidden } = useNavigationAnimation();

  // Prevent scrolling and set up automatic navigation to Result screen
  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    
    // Ensure header and navigation stay hidden for immersive game experience
    setIsHeaderHidden(true);
    setIsNavigationHidden(true);
    
    // Set up timer to navigate to Result screen after 3 seconds
    const timer = setTimeout(() => {
      // Navigate to Result, passing state to keep header and navigation hidden
      navigate('/result', { state: { keepHeaderHidden: true, keepNavigationHidden: true } });
    }, 3000);
    
    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [navigate, setIsHeaderHidden, setIsNavigationHidden]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <img
        className="w-full h-full object-cover"
        alt="TempBkg"
        src="https://c.animaapp.com/C7qDGUDq/img/shout-ux06-1.png"
        data-component-name="TempBkg"
      />
    </div>
  );
};

export default Game;

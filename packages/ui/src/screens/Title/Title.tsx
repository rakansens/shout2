import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Title = (): JSX.Element => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    
    // Simulate loading process
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "";
    };
  }, []);

  const handleScreenTap = () => {
    if (!isLoading) {
      navigate("/home");
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen items-center justify-center px-0 relative bg-[url(https://c.animaapp.com/2vwKHwvR/img/title.png)] bg-cover bg-[50%_50%] overflow-hidden w-full"
      onClick={handleScreenTap}
    >
      <div className="flex flex-col items-center justify-center w-full" data-component-name="Title">
        <div className="mb-40 w-full flex justify-center">
          <img
            className="w-full h-auto max-h-[60vh] object-contain"
            alt="Logo"
            src="https://c.animaapp.com/2vwKHwvR/img/logo.png"
            data-component-name="Title"
          />
        </div>

        <div className="flex h-[38px] items-center justify-center px-0 py-[7px] relative w-full bg-[#00000080]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap z-10" data-component-name="Title">
            {isLoading ? "preparing the stage for tonight" : "tap anywhere to start"}
          </div>

          <div 
            className="absolute h-[37px] top-px left-0 bg-[#6601ff80]" 
            style={{ width: `${loadingProgress}%` }}
            data-component-name="Title"
          />
        </div>
      </div>
    </div>
  );
};

export default Title;

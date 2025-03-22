import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { PriceDisplay } from "../../components/ui/price-display";
import PurchaseConfirmationModal from "../../components/Store/PurchaseConfirmationModal";
import { useScreenAnimation } from "../../hooks/useScreenAnimation";
import { useScreenEntryExit } from "../../hooks/useScreenEntryExit";
import { useNavigationAnimation } from "../../contexts/NavigationAnimationContext";
import "../../styles/screen-animations.css";

export const Store = (): JSX.Element => {
  useScreenAnimation();
  const { isLoaded, isExiting } = useScreenEntryExit();
  const { setIsHeaderHidden, setIsNavigationHidden } = useNavigationAnimation();

  // Effect to handle header and navigation visibility on entry
  useEffect(() => {
    if (isLoaded && !isExiting) {
      // Show header and navigation with a slight delay for smooth entry
      const timer = setTimeout(() => {
        setIsHeaderHidden(false);
        setIsNavigationHidden(false);
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoaded, isExiting, setIsHeaderHidden, setIsNavigationHidden]);
  
  // Effect to handle header and navigation visibility on exit
  useEffect(() => {
    if (isExiting) {
      setIsHeaderHidden(true);
      setIsNavigationHidden(true);
    }
  }, [isExiting, setIsHeaderHidden, setIsNavigationHidden]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Store items data with descriptions
  const storeItems = [
    {
      id: 1,
      title: "clear events faster with premium song tickets",
      image: "https://c.animaapp.com/aL2SPxfq/img/premium-banner.png",
      price: 1200,
      description: "Premium song tickets allow you to clear events faster and earn more rewards. Get access to exclusive premium songs and boost your progress in the game."
    },
    {
      id: 2,
      title: "song tickets",
      image: "https://c.animaapp.com/aL2SPxfq/img/song-ticket-img.png",
      price: 100,
      description: "Standard song tickets give you access to regular songs in the game. Collect these to unlock more content and enjoy a wider variety of music."
    },
  ];

  // Handle item click
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle purchase confirmation
  const handlePurchaseConfirm = () => {
    // Here you would implement the actual purchase logic
    console.log(`Purchase confirmed for item: ${selectedItem?.title}`);
    setIsModalOpen(false);
    // You could show a success notification here
  };

  return (
    <div>
      {/* Main content */}
      <main className="flex flex-col items-center gap-2.5 px-2 py-0 relative flex-1 self-stretch w-full grow mt-10 mb-20">
        <section className="flex flex-col items-start gap-[13px] px-4 py-[18px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-center gap-[35px] px-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
            
            {/* Premium banner card */}
            <div className={`w-full ${isExiting ? 'store-item-animate-exit' : isLoaded ? 'store-item-animate-entry' : 'opacity-0'}`}
                style={{ animationDelay: isExiting ? '0.2s' : '0.2s' }}>
              <Card 
                className="flex flex-col h-[535px] items-start relative self-stretch w-full rounded-[14px] overflow-hidden border-0 cursor-pointer"
                onClick={() => handleItemClick(storeItems[0])}
              >
                <CardContent className="p-0 h-full w-full">
                  <img
                    className="relative flex-1 self-stretch w-full h-full object-cover"
                    alt="Premium banner"
                    src={storeItems[0].image}
                  />

                  <div className="absolute h-[116px] top-[219px] left-2.5 [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-2xl tracking-[1.44px] leading-[normal]">
                    {storeItems[0].title.split(" ").map((word, index) => (
                      <span key={index}>
                        {word}
                        {(index + 1) % 2 === 0 &&
                          index !== storeItems[0].title.split(" ").length - 1 && (
                            <br />
                          )}
                        {(index + 1) % 2 !== 0 &&
                          index !== storeItems[0].title.split(" ").length - 1 &&
                          " "}
                      </span>
                    ))}
                  </div>

                  <PriceDisplay 
                    price={storeItems[0].price}
                    className="absolute top-0 left-0"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Song tickets card */}
            <div className={`w-full ${isExiting ? 'store-item-animate-exit' : isLoaded ? 'store-item-animate-entry' : 'opacity-0'}`}
                style={{ animationDelay: isExiting ? '0.1s' : '0.4s' }}>
              <Card 
                className="flex flex-col h-[167.25px] items-start gap-2.5 relative self-stretch w-full rounded-[14px] overflow-hidden border-0 cursor-pointer"
                onClick={() => handleItemClick(storeItems[1])}
              >
                <CardContent className="p-0 h-full w-full">
                  <img
                    className="absolute w-full h-full object-cover"
                    alt="Song tickets"
                    src={storeItems[1].image}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start px-4">
                    <div className="[font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-xl tracking-[1.20px] leading-[normal]">
                      {storeItems[1].title}
                    </div>
                  </div>
                  <PriceDisplay 
                    price={storeItems[1].price}
                    className="absolute top-0 left-0"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Purchase confirmation modal */}
      {isModalOpen && selectedItem && (
        <PurchaseConfirmationModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handlePurchaseConfirm}
          item={selectedItem}
        />
      )}
    </div>
  );
};

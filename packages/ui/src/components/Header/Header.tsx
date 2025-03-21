import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { EnergyStars } from "../ui/energy-stars";
import { BellIcon, Ticket } from "lucide-react";
import { NotificationList } from "../ui/notification-list";
import { GlitterStar } from "../ui/glitter-star";
import { useNotifications } from "../../contexts/NotificationContext";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ children, title, className, onProfileClick }) => {
  const [energyStars, setEnergyStars] = useState(5);
  const { notifications, unreadCount, markAsRead, isOpen, setIsOpen } = useNotifications();

  // エネルギー消費イベントをリッスン
  useEffect(() => {
    const handleConsumeEnergy = () => {
      setEnergyStars(prev => Math.max(0, prev - 1));
    };

    window.addEventListener('consume-energy', handleConsumeEnergy);
    
    return () => {
      window.removeEventListener('consume-energy', handleConsumeEnergy);
    };
  }, []);

  // エネルギー回復のモック（デモ用）
  useEffect(() => {
    const regenerateInterval = setInterval(() => {
      setEnergyStars(prev => Math.min(5, prev + 1));
    }, 60000); // 1分ごとに1つ回復
    
    return () => clearInterval(regenerateInterval);
  }, []);

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // デフォルトの動作（Next.jsでは使用しない）
      console.log('Profile clicked, but no handler provided');
    }
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={`min-w-[460px] h-[78px] items-center gap-2.5 px-2.5 py-2 bg-[#00000080] backdrop-blur-md rounded-[47px] opacity-[0.99] flex fixed top-0 left-0 right-0 w-full z-50 select-none ${className || ''}`}>
      {/* プロフィール部分（常に表示） */}
      <div 
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleProfileClick}
        aria-label="Go to player profile"
      >
        <Avatar className="w-[62px] h-[62px] bg-[#d9d9d9] rounded-[31px]">
          <AvatarFallback />
        </Avatar>

        <div className="inline-flex flex-col items-start justify-center gap-[5px] relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
            RHYTHM MASTER (L99)
          </div>

          <div className="relative w-fit [font-family:'Good_Times-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
            player123
          </div>
          
          <div 
            data-energy-stars="true"
            data-active-stars={energyStars}
            className="mt-1"
          >
            <EnergyStars 
              totalStars={5} 
              activeStars={energyStars} 
              size="sm" 
            />
          </div>
        </div>
      </div>

      {/* タイトル部分（中央） */}
      <div className="flex-1 flex justify-center">
        {children || (title && <div className="text-white text-xl font-bold">{title}</div>)}
      </div>

      {/* 右側のアイテム（常に表示） */}
      <div className="flex items-center">
        <div className="inline-flex h-7 items-center gap-[13px] relative mr-4">
          <div className="relative">
            <Ticket 
              className="w-[19px] h-[18px] text-white"
              strokeWidth={2}
              data-component-name="Header"
            />
            
            {/* Glitter stars around the ticket */}
            <GlitterStar size={6} style={{ top: -5, left: -3 }} className="animate-[pulse_1.5s_ease-in-out_infinite]" />
            <GlitterStar size={5} style={{ top: -2, right: -4 }} className="animate-[pulse_2s_ease-in-out_infinite]" />
            <GlitterStar size={4} style={{ bottom: -3, left: 2 }} className="animate-[pulse_1.8s_ease-in-out_infinite]" />
            <GlitterStar size={5} style={{ bottom: 0, right: 0 }} className="animate-[pulse_2.2s_ease-in-out_infinite]" />
            <GlitterStar size={6} style={{ top: 8, right: -5 }} className="animate-[pulse_1.7s_ease-in-out_infinite]" />
          </div>

          <div className="text-white text-sm relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold tracking-[0] leading-[normal]">
            99
          </div>
        </div>

        <div className="inline-flex h-7 items-center gap-2.5 relative mr-4">
          <img
            className="relative w-4 h-4"
            alt="Coins"
            src="https://c.animaapp.com/sVl5C9mT/img/coins.svg"
          />

          <div className="relative w-fit [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-[normal]">
            9,999
          </div>
        </div>

        <div 
          className="relative w-[23px] h-7 cursor-pointer"
          aria-label="Notifications"
          onClick={toggleNotifications}
        >
          <BellIcon className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* 通知リスト */}
      <NotificationList 
        notifications={notifications}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMarkAsRead={markAsRead}
      />
    </header>
  );
};

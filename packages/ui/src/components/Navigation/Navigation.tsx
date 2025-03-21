import React from "react";
import { useLocation } from "react-router-dom";

// Navigation items data with path mapping
const navItems = [
  {
    name: "HOME",
    icon: "https://c.animaapp.com/sVl5C9mT/img/home-heart.svg",
    iconWidth: "w-11",
    iconHeight: "h-[37px]",
    screen: "Home",
    path: "/home"
  },
  {
    name: "rankings",
    icon: "https://c.animaapp.com/sVl5C9mT/img/crown.svg",
    iconWidth: "w-[35px]",
    iconHeight: "h-[35px]",
    screen: "Rankings",
    path: "/rankings"
  },
  {
    name: "store",
    icon: "https://c.animaapp.com/sVl5C9mT/img/store.svg",
    iconWidth: "w-[33px]",
    iconHeight: "h-[33px]",
    screen: "Store",
    path: "/store"
  },
  {
    name: "settings",
    icon: "https://c.animaapp.com/sVl5C9mT/img/settings.svg",
    iconWidth: "w-[35px]",
    iconHeight: "h-9",
    screen: "Settings",
    path: "/settings"
  },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  // Get current path
  const currentPath = location.pathname;
  
  return (
    <nav className="h-20 items-end justify-between pt-0 pb-2.5 px-[22px] bg-black flex fixed bottom-0 left-0 right-0 w-full z-50">
      {navItems.slice(0, 2).map((item) => (
        <button
          key={item.name}
          data-path={item.path}
          className={`flex-col justify-end gap-[9px] px-[13px] py-0 inline-flex items-center relative flex-[0_0_auto] focus:outline-none transform hover:scale-105 transition-transform duration-200 active:scale-95 ${
            (currentPath === item.path || (item.screen === "Home" && (currentPath === "/" || currentPath === "/home")))
              ? "after:content-[''] after:absolute after:bottom-[-10px] after:w-full after:h-1 after:bg-[#00af51] after:rounded-t-md"
              : ""
          }`}
          aria-label={`Go to ${item.name} screen`}
          data-component-name="Navigation"
        >
          {(currentPath === item.path || (item.screen === "Home" && (currentPath === "/" || currentPath === "/home"))) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00af51] rounded-full animate-pulse"></div>
          )}
          <img
            className={`relative ${item.iconWidth} ${item.iconHeight} ${
              (currentPath === item.path || (item.screen === "Home" && (currentPath === "/" || currentPath === "/home"))) ? "filter brightness-125" : ""
            }`}
            alt={item.name}
            src={item.icon}
          />
          <div
            className={`relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap ${
              (currentPath === item.path || (item.screen === "Home" && (currentPath === "/" || currentPath === "/home"))) ? "text-[#00af51]" : ""
            }`}
          >
            {item.name}
          </div>
        </button>
      ))}

      {/* Play Button */}
      <div className="justify-center pl-3 pr-0 py-0 mt-[-48.00px] inline-flex items-center relative flex-[0_0_auto]">
        <button
          data-path="/play"
          className={`relative w-[107px] h-32 flex items-center justify-center focus:outline-none transform hover:scale-105 transition-transform duration-200 active:scale-95 ${
            currentPath === "/play" ? "filter brightness-125" : ""
          }`}
          aria-label="Play button"
        >
          <img
            className="w-full h-full object-cover translate-y-8"
            alt="Play button"
            src="https://c.animaapp.com/sVl5C9mT/img/play-grf@2x.png"
          />
        </button>
      </div>

      {navItems.slice(2).map((item) => (
        <button
          key={item.name}
          data-path={item.path}
          className={`flex-col justify-end gap-[9px] px-[13px] py-0 inline-flex items-center relative flex-[0_0_auto] focus:outline-none transform hover:scale-105 transition-transform duration-200 active:scale-95 ${
            currentPath === item.path
              ? "after:content-[''] after:absolute after:bottom-[-10px] after:w-full after:h-1 after:bg-[#00af51] after:rounded-t-md"
              : ""
          }`}
          aria-label={`Go to ${item.name} screen`}
          data-component-name="Navigation"
        >
          {currentPath === item.path && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00af51] rounded-full animate-pulse"></div>
          )}
          <img
            className={`relative ${item.iconWidth} ${item.iconHeight} ${
              currentPath === item.path ? "filter brightness-125" : ""
            }`}
            alt={item.name}
            src={item.icon}
          />
          <div
            className={`relative w-fit [font-family:'Good_Times-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap ${
              currentPath === item.path ? "text-[#00af51]" : ""
            }`}
          >
            {item.name}
          </div>
        </button>
      ))}
    </nav>
  );
};

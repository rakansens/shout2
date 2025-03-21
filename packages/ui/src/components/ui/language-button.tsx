import React from "react";

interface LanguageButtonProps {
  language: string;
  onClick: () => void;
}

export const LanguageButton: React.FC<LanguageButtonProps> = ({
  language,
  onClick
}) => {
  return (
    <div 
      className="text-card-foreground shadow flex items-center justify-center gap-2.5 px-[230px] py-1.5 relative flex-1 grow bg-[#00000099] overflow-hidden border border-solid border-white h-9 rounded-[90px] cursor-pointer select-none"
      onClick={onClick}
      data-component-name="_c"
    >
      <div 
        className="absolute h-9 top-0 left-0 rounded-[90px]" 
        style={{ 
          width: "0%", 
          background: "linear-gradient(rgb(103, 1, 255) 0%, rgb(75, 117, 209) 49.5%, rgb(176, 192, 255) 100%)" 
        }}
      />
      <div className="p-0 z-10 pointer-events-none">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Bold',Helvetica] font-bold text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap select-none">
          {language}
        </div>
      </div>
    </div>
  );
};

export default LanguageButton;

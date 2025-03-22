// このファイルは、共通のタイトルページコンポーネントです。
// React Router依存部分をNext.js互換に変換し、テーマプロパティを追加しています。

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TitlePageProps {
  theme?: 'blue' | 'green';
}

export function TitlePage({ theme = 'blue' }: TitlePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // テーマカラーの設定
  const progressBarColor = theme === 'green' ? 'bg-[#06c755]' : 'bg-[#6601ff]';

  useEffect(() => {
    // スクロール防止
    document.body.style.overflow = "hidden";
    
    // ローディングプロセスのシミュレーション
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
      // コンポーネントのアンマウント時にスクロールを再有効化
      document.body.style.overflow = "";
    };
  }, []);

  const handleScreenTap = () => {
    if (!isLoading) {
      router.push("/home");
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen items-center justify-center px-0 relative bg-[url(https://c.animaapp.com/2vwKHwvR/img/title.png)] bg-cover bg-[50%_50%] overflow-hidden w-full"
      onClick={handleScreenTap}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="mb-40 w-full flex justify-center">
          <img
            className="w-full h-auto max-h-[60vh] object-contain"
            alt="Logo"
            src="https://c.animaapp.com/2vwKHwvR/img/logo.png"
          />
        </div>

        <div className="flex h-[38px] items-center justify-center px-0 py-[7px] relative w-full bg-[#00000080]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Good_Times-Light',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] whitespace-nowrap z-10">
            {isLoading ? "preparing the stage for tonight" : "tap anywhere to start"}
          </div>

          <div 
            className={`absolute h-[37px] top-px left-0 ${progressBarColor}`}
            style={{ width: `${loadingProgress}%`, opacity: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

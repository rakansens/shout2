// このファイルは、TONクライアントのルートレイアウトです。
// アプリケーション全体のレイアウトとプロバイダーを設定します。

'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationProvider } from '@shout2/ui/src/contexts/UnifiedNavigationContext';
import { AnimationSettingsProvider } from '@shout2/ui/src/contexts/AnimationSettingsContext';
import { NotificationProvider } from '@shout2/ui/src/contexts/NotificationContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// メタデータはクライアントコンポーネントでは使用できないため、別のオブジェクトとして定義
const metadataObj = {
  title: 'Shout2 - TON',
  description: 'Shout2 TONクライアント',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // Telegram Mini App SDKの初期化
  useEffect(() => {
    // Telegramオブジェクトの存在を確認
    if (typeof window !== 'undefined') {
      try {
        // TypeScriptのエラーを回避するために型アサーションを使用
        const win = window as any;
        
        // TelegramGameProxyの存在を確認
        if (win.TelegramGameProxy === undefined) {
          console.log('TelegramGameProxy is not available');
          // モックオブジェクトを作成して、エラーを防止
          win.TelegramGameProxy = {
            receiveEvent: (eventName: string, eventData: any) => {
              console.log(`Mock TelegramGameProxy.receiveEvent: ${eventName}`, eventData);
            }
          };
        } else {
          console.log('TelegramGameProxy is available');
        }

        // Telegram WebApp APIの初期化
        if (win.Telegram && win.Telegram.WebApp) {
          win.Telegram.WebApp.ready();
          console.log('Telegram WebApp initialized');
        }
      } catch (error) {
        console.error('Failed to initialize Telegram:', error);
      }
    }
  }, []);

  return (
    <html lang="ja">
      <head>
        <title>{metadataObj.title}</title>
        <meta name="description" content={metadataObj.description} />
      </head>
      <body className={inter.className}>
        <NavigationProvider router={router} pathname={pathname} isNextJs={true}>
          <AnimationSettingsProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AnimationSettingsProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}

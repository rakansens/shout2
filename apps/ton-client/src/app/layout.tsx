// このファイルは、TONクライアントのルートレイアウトです。
// アプリケーション全体のレイアウトとプロバイダーを設定します。

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextNavigationProvider } from '@shout2/ui/src/contexts/NextNavigationContext';
import { AnimationSettingsProvider } from '@shout2/ui/src/contexts/AnimationSettingsContext';
import { NotificationProvider } from '@shout2/ui/src/contexts/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shout2 - TON',
  description: 'Shout2 TONクライアント',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <NextNavigationProvider>
          <AnimationSettingsProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AnimationSettingsProvider>
        </NextNavigationProvider>
      </body>
    </html>
  );
}

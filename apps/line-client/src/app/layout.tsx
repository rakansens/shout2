// このファイルは、LINEクライアントのルートレイアウトです。
// アプリケーション全体のレイアウトとプロバイダーを設定します。

'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationProvider } from '@shout2/ui/src/contexts/UnifiedNavigationContext';
import { AnimationSettingsProvider } from '@shout2/ui/src/contexts/AnimationSettingsContext';
import { NotificationProvider } from '@shout2/ui/src/contexts/NotificationContext';
import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// メタデータはクライアントコンポーネントでは使用できないため、別のオブジェクトとして定義
const metadataObj = {
  title: 'Shout2 - LINE',
  description: 'Shout2 LINEクライアント',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

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

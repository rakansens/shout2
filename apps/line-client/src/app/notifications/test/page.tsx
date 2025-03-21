// このファイルは、通知システムのテスト用ページです。
// 通知の表示、既読処理、追加をテストします。

'use client';

import { useEffect } from 'react';
import { useNotifications } from '@shout2/ui/src/contexts/NotificationContext';
import MainLayout from '@shout2/ui/src/components/MainLayout/MainLayout';
import { Header } from '@shout2/ui/src/components/Header/Header';
import { Navigation } from '@shout2/ui/src/components/Navigation/Navigation';
import { usePathname } from 'next/navigation';
import { useNextScreenEntryExit } from '@shout2/ui/src/hooks/useNextScreenEntryExit';

export default function NotificationTest() {
  const pathname = usePathname();
  const { isLoaded } = useNextScreenEntryExit();
  const { notifications, markAsRead, fetchNotifications, isOpen, setIsOpen } = useNotifications();
  
  // プロフィールクリック処理
  const handleProfileClick = () => {
    // プロフィールページへ遷移
    console.log('Profile clicked');
  };
  
  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    // 指定されたパスへ遷移
    console.log(`Navigate to: ${path}`);
  };
  
  // テスト用に通知を追加
  const addTestNotification = () => {
    // 実際のAPIが実装されるまでは、fetchNotificationsを呼び出して
    // コンテキスト内のダミーデータを再設定
    fetchNotifications();
    
    // 通知ドロップダウンを開く
    setIsOpen(true);
  };
  
  // 全ての通知を既読にする
  const markAllAsRead = () => {
    // 未読の通知をすべて既読にする
    notifications
      .filter(notification => !notification.read)
      .forEach(notification => markAsRead(notification.id));
  };
  
  return (
    <MainLayout>
      <Header onProfileClick={handleProfileClick}>
        <div className="text-white text-xl font-bold">通知テスト</div>
      </Header>
      
      <div className={`min-h-screen pb-20 pt-24 px-4 ${isLoaded ? 'animate-entry' : ''}`}>
        <h1 className="text-2xl font-bold mb-6 text-white">通知テスト</h1>
        
        <div className="space-y-6">
          <div className={`bg-gray-800/50 rounded-lg p-4 ${isLoaded ? 'animate-entry delay-1' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 text-white">通知操作</h2>
            
            <div className="flex space-x-4">
              <button
                onClick={addTestNotification}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                テスト通知を追加
              </button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                通知を{isOpen ? '閉じる' : '開く'}
              </button>
              
              <button
                onClick={markAllAsRead}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                すべて既読にする
              </button>
            </div>
          </div>
          
          <div className={`bg-gray-800/50 rounded-lg p-4 ${isLoaded ? 'animate-entry delay-2' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 text-white">現在の通知一覧</h2>
            
            {notifications.length === 0 ? (
              <p className="text-gray-400">通知はありません</p>
            ) : (
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-700/30' : 'bg-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white">{notification.title}</h3>
                      <span className="text-xs text-gray-400">{notification.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-green-400 mt-2"
                      >
                        既読にする
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={`bg-gray-800/50 rounded-lg p-4 ${isLoaded ? 'animate-entry delay-3' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 text-white">使用方法</h2>
            
            <div className="text-gray-300 space-y-2">
              <p>1. 「テスト通知を追加」ボタンをクリックして、通知を追加します。</p>
              <p>2. ヘッダーの通知アイコンをクリックして、通知ドロップダウンを開きます。</p>
              <p>3. 通知の「既読にする」ボタンをクリックして、個別の通知を既読にします。</p>
              <p>4. 「すべて既読にする」ボタンをクリックして、すべての通知を既読にします。</p>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation 
        currentPath={pathname} 
        onNavigate={handleNavigation} 
      />
    </MainLayout>
  );
}

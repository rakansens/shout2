// このファイルは、通知システムを管理するコンテキストを提供します。
// アプリケーション全体で通知の表示、既読管理、取得を制御します。

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../components/ui/notification-list';

// コンテキストの型定義
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  fetchNotifications: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// デフォルト値を持つコンテキストの作成
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  fetchNotifications: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

// コンテキストを使用するためのフック
export const useNotifications = () => useContext(NotificationContext);

/**
 * 通知プロバイダーコンポーネント
 * アプリケーション全体で通知を管理します
 */
export const NotificationProvider: React.FC<{ children: ReactNode; userId?: string }> = ({ 
  children, 
  userId 
}) => {
  // 通知リストの状態
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // 通知ドロップダウンの開閉状態
  const [isOpen, setIsOpen] = useState(false);
  
  // 通知を取得する関数
  const fetchNotifications = async () => {
    // APIが実装されるまではダミーデータを使用
    // 実際のAPIが実装されたら、以下のコードを使用
    /*
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) {
        throw new Error('通知の取得に失敗しました');
      }
      
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('通知の取得エラー:', error);
    }
    */
    
    // ダミーデータ
    setNotifications([
      {
        id: "1",
        title: "新しいクエスト",
        message: "3つのクエストが追加されました！",
        timestamp: "1時間前",
        read: false,
      },
      {
        id: "2",
        title: "ランキング更新",
        message: "あなたのランキングが上昇しました！",
        timestamp: "3時間前",
        read: false,
      },
      {
        id: "3",
        title: "デイリーボーナス",
        message: "デイリーボーナスを受け取りましょう！",
        timestamp: "1日前",
        read: true,
      },
      {
        id: "4",
        title: "新しいアイテム",
        message: "ストアに新しいアイテムが追加されました",
        timestamp: "2日前",
        read: true,
      },
    ]);
  };
  
  // 通知を既読にする関数
  const markAsRead = async (id: string) => {
    // APIが実装されるまではローカルステートのみ更新
    // 実際のAPIが実装されたら、以下のコードを使用
    /*
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('通知の既読処理に失敗しました');
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('通知の既読処理エラー:', error);
    }
    */
    
    // ローカルステートの更新
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  // 未読通知数の計算
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // 初回読み込みと定期更新
  useEffect(() => {
    fetchNotifications();
    
    // 1分ごとに通知を更新
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(interval);
  }, [userId]);
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      fetchNotifications,
      isOpen,
      setIsOpen,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

import React from "react";
import { XIcon } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-[78px] right-0 w-80 max-h-96 overflow-y-auto bg-[#1a1a1a] rounded-b-lg shadow-lg z-50 border border-[#333]">
      <div className="sticky top-0 flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-[#333]">
        <h3 className="text-white font-bold">Notifications</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-[#333] transition-colors">
          <XIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-400">No notifications</div>
      ) : (
        <div className="divide-y divide-[#333]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-[#252525] transition-colors cursor-pointer ${
                notification.read ? "opacity-60" : ""
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
                  <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                  <span className="text-gray-400 text-xs mt-2 block">{notification.timestamp}</span>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

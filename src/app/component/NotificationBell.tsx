"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { getNotificationsAction, getUnreadNotificationCountAction, markNotificationReadAction, markAllNotificationsReadAction } from "../actions/notification";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const user = getCurrentUser();

  const fetchNotifications = async () => {
    if (!user) return;
    const [countRes, listRes] = await Promise.all([
      getUnreadNotificationCountAction(user.id),
      getNotificationsAction(user.id)
    ]);
    if (countRes.success) setUnreadCount(countRes.count || 0);
    if (listRes.success) setNotifications(listRes.data || []);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markNotificationReadAction(notif.id);
      fetchNotifications();
    }
    setOpen(false);
    if (notif.linkUrl) {
      window.location.href = notif.linkUrl;
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    await markAllNotificationsReadAction(user.id);
    fetchNotifications();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Notifikasi</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <Check size={12} /> Tandai dibaca
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Belum ada notifikasi
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {notif.sender?.name?.charAt(0).toUpperCase() || "S"}
                      </div>
                    </div>
                    <div>
                      <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 ml-auto shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

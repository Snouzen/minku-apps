"use client";

import React from "react";
import { Menu, LogOut, User } from "lucide-react";
import Image from "next/image";
import { getCurrentUser, logout } from "../lib/auth";
import NotificationBell from "./NotificationBell";

export default function Navbar({ onToggle }: { onToggle: () => void }) {
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile: show logo instead of burger */}
          <button
            onClick={onToggle}
            className="md:hidden p-0 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
            title="Open sidebar"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/logo-sikd-3.png"
                alt="SIKD"
                fill
                priority
                sizes="(max-width: 768px) 32px, 0px"
                className="object-contain"
              />
            </div>
          </button>
          {/* Desktop: keep burger */}
          <button
            onClick={onToggle}
            className="hidden md:inline-flex p-2 rounded-lg hover:bg-gray-100 transition-colors text-black"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <User size={16} />
            </div>
            <div className="hidden md:flex flex-col items-start justify-center">
              <span className="text-sm font-bold text-gray-800 leading-none mb-1">
                {currentUser?.picName || currentUser?.name || "User"}
              </span>
              <span className="text-xs font-medium text-blue-600 leading-none">
                {currentUser?.jabatan || (currentUser?.role === "SUPER_ADMIN" ? "Manager" : "Staff")}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-black"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

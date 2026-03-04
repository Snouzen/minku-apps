"use client";

import React from "react";
import { Menu, Search, LogOut, User } from "lucide-react";
import Image from "next/image";
import { getCurrentUser, logout } from "../lib/auth";

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

          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <User size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {currentUser?.name}
            </span>
            <span className="text-xs text-gray-500">
              ({currentUser?.role === "super_admin" ? "User Master" : "PIC"})
            </span>
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

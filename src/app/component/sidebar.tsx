"use client";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Database,
  ChevronRight,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, active: true },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-60 bg-white border-r flex flex-col transition-all duration-300 ease-in-out shadow-xl lg:relative lg:translate-x-0 ${isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-20"}`}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 mb-4">
        {isOpen ? (
          <div className="relative w-full h-10 transition-all duration-300">
            <Image
              src="/logo-bulog.png"
              alt="Bulog Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0 mx-auto transition-all duration-300">
            <span className="text-white font-black text-xl italic">B</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-x-hidden">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            href="#"
            className={`flex items-center p-3 rounded-xl transition-all ${menu.active ? "bg-orange-50 text-orange-500 font-bold" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}
          >
            <div className="flex items-center gap-4 min-w-50">
              {menu.icon}
              <span
                className={`text-sm transition-opacity duration-200 ${!isOpen && "lg:opacity-0"}`}
              >
                {menu.name}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

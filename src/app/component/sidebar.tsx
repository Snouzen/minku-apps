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
import { getCurrentUser } from "../lib/auth";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const user = getCurrentUser();
  const menus = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard size={20} />,
      active: true,
    },
    ...(user?.role === "super_admin"
      ? [
          {
            name: "Logs",
            href: "/logs",
            icon: <Database size={20} />,
            active: false,
          } as const,
        ]
      : []),
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-60 bg-white border-r flex flex-col transition-all duration-300 ease-in-out shadow-xl overflow-hidden lg:relative lg:translate-x-0 ${isOpen ? "w-72 translate-x-0 pointer-events-auto" : "w-0 -translate-x-full lg:w-24 pointer-events-none lg:pointer-events-auto"}`}
    >
      {/* Logo Section */}
      <div className="h-24 flex items-center px-4 mb-4">
        {isOpen ? (
          <div className="relative w-full h-12 transition-all duration-300">
            <Image
              src="/logo-bulog.png"
              alt="Bulog Logo"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 288px"
              className="object-contain object-center"
            />
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center w-full">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 mx-auto mt-1 transition-all duration-300">
              <Image
                src="/logo-sikd-3.png"
                alt="SIKD Logo"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 96px"
                className="object-contain object-center"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-x-hidden">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            href={menu.href}
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

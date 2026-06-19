"use client";

import {
  LayoutDashboard,
  Building2,
  Database,
  ChevronRight,
  Server,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/auth";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const user = getCurrentUser();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === "/unit-produksi" || pathname === "/vendor") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDropdown("Master Data");
    }
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
    if (!isOpen) setIsOpen(true);
  };

  const menus = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard size={20} />,
      active: pathname === "/",
    },
    {
      name: "UBI Maintenance",
      href: "/ubi-maintenance",
      icon: <Building2 size={20} />,
      active: pathname === "/ubi-maintenance",
    },
    {
      name: "Matrix IT",
      href: "/matrix-it",
      icon: <Server size={20} />,
      active: pathname === "/matrix-it",
    },
    {
      name: "Master Data",
      icon: <Database size={20} />,
      active: pathname === "/unit-produksi" || pathname === "/vendor",
      subMenus: [
        {
          name: "Unit Produksi",
          href: "/unit-produksi",
          active: pathname === "/unit-produksi",
        },
        {
          name: "Data Vendor",
          href: "/vendor",
          active: pathname === "/vendor",
        },
      ],
    },
    ...(user?.role === "SUPER_ADMIN"
      ? [
          {
            name: "Logs",
            href: "/logs",
            icon: <Database size={20} />,
            active: pathname === "/logs",
          } as const,
        ]
      : []),
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-60 bg-white border-r flex flex-col transition-all duration-300 ease-in-out shadow-xl overflow-hidden lg:relative lg:translate-x-0 ${
        isOpen
          ? "w-72 translate-x-0 pointer-events-auto"
          : "w-0 -translate-x-full lg:w-24 pointer-events-none lg:pointer-events-auto"
      }`}
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
        {menus.map((menu) =>
          menu.subMenus ? (
            <div key={menu.name} className="space-y-1">
              <button
                onClick={() => toggleDropdown(menu.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  menu.active
                    ? "bg-orange-50 text-orange-500 font-bold"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                <div className="flex items-center gap-4 min-w-50">
                  <div
                    className={`${
                      menu.active
                        ? "text-orange-500"
                        : "text-gray-400 group-hover:text-orange-400"
                    } transition-colors`}
                  >
                    {menu.icon}
                  </div>
                  <span
                    className={`text-sm transition-opacity duration-200 ${
                      !isOpen && "lg:opacity-0"
                    }`}
                  >
                    {menu.name}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    openDropdown === menu.name
                      ? "rotate-90 text-orange-500"
                      : "text-gray-400"
                  } ${!isOpen && "hidden"}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openDropdown === menu.name && isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0 mt-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pl-14 pr-4 space-y-1 relative before:absolute before:left-8 before:top-0 before:bottom-4 before:w-[2px] before:bg-gray-100">
                    {menu.subMenus.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() =>
                          window.innerWidth < 1024 && setIsOpen(false)
                        }
                        className={`block px-4 py-2.5 rounded-xl transition-all duration-200 text-sm relative before:absolute before:left-[-1.5rem] before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-[2px] before:bg-gray-100 ${
                          sub.active
                            ? "bg-orange-50 text-orange-500 font-bold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-orange-500"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={menu.name}
              href={menu.href}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`flex items-center p-3 rounded-xl transition-all ${
                menu.active
                  ? "bg-orange-50 text-orange-500 font-bold"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              }`}
            >
              <div className="flex items-center gap-4 min-w-50">
                {menu.icon}
                <span
                  className={`text-sm transition-opacity duration-200 ${
                    !isOpen && "lg:opacity-0"
                  }`}
                >
                  {menu.name}
                </span>
              </div>
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}

import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "icon" | "icon-blue" | "icon-orange" | "icon-red";
  icon?: LucideIcon;
  iconSize?: number;
  label?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  icon: Icon,
  iconSize = 16,
  label,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#1A237E] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold",
    danger: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md",
    outline: "bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm",
    icon: "p-2 text-gray-400 hover:bg-gray-100 rounded-lg",
    "icon-blue": "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg",
    "icon-orange": "p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg",
    "icon-red": "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={iconSize} />}
      {label || children}
    </button>
  );
}

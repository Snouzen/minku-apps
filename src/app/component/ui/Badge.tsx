import React from "react";

interface BadgeProps {
  label: string;
  color?: "green" | "blue" | "orange" | "purple" | "teal" | "gray" | "red";
  className?: string;
}

export default function Badge({ label, color = "gray", className = "" }: BadgeProps) {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    teal: "bg-teal-100 text-teal-600",
    red: "bg-red-100 text-red-600",
    gray: "bg-gray-100 text-gray-600"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[color]} ${className}`}>
      {label}
    </span>
  );
}

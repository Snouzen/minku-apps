import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Cari...",
  value,
  onChange,
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 min-w-[250px] ${className}`}>
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl outline-none text-sm text-black focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-300"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

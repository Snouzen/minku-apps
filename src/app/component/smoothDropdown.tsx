"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface SmoothDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Wrapper classes
  buttonClassName?: string; // Specific classes for the trigger button
  disabled?: boolean;
}

export default function SmoothDropdown({
  options,
  value,
  onChange,
  placeholder = "Pilih opsi...",
  className = "",
  buttonClassName = "p-4",
  disabled = false,
}: SmoothDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className={`relative ${className}`} 
      ref={dropdownRef}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${buttonClassName} ${
          isOpen ? "border-blue-300 ring-4 ring-blue-50" : "border-gray-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-200"}`}
      >
        <span className={selectedOption ? "text-black line-clamp-1 text-left" : "text-gray-400 line-clamp-1 text-left"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu (Absolute positioning, animated) */}
      <div
        className={`absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl transition-all duration-200 transform origin-top ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="py-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 rounded-xl">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">Tidak ada opsi</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-blue-50 ${
                  value === option.value
                    ? "bg-blue-50/50 text-[#1A237E] font-bold"
                    : "text-gray-700 font-medium"
                }`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

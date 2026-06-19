"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownConfig, setDropdownConfig] = useState<{ style: React.CSSProperties, placement: 'top' | 'bottom' } | null>(null);
  const [mounted, setMounted] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = (e: Event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", () => setIsOpen(false));
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 250;
      
      const isTop = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
      
      setDropdownConfig({
        style: {
          position: 'fixed',
          top: isTop ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
        },
        placement: isTop ? 'top' : 'bottom'
      });
    }
  }, [isOpen, options.length]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
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

      {/* Dropdown Menu Portaled to Body */}
      {mounted && isOpen && dropdownConfig && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownConfig.style}
          className={`bg-white border border-gray-100 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 ${
            dropdownConfig.placement === 'top' 
              ? 'origin-bottom slide-in-from-bottom-2' 
              : 'origin-top slide-in-from-top-2'
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
                  onClick={(e) => {
                    e.stopPropagation();
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
        </div>,
        document.body
      )}
    </div>
  );
}

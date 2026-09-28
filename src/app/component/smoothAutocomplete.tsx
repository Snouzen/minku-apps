"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { createPortal } from "react-dom";

export interface AutocompleteOption {
  label: string;
  value: string;
}

const escapeRegex = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const renderHighlightedText = (text: string, highlight: string) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${escapeRegex(highlight)})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 text-yellow-900 font-bold rounded-sm">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

interface SmoothAutocompleteProps {
  options: AutocompleteOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Wrapper classes
  inputClassName?: string; // Specific classes for the input
  disabled?: boolean;
}

export default function SmoothAutocomplete({
  options,
  value,
  onChange,
  placeholder = "Ketik atau pilih opsi...",
  className = "",
  inputClassName = "p-3",
  disabled = false,
}: SmoothAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownConfig, setDropdownConfig] = useState<{ style: React.CSSProperties, placement: 'top' | 'bottom' } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sync internal input value with external value prop
  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(selectedOption.label);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(value);
    }
  }, [value, options]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
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
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300;
      
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

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    const lowerVal = inputValue.toLowerCase();
    // If the input exactly matches an option's value (meaning it was selected), show all options
    const exactMatch = options.find((opt) => opt.value === value || opt.label === inputValue);
    if (exactMatch) return options;

    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerVal) ||
        opt.value.toLowerCase().includes(lowerVal)
    );
  }, [inputValue, options, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val); // Propagate free text so it can be saved even if not in options
    setActiveIndex(0); // Reset highlight to first item when typing
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < filteredOptions.length ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0 && activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleOptionClick(filteredOptions[activeIndex].value, filteredOptions[activeIndex].label);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Tab") {
      // If user tabs away, close the dropdown but allow default tab behavior
      setIsOpen(false);
    }
  };

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    setInputValue(optionLabel);
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={wrapperRef}
        className={`w-full flex items-center justify-between bg-white rounded-xl outline-none border transition-all text-sm font-medium focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 ${
          isOpen ? "border-blue-400 ring-2 ring-blue-50" : "border-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full outline-none bg-transparent ${inputClassName} ${
            disabled ? "cursor-not-allowed text-gray-500" : "text-black"
          }`}
        />
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 mr-3 cursor-pointer ${
            isOpen ? "rotate-180 text-blue-500" : "rotate-0"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }
          }}
        />
      </div>

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
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center italic">
                Tidak ada kecocokan
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionClick(option.value, option.label);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    activeIndex === index
                      ? "bg-blue-50 border-l-4 border-blue-500 text-[#1A237E] font-bold"
                      : value === option.value
                      ? "bg-gray-50 text-gray-800 font-bold border-l-4 border-transparent"
                      : "text-gray-700 font-medium hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  {renderHighlightedText(option.label, inputValue !== (options.find(o => o.value === value)?.label || "") ? inputValue : "")}
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

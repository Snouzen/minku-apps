"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";

export interface MultiAutocompleteOption {
  label: string;
  value: string;
}

interface SmoothMultiAutocompleteProps {
  options: MultiAutocompleteOption[];
  value: string; // Comma-separated string of values e.g. "SPP Subang, SPP Karawang"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Wrapper classes
  inputClassName?: string; // Specific classes for the input
  disabled?: boolean;
}

export default function SmoothMultiAutocomplete({
  options,
  value,
  onChange,
  placeholder = "Ketik atau pilih opsi...",
  className = "",
  inputClassName = "p-2",
  disabled = false,
}: SmoothMultiAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dropdownConfig, setDropdownConfig] = useState<{ style: React.CSSProperties, placement: 'top' | 'bottom' } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Parse comma-separated value into array
  const selectedValues = useMemo(() => {
    return value ? value.split(", ").filter(v => v.trim() !== "") : [];
  }, [value]);

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
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerVal) ||
        opt.value.toLowerCase().includes(lowerVal)
    );
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setActiveIndex(0);
    if (!isOpen) setIsOpen(true);
  };

  const toggleOption = (optionValue: string) => {
    // If we want to store the label instead of value for display purposes
    // based on original component's behavior, we should store labels.
    // Wait, original SmoothAutocomplete stored optionValue via onChange.
    // But then it showed optionLabel.
    // Since unitProduksiOptions has value=namaRegional and label=namaRegional, they are the same!
    const isSelected = selectedValues.includes(optionValue);
    let newValues;
    if (isSelected) {
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      newValues = [...selectedValues, optionValue];
    }
    onChange(newValues.join(", "));
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && selectedValues.length > 0) {
      // Remove last item
      const newValues = selectedValues.slice(0, -1);
      onChange(newValues.join(", "));
      return;
    }

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
        const opt = filteredOptions[activeIndex];
        toggleOption(opt.value);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={wrapperRef}
        className={`w-full flex items-center justify-between bg-white rounded-xl outline-none border transition-all text-sm font-medium focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-50 ${
          isOpen ? "border-orange-400 ring-2 ring-orange-50" : "border-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "p-2 min-h-[46px]"}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <div className="flex flex-wrap items-center gap-2 flex-1 overflow-hidden">
          {selectedValues.map((val) => {
            const opt = options.find(o => o.value === val);
            const displayLabel = opt ? opt.label : val;
            return (
              <span key={val} className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                {displayLabel}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) {
                      toggleOption(val);
                    }
                  }}
                  className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            className={`flex-1 outline-none bg-transparent min-w-[120px] ${inputClassName} ${
              disabled ? "cursor-not-allowed text-gray-500" : "text-black"
            }`}
          />
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 mr-2 cursor-pointer ${
            isOpen ? "rotate-180 text-orange-500" : "rotate-0"
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
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.value);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      activeIndex === index
                        ? "bg-orange-50 border-l-4 border-orange-500 text-orange-900 font-bold"
                        : isSelected
                        ? "bg-gray-50 text-gray-800 font-bold border-l-4 border-transparent"
                        : "text-gray-700 font-medium hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="flex items-center justify-center bg-orange-500 text-white rounded-full p-0.5">
                        <X size={12} />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

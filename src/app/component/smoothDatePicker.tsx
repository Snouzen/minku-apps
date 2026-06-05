"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";

interface SmoothDatePickerProps {
  value: string; // ISO date string e.g. "yyyy-MM-dd"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Class for outer wrapper
  buttonClassName?: string; // Class for trigger button
  disabled?: boolean;
}

export default function SmoothDatePicker({
  value,
  onChange,
  placeholder = "Pilih Tanggal",
  className = "",
  buttonClassName = "p-4 bg-gray-50 rounded-xl",
  disabled = false,
}: SmoothDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (value && isOpen) {
      setCurrentMonth(parseISO(value));
    } else if (!value && isOpen) {
      setCurrentMonth(new Date());
    }
  }, [value, isOpen]);

  const selectedDate = value ? parseISO(value) : null;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  const onDateClick = (day: Date) => {
    onChange(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStarts: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStarts: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

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
        className={`w-full flex items-center justify-between outline-none border transition-all text-sm font-medium ${buttonClassName} ${
          isOpen ? "border-blue-300 ring-4 ring-blue-50" : "border-gray-100"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:border-blue-200"}`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className={selectedDate ? "text-blue-600" : "text-gray-400"} />
          <span className={selectedDate ? "text-black" : "text-gray-400"}>
            {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : placeholder}
          </span>
        </div>
      </button>

      {/* Calendar Dropdown */}
      <div
        className={`absolute z-50 w-72 p-4 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl transition-all duration-200 transform origin-top-left ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-gray-800">
            {format(currentMonth, "MMMM yyyy", { locale: id })}
          </span>
          <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={i}
                type="button"
                onClick={() => onDateClick(day)}
                className={`
                  w-8 h-8 rounded-full flex items-center mx-auto justify-center text-xs font-medium transition-colors
                  ${!isCurrentMonth ? "text-gray-300 hover:text-gray-500" : "text-gray-700 hover:bg-gray-100"}
                  ${isToday && !isSelected ? "border border-blue-500 text-blue-600" : ""}
                  ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : ""}
                `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
        
        {/* Today Button shortcut */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
          <button
            type="button"
            onClick={() => onDateClick(new Date())}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Hari Ini
          </button>
        </div>
      </div>
    </div>
  );
}

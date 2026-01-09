"use client";
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    ChevronDown,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

const CustomDatePicker = ({ className = "", value, onChange }: { className?: string, value: string, onChange: (date: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    // Fix: Parse initial value using local time to avoid timezone shifts
    const parseLocalDate = (dateStr: string) => {
        if (!dateStr) return new Date();
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // const [viewDate, setViewDate] = useState(new Date(value || new Date()));
    const [viewDate, setViewDate] = useState(parseLocalDate(value));
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const activeYearRef = useRef<HTMLButtonElement>(null); // Ref for scrolling to selected year

    const selectedDate = useMemo(() => {
        const d = new Date(value);
        return isNaN(d.getTime()) ? new Date() : d;
    }, [value]);

    // Handle Scrolling to Active Year
    useEffect(() => {
        if (!showYearPicker) return;

        const el = activeYearRef.current;
        if (!el) return;

        const timer = setTimeout(() => {
            el.scrollIntoView({
                block: "center",
                behavior: "auto",
            });
        }, 10);

        return () => clearTimeout(timer);
    }, [showYearPicker]);

    // Calculate position for the portal
    const updatePosition = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX + rect.width / 2,
                width: rect.width
            });
        }
    }, []);

    const toggleOpen = () => {
        if (!isOpen) {
            updatePosition();
            setViewDate(selectedDate);
        }
        setIsOpen(!isOpen);
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < startDay; i++) days.push(null);
        for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
        return days;
    }, [viewDate]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const result = [];
        for (let i = currentYear - 80; i <= currentYear + 30; i++) result.push(i);
        return result;
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current && !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setShowYearPicker(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen, updatePosition]);

    const formatDateLabel = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleDayClick = (date: Date) => {
        if (!date) return;
        // Format to YYYY-MM-DD in local time
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const handleYearClick = (year: number) => {
        setViewDate(new Date(year, viewDate.getMonth(), 1));
        setShowYearPicker(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    // Portal Component
    const PickerPanel = (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transform: 'translateX(-50%)'
            }}
            className="z-[9999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <ChevronLeft size={16} />
                </button>

                <button
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="flex items-center gap-1 px-2 py-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                    </div>
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} />
                </button>

                <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>

            {showYearPicker ? (
                <div className="h-48 overflow-y-auto grid grid-cols-3 gap-2 p-1 scroll-smooth">
                    {years.map(year => {
                        const isSelected = viewDate.getFullYear() === year;
                        return (
                            <button
                                key={year}
                                ref={isSelected ? activeYearRef : null}
                                onClick={() => handleYearClick(year)}
                                className={`py-1 text-xs rounded-full transition-colors ${isSelected ? 'bg-blue-500 text-white font-bold' : 'hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300'}`}
                            >
                                {year}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-[10px] text-center font-bold text-slate-400 uppercase">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="h-7 w-7" />;

                            // Compare dates using local time values
                            const isSelected =
                                date.getFullYear() === selectedDate.getFullYear() &&
                                date.getMonth() === selectedDate.getMonth() &&
                                date.getDate() === selectedDate.getDate();

                            const isToday = new Date().toDateString() === date.toDateString();

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleDayClick(date)}
                                    className={`h-7 w-7 flex items-center justify-center text-[11px] rounded-full transition-colors
                                        ${isSelected ? 'bg-blue-500 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40'}
                                        ${isToday && !isSelected ? 'border border-indigo-200 dark:border-blue-700 text-blue-600' : ''}
                                    `}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={toggleOpen}
                className={cn(className)}
            >
                <span className="truncate block">{formatDateLabel(selectedDate)}</span>
            </button>

            {isOpen && createPortal(PickerPanel, document.body)}
        </div>
    );
};

export default CustomDatePicker;
"use client";

import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
} from "react";
import {
    ChevronDown,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface CustomDatePickerProps {
    value?: Date;
    onChange: (date?: Date) => void;
    className?: string;
    disabled?: boolean;
}

/* ------------------------------------------------------------------ */
/* Utils */
/* ------------------------------------------------------------------ */

// Parse YYYY-MM-DD as LOCAL date (no timezone shift)
const parseLocalDate = (date?: Date): Date =>
    date ?? new Date();

// Format Date → YYYY-MM-DD
const formatLocalDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    className = "",
    disabled = false
}) => {
    const [open, setOpen] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const selectedDate = useMemo(
        () => value ?? new Date(),
        [value]
    );

    const [viewDate, setViewDate] = useState<Date>(selectedDate);

    useEffect(() => {
        setViewDate(selectedDate);
    }, [selectedDate]);

    /* -------------------------------------------------------------- */
    /* Year scroll ref */
    /* -------------------------------------------------------------- */

    const activeYearRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!showYearPicker) return;
        activeYearRef.current?.scrollIntoView({
            block: "center",
        });
    }, [showYearPicker]);

    /* -------------------------------------------------------------- */
    /* Calendar helpers */
    /* -------------------------------------------------------------- */

    const daysInMonth = (y: number, m: number) =>
        new Date(y, m + 1, 0).getDate();

    const firstDayOfMonth = (y: number, m: number) =>
        new Date(y, m, 1).getDay();

    const calendarDays = useMemo(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        const total = daysInMonth(y, m);
        const start = firstDayOfMonth(y, m);

        const days: (Date | null)[] = [];
        for (let i = 0; i < start; i++) days.push(null);
        for (let i = 1; i <= total; i++)
            days.push(new Date(y, m, i));
        return days;
    }, [viewDate]);

    const years = useMemo(() => {
        const now = new Date().getFullYear();
        return Array.from(
            { length: 111 },
            (_, i) => now - 80 + i
        );
    }, []);

    /* -------------------------------------------------------------- */

    const formatLabel = (date: Date) =>
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    /* -------------------------------------------------------------- */

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "w-full text-left",
                        className,
                        !value &&
                        "text-black/60 dark:text-white/60"
                    )}
                >
                    {value
                        ? formatLabel(selectedDate)
                        : "Select date"}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-64 p-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() =>
                            setViewDate(
                                new Date(
                                    viewDate.getFullYear(),
                                    viewDate.getMonth() - 1,
                                    1
                                )
                            )
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <button
                        onClick={() =>
                            setShowYearPicker(!showYearPicker)
                        }
                        className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                        <span className="text-xs font-bold">
                            {viewDate.toLocaleString("default", {
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                        <ChevronDown
                            size={12}
                            className={cn(
                                "transition-transform",
                                showYearPicker && "rotate-180"
                            )}
                        />
                    </button>

                    <button
                        onClick={() =>
                            setViewDate(
                                new Date(
                                    viewDate.getFullYear(),
                                    viewDate.getMonth() + 1,
                                    1
                                )
                            )
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Year picker */}
                {showYearPicker ? (
                    <div className="h-48 overflow-y-auto grid grid-cols-3 gap-2">
                        {years.map((year) => {
                            const isSelected =
                                viewDate.getFullYear() === year;
                            return (
                                <button
                                    key={year}
                                    ref={
                                        isSelected
                                            ? activeYearRef
                                            : null
                                    }
                                    onClick={() => {
                                        setViewDate(
                                            new Date(
                                                year,
                                                viewDate.getMonth(),
                                                1
                                            )
                                        );
                                        setShowYearPicker(false);
                                    }}
                                    className={cn(
                                        "py-1 text-xs rounded-full",
                                        isSelected
                                            ? "bg-blue-500 text-white font-bold"
                                            : "hover:bg-blue-50 dark:hover:bg-slate-800",

                                    )}
                                >
                                    {year}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        {/* Weekdays */}
                        <div className="grid grid-cols-7 gap-1 mb-2 text-[10px] text-center text-slate-400 font-bold">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                                (d) => (
                                    <div key={d}>{d}</div>
                                )
                            )}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((date, i) => {
                                if (!date)
                                    return (
                                        <div
                                            key={i}
                                            className="h-7 w-7"
                                        />
                                    );

                                const selected =
                                    date.toDateString() ===
                                    selectedDate.toDateString();

                                const isToday = new Date().toDateString() === date.toDateString();

                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            onChange(date);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "h-7 w-7 text-[11px] rounded-full flex items-center justify-center",
                                            isToday && !selected ? 'border border-indigo-200 dark:border-blue-700 text-blue-600' : '',
                                            selected ? "bg-blue-500 text-white font-bold" : "hover:bg-indigo-50 dark:hover:bg-blue-800/50",
                                        )}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default CustomDatePicker;

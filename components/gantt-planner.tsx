"use client";
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    Plus,
    ChevronDown,
    ChevronRight,
    Trash2,
    GripVertical,
    Clock,
    PlusCircle,
    ListTodo,
    ArrowLeft,
    Calendar,
    ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// --- Types ---
interface Task {
    id: number;
    name: string;
    type: 'main' | 'subtask';
    assignedTo: string;
    progress: number;
    startDate: string;
    endDate: string;
    color: string;
    expanded: boolean;
    parentId: number | null;
    level: number;
}

interface Week {
    start: Date;
    end: Date;
    days: Date[];
}

// --- Custom Modern Date Picker Component with Year Selection ---
const CustomDatePicker = ({ value, onChange }: { value: string, onChange: (date: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value || new Date()));
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedDate = useMemo(() => {
        const d = new Date(value);
        return isNaN(d.getTime()) ? new Date() : d;
    }, [value]);

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
        if (!isOpen) updatePosition();
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
        for (let i = currentYear - 50; i <= currentYear + 20; i++) result.push(i);
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
        const isoString = date.toISOString().split('T')[0];
        onChange(isoString);
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
            className="z-[9999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-4 animate-in fade-in zoom-in duration-150"
        >
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <ChevronLeft size={16} />
                </button>

                <button
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                <div className="h-48 overflow-y-auto grid grid-cols-3 gap-2 p-1 custom-scrollbar">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => handleYearClick(year)}
                            className={`py-2 text-xs rounded-md transition-colors ${viewDate.getFullYear() === year ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-600 dark:text-slate-300'}`}
                        >
                            {year}
                        </button>
                    ))}
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
                            const isSelected = date.toISOString().split('T')[0] == value;
                            const isToday = new Date().toDateString() == date.toDateString();
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleDayClick(date)}
                                    className={`h-7 w-7 flex items-center justify-center text-[11px] rounded-lg transition-colors
                                        ${isSelected ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40'}
                                        ${isToday && !isSelected ? 'border border-indigo-200 dark:border-indigo-700 text-indigo-600' : ''}
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
                className="w-full px-2 text-[10px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-transparent rounded-xs py-1 transition-all outline-none focus:ring-1 focus:ring-indigo-500"
            >
                <span className="truncate block">{formatDateLabel(selectedDate)}</span>
            </button>

            {isOpen && createPortal(PickerPanel, document.body)}
        </div>
    );
};

const GanttPlanner = () => {
    const router = useRouter();
    // --- Initial Data ---
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, name: "Product Initiation", type: "main", assignedTo: "Koemsak Mean", progress: 15, startDate: "2024-10-14", endDate: "2024-10-25", color: "#6366f1", expanded: true, parentId: null, level: 0 },
        { id: 2, name: "Market Research & Goals", type: "subtask", assignedTo: "Gokce Aslan", progress: 50, startDate: "2024-10-14", endDate: "2024-10-17", color: "#818cf8", expanded: true, parentId: 1, level: 1 },
        { id: 7, name: "Competitor Benchmarking", type: "subtask", assignedTo: "Sarah Kim", progress: 30, startDate: "2024-10-14", endDate: "2024-10-16", color: "#a5b4fc", expanded: false, parentId: 2, level: 2 },
        { id: 8, name: "User Persona Mapping", type: "subtask", assignedTo: "Mike Chen", progress: 20, startDate: "2024-10-16", endDate: "2024-10-18", color: "#a5b4fc", expanded: false, parentId: 2, level: 2 },
        { id: 3, name: "Feasibility Studies", type: "subtask", assignedTo: "Hayden Cook", progress: 60, startDate: "2024-10-17", endDate: "2024-10-19", color: "#818cf8", expanded: false, parentId: 1, level: 1 },
        { id: 5, name: "Design Phase", type: "main", assignedTo: "", progress: 0, startDate: "2024-10-20", endDate: "2024-11-05", color: "#ec4899", expanded: true, parentId: null, level: 0 },
        { id: 6, name: "High-Fidelity Wireframes", type: "subtask", assignedTo: "Gokce Aslan", progress: 10, startDate: "2024-10-21", endDate: "2024-10-28", color: "#f472b6", expanded: false, parentId: 5, level: 1 }
    ]);

    const [projectTitle, setProjectTitle] = useState<string>('Q4 Project Roadmap');
    const viewStartDate = useMemo(() => new Date('2024-10-14'), []);

    const [isDragging, setIsDragging] = useState(false);
    const dragInfo = useRef<{
        taskId: number | null;
        initialX: number;
        initialProgress: number;
        barWidth: number;
    }>({
        taskId: null,
        initialX: 0,
        initialProgress: 0,
        barWidth: 0
    });

    // --- Layout Constants ---
    const DAY_WIDTH = 44;
    const ROW_HEIGHT = 52;
    const COL_WIDTH = "w-28";

    // --- Timeline Logic ---
    const weeks = useMemo((): Week[] => {
        const arr: Week[] = [];
        for (let i = 0; i < 10; i++) {
            const weekStart = new Date(viewStartDate);
            weekStart.setDate(viewStartDate.getDate() + i * 7);
            const days = Array.from({ length: 7 }, (_, j) => {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + j);
                return d;
            });
            arr.push({ start: weekStart, end: days[6], days });
        }
        return arr;
    }, [viewStartDate]);

    const calculateBarPosition = (startStr: string, endStr: string) => {
        if (!startStr || !endStr) return null;
        const start = new Date(startStr);
        const end = new Date(endStr);
        const diffDays = (start.getTime() - viewStartDate.getTime()) / (1000 * 60 * 60 * 24);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

        return {
            left: Math.max(0, diffDays * DAY_WIDTH),
            width: Math.max(DAY_WIDTH, duration * DAY_WIDTH)
        };
    };

    const visibleTasks = useMemo(() => {
        const visible: Task[] = [];
        const recurse = (pid: number | null) => {
            tasks.filter(t => t.parentId === pid).forEach(t => {
                visible.push(t);
                if (t.expanded) recurse(t.id);
            });
        };
        recurse(null);
        return visible;
    }, [tasks]);

    // --- Handlers ---
    const toggleExpand = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
    };

    const updateTask = (id: number, field: keyof Task, value: any) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const deleteTask = (id: number) => {
        const getIds = (pid: number): number[] => {
            const children = tasks.filter(t => t.parentId === pid);
            return [pid, ...children.flatMap(c => getIds(c.id))];
        };
        const toDelete = getIds(id);
        setTasks(prev => prev.filter(t => !toDelete.includes(t.id)));
    };

    const addNewSubtask = (parentId: number) => {
        const parent = tasks.find(t => t.id === parentId);
        if (!parent) return;

        const newTask: Task = {
            id: Date.now(),
            name: "New Subtask",
            type: "subtask",
            assignedTo: "",
            progress: 0,
            startDate: parent.startDate,
            endDate: parent.endDate,
            color: parent.color,
            expanded: true,
            parentId: parentId,
            level: parent.level + 1
        };

        setTasks(prev => {
            const index = prev.findIndex(t => t.id === parentId);
            const newTasks = [...prev];
            newTasks.splice(index + 1, 0, newTask);
            return newTasks.map(t => t.id === parentId ? { ...t, expanded: true } : t);
        });
    };

    const addNewPhase = () => {
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];
        const newTask: Task = {
            id: Date.now(),
            name: "Untitled Project Phase",
            type: "main",
            assignedTo: "",
            progress: 0,
            startDate: "2024-10-14",
            endDate: "2024-10-20",
            color: colors[tasks.length % colors.length],
            expanded: true,
            parentId: null,
            level: 0
        };
        setTasks(prev => [...prev, newTask]);
    };

    // --- Progress Slider Logic ---
    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, task: Task, barWidth: number) => {
        e.preventDefault();
        setIsDragging(true);
        dragInfo.current = {
            taskId: task.id,
            initialX: e.clientX,
            initialProgress: task.progress,
            barWidth: barWidth
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const { taskId, initialX, initialProgress, barWidth } = dragInfo.current;
            const deltaX = e.clientX - initialX;
            const deltaPercent = Math.round((deltaX / barWidth) * 100);
            const newProgress = Math.min(100, Math.max(0, initialProgress + deltaPercent));

            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: newProgress } : t));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="flex overflow-hidden transition-colors duration-200 rounded-sm">
            <main className="flex-1 flex flex-col min-w-0">
                {/* --- Header --- */}
                <header className="h-14 border-b bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-40 transition-colors">
                    <div className="flex h-5 items-center gap-3">
                        <Button variant={"ghost"} onClick={() => router.back()} className={"text-purple-700 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-500 rounded-xs bg-transparent hover:bg-transparent dark:hover:bg-transparent !px-0"}>
                            <ArrowLeft />
                            <span className='hidden md:block'>Back</span>
                        </Button>
                        <Separator orientation="vertical" />
                        <input
                            value={projectTitle}
                            onChange={e => setProjectTitle(e.target.value)}
                            className="font-bold text-lg bg-transparent border-0 w-full focus:ring-0 truncate text-slate-800 dark:text-slate-100"
                        />
                    </div>
                    <div className="flex items-center gap-3 h-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full transition-colors">
                            <Clock size={14} /> <span>Saving<span className='animate-pulse'>...</span></span>
                        </div>
                        <Separator orientation="vertical" />
                        <button
                            onClick={addNewPhase}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                        >
                            <Plus size={16} /> <span className='hidden md:block'>New Phase</span>
                        </button>
                    </div>
                </header>

                {/* --- Main Workspace --- */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Editor Panel */}
                    <div className="flex-[0.5] min-w-[200px] sm:min-w-[400px] md:min-w-[750px] overflow-auto bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-30 transition-colors">
                        <div className='flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800'>
                            <div className="inline-block min-w-full align-middle">
                                {/* Table Headers */}
                                <div className="flex items-center px-4 h-17.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                                    {/* <span className="w-8 shrink-0"></span> */}
                                    <span className="flex-1 min-w-[150px]">Task Description</span>
                                    <span className={`${COL_WIDTH} text-center`}>Owner</span>
                                    <span className={`${COL_WIDTH} text-center`}>Progress</span>
                                    <span className={`${COL_WIDTH} text-center px-2`}>Start Date</span>
                                    <span className={`${COL_WIDTH} text-center px-2`}>End Date</span>
                                    <span className={`${COL_WIDTH} text-center`}>Actions</span>
                                </div>

                                {/* Table Body */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                                    {visibleTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className={`group flex items-center px-2 h-[52px] border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${task.level === 0 ? 'bg-indigo-50/10 dark:bg-indigo-500/5' : ''}`}
                                        >
                                            {/* Name & Indent */}
                                            <div className="flex items-center flex-1 min-w-[150px]" style={{ paddingLeft: `${task.level * 20}px` }}>
                                                <div className="w-6 flex items-center justify-center">
                                                    {tasks.some(t => t.parentId === task.id) ? (
                                                        <button onClick={() => toggleExpand(task.id)} className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                                                            {task.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </button>
                                                    ) : <ListTodo size={12} className="text-slate-600 dark:text-slate-300" />}
                                                </div>
                                                <input
                                                    value={task.name}
                                                    onChange={e => updateTask(task.id, 'name', e.target.value)}
                                                    className={`ml-1 bg-transparent border-none focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900 rounded px-1.5 py-0.5 text-sm w-full truncate transition-colors ${task.level === 0 ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}
                                                />
                                            </div>

                                            {/* Owner */}
                                            <div className={`${COL_WIDTH} px-2`}>
                                                <input
                                                    value={task.assignedTo}
                                                    onChange={e => updateTask(task.id, 'assignedTo', e.target.value)}
                                                    placeholder="+"
                                                    className="w-full text-center text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-none rounded-full py-1 text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 font-medium transition-colors"
                                                />
                                            </div>

                                            {/* Progress */}
                                            <div className={`${COL_WIDTH} flex items-center justify-center`}>
                                                <input
                                                    type="number"
                                                    value={task.progress}
                                                    onChange={e => updateTask(task.id, 'progress', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                                    className="w-8 text-center text-xs bg-transparent border-none font-semibold text-slate-500 dark:text-slate-400 p-0"
                                                />
                                                <span className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">%</span>
                                            </div>

                                            {/* Dates */}
                                            <div className={`${COL_WIDTH} px-2`}>
                                                <CustomDatePicker
                                                    value={task.startDate}
                                                    onChange={(val) => updateTask(task.id, 'startDate', val)}
                                                />
                                            </div>
                                            <div className={`${COL_WIDTH} px-2`}>
                                                {/* <input
                                                    type="date"
                                                    value={task.endDate}
                                                    onChange={e => updateTask(task.id, 'endDate', e.target.value)}
                                                    className="w-full text-[11px] text-slate-600 dark:text-slate-400 border-none bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 rounded px-1.5 py-1 transition-colors text-center [color-scheme:light] dark:[color-scheme:dark]"
                                                /> */}

                                                <CustomDatePicker
                                                    value={task.endDate}
                                                    onChange={(val) => updateTask(task.id, 'endDate', val)}
                                                />
                                            </div>

                                            {/* Actions */}
                                            <div className={`${COL_WIDTH} flex items-center justify-center gap-2 transition-opacity`}>
                                                <button
                                                    onClick={() => addNewSubtask(task.id)}
                                                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                    title="Add subtask"
                                                >
                                                    <PlusCircle size={15} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline View */}
                    <div className="flex-1 overflow-auto bg-white dark:bg-slate-950 relative transition-colors">
                        <div className="inline-flex flex-col min-w-full">
                            {/* Timeline Header */}
                            <div className="flex sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
                                {weeks.map((week, idx) => (
                                    <div key={idx} className="shrink-0 border-r border-slate-100 dark:border-slate-800">
                                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-center transition-colors">
                                            {week.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="flex">
                                            {week.days.map((day, dIdx) => {
                                                const isToday = new Date().toDateString() === day.toDateString();
                                                const isWeekend = [0, 6].includes(day.getDay());
                                                return (
                                                    <div
                                                        key={dIdx}
                                                        className={`w-[44px] h-10 flex flex-col items-center justify-center border-r border-slate-50 dark:border-slate-800 relative transition-colors ${isWeekend ? 'bg-slate-50/40 dark:bg-slate-900/40' : ''}`}
                                                    >
                                                        <span className={`text-[9px] font-medium uppercase transition-colors ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-800 dark:text-slate-300'}`}>
                                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}
                                                        </span>
                                                        <span className={`text-[11px] font-bold transition-colors ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                            {day.getDate()}
                                                        </span>
                                                        {isToday && <div className="absolute bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart Rows */}
                            <div className="relative">
                                {/* Guidelines */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                    {weeks.map((w, wi) => (
                                        <div key={wi} className="flex shrink-0">
                                            {w.days.map((d, di) => (
                                                <div key={di} className="w-[44px] border-r border-slate-50 dark:border-slate-800/60 h-full" />
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Bars */}
                                {visibleTasks.map(task => {
                                    const pos = calculateBarPosition(task.startDate, task.endDate);
                                    return (
                                        <div
                                            key={task.id}
                                            // className={`relative border-b border-slate-50 dark:border-slate-800 flex items-center group transition-colors ${task.level === 0 ? 'bg-indigo-50/5 dark:bg-indigo-500/5' : ''}`}
                                            className="relative border-b border-slate-200/50 dark:border-slate-800/50 flex items-center"
                                            style={{ height: `${ROW_HEIGHT}px` }}
                                        >
                                            {pos && (
                                                <div
                                                    // className="absolute h-9 rounded-full shadow-sm flex items-center px-2 transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-md cursor-pointer overflow-hidden"
                                                    className="absolute h-9 rounded-xs shadow-sm flex items-center transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-md cursor-pointer overflow-hidden"
                                                    style={{
                                                        left: pos.left + 4,
                                                        width: pos.width - 8,
                                                        backgroundColor: task.color,
                                                    }}
                                                >
                                                    {/* The Actual Colored Progress Part (The Slider Target) */}
                                                    <div
                                                        className="h-full relative cursor-ew-resize group-hover:brightness-110 active:brightness-90 transition-all flex"
                                                        style={{
                                                            width: `${task.progress}%`,
                                                            backgroundColor: task.color,
                                                        }}
                                                        onMouseDown={(e) => handleDragStart(e, task, pos.width - 8)}
                                                    >
                                                        {/* Visual Indicator of the Drag Edge */}
                                                        <div
                                                            className={cn(
                                                                "absolute inset-0 bg-white/25 dark:bg-black/20 rounded-xs transition-all duration-500",
                                                                task.progress < 100 && "border-r-2 border-r-white/20"
                                                            )}
                                                        />
                                                        <div className="relative z-10 w-full flex justify-between items-center overflow-hidden px-1">
                                                            <span className="text-[10px] font-bold text-white dark:text-white/90 truncate drop-shadow-sm">
                                                                {task.progress}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GanttPlanner;
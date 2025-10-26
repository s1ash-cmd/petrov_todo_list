"use client";

import { useState, useRef, useEffect } from "react";
import {
    NotebookPen,
    Star,
    Edit2,
    Trash2,
    Plus,
    Check,
    X,
    Timer,
    CheckCheck,
    Flame,
    BarChart3,
    Menu,
    RefreshCw,
    Eraser,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface Task {
    id: number;
    text: string;
    description: string;
    done: boolean;
    favorite: boolean;
    dueDate?: string;
    createdAt: string;
    isToday?: boolean;
}

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [input, setInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [dueDateInput, setDueDateInput] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "done" | "favorite" | "ending" | "overdue">("all");
    const [isAdding, setIsAdding] = useState(false);
    const [showCharts, setShowCharts] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [editingDescription, setEditingDescription] = useState("");
    const [editingDueDate, setEditingDueDate] = useState("");

    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stickyTodayDropRef = useRef<HTMLDivElement>(null);
    const listDropRef = useRef<HTMLDivElement>(null);

    const LONG_PRESS_DURATION = 500;

    const [addError, setAddError] = useState<string | null>(null);

    const addTask = () => {
        if (!input.trim()) {
            setAddError("Заполните название задачи");
            return;
        }
        setTasks([
            ...tasks,
            {
                id: Date.now(),
                text: input.trim(),
                description: descriptionInput.trim() || "",
                done: false,
                favorite: false,
                dueDate: dueDateInput || undefined,
                createdAt: new Date().toISOString(),
                isToday: false,
            },
        ]);
        setInput("");
        setDescriptionInput("");
        setDueDateInput("");
        setIsAdding(false);
        setAddError(null);
    };

    const toggleTask = (id: number) =>
        setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

    const toggleFavorite = (id: number) =>
        setTasks(tasks.map((task) => (task.id === id ? { ...task, favorite: !task.favorite } : task)));

    const deleteTask = (id: number) => setTasks(tasks.filter((task) => task.id !== id));

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingText(task.text);
        setEditingDescription(task.description);
        setEditingDueDate(task.dueDate || "");
    };

    const saveEditing = (id: number) => {
        if (!editingText.trim()) return;
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? { ...task, text: editingText, description: editingDescription, dueDate: editingDueDate || undefined }
                    : task
            )
        );
        setEditingTaskId(null);
        setEditingText("");
        setEditingDescription("");
        setEditingDueDate("");
    };

    const cancelEditing = () => setEditingTaskId(null);

    const isEndingSoon = (dueDate?: string) => {
        if (!dueDate) return false;
        const diff = new Date(dueDate).getTime() - Date.now();
        return diff > 0 && diff <= 24 * 60 * 60 * 1000;
    };

    const clearTodayTasks = () => {
        setTasks((prev) => prev.map((t) => ({ ...t, isToday: false })));
    };

    const refreshTodayTasks = () => {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        setTasks((prev) =>
            prev.map((t) => {
                const within24h =
                    !!t.dueDate &&
                    !t.done &&
                    new Date(t.dueDate).getTime() - now > 0 &&
                    new Date(t.dueDate).getTime() - now <= dayMs;
                return { ...t, isToday: within24h };
            })
        );
    };

    const todayTasks = tasks.filter((task) => task.isToday);
    const filteredTasks = tasks
        .filter((task) => !task.isToday)
        .filter((task) => {
            if (filter === "active") return !task.done;
            if (filter === "done") return task.done;
            if (filter === "favorite") return task.favorite;
            if (filter === "ending") return isEndingSoon(task.dueDate) && !task.done;
            if (filter === "overdue") return task.dueDate && !task.done && new Date(task.dueDate) < new Date();
            return true;
        });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.done).length;
    const activeTasks = tasks.filter((t) => !t.done).length;
    const favoriteTasks = tasks.filter((t) => t.favorite).length;
    const endingTasks = tasks.filter((task) => isEndingSoon(task.dueDate) && !task.done);
    const overdueTasks = tasks.filter((t) => t.dueDate && !t.done && new Date(t.dueDate) < new Date()).length;
    const activeNonOverdueTasks = tasks.filter((t) => !t.done && !(t.dueDate && new Date(t.dueDate) < new Date())).length;

    const getStatusColor = (name: string) => {
        switch (name) {
            case "Выполнено":
                return "#10b981";
            case "Активные":
                return "#a287fa";
            case "Просрочено":
                return "#f87171";
            default:
                return "#888";
        }
    };

    const chartDataStatus = [
        { name: "Выполнено", value: completedTasks },
        { name: "Активные", value: activeNonOverdueTasks },
        { name: "Просрочено", value: overdueTasks },
    ].filter((item) => item.value > 0);

    const chartDataDeadlines = Array.from({ length: 7 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + i);
        const weekday = day.toLocaleDateString("ru-RU", { weekday: "short" }).slice(0, 3);
        const date = day.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
        const label = `${weekday}, ${date}`;
        const count = tasks.filter(
            (t) => t.dueDate && new Date(t.dueDate).toDateString() === day.toDateString() && !t.done
        ).length;
        return { day: label, count };
    });

    const filterOptions = [
        { label: "Все", value: "all" as const, count: totalTasks },
        { label: "Активные", value: "active" as const, count: activeTasks },
        { label: "Истекающие", value: "ending" as const, count: endingTasks.length },
        { label: "Избранные", value: "favorite" as const, count: favoriteTasks },
        { label: "Выполненные", value: "done" as const, count: completedTasks },
        { label: "Просроченные", value: "overdue" as const, count: overdueTasks },
    ];

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, target: "today" | "list") => {
        e.preventDefault();
        if (!draggedTask) return;
        setTasks(tasks.map((task) => (task.id === draggedTask.id ? { ...task, isToday: target === "today" } : task)));
        setDraggedTask(null);
    };

    const handleTouchStart = (e: React.TouchEvent, task: Task) => {
        e.preventDefault();
        if (touchTimeout.current) clearTimeout(touchTimeout.current);

        touchTimeout.current = setTimeout(() => {
            setDraggedTask(task);
            navigator.vibrate?.(30);
        }, LONG_PRESS_DURATION);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggedTask) return;
        e.preventDefault();

        const touchY = e.touches[0].clientY;

        const stickyRect = stickyTodayDropRef.current?.getBoundingClientRect();
        const listRect = listDropRef.current?.getBoundingClientRect();

        const inSticky = !!(stickyRect && touchY >= stickyRect.top && touchY <= stickyRect.bottom);
        const inList = !!(listRect && touchY >= listRect.top && touchY <= listRect.bottom);

        if (stickyTodayDropRef.current) {
            stickyTodayDropRef.current.classList.toggle("border-purple-400", inSticky);
            stickyTodayDropRef.current.classList.toggle("bg-purple-900/30", inSticky);
        }
        if (listDropRef.current) {
            listDropRef.current.classList.toggle("border-purple-400", inList);
            listDropRef.current.classList.toggle("bg-purple-900/30", inList);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchTimeout.current) clearTimeout(touchTimeout.current);

        if (!draggedTask) return;

        const touchY = e.changedTouches[0].clientY;

        const stickyRect = stickyTodayDropRef.current?.getBoundingClientRect();
        const listRect = listDropRef.current?.getBoundingClientRect();

        let target: "today" | "list" | null = null;

        if (stickyRect && touchY >= stickyRect.top && touchY <= stickyRect.bottom) {
            target = "today";
        } else if (listRect && touchY >= listRect.top && touchY <= listRect.bottom) {
            target = "list";
        }

        if (target && draggedTask.isToday !== (target === "today")) {
            setTasks(tasks.map((task) => (task.id === draggedTask.id ? { ...task, isToday: target === "today" } : task)));
        }

        setDraggedTask(null);

        setTimeout(() => {
            listDropRef.current?.classList.remove("border-purple-400", "bg-purple-900/30");
            stickyTodayDropRef.current?.classList.remove("border-purple-400", "bg-purple-900/30");
        }, 100);
    };

    useEffect(() => {
        return () => {
            if (touchTimeout.current) clearTimeout(touchTimeout.current);
        };
    }, []);

    const getTaskClasses = (task: Task) => {
        const isDragging = draggedTask?.id === task.id;
        const isOverdue = task.dueDate && !task.done && new Date(task.dueDate) < new Date();

        return `
      p-4 rounded-xl border flex flex-col gap-3
      transition-all duration-200 ease-out
      select-none cursor-grab active:cursor-grabbing
      hover:scale-[1.02] hover:shadow-xl
      ${
            task.done
                ? "bg-green-700/30 border-green-600/40"
                : isOverdue
                    ? "bg-red-900/30 border-red-600/40"
                    : isEndingSoon(task.dueDate)
                        ? "bg-orange-400/20 border-orange-500/40"
                        : "bg-white/5 border-white/20"
        }
      ${
            isDragging
                ? "scale-105 opacity-70 shadow-2xl ring-2 ring-purple-400 z-50 translate-y-[-6px] !transition-transform !duration-150"
                : ""
        }
    `.trim();
    };

    return (
        <main className="flex justify-center items-start min-h-screen p-4 sm:p-6 lg:p-8 bg-black text-white">
            <div className="w-full max-w-5xl flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
                <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                        <NotebookPen className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-white" />
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Мои задачи</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-lg sm:text-xl lg:text-2xl font-semibold justify-center">
                        <span className="text-sm sm:text-base">Всего: {totalTasks}</span>
                        <div className="flex items-center gap-1">
                            <CheckCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                            <span className="text-sm sm:text-base">{completedTasks}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                            <span className="text-sm sm:text-base">{endingTasks.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                            <span className="text-sm sm:text-base">{overdueTasks}</span>
                        </div>

                        <button
                            onClick={() => setShowCharts(!showCharts)}
                            className="p-2 sm:p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 text-sm sm:text-base"
                        >
                            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                            {showCharts ? "Список" : "Графики"}
                        </button>
                    </div>
                </div>

                {!showCharts && (
                    <div className="w-full mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                Задачи на сегодня
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={refreshTodayTasks}
                                    className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 flex items-center gap-1"
                                    title="Добавить задачи с дедлайном в ближайшие 24 часа"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Обновить
                                </button>
                                <button
                                    onClick={clearTodayTasks}
                                    className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 flex items-center gap-1"
                                    title="Полностью очистить список 'на сегодня'"
                                >
                                    <Eraser className="w-4 h-4" />
                                    Очистить
                                </button>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-xl border-2 ${
                                todayTasks.length > 0 ? "border-purple-500/50 bg-purple-900/20" : "border-white/20 bg-white/5"
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, "today")}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {todayTasks.length === 0 ? (
                                <p className="text-center text-white/60 text-sm">
                                    Перетащите сюда, чтобы добавить в «Задачи на сегодня»
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {todayTasks.map((task) => {
                                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                                        const isEditing = editingTaskId === task.id;
                                        return (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                onDragEnd={handleDragEnd}
                                                onTouchStart={(e) => handleTouchStart(e, task)}
                                                onTouchMove={handleTouchMove}
                                                onTouchEnd={handleTouchEnd}
                                                className={getTaskClasses(task)}
                                                style={{
                                                    touchAction: draggedTask?.id === task.id ? "none" : "auto",
                                                }}
                                            >
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                            className="px-3 py-2 bg-white/10 rounded-md border border-white/20 text-white outline-none w-full"
                                                        />
                                                        <textarea
                                                            value={editingDescription}
                                                            onChange={(e) => setEditingDescription(e.target.value)}
                                                            className="px-3 py-2 bg-white/10 rounded-md border border-white/20 text-white outline-none resize-none w-full mt-2"
                                                            rows={2}
                                                        />
                                                        <input
                                                            type="datetime-local"
                                                            value={editingDueDate}
                                                            onChange={(e) => setEditingDueDate(e.target.value)}
                                                            className="px-3 py-2 bg-white/10 rounded-md border border-white/20 text-white outline-none w-full mt-2"
                                                        />
                                                        <div className="flex gap-2 justify-end mt-2">
                                                            <button
                                                                onClick={() => saveEditing(task.id)}
                                                                className="p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all"
                                                            >
                                                                <Check className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={task.done}
                                                                    onChange={() => toggleTask(task.id)}
                                                                    className="w-5 h-5 accent-purple-500"
                                                                />
                                                                <span className={`font-medium ${task.done ? "line-through text-white/40" : ""}`}>
                                                                  {task.text}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => toggleFavorite(task.id)}>
                                                                    <Star
                                                                        className={`w-5 h-5 ${task.favorite ? "text-yellow-400 fill-yellow-400" : "text-white/40"}`}
                                                                    />
                                                                </button>
                                                                <button onClick={() => startEditing(task)}>
                                                                    <Edit2 className="w-5 h-5 text-white/50 hover:text-white" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {task.description && (
                                                            <p className="text-white/70 text-sm ml-8 mt-1">{task.description}</p>
                                                        )}
                                                        {task.dueDate && (
                                                            <p className={`text-xs ml-8 mt-1 ${isOverdue ? "text-red-400" : "text-white/40"}`}>
                                                                Срок: {new Date(task.dueDate).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="w-full sm:hidden mb-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/30"
                    >
                        <span className="font-medium">Фильтры</span>
                        <Menu className="w-5 h-5" />
                    </button>
                    {mobileMenuOpen && (
                        <div className="mt-2 flex flex-col gap-2">
                            {filterOptions.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => {
                                        setFilter(f.value);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`px-4 py-2 rounded-full font-medium transition-all text-left ${
                                        filter === f.value ? getFilterActiveClass(f.value) : "bg-white/10 text-white/70 hover:bg-white/20"
                                    }`}
                                >
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex gap-2 mb-6 w-full">
                    {filterOptions.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`flex-1 min-w-0 px-3 py-2 rounded-full font-medium transition-all text-sm lg:text-base ${
                                filter === f.value ? getFilterActiveClass(f.value) : "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                        >
              <span className="truncate block">
                {f.label} ({f.count})
              </span>
                        </button>
                    ))}
                </div>

                {showCharts ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="flex flex-col h-[300px] sm:h-[340px] bg-white/10 p-4 sm:p-6 rounded-2xl">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white text-center">Дедлайны (7 дней)</h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartDataDeadlines} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="day" stroke="#ccc" fontSize={11} tick={{ fill: "#ddd" }} />
                                    <YAxis stroke="#ccc" allowDecimals={false} fontSize={11} tick={{ fill: "#ddd" }} />
                                    <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-2 text-center text-xs sm:text-sm text-white/80">
                <span className="inline-flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#a78bfa" }}></div>
                  Задачи
                </span>
                            </div>
                        </div>

                        <div className="flex flex-col h-[380px] sm:h-[420px] bg-white/10 p-4 sm:p-6 rounded-2xl justify-between">
                            <h2 className="text-lg sm:text-xl font-semibold text-white text-center">Статусы задач</h2>
                            <div className="flex justify-center flex-1">
                                <ResponsiveContainer width={220} height={220}>
                                    <PieChart>
                                        <Pie
                                            data={chartDataStatus}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                        >
                                            {chartDataStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2 text-xs sm:text-sm text-white/80 overflow-y-auto max-h-32 px-1">
                                {chartDataStatus.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getStatusColor(item.name) }} />
                                        <span className="truncate">
                      {item.name} — {item.value} ({totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(0) : 0}%)
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full mb-6">
                            {isAdding ? (
                                <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/20">
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                if (addError && e.target.value.trim()) setAddError(null);
                                            }}
                                            placeholder="Название задачи..."
                                            autoFocus
                                            aria-invalid={!!addError}
                                            aria-describedby={addError ? "add-task-title-error" : undefined}
                                            className={`px-4 py-3 bg-white/10 rounded-xl border text-white placeholder-white/50 focus:outline-none text-base ${
                                                addError ? "border-red-500 focus:border-red-500" : "border-white/30 focus:border-purple-500"
                                            }`}
                                        />
                                        {addError && (
                                            <span id="add-task-title-error" role="alert" className="text-red-400 text-sm">
                        {addError}
                      </span>
                                        )}
                                    </div>

                                    <textarea
                                        value={descriptionInput}
                                        onChange={(e) => setDescriptionInput(e.target.value)}
                                        placeholder="Описание (необязательно)..."
                                        className="px-4 py-3 bg-white/10 rounded-xl border border-white/30 text-white placeholder-white/50 focus:border-purple-500 resize-none outline-none text-base"
                                        rows={2}
                                    />
                                    <input
                                        type="datetime-local"
                                        value={dueDateInput}
                                        onChange={(e) => setDueDateInput(e.target.value)}
                                        className="px-4 py-3 bg-white/10 rounded-xl border border-white/30 text-white focus:border-purple-500 outline-none text-base"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={addTask} className="p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all">
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsAdding(false);
                                                setInput("");
                                                setDescriptionInput("");
                                                setDueDateInput("");
                                                setAddError(null);
                                            }}
                                            className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white/10 rounded-xl border border-dashed border-white/30 text-white hover:bg-white/15 transition-all text-base font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Добавить задачу
                                </button>
                            )}
                        </div>

                        <div
                            ref={listDropRef}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, "list")}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="w-full flex flex-col gap-3"
                        >
                            {filteredTasks.length === 0 ? (
                                <p className="text-center text-white/60 py-8 text-base">Нет задач</p>
                            ) : (
                                filteredTasks.map((task) => {
                                    const isOverdue = task.dueDate && !task.done && new Date(task.dueDate) < new Date();
                                    const isEditing = editingTaskId === task.id;
                                    return (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task)}
                                            onDragEnd={handleDragEnd}
                                            onTouchStart={(e) => handleTouchStart(e, task)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={handleTouchEnd}
                                            className={getTaskClasses(task)}
                                            style={{
                                                touchAction: draggedTask?.id === task.id ? "none" : "auto",
                                            }}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="px-3 py-2 bg-white/10 rounded-md border border-white/20 text-white outline-none"
                                                    />
                                                    <textarea
                                                        value={editingDescription}
                                                        onChange={(e) => setEditingDescription(e.target.value)}
                                                        className="px-3 py-2 bg-white/10 rounded-md border border-white/20 text-white outline-none resize-none"
                                                        rows={2}
                                                    />
                                                    <input
                                                        type="datetime-local"
                                                        value={editingDueDate}
                                                        onChange={(e) => setEditingDueDate(e.target.value)}
                                                        className="px-3 py-2 bg-white/10 rounded-md border border-white/20 text-white outline-none"
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => saveEditing(task.id)}
                                                            className="p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                                                            onClick={cancelEditing}
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={task.done}
                                                                onChange={() => toggleTask(task.id)}
                                                                className="w-5 h-5 mt-1 accent-purple-500"
                                                            />
                                                            <div className="flex-1 flex items-center gap-2 flex-wrap">
                                <span className={`font-semibold ${task.done ? "line-through text-white/40" : ""}`}>
                                  {task.text}
                                </span>
                                                                {isOverdue && (
                                                                    <span className="text-sm text-red-400 whitespace-nowrap"> (просрочено)</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => toggleFavorite(task.id)}>
                                                                <Star
                                                                    className={`w-5 h-5 ${
                                                                        task.favorite ? "text-yellow-400 fill-yellow-400" : "text-white/40 hover:text-yellow-400"
                                                                    }`}
                                                                />
                                                            </button>
                                                            <button onClick={() => startEditing(task)}>
                                                                <Edit2 className="w-5 h-5 text-white/50 hover:text-white" />
                                                            </button>
                                                            <button onClick={() => deleteTask(task.id)}>
                                                                <Trash2 className="w-5 h-5 text-white/50 hover:text-red-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {task.description && <p className="text-white/70 ml-8 text-sm">{task.description}</p>}
                                                    {task.dueDate && (
                                                        <p className={`text-sm ml-8 ${isOverdue ? "text-red-400" : "text-white/40"}`}>
                                                            Срок: {new Date(task.dueDate).toLocaleString()}
                                                        </p>
                                                    )}
                                                    <p className="text-xs ml-8 text-white/50">
                                                        Создано: {new Date(task.createdAt).toLocaleString()}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>

            {!showCharts && draggedTask && (
                <div className="fixed top-3 left-1/2 -translate-x-1/2 w-full px-4 z-50 pointer-events-none">
                    <div className="mx-auto max-w-5xl pointer-events-auto">
                        <div
                            ref={stickyTodayDropRef}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, "today")}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="p-3 rounded-xl border-2 border-dashed border-white/30 bg-black/50 backdrop-blur-sm text-white transition-all"
                        >
                            <p className="text-center text-sm text-white/80">
                                Перетащите сюда, чтобы добавить в «Задачи на сегодня»
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function getFilterActiveClass(filter: string) {
    switch (filter) {
        case "all":
            return "bg-white text-black";
        case "active":
            return "bg-purple-400 text-black";
        case "ending":
            return "bg-orange-400 text-white";
        case "favorite":
            return "bg-yellow-300 text-black";
        case "done":
            return "bg-green-400 text-black";
        case "overdue":
            return "bg-red-600 text-white";
        default:
            return "bg-white text-black";
    }
}
"use client";

import { useEffect, useRef, useState } from "react";
import { Task, Filter } from "@/types";
import Header from "../components/Header";
import Filters from "../components/Filters";
import AddTaskForm from "../components/AddTaskForm";
import TodaySection from "../components/TodaySection";
import TaskList from "../components/TaskList";
import ChartsPanel from "../components/ChartsPanel";
import StickyTodayDrop from "../components/StickyTodayDrop";
import { isEndingSoon } from "@/lib/utils";

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<Filter>("all");
    const [showCharts, setShowCharts] = useState(false);

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [editingDescription, setEditingDescription] = useState("");
    const [editingDueDate, setEditingDueDate] = useState("");

    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stickyTodayDropRef = useRef<HTMLDivElement | null>(null);
    const listDropRef = useRef<HTMLDivElement | null>(null);
    const LONG_PRESS_DURATION = 500;

    const addTask = (data: { text: string; description?: string; dueDate?: string }) => {
        setTasks((prev) => [
            ...prev,
            {
                id: Date.now(),
                text: data.text,
                description: data.description || "",
                done: false,
                favorite: false,
                dueDate: data.dueDate || undefined,
                createdAt: new Date().toISOString(),
                isToday: false,
            },
        ]);
    };

    const toggleTask = (id: number) =>
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));

    const toggleFavorite = (id: number) =>
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, favorite: !task.favorite } : task)));

    const deleteTask = (id: number) => setTasks((prev) => prev.filter((task) => task.id !== id));

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingText(task.text);
        setEditingDescription(task.description);
        setEditingDueDate(task.dueDate || "");
    };

    const saveEditing = (id: number) => {
        if (!editingText.trim()) return;
        setTasks((prev) =>
            prev.map((task) =>
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

    const clearTodayTasks = () => {
        setTasks((prev) => prev.map((t) => ({ ...t, isToday: false })));
    };

    const refreshTodayTasks = () => {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        setTasks((prev) =>
            prev.map((t) => {
                const within24h =
                    !!t.dueDate && !t.done && new Date(t.dueDate).getTime() - now > 0 && new Date(t.dueDate).getTime() - now <= dayMs;
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
        setTasks((prev) => prev.map((task) => (task.id === draggedTask.id ? { ...task, isToday: target === "today" } : task)));
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
            setTasks((prev) => prev.map((task) => (task.id === draggedTask.id ? { ...task, isToday: target === "today" } : task)));
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

    return (
        <main className="flex justify-center items-start min-h-screen p-4 sm:p-6 lg:p-8 bg-black text-white">
            <div className="w-full max-w-5xl flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
                <Header
                    totalTasks={totalTasks}
                    completedTasks={completedTasks}
                    endingCount={endingTasks.length}
                    overdueCount={overdueTasks}
                    showCharts={showCharts}
                    onToggleCharts={() => setShowCharts((s) => !s)}
                />

                {!showCharts && (
                    <TodaySection
                        todayTasks={todayTasks}
                        editingTaskId={editingTaskId}
                        editingText={editingText}
                        editingDescription={editingDescription}
                        editingDueDate={editingDueDate}
                        setEditingText={setEditingText}
                        setEditingDescription={setEditingDescription}
                        setEditingDueDate={setEditingDueDate}
                        onStartEditing={startEditing}
                        onSaveEditing={saveEditing}
                        onCancelEditing={cancelEditing}
                        onToggleDone={toggleTask}
                        onToggleFavorite={toggleFavorite}
                        onDragOver={handleDragOver}
                        onDropToToday={(e) => handleDrop(e, "today")}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        draggedTaskId={draggedTask?.id ?? null}
                        onRefreshToday={refreshTodayTasks}
                        onClearToday={clearTodayTasks}
                    />
                )}

                {!showCharts && <AddTaskForm onAdd={addTask} />}

                {showCharts ? (
                    <ChartsPanel tasks={tasks} />
                ) : (
                    <Filters
                        filter={filter}
                        onChange={setFilter}
                        options={filterOptions}
                    />
                )}

                {!showCharts && (
                    <TaskList
                        tasks={filteredTasks}
                        editingTaskId={editingTaskId}
                        editingText={editingText}
                        editingDescription={editingDescription}
                        editingDueDate={editingDueDate}
                        setEditingText={setEditingText}
                        setEditingDescription={setEditingDescription}
                        setEditingDueDate={setEditingDueDate}
                        onStartEditing={startEditing}
                        onSaveEditing={saveEditing}
                        onCancelEditing={cancelEditing}
                        onToggleDone={toggleTask}
                        onToggleFavorite={toggleFavorite}
                        onDelete={deleteTask}
                        onDragOver={handleDragOver}
                        onDropToList={(e) => handleDrop(e, "list")}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        draggedTaskId={draggedTask?.id ?? null}
                        listDropRef={listDropRef}
                    />
                )}
            </div>

            {!showCharts && (
                <StickyTodayDrop
                    visible={!!draggedTask}
                    dropRef={stickyTodayDropRef}
                    onDragOver={handleDragOver}
                    onDropToToday={(e) => handleDrop(e, "today")}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                />
            )}
        </main>
    );
}
import { Task, Filter } from "@/types";

export function isEndingSoon(dueDate?: string) {
    if (!dueDate) return false;
    const diff = new Date(dueDate).getTime() - Date.now();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}

export function isOverdue(task: Task) {
    return Boolean(task.dueDate && !task.done && new Date(task.dueDate) < new Date());
}

export function getStatusColor(name: string) {
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
}

export function getFilterActiveClass(filter: Filter) {
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

export function getTaskClasses(task: Task, isDragging: boolean) {
    const overdue = isOverdue(task);

    const base =
        "p-4 rounded-xl border flex flex-col gap-3 transition-all duration-200 ease-out select-none cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow-xl";

    const state = task.done
        ? "bg-green-700/30 border-green-600/40"
        : overdue
            ? "bg-red-900/30 border-red-600/40"
            : isEndingSoon(task.dueDate)
                ? "bg-orange-400/20 border-orange-500/40"
                : "bg-white/5 border-white/20";

    const dragging = isDragging
        ? "scale-105 opacity-70 shadow-2xl ring-2 ring-purple-400 z-50 translate-y-[-6px] !transition-transform !duration-150"
        : "";

    return `${base} ${state} ${dragging}`.trim();
}
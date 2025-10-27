import { Task } from "@/types";
import { getTaskClasses, isOverdue } from "@/lib/utils";
import { Star, Edit2, Trash2, Check, X } from "lucide-react";
import React from "react";

interface TaskCardProps {
    task: Task;
    variant: "today" | "list";

    isEditing: boolean;
    editingText: string;
    editingDescription: string;
    editingDueDate: string;
    setEditingText: (v: string) => void;
    setEditingDescription: (v: string) => void;
    setEditingDueDate: (v: string) => void;
    onSaveEditing: (id: number) => void;
    onCancelEditing: () => void;
    onStartEditing: (task: Task) => void;

    onToggleDone: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    onDelete: (id: number) => void;

    onDragStart: (e: React.DragEvent, task: Task) => void;
    onDragEnd: () => void;
    onTouchStart: (e: React.TouchEvent, task: Task) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    isDragging: boolean;
}

export default function TaskCard({
                                     task,
                                     variant,
                                     isEditing,
                                     editingText,
                                     editingDescription,
                                     editingDueDate,
                                     setEditingText,
                                     setEditingDescription,
                                     setEditingDueDate,
                                     onSaveEditing,
                                     onCancelEditing,
                                     onStartEditing,

                                     onToggleDone,
                                     onToggleFavorite,
                                     onDelete,

                                     onDragStart,
                                     onDragEnd,
                                     onTouchStart,
                                     onTouchMove,
                                     onTouchEnd,
                                     isDragging,
                                 }: TaskCardProps) {
    const overdue = isOverdue(task);

    return (
        <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
            onTouchStart={(e) => onTouchStart(e, task)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={getTaskClasses(task, isDragging)}
            style={{ touchAction: isDragging ? "none" : "auto" }}
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
                        <button onClick={() => onSaveEditing(task.id)} className="p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all">
                            <Check className="w-5 h-5" />
                        </button>
                        <button onClick={onCancelEditing} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {variant === "today" ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => onToggleDone(task.id)}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                    <span className={`font-medium ${task.done ? "line-through text-white/40" : ""}`}>{task.text}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onToggleFavorite(task.id)}>
                                        <Star className={`w-5 h-5 ${task.favorite ? "text-yellow-400 fill-yellow-400" : "text-white/40"}`} />
                                    </button>
                                    <button onClick={() => onStartEditing(task)}>
                                        <Edit2 className="w-5 h-5 text-white/50 hover:text-white" />
                                    </button>
                                </div>
                            </div>
                            {task.description && <p className="text-white/70 text-sm ml-8 mt-1">{task.description}</p>}
                            {task.dueDate && (
                                <p className={`text-xs ml-8 mt-1 ${overdue ? "text-red-400" : "text-white/40"}`}>
                                    Срок: {new Date(task.dueDate).toLocaleString()}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => onToggleDone(task.id)}
                                        className="w-5 h-5 mt-1 accent-purple-500"
                                    />
                                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                                        <span className={`font-semibold ${task.done ? "line-through text-white/40" : ""}`}>{task.text}</span>
                                        {overdue && <span className="text-sm text-red-400 whitespace-nowrap"> (просрочено)</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onToggleFavorite(task.id)}>
                                        <Star
                                            className={`w-5 h-5 ${
                                                task.favorite ? "text-yellow-400 fill-yellow-400" : "text-white/40 hover:text-yellow-400"
                                            }`}
                                        />
                                    </button>
                                    <button onClick={() => onStartEditing(task)}>
                                        <Edit2 className="w-5 h-5 text-white/50 hover:text-white" />
                                    </button>
                                    <button onClick={() => onDelete(task.id)}>
                                        <Trash2 className="w-5 h-5 text-white/50 hover:text-red-400" />
                                    </button>
                                </div>
                            </div>
                            {task.description && <p className="text-white/70 ml-8 text-sm">{task.description}</p>}
                            {task.dueDate && (
                                <p className={`text-sm ml-8 ${overdue ? "text-red-400" : "text-white/40"}`}>
                                    Срок: {new Date(task.dueDate).toLocaleString()}
                                </p>
                            )}
                            <p className="text-xs ml-8 text-white/50">Создано: {new Date(task.createdAt).toLocaleString()}</p>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
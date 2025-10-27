import { Task } from "@/types";
import TaskCard from "./TaskCard";
import { RefreshCw, Eraser } from "lucide-react";

interface TodaySectionProps {
    todayTasks: Task[];

    editingTaskId: number | null;
    editingText: string;
    editingDescription: string;
    editingDueDate: string;
    setEditingText: (v: string) => void;
    setEditingDescription: (v: string) => void;
    setEditingDueDate: (v: string) => void;

    onStartEditing: (task: Task) => void;
    onSaveEditing: (id: number) => void;
    onCancelEditing: () => void;
    onToggleDone: (id: number) => void;
    onToggleFavorite: (id: number) => void;

    onDragOver: (e: React.DragEvent) => void;
    onDropToToday: (e: React.DragEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onDragStart: (e: React.DragEvent, task: Task) => void;
    onDragEnd: () => void;
    onTouchStart: (e: React.TouchEvent, task: Task) => void;

    draggedTaskId: number | null;

    onRefreshToday: () => void;
    onClearToday: () => void;
}

export default function TodaySection({
                                         todayTasks,

                                         editingTaskId,
                                         editingText,
                                         editingDescription,
                                         editingDueDate,
                                         setEditingText,
                                         setEditingDescription,
                                         setEditingDueDate,

                                         onStartEditing,
                                         onSaveEditing,
                                         onCancelEditing,
                                         onToggleDone,
                                         onToggleFavorite,

                                         onDragOver,
                                         onDropToToday,
                                         onTouchMove,
                                         onTouchEnd,
                                         onDragStart,
                                         onDragEnd,
                                         onTouchStart,

                                         draggedTaskId,

                                         onRefreshToday,
                                         onClearToday,
                                     }: TodaySectionProps) {
    return (
        <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    Задачи на сегодня
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRefreshToday}
                        className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 flex items-center gap-1"
                        title="Добавить задачи с дедлайном в ближайшие 24 часа"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Обновить
                    </button>
                    <button
                        onClick={onClearToday}
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
                onDragOver={onDragOver}
                onDrop={onDropToToday}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {todayTasks.length === 0 ? (
                    <p className="text-center text-white/60 text-sm">Перетащите сюда, чтобы добавить в «Задачи на сегодня»</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {todayTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                variant="today"
                                isEditing={editingTaskId === task.id}
                                editingText={editingText}
                                editingDescription={editingDescription}
                                editingDueDate={editingDueDate}
                                setEditingText={setEditingText}
                                setEditingDescription={setEditingDescription}
                                setEditingDueDate={setEditingDueDate}
                                onSaveEditing={onSaveEditing}
                                onCancelEditing={onCancelEditing}
                                onStartEditing={onStartEditing}
                                onToggleDone={onToggleDone}
                                onToggleFavorite={onToggleFavorite}
                                onDelete={() => {}}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                isDragging={draggedTaskId === task.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
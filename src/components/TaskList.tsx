import React from "react";
import { Task } from "@/types";
import TaskCard from "./TaskCard";

interface TaskListProps {
    tasks: Task[];

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
    onDelete: (id: number) => void;

    onDragOver: (e: React.DragEvent) => void;
    onDropToList: (e: React.DragEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onDragStart: (e: React.DragEvent, task: Task) => void;
    onDragEnd: () => void;
    onTouchStart: (e: React.TouchEvent, task: Task) => void;

    draggedTaskId: number | null;

    listDropRef: React.RefObject<HTMLDivElement | null>
}

export default function TaskList({
                                     tasks,

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
                                     onDelete,

                                     onDragOver,
                                     onDropToList,
                                     onTouchMove,
                                     onTouchEnd,
                                     onDragStart,
                                     onDragEnd,
                                     onTouchStart,

                                     draggedTaskId,

                                     listDropRef,
                                 }: TaskListProps) {
    return (
        <div
            ref={listDropRef}
            onDragOver={onDragOver}
            onDrop={onDropToList}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full flex flex-col gap-3"
        >
            {tasks.length === 0 ? (
                <p className="text-center text-white/60 py-8 text-base">Нет задач</p>
            ) : (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        variant="list"
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
                        onDelete={onDelete}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        isDragging={draggedTaskId === task.id}
                    />
                ))
            )}
        </div>
    );
}
"use client";

import { useState } from "react";
import { NotebookPen, Star, Edit2, Trash2, Plus, Check } from "lucide-react";

interface Task {
    id: number;
    text: string;
    description: string;
    done: boolean;
    favorite: boolean;
    dueDate?: string;
}

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [input, setInput] = useState<string>("");
    const [descriptionInput, setDescriptionInput] = useState<string>("");
    const [dueDateInput, setDueDateInput] = useState<string>("");
    const [filter, setFilter] = useState<"all" | "active" | "done" | "favorite" | "overdue">("all");
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const [editingDescription, setEditingDescription] = useState<string>("");
    const [editingDueDate, setEditingDueDate] = useState<string>("");

    const addTask = () => {
        if (!input.trim()) return;
        setTasks([
            ...tasks,
            {
                id: Date.now(),
                text: input.trim(),
                description: descriptionInput.trim() || "",
                done: false,
                favorite: false,
                dueDate: dueDateInput || undefined
            }
        ]);
        setInput("");
        setDescriptionInput("");
        setDueDateInput("");
        setIsAdding(false);
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
    };

    const toggleFavorite = (id: number) => {
        setTasks(tasks.map(task => (task.id === id ? { ...task, favorite: !task.favorite } : task)));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
        if (editingTaskId === id) {
            setEditingTaskId(null);
            setEditingText("");
            setEditingDescription("");
            setEditingDueDate("");
        }
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingText(task.text);
        setEditingDescription(task.description);
        setEditingDueDate(task.dueDate || "");
    };

    const saveEditing = (id: number) => {
        if (!editingText.trim()) return;
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, text: editingText, description: editingDescription, dueDate: editingDueDate || undefined }
                : task
        ));
        setEditingTaskId(null);
        setEditingText("");
        setEditingDescription("");
        setEditingDueDate("");
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingText("");
        setEditingDescription("");
        setEditingDueDate("");
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "active") return !task.done;
        if (filter === "done") return task.done;
        if (filter === "favorite") return task.favorite;
        if (filter === "overdue") return task.dueDate && !task.done && new Date(task.dueDate) < new Date();
        return true;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.done).length;
    const activeTasks = tasks.filter(t => !t.done).length;
    const favoriteTasks = tasks.filter(t => t.favorite).length;
    const overdueTasks = tasks.filter(t => t.dueDate && !t.done && new Date(t.dueDate) < new Date()).length;

    return (
        <main className="flex justify-center items-start min-h-screen p-8 bg-black text-white">
            <div className="w-full max-w-[50%] flex flex-col items-center p-6 rounded-2xl
          bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/40 transition-all duration-300">

                <div className="w-full flex flex-col items-center px-6 pt-6 pb-0 rounded-2xl
            bg-white/2 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/40 transition-all duration-300">

                    <div className="w-full flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <NotebookPen className="w-8 h-8 mr-3 text-white" />
                            <h1 className="text-4xl font-bold">Мои задачи</h1>
                        </div>
                        <div className="flex items-center gap-9 text-2xl font-semibold text-white">
                            <span>Всего: {totalTasks}</span>
                            <span>Выполнено: <span style={{ color: 'lightgreen', fontWeight: 'bold' }}>{completedTasks}</span></span>
                            <span>Просрочено: <span style={{ color: 'red', fontWeight: 'bold' }}>{overdueTasks}</span></span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 w-full">
                        <button
                            onClick={() => setFilter("all")}
                            className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${filter === "all" ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                            Все ({totalTasks})
                        </button>
                        <button
                            onClick={() => setFilter("active")}
                            className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${filter === "active" ? "bg-purple-400 text-black" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                            Активные ({activeTasks})
                        </button>
                        <button
                            onClick={() => setFilter("favorite")}
                            className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${filter === "favorite" ? "bg-yellow-300 text-black" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                            Избранные ({favoriteTasks})
                        </button>
                        <button
                            onClick={() => setFilter("done")}
                            className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${filter === "done" ? "bg-green-400 text-black" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                            Выполненные ({completedTasks})
                        </button>
                        <button
                            onClick={() => setFilter("overdue")}
                            className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${filter === "overdue" ? "bg-red-600 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                        >
                            Просроченные ({overdueTasks})
                        </button>
                    </div>


                    <div className="w-full mb-6">
                        {isAdding ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Название задачи..."
                                    autoFocus
                                    className="px-4 py-3 bg-white/10 rounded-xl border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all"
                                />
                                <textarea
                                    value={descriptionInput}
                                    onChange={(e) => setDescriptionInput(e.target.value)}
                                    placeholder="Описание задачи..."
                                    className="px-4 py-3 bg-white/10 rounded-xl border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all resize-none"
                                />
                                <input
                                    type="datetime-local"
                                    value={dueDateInput}
                                    onChange={(e) => setDueDateInput(e.target.value)}
                                    className="px-4 py-2 bg-white/10 rounded-xl border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all"
                                />
                                <div className="flex gap-2">
                                    <button onClick={addTask} className="p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all">
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => { setIsAdding(false); setInput(""); setDescriptionInput(""); setDueDateInput(""); }}
                                            className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 rounded-xl
                                   border border-dashed border-white/30 text-white hover:bg-white/15 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Добавить новую задачу
                            </button>
                        )}
                    </div>



                </div>
            </div>
        </main>
    );
}

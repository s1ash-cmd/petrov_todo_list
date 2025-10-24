"use client";

import { useState } from "react";

export default function Home() {
    const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([]);
    const [input, setInput] = useState("");

    const addTask = () => {
        if (!input.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: input.trim(), done: false }]);
        setInput("");
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, done: !task.done } : task
        ));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
            <h1 className="text-4xl font-bold mb-6">📝 ToDo List</h1>

            <div className="flex gap-2 w-full max-w-md mb-6">
                <input
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите задачу..."
                />
                <button
                    onClick={addTask}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Добавить
                </button>
            </div>

            <ul className="w-full max-w-md flex flex-col gap-2">
                {tasks.length === 0 && (
                    <p className="text-gray-400 text-center">Пока нет задач</p>
                )}
                {tasks.map(task => (
                    <li
                        key={task.id}
                        className={`flex justify-between items-center px-3 py-2 border rounded ${
                            task.done ? "line-through text-gray-400" : ""
                        }`}
                    >
            <span
                onClick={() => toggleTask(task.id)}
                className="cursor-pointer select-none"
            >
              {task.text}
            </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

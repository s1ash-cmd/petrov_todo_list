"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";

interface AddTaskFormProps {
    onAdd: (data: { text: string; description?: string; dueDate?: string }) => void;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setText("");
        setDescription("");
        setDueDate("");
        setError(null);
    };

    const handleSubmit = () => {
        if (!text.trim()) {
            setError("Заполните название задачи");
            return;
        }
        onAdd({ text: text.trim(), description: description.trim() || "", dueDate: dueDate || undefined });
        reset();
        setIsAdding(false);
    };

    return (
        <div className="w-full mb-6">
            {isAdding ? (
                <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/20">
                    <div className="flex flex-col gap-1">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                if (error && e.target.value.trim()) setError(null);
                            }}
                            placeholder="Название задачи..."
                            autoFocus
                            aria-invalid={!!error}
                            aria-describedby={error ? "add-task-title-error" : undefined}
                            className={`px-4 py-3 bg-white/10 rounded-xl border text-white placeholder-white/50 focus:outline-none text-base ${
                                error ? "border-red-500 focus:border-red-500" : "border-white/30 focus:border-purple-500"
                            }`}
                        />
                        {error && (
                            <span id="add-task-title-error" role="alert" className="text-red-400 text-sm">
                {error}
              </span>
                        )}
                    </div>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание (необязательно)..."
                        className="px-4 py-3 bg-white/10 rounded-xl border border-white/30 text-white placeholder-white/50 focus:border-purple-500 resize-none outline-none text-base"
                        rows={2}
                    />
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="px-4 py-3 bg-white/10 rounded-xl border border-white/30 text-white focus:border-purple-500 outline-none text-base"
                    />
                    <div className="flex gap-2 justify-end">
                        <button onClick={handleSubmit} className="p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all">
                            <Check className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                reset();
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
    );
}
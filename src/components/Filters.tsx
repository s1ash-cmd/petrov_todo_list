"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Filter } from "@/types";
import { getFilterActiveClass } from "@/lib/utils";

interface FilterOption {
    label: string;
    value: Filter;
    count: number;
}

interface FiltersProps {
    filter: Filter;
    onChange: (value: Filter) => void;
    options: FilterOption[];
}

export default function Filters({ filter, onChange, options }: FiltersProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
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
                        {options.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => {
                                    onChange(f.value);
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
                {options.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => onChange(f.value)}
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
        </>
    );
}
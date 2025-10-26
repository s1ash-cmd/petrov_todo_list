import React from "react";

interface StickyTodayDropProps {
    visible: boolean;
    dropRef: React.RefObject<HTMLDivElement | null>;
    onDragOver: (e: React.DragEvent) => void;
    onDropToToday: (e: React.DragEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export default function StickyTodayDrop({
                                            visible,
                                            dropRef,
                                            onDragOver,
                                            onDropToToday,
                                            onTouchMove,
                                            onTouchEnd,
                                        }: StickyTodayDropProps) {
    if (!visible) return null;

    return (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 w-full px-4 z-50 pointer-events-none">
            <div className="mx-auto max-w-5xl pointer-events-auto">
                <div
                    ref={dropRef}
                    onDragOver={onDragOver}
                    onDrop={onDropToToday}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    className="p-3 rounded-xl border-2 border-dashed border-white/30 bg-black/50 backdrop-blur-sm text-white transition-all"
                >
                    <p className="text-center text-sm text-white/80">
                        Перетащите сюда, чтобы добавить в «Задачи на сегодня»
                    </p>
                </div>
            </div>
        </div>
    );
}
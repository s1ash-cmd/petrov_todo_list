import { NotebookPen, CheckCheck, Flame, Timer, BarChart3 } from "lucide-react";

interface HeaderProps {
    totalTasks: number;
    completedTasks: number;
    endingCount: number;
    overdueCount: number;
    showCharts: boolean;
    onToggleCharts: () => void;
}

export default function Header({
                                   totalTasks,
                                   completedTasks,
                                   endingCount,
                                   overdueCount,
                                   showCharts,
                                   onToggleCharts,
                               }: HeaderProps) {
    return (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
                <NotebookPen className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-white" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Мои задачи</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-lg sm:text-xl lg:text-2xl font-semibold justify-center">
                <span className="text-sm sm:text-base">Всего: {totalTasks}</span>
                <div className="flex items-center gap-1">
                    <CheckCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    <span className="text-sm sm:text-base">{completedTasks}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <span className="text-sm sm:text-base">{endingCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                    <span className="text-sm sm:text-base">{overdueCount}</span>
                </div>

                <button
                    onClick={onToggleCharts}
                    className="p-2 sm:p-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 text-sm sm:text-base"
                >
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                    {showCharts ? "Список" : "Графики"}
                </button>
            </div>
        </div>
    );
}
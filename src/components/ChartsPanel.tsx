import { Task } from "@/types";
import { getStatusColor } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

interface ChartsPanelProps {
    tasks: Task[];
}

export default function ChartsPanel({ tasks }: ChartsPanelProps) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.done).length;
    const overdueTasks = tasks.filter((t) => t.dueDate && !t.done && new Date(t.dueDate) < new Date()).length;
    const activeNonOverdueTasks = tasks.filter((t) => !t.done && !(t.dueDate && new Date(t.dueDate) < new Date())).length;

    const chartDataStatus = [
        { name: "Выполнено", value: completedTasks },
        { name: "Активные", value: activeNonOverdueTasks },
        { name: "Просрочено", value: overdueTasks },
    ].filter((item) => item.value > 0);

    const chartDataDeadlines = Array.from({ length: 7 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + i);
        const weekday = day.toLocaleDateString("ru-RU", { weekday: "short" }).slice(0, 3);
        const date = day.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
        const label = `${weekday}, ${date}`;
        const count = tasks.filter(
            (t) => t.dueDate && new Date(t.dueDate).toDateString() === day.toDateString() && !t.done
        ).length;
        return { day: label, count };
    });

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col h-[300px] sm:h-[340px] bg-white/10 p-4 sm:p-6 rounded-2xl">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white text-center">Дедлайны (7 дней)</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataDeadlines} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="day" stroke="#ccc" fontSize={11} tick={{ fill: "#ddd" }} />
                        <YAxis stroke="#ccc" allowDecimals={false} fontSize={11} tick={{ fill: "#ddd" }} />
                        <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 text-center text-xs sm:text-sm text-white/80">
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#a78bfa" }}></div>
            Задачи
          </span>
                </div>
            </div>

            <div className="flex flex-col h-[380px] sm:h-[420px] bg-white/10 p-4 sm:p-6 rounded-2xl justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-white text-center">Статусы задач</h2>
                <div className="flex justify-center flex-1">
                    <ResponsiveContainer width={220} height={220}>
                        <PieChart>
                            <Pie
                                data={chartDataStatus}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                            >
                                {chartDataStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2 text-xs sm:text-sm text-white/80 overflow-y-auto max-h-32 px-1">
                    {chartDataStatus.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getStatusColor(item.name) }} />
                            <span className="truncate">
                {item.name} — {item.value} ({totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(0) : 0}%)
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
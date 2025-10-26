export interface Task {
    id: number;
    text: string;
    description: string;
    done: boolean;
    favorite: boolean;
    dueDate?: string;
    createdAt: string;
    isToday?: boolean;
}

export type Filter = "all" | "active" | "done" | "favorite" | "ending" | "overdue";
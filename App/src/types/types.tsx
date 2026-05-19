export interface Task {
    id: string,
    title: string,
    completed: boolean,
    priority: PriorityType | string
}

export type PriorityType = 'high' | 'low' | 'medium';

export interface TasksResponse<T> {
    data: T[],
    hasMore: boolean,
    nextPage: number | null,
}
export interface Task {
    id: string,
    title: string,
    completed: boolean,
    priority: PriorityType | string
}

export type PriorityType = 'high' | 'low' | 'medium';
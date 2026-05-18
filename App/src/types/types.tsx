export interface Task {
    id: number,
    title: string,
    completed: boolean,
    priority: 'high' | 'low' | 'medium'
}
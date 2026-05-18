import type { Task } from '../types/types.tsx';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchTasks = async (): Promise<Task> => {
    await delay(500);
    const response = await fetch('http://localhost:3000/tasks');
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    const data = await response.json();
    return data;
}

export const addTask = async (newTask: Omit<Task, 'id'>): Promise<Task> => {
    await delay(500);
    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return response.json()
}

export const deleteTask = async (id: number): Promise<void> => {
    await delay(500);
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) throw new Error(`Error: ${response.status}`)
}

export const updateStatus = async (id: number, status: Partial<Task>): Promise<Task> => {
    await delay(500);
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
    })
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return response.json()
}

export const filteredFetch = async (): Promise<Task> => {
    await delay(500);
    const response = await fetch('http://localhost:3000/tasks?priority=high');
    if (!response.ok) throw new Error(`Error: ${response.status}`)

    const filteredData = await response.json();
    return filteredData
}
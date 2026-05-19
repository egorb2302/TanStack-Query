import type { Task, TasksResponse } from '../types/types.tsx';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchTasks = async (priority?: string): Promise<Task[]> => {
    await delay(500);
    const url = priority && priority !== 'all'
     ? `http://localhost:3000/tasks?priority=${priority}`
     : 'http://localhost:3000/tasks' 

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    const data: Task[] = await response.json();
    console.log(data);
    return data;
}

export const addTask = async (newTask: Omit<Task, 'id'>): Promise<Task> => {
    await delay(500);
    const withUniqeId = {...newTask, id: Date.now()};
    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(withUniqeId)
    })
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return response.json()
}

export const deleteTask = async (id: string | undefined): Promise<void> => {
    await delay(500);
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) throw new Error(`Error: ${response.status}`)
}

export const updateStatus = async (id: string | undefined, status: Partial<Task>): Promise<Task> => {
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

export const fetchSoloTask = async(id: string | undefined): Promise<Task> => {
    await delay(500);
    const response = await fetch(`http://localhost:3000/tasks/${id}`)
    const data: Task = await response.json()
    return data
}

export const fetchPagination = async (page: number, priority?: string ): Promise<TasksResponse<Task>> => {
    await delay(500);

    const params = new URLSearchParams();
    params.set('_page', page.toString());
    params.set('_limit', '3');

    if (priority && priority !== 'all') {
        params.set('priority', priority)
    }

    const response = await fetch(`http://localhost:3000/tasks`);
    const totalCount = response.headers.get('X-Total-Count');
    const data = await response.json();

    const total = totalCount ? parseInt(totalCount) : 0;
    const hasMore = page * 3 < total;

    return {data, hasMore, nextPage: hasMore ? page + 1 : null};
}

// export const filteredFetch = async (): Promise<Task> => {
//     await delay(500);
//     const response = await fetch('http://localhost:3000/tasks?priority=high');
//     if (!response.ok) throw new Error(`Error: ${response.status}`)

//     const filteredData = await response.json();
//     return filteredData
// }
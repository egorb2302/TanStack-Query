import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTask, fetchTasks } from "../api/tasks";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Task } from "../types/types";

export default function TaskList() {
    const client = useQueryClient();
    const [priority, setPriority] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const PAGES_PER_VIEW: number = 3;

    const { data: tasks, isLoading, error, refetch } = useQuery({
        queryKey: ['tasks', priority],
        queryFn: () => fetchTasks(priority),
    });

    const mutation = useMutation({
        mutationFn: deleteTask,
        onMutate: async (deletedId) => {
            client.cancelQueries({ queryKey: ['tasks'] })

            const backup = client.getQueryData(['tasks']);

            client.setQueryData(['tasks'], (old: Task[] | undefined) => {
                return old?.filter(task => task.id === deletedId)
            })

            return { backup }
        },
        onError: (err, deletedId, context) => {
            client.setQueryData(['tasks'], context?.backup)
            console.error(`Error ${err} in element with id ${deletedId}`)
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

    if (isLoading) return <div>Loading...</div>
    if (error) throw new Error(`Error: ${error}`)

    const totalPages = Math.ceil((tasks?.length ?? 0) / PAGES_PER_VIEW);
    const startIndex = (currentPage - 1) * PAGES_PER_VIEW;
    const endIndex = startIndex + PAGES_PER_VIEW;
    const currentTasks = tasks?.slice(startIndex, endIndex) ?? [];

    return (
        <div>
            <div>
                <h1>Tasks</h1>
                <h3>Priority: {priority}</h3>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button onClick={() => refetch()}>Update list</button>
                <Link to="/tasks/add">
                    <button>Add Task</button>
                </Link>
            </div>
            <div>
                <ul>
                    {currentTasks.map(task => (
                        <li style={{border: '2px solid black', width: '300px'}} key={task.id}>
                            <Link to={`/tasks/${task.id}`}>
                                <strong>{task.title}</strong><br></br> 
                                priority: {task.priority}<br></br> 
                                completed: {task.completed ? '✔️' : '❌'}
                            </Link>
                            <button onClick={() => mutation.mutate(task.id)}>
                                {mutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}>
                        Prev
                </button>
                <span>Страница {currentPage} из {totalPages}</span>
                <button onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}>
                        Next
                </button>
            </div>
        </div>
    )
}
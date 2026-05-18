import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTask, fetchTasks } from "../api/tasks";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function TaskList() {
    const client = useQueryClient();
    const [priority, setPriority] = useState<string>('all');

    const { data: tasks, isLoading, error, refetch } = useQuery({
        queryKey: ['tasks', priority],
        queryFn: () => fetchTasks(priority),
    });

    const mutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

    if (isLoading) return <div>Loading...</div>
    if (error) throw new Error(`Error: ${error}`)

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
                    {tasks?.map(task => (
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
            </div>
        </div>
    )
}
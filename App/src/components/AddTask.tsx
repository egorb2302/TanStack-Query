import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../api/tasks";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Task } from '../types/types';

export default function AddTask() {
    const client = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [priority, setPriority] = useState<string>('low');
    const nav = useNavigate(); 

    const mutation = useMutation({
        mutationFn: addTask,   
        onMutate: async (newID) => {
            client.cancelQueries({ queryKey: ['tasks'] })

            const backup = client.getQueryData(['tasks'])
            const tempTask: Task = {
                ...newID,
                id: `temp-${Date.now()}`,
                completed: false,
            }

            client.setQueryData(['tasks'], (old: Task[] | undefined) => {
                return [...(old ?? []), tempTask]
            })

            return { backup }
        },
        onError: (err, newID, context) => {
            client.setQueryData(['tasks'], context?.backup)
            console.error(`Error ${err} of adding task with id ${newID}`)
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if(!title || !priority) return 
        mutation.mutate({title, priority, completed: false})
        nav('/tasks')
    }

    return (
        <div>
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="cook the cat"/>
                </div>
                <div>
                    <label>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit">Add</button>
                <Link to="/tasks">
                    <button type="button">Cancel</button>
                </Link>            
            </form>
        </div>
    )
}
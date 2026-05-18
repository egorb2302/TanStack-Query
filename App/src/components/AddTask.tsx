import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../api/tasks";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AddTask() {
    const client = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [priority, setPriority] = useState<string>('low');
    const nav = useNavigate(); 

    const mutation = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['tasks']})
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTask, fetchTasks } from "../api/users";
import { Link } from "react-router-dom";

export default function TaskList() {
    const client = useQueryClient();

    const { data: tasks, isLoading, error, refetch } = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
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
                <Link to="/tasks">
                    <button>All</button>
                </Link>
                <Link to="/tasks/highPriority">
                    <button>High Priority</button>
                </Link>
            </div>
            
        </div>
    )
}
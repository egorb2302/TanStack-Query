import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchSoloTask, updateStatus } from "../api/tasks";

export default function TaskDetail() {
    const { id: taskId } = useParams();
    const nav = useNavigate();

    const {data: task, isLoading, error} = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => fetchSoloTask(taskId),
        enabled: !!taskId
    })

    const checkedHandler = () => {
        updateStatus(taskId, { completed: true });
        nav('/tasks');
    }

    if (isLoading) return <div>Loading...</div>
    if (error) throw new Error(`Error ${error} was catched`)
    if (!task) return <div>{`Task with id ${taskId} has not found`}</div>

    return (
        <div>
            <h1>{task.title}</h1>
            <h3>Priority: {task.priority}</h3>
            <p>Completed: {task.completed ? '✔️' : '❌'}</p>
            <input type="checkbox" onChange={checkedHandler}/>
            <Link to="/tasks">Back to Tasks</Link>
        </div>
    )
}
import { Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import TaskDetail from "./components/TaskDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />}/>
      <Route path="/tasks" element={<TaskList />}/>
      <Route path="/tasks/add" element={<AddTask />}/>
      <Route path="/tasks/:id" element={<TaskDetail />}/>
    </Routes>
  )
}
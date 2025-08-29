import { useState } from "react";
import type { Task } from "./types/Task";
import { getActiveTasks, getCompletedTasks } from "./utils/taskUtils";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";
import { CompletedTaskList } from "./components/CompletedTaskList";

export const ToDoList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // Логика для добавления задачи
    const addTask = (text: string) => {
        const newTask: Task = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        
        setTasks([...tasks, newTask]);
    };

    // Логика для изменения статуса задачи
    const toggleTaskStatus = (taskId: string) => {
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
        ));
    };

    // Логика для очистки выполненных задач
    const clearCompletedTasks = () => {
        setTasks(tasks.filter(task => !task.completed));
    };

    // Получение активных и выполненных задач
    const activeTasks = getActiveTasks(tasks);
    const completedTasks = getCompletedTasks(tasks);

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Форма добавления задачи - остается на месте */}
            <div className="mb-6">
                <AddTaskForm onAddTask={addTask} />
            </div>

            {/* Блоки с задачами - располагаются горизонтально в ряд */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Список всех задач */}
                <TaskList 
                    title="Все задачи"
                    tasks={tasks}
                    onToggleStatus={toggleTaskStatus}
                    countText="Всего задач"
                    count={tasks.length}
                    emptyMessage="Нет задач"
                />

                {/* Список задач в работе */}
                <TaskList 
                    title="В работе"
                    tasks={activeTasks}
                    onToggleStatus={toggleTaskStatus}
                    countText="Активных задач"
                    count={activeTasks.length}
                    emptyMessage="Нет активных задач"
                />

                {/* Список выполненных задач */}
                <CompletedTaskList 
                    tasks={completedTasks}
                    onToggleStatus={toggleTaskStatus}
                    onClearCompleted={clearCompletedTasks}
                />
            </div>
        </div>
    );
};
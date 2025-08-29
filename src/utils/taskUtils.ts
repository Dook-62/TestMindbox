import type { Task } from '../types/Task';

// Получить активные (не выполненные) задачи
export const getActiveTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => !task.completed);
};

// Получить выполненные задачи
export const getCompletedTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => task.completed);
};

// Получить количество активных задач
export const getActiveTasksCount = (tasks: Task[]): number => {
    return getActiveTasks(tasks).length;
};

// Получить количество выполненных задач
export const getCompletedTasksCount = (tasks: Task[]): number => {
    return getCompletedTasks(tasks).length;
};

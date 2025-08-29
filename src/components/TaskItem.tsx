import React from 'react';
import { Checkbox } from './ui/checkbox';
import type { Task } from '../types/Task';

interface TaskItemProps {
    task: Task;
    onToggleStatus: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus }) => {
    return (
        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
            <Checkbox 
                checked={task.completed}
                onCheckedChange={() => onToggleStatus(task.id)}
            />
            <span 
                className={`flex-1 ${
                    task.completed 
                        ? 'line-through text-muted-foreground' 
                        : ''
                }`}
            >
                {task.text}
            </span>
        </li>
    );
};

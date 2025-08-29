import React from 'react';
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from './ui/card';
import { TaskItem } from './TaskItem';
import type { Task } from '../types/Task';

interface TaskListProps {
    title: string;
    tasks: Task[];
    onToggleStatus: (taskId: string) => void;
    countText: string;
    count: number;
    emptyMessage: string;
}

export const TaskList: React.FC<TaskListProps> = ({ 
    title, 
    tasks, 
    onToggleStatus, 
    countText, 
    count, 
    emptyMessage 
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">{title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
                ) : (
                    <ul className="space-y-2">
                        {tasks.map((task) => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onToggleStatus={onToggleStatus}
                            />
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter>
                <span className="text-sm text-muted-foreground">
                    {countText}: {count}
                </span>
            </CardFooter>
        </Card>
    );
};

import React from 'react';
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from './ui/card';
import { TaskItem } from './TaskItem';
import { ClearCompletedButton } from './ClearCompletedButton';
import type { Task } from '../types/Task';

interface CompletedTaskListProps {
    tasks: Task[];
    onToggleStatus: (taskId: string) => void;
    onClearCompleted: () => void;
}

export const CompletedTaskList: React.FC<CompletedTaskListProps> = ({ 
    tasks, 
    onToggleStatus, 
    onClearCompleted 
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">Готово</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Нет выполненных задач</p>
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
            <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                    Выполнено задач: {tasks.length}
                </span>
                <ClearCompletedButton 
                    completedTasksCount={tasks.length}
                    onClearCompleted={onClearCompleted}
                />
            </CardFooter>
        </Card>
    );
};

import React from 'react';
import { Button } from './ui/button';

interface ClearCompletedButtonProps {
    completedTasksCount: number;
    onClearCompleted: () => void;
}

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({ 
    completedTasksCount, 
    onClearCompleted 
}) => {
    if (completedTasksCount === 0) {
        return null;
    }

    return (
        <Button 
            variant="outline" 
            size="sm"
            onClick={onClearCompleted}
        >
            Очистить выполненные
        </Button>
    );
};

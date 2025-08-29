import React, { useState } from 'react';
import { Card, CardContent, CardTitle, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AddTaskFormProps {
    onAddTask: (text: string) => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = () => {
        if (inputValue.trim() === "") return;
        
        onAddTask(inputValue.trim());
        setInputValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">Добавить новую задачу</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Input 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Введите задачу"
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                />
                <Button variant="default" onClick={handleSubmit}>
                    Добавить
                </Button>
            </CardContent>
        </Card>
    );
};

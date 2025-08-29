import { describe, it, expect } from 'vitest';
import { 
  getActiveTasks, 
  getCompletedTasks, 
  getActiveTasksCount, 
  getCompletedTasksCount 
} from '../utils/taskUtils';
import type { Task } from '../types/Task';

describe('taskUtils', () => {
  const mockTasks: Task[] = [
    { id: '1', text: 'Активная задача 1', completed: false },
    { id: '2', text: 'Активная задача 2', completed: false },
    { id: '3', text: 'Выполненная задача 1', completed: true },
    { id: '4', text: 'Выполненная задача 2', completed: true },
    { id: '5', text: 'Активная задача 3', completed: false }
  ];

  describe('getActiveTasks', () => {
    it('должен возвращать только активные задачи', () => {
      const activeTasks = getActiveTasks(mockTasks);
      
      expect(activeTasks).toHaveLength(3);
      expect(activeTasks.every(task => !task.completed)).toBe(true);
      expect(activeTasks.map(task => task.text)).toEqual([
        'Активная задача 1',
        'Активная задача 2',
        'Активная задача 3'
      ]);
    });

    it('должен возвращать пустой массив для пустого списка', () => {
      const activeTasks = getActiveTasks([]);
      expect(activeTasks).toHaveLength(0);
    });

    it('должен возвращать пустой массив если все задачи выполнены', () => {
      const completedTasks: Task[] = [
        { id: '1', text: 'Задача 1', completed: true },
        { id: '2', text: 'Задача 2', completed: true }
      ];
      
      const activeTasks = getActiveTasks(completedTasks);
      expect(activeTasks).toHaveLength(0);
    });
  });

  describe('getCompletedTasks', () => {
    it('должен возвращать только выполненные задачи', () => {
      const completedTasks = getCompletedTasks(mockTasks);
      
      expect(completedTasks).toHaveLength(2);
      expect(completedTasks.every(task => task.completed)).toBe(true);
      expect(completedTasks.map(task => task.text)).toEqual([
        'Выполненная задача 1',
        'Выполненная задача 2'
      ]);
    });

    it('должен возвращать пустой массив для пустого списка', () => {
      const completedTasks = getCompletedTasks([]);
      expect(completedTasks).toHaveLength(0);
    });

    it('должен возвращать пустой массив если все задачи активны', () => {
      const activeTasks: Task[] = [
        { id: '1', text: 'Задача 1', completed: false },
        { id: '2', text: 'Задача 2', completed: false }
      ];
      
      const completedTasks = getCompletedTasks(activeTasks);
      expect(completedTasks).toHaveLength(0);
    });
  });

  describe('getActiveTasksCount', () => {
    it('должен возвращать правильное количество активных задач', () => {
      const count = getActiveTasksCount(mockTasks);
      expect(count).toBe(3);
    });

    it('должен возвращать 0 для пустого списка', () => {
      const count = getActiveTasksCount([]);
      expect(count).toBe(0);
    });
  });

  describe('getCompletedTasksCount', () => {
    it('должен возвращать правильное количество выполненных задач', () => {
      const count = getCompletedTasksCount(mockTasks);
      expect(count).toBe(2);
    });

    it('должен возвращать 0 для пустого списка', () => {
      const count = getCompletedTasksCount([]);
      expect(count).toBe(0);
    });
  });

  describe('Интеграционные тесты', () => {
    it('сумма активных и выполненных задач должна равняться общему количеству', () => {
      const activeCount = getActiveTasksCount(mockTasks);
      const completedCount = getCompletedTasksCount(mockTasks);
      const totalCount = mockTasks.length;
      
      expect(activeCount + completedCount).toBe(totalCount);
    });

    it('функции должны работать с изменёнными данными', () => {
      const modifiedTasks = [...mockTasks];
      
      // Изменяем статус первой задачи
      modifiedTasks[0].completed = true;
      
      expect(getActiveTasksCount(modifiedTasks)).toBe(2);
      expect(getCompletedTasksCount(modifiedTasks)).toBe(3);
    });
  });
});


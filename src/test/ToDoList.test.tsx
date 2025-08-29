import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ToDoList } from '../to-do';

// Мокаем компоненты для изоляции тестов
vi.mock('../components/AddTaskForm', () => ({
  AddTaskForm: ({ onAddTask }: { onAddTask: (text: string) => void }) => (
    <div data-testid="add-task-form">
      <input 
        data-testid="task-input" 
        placeholder="Введите задачу"
        onChange={(e) => {
          const input = e.target as HTMLInputElement;
          input.dataset.value = input.value;
        }}
      />
      <button 
        data-testid="add-task-button"
        onClick={() => {
          const input = document.querySelector('[data-testid="task-input"]') as HTMLInputElement;
          if (input && input.dataset.value) {
            onAddTask(input.dataset.value);
          }
        }}
      >
        Добавить
      </button>
    </div>
  )
}));

vi.mock('../components/TaskList', () => ({
  TaskList: ({ 
    title, 
    tasks, 
    onToggleStatus, 
    countText, 
    count, 
    emptyMessage 
  }: any) => (
    <div data-testid={`task-list-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2>{title}</h2>
      {tasks.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {tasks.map((task: any) => (
            <li key={task.id} data-testid={`task-${task.id}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleStatus(task.id)}
                data-testid={`checkbox-${task.id}`}
              />
              <span className={task.completed ? 'line-through' : ''}>
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div data-testid={`counter-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {countText}: {count}
      </div>
    </div>
  )
}));

vi.mock('../components/CompletedTaskList', () => ({
  CompletedTaskList: ({ 
    tasks, 
    onToggleStatus, 
    onClearCompleted 
  }: any) => (
    <div data-testid="completed-task-list">
      <h2>Готово</h2>
      {tasks.length === 0 ? (
        <p>Нет выполненных задач</p>
      ) : (
        <ul>
          {tasks.map((task: any) => (
            <li key={task.id} data-testid={`completed-task-${task.id}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleStatus(task.id)}
                data-testid={`completed-checkbox-${task.id}`}
              />
              <span className="line-through">{task.text}</span>
            </li>
          ))}
        </ul>
      )}
      {tasks.length > 0 && (
        <button 
          data-testid="clear-completed-button"
          onClick={onClearCompleted}
        >
          Очистить выполненные
        </button>
      )}
      <div data-testid="completed-counter">
        Выполнено задач: {tasks.length}
      </div>
    </div>
  )
}));

describe('ToDoList', () => {
  it('должен отображать пустые списки при запуске', () => {
    render(<ToDoList />);
    
    expect(screen.getByText('Все задачи')).toBeInTheDocument();
    expect(screen.getByText('В работе')).toBeInTheDocument();
    expect(screen.getByText('Готово')).toBeInTheDocument();
    
    expect(screen.getByText('Нет задач')).toBeInTheDocument();
    expect(screen.getByText('Нет активных задач')).toBeInTheDocument();
    expect(screen.getByText('Нет выполненных задач')).toBeInTheDocument();
  });

  it('должен показывать правильные счётчики при запуске', () => {
    render(<ToDoList />);
    
    expect(screen.getByTestId('counter-все-задачи')).toHaveTextContent('Всего задач: 0');
    expect(screen.getByTestId('counter-в-работе')).toHaveTextContent('Активных задач: 0');
    expect(screen.getByTestId('completed-counter')).toHaveTextContent('Выполнено задач: 0');
  });

  it('должен добавлять новую задачу', async () => {
    const user = userEvent.setup();
    render(<ToDoList />);
    
    const input = screen.getByTestId('task-input');
    const button = screen.getByTestId('add-task-button');
    
    // Симулируем ввод текста
    Object.defineProperty(input, 'dataset', {
      value: { value: 'Новая задача' },
      writable: true
    });
    
    await user.click(button);
    
    // Проверяем, что задача появилась в списке "Все задачи"
    await waitFor(() => {
      // Используем getAllByText и проверяем, что есть хотя бы один элемент
      const elements = screen.getAllByText('Новая задача');
      expect(elements.length).toBeGreaterThan(0);
    });
    
    // Проверяем, что счётчик обновился
    expect(screen.getByTestId('counter-все-задачи')).toHaveTextContent('Всего задач: 1');
    expect(screen.getByTestId('counter-в-работе')).toHaveTextContent('Активных задач: 1');
  });

  it('должен отмечать задачу как выполненную', async () => {
    const user = userEvent.setup();
    render(<ToDoList />);
    
    // Сначала добавляем задачу
    const input = screen.getByTestId('task-input');
    const button = screen.getByTestId('add-task-button');
    
    Object.defineProperty(input, 'dataset', {
      value: { value: 'Тестовая задача' },
      writable: true
    });
    
    await user.click(button);
    
    // Ждём появления задачи и находим её ID
    let taskId = '';
    await waitFor(() => {
      const elements = screen.getAllByText('Тестовая задача');
      expect(elements.length).toBeGreaterThan(0);
      // Получаем ID из первого элемента
      const taskElement = elements[0].closest('[data-testid^="task-"]');
      expect(taskElement).toBeInTheDocument();
      taskId = taskElement!.getAttribute('data-testid')!.replace('task-', '');
    });
    
    // Находим чекбокс по ID и отмечаем задачу (берем первый из дублирующихся)
    const checkboxes = screen.getAllByTestId(`checkbox-${taskId}`);
    expect(checkboxes.length).toBeGreaterThan(0);
    const checkbox = checkboxes[0];
    await user.click(checkbox);
    
    // Проверяем, что счётчики обновились
    await waitFor(() => {
      expect(screen.getByTestId('counter-в-работе')).toHaveTextContent('Активных задач: 0');
      expect(screen.getByTestId('completed-counter')).toHaveTextContent('Выполнено задач: 1');
    });
  });

  it('должен очищать выполненные задачи', async () => {
    const user = userEvent.setup();
    render(<ToDoList />);
    
    // Добавляем задачу
    const input = screen.getByTestId('task-input');
    const button = screen.getByTestId('add-task-button');
    
    Object.defineProperty(input, 'dataset', {
      value: { value: 'Задача для очистки' },
      writable: true
    });
    
    await user.click(button);
    
    // Ждём появления задачи и находим её ID
    let taskId = '';
    await waitFor(() => {
      const elements = screen.getAllByText('Задача для очистки');
      expect(elements.length).toBeGreaterThan(0);
      const taskElement = elements[0].closest('[data-testid^="task-"]');
      expect(taskElement).toBeInTheDocument();
      taskId = taskElement!.getAttribute('data-testid')!.replace('task-', '');
    });
    
    // Отмечаем как выполненную (берем первый из дублирующихся)
    const checkboxes = screen.getAllByTestId(`checkbox-${taskId}`);
    expect(checkboxes.length).toBeGreaterThan(0);
    const checkbox = checkboxes[0];
    await user.click(checkbox);
    
    // Ждём появления кнопки очистки
    await waitFor(() => {
      expect(screen.getByTestId('clear-completed-button')).toBeInTheDocument();
    });
    
    // Нажимаем кнопку очистки
    const clearButton = screen.getByTestId('clear-completed-button');
    await user.click(clearButton);
    
    // Проверяем, что выполненные задачи удалены
    await waitFor(() => {
      expect(screen.getByText('Нет выполненных задач')).toBeInTheDocument();
      expect(screen.getByTestId('completed-counter')).toHaveTextContent('Выполнено задач: 0');
    });
  });

  it('не должен добавлять пустые задачи', async () => {
    const user = userEvent.setup();
    render(<ToDoList />);
    
    const button = screen.getByTestId('add-task-button');
    
    // Пытаемся добавить пустую задачу
    await user.click(button);
    
    // Проверяем, что счётчики не изменились
    expect(screen.getByTestId('counter-все-задачи')).toHaveTextContent('Всего задач: 0');
    expect(screen.getByTestId('counter-в-работе')).toHaveTextContent('Активных задач: 0');
  });
});

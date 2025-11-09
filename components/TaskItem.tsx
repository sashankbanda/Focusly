import React, { useState, useEffect } from 'react';
import { Task } from '../App';
import EditTaskForm from './EditTaskForm'; // Import the new form

interface TaskItemProps {
  task: Task;
  isExiting: boolean;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetEditing: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isExiting, isEditing, onToggle, onDelete, onSetEditing, onUpdate }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isEditing) {
    return <EditTaskForm task={task} onUpdate={onUpdate} onCancel={() => onSetEditing(null)} />;
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  const getDaysLeftText = (dueDateString?: string): string | null => {
    if (!dueDateString) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const dueDate = new Date(dueDateString);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() < now.getTime()) {
      return 'Overdue';
    }
    
    if (dueDate.getTime() === now.getTime()) {
        return 'Today';
    }

    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Tomorrow';
    }
    
    if (diffDays > 1) {
      return `In ${diffDays} days`;
    }

    return null;
  };

  const priorityColor = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
  }[task.priority || 'Low'];
  
  const leadTimeText = {
      0: 'On time',
      5: '5m before',
      15: '15m before',
      30: '30m before',
      60: '1h before',
  }[task.reminderLeadTime || 0];
  
  const daysLeftText = getDaysLeftText(task.dueDate);

  const animationClass = isExiting ? 'animate-fadeOut' : (isMounted ? 'animate-fadeIn' : 'opacity-0');

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg shadow-sm transition-all duration-300 ${animationClass} ${
        task.completed ? 'bg-green-500/10 dark:bg-green-900/30 opacity-70' : 'bg-white/70 dark:bg-neutral-800'
      }`}
    >
      <div className="flex-grow flex items-start gap-3">
        <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${priorityColor}`}></div>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 mt-1 rounded-md bg-gray-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-blue-500 focus:ring-blue-500 cursor-pointer flex-shrink-0"
          aria-labelledby={`task-text-${task.id}`}
        />
        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
             <span
              id={`task-text-${task.id}`}
              className={`transition-all duration-300 break-all ${
                task.completed ? 'line-through text-zinc-500 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'
              }`}
            >
              {task.text}
            </span>
            {task.tag && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">{task.tag}</span>
            )}
            {task.repeatDaily && (
                <span title="Repeats daily" className="text-zinc-500">🔁</span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs mt-1 flex-wrap">
              {task.dueDate && !task.completed && (
                <p className="text-blue-500 dark:text-blue-400">Due: {formatDate(task.dueDate)}</p>
              )}
              {daysLeftText && (
                 <p className={`font-semibold ${daysLeftText === 'Overdue' ? 'text-red-500' : 'text-orange-500 dark:text-orange-400'}`}>({daysLeftText})</p>
              )}
              {task.completionDate && task.completed && (
                <p className="text-zinc-500 dark:text-zinc-400">Completed: {formatDate(task.completionDate)}</p>
              )}
              {task.reminderEnabled && !task.completed && (
                <div className="flex items-center gap-1 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <span>{leadTimeText}</span>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4 flex-shrink-0">
        <button
            onClick={() => onSetEditing(task.id)}
            className="text-zinc-400 dark:text-zinc-500 hover:text-blue-500 transition-colors mr-2"
            aria-label={`Edit task: ${task.text}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
        </button>
        <button
            onClick={() => onDelete(task.id)}
            className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors"
            aria-label={`Delete task: ${task.text}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
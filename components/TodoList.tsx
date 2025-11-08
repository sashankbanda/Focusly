
import React, { useState, useMemo } from 'react';
// FIX: Correctly import Task and Priority types from the parent App component.
import { Task, Priority } from '../App';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

interface TodoListProps {
  tasks: Task[];
  // FIX: Changed to Set<string> to handle string-based IDs from the backend.
  exitingTaskIds: Set<string>;
  isFocusMode: boolean;
  onAddTask: (taskDetails: { text: string; dueDate?: string; priority?: Priority; tag?: string; reminderEnabled?: boolean; reminderLeadTime?: number; }) => void;
  // FIX: Changed ID type to string for backend compatibility.
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearHistory: () => void;
}

// Moved Section outside of TodoList to prevent re-mounting on every render
const Section: React.FC<{
  title: string;
  tasks: Task[];
  placeholder: string;
  exitingTaskIds: Set<string>;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  children?: React.ReactNode;
}> = ({ title, tasks: taskItems, children, placeholder, exitingTaskIds, onToggleTask, onDeleteTask }) => (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400 border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-4">{title}</h3>
      <div className="space-y-3">
        {taskItems.length > 0 ? (
          taskItems.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isExiting={exitingTaskIds.has(task.id)}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          <p className="text-center text-zinc-500 italic">{placeholder}</p>
        )}
      </div>
      {children}
    </div>
);


const TodoList: React.FC<TodoListProps> = ({
  tasks,
  exitingTaskIds,
  isFocusMode,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearHistory,
}) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach(task => {
      if (task.tag) tags.add(task.tag);
    });
    return Array.from(tags);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!activeTag) return tasks;
    return tasks.filter(task => task.tag === activeTag);
  }, [tasks, activeTag]);

  const isToday = (dateString: string) => {
    const taskDate = new Date(dateString);
    return taskDate >= today && taskDate < tomorrow;
  };

  const todayTasks = filteredTasks.filter(
    task => !task.completed && (!task.dueDate || isToday(task.dueDate))
  );

  const scheduledTasks = filteredTasks.filter(
    task => !task.completed && task.dueDate && !isToday(task.dueDate)
  );

  const historyTasks = filteredTasks
    .filter(task => task.completed)
    .sort((a, b) => new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime());

  return (
    <div className="w-full max-w-lg mx-auto bg-white/50 dark:bg-neutral-900/50 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
      <div className={`transition-all duration-500 ease-in-out ${isFocusMode ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-screen opacity-100'}`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-300">Daily Tasks</h2>
        <TaskInput onAddTask={onAddTask} />
        {uniqueTags.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              <button onClick={() => setActiveTag(null)} className={`px-3 py-1 text-sm rounded-full transition ${!activeTag ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-zinc-700 dark:text-zinc-300'}`}>All</button>
              {uniqueTags.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 text-sm rounded-full transition ${activeTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-zinc-700 dark:text-zinc-300'}`}>{tag}</button>
              ))}
          </div>
        )}
      </div>
      
      <Section 
        title="Today's Tasks" 
        tasks={todayTasks} 
        placeholder="No tasks for today." 
        exitingTaskIds={exitingTaskIds}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />
      <Section 
        title="Scheduled" 
        tasks={scheduledTasks} 
        placeholder="No upcoming tasks." 
        exitingTaskIds={exitingTaskIds}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />
      
      <div className={`transition-all duration-500 ease-in-out ${isFocusMode ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-screen opacity-100'}`}>
        <Section 
            title="History" 
            tasks={historyTasks} 
            placeholder="No completed tasks yet."
            exitingTaskIds={exitingTaskIds}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
        >
          {historyTasks.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={onClearHistory}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-500 transition-colors"
              >
                Clear History
              </button>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};

export default TodoList;

import React, { useState, useEffect, useRef } from 'react';
import FlipClock from './components/FlipClock';
import DateDisplay from './components/DateDisplay';
import TodoList from './components/TodoList';
import ThemeToggle from './components/ThemeToggle';
import ProductivityStats from './components/ProductivityStats';
import FocusModeToggle from './components/FocusModeToggle';
import ReportModal from './components/WeeklyReportModal';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  completionDate?: string;
  priority?: Priority;
  tag?: string;
  reminderEnabled?: boolean;
  reminderLeadTime?: number; // In minutes
}

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Failed to parse tasks from localStorage', error);
      return [];
    }
  });
  const [exitingTaskIds, setExitingTaskIds] = useState<Set<number>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    return localStorage.getItem('focusMode') === 'true';
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const sentNotifications = useRef(new Set<number>());

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('focusMode', String(isFocusMode));
  }, [isFocusMode]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Effect for handling reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.reminderEnabled && task.dueDate && !task.completed) {
          const dueDate = new Date(task.dueDate);
          const leadTimeMinutes = task.reminderLeadTime || 0;
          const reminderTime = new Date(dueDate.getTime() - leadTimeMinutes * 60 * 1000);

          if (reminderTime <= now && !sentNotifications.current.has(task.id)) {
            // Send notification
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: task.text,
                icon: '/favicon.ico' 
              });
            } else {
              // Fallback to alert if notifications are not granted
              alert(`Reminder: ${task.text}`);
            }
            sentNotifications.current.add(task.id);
          }
        }
      });
    };

    const reminderInterval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(reminderInterval);
  }, [tasks]);


  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const handleAddTask = (taskDetails: { text: string; dueDate?: string; priority?: Priority; tag?: string; reminderEnabled?: boolean; reminderLeadTime?: number }) => {
    if (taskDetails.reminderEnabled && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
      
    const newTask: Task = {
      id: Date.now(),
      text: taskDetails.text,
      completed: false,
      dueDate: taskDetails.dueDate,
      priority: taskDetails.priority,
      tag: taskDetails.tag,
      reminderEnabled: taskDetails.reminderEnabled,
      reminderLeadTime: taskDetails.reminderLeadTime,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleToggleTask = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const isNowCompleted = !task.completed;
          return {
            ...task,
            completed: isNowCompleted,
            completionDate: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id: number) => {
    setExitingTaskIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setExitingTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 400); // Animation duration
  };

  const handleClearHistory = () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    setExitingTaskIds(prev => new Set([...prev, ...completedIds]));
    setTimeout(() => {
        setTasks(prevTasks => prevTasks.filter(task => !task.completed));
        setExitingTaskIds(prev => {
            const newSet = new Set(prev);
            completedIds.forEach(id => newSet.delete(id));
            return newSet;
        });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col items-center p-4 font-sans text-gray-800 dark:text-white antialiased transition-colors duration-300">
      <FocusModeToggle isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <main className="flex flex-col items-center w-full max-w-2xl mt-16 space-y-12">
        <FlipClock hours={hours} minutes={minutes} seconds={seconds} />
        <DateDisplay date={time} />
        <div className={`w-full transition-opacity duration-500 ${isFocusMode ? 'opacity-0 max-h-0' : 'opacity-100 max-h-full'}`}>
            <ProductivityStats tasks={tasks} onViewReport={() => setIsReportModalOpen(true)} />
        </div>
        <TodoList
          tasks={tasks}
          exitingTaskIds={exitingTaskIds}
          isFocusMode={isFocusMode}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onClearHistory={handleClearHistory}
        />
      </main>
      <footer className="w-full text-center text-zinc-500 dark:text-zinc-500 text-sm py-4 mt-auto">
        <p>Crafted with React & Tailwind CSS</p>
      </footer>
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} tasks={tasks} />
    </div>
  );
};

export default App;
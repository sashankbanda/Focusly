
// FIX: Add a reference to Vite's client types to provide type definitions for `import.meta.env`.
/// <reference types="vite/client" />

import React, { useState, useEffect, useCallback } from 'react';
import { auth } from './firebase';
import firebase from 'firebase/compat/app';

import FlipClock from './components/FlipClock';
import DateDisplay from './components/DateDisplay';
import TodoList from './components/TodoList';
import ThemeToggle from './components/ThemeToggle';
import ProductivityStats from './components/ProductivityStats';
import WeeklyReportModal from './components/WeeklyReportModal';
import FocusModeToggle from './components/FocusModeToggle';
import LoginPage from './components/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Toast from './components/Toast';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completionDate?: string;
  dueDate?: string;
  priority?: Priority;
  tag?: string;
  reminderEnabled?: boolean;
  reminderLeadTime?: number;
}

type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

// Use environment variable for the API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exitingTaskIds, setExitingTaskIds] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getAuthHeader = useCallback(async () => {
    if (!auth.currentUser) return {};
    const token = await auth.currentUser.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/tasks`, { headers });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      // Map backend `_id`, `title`, `reminder` to frontend `id`, `text`, `reminderEnabled`
      const mappedTasks = data.map((task: any) => ({
        ...task,
        id: task._id,
        text: task.title,
        reminderEnabled: task.reminder,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error(error);
      showToast('Could not load tasks.', 'error');
    }
  }, [user, getAuthHeader]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleLogout = async () => {
    await auth.signOut();
    setTasks([]); // Clear tasks on logout
  };

  const handleAddTask = async (taskDetails: { text: string; dueDate?: string; priority?: Priority; tag?: string; reminderEnabled?: boolean; reminderLeadTime?: number; }) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
            title: taskDetails.text,
            dueDate: taskDetails.dueDate,
            priority: taskDetails.priority,
            tag: taskDetails.tag,
            reminder: taskDetails.reminderEnabled,
         }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      showToast('✅ Synced with Cloud', 'success');
      fetchTasks(); // Refetch tasks to get the new one with DB id
    } catch (error) {
      console.error(error);
      showToast('Failed to add task.', 'error');
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ completed: !task.completed }),
        });
        if (!response.ok) throw new Error('Failed to update task');

        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed, completionDate: !t.completed ? new Date().toISOString() : undefined } : t
        ));
        showToast('✅ Synced with Cloud', 'success');
    } catch (error) {
        console.error(error);
        showToast('Failed to update task.', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    setExitingTaskIds(prev => new Set(prev).add(id));
    
    setTimeout(async () => {
        try {
            const headers = await getAuthHeader();
            const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
                method: 'DELETE',
                headers,
            });
            if (!response.ok) throw new Error('Failed to delete task');

            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            showToast('✅ Synced with Cloud', 'success');
            setExitingTaskIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (error) {
            console.error(error);
            showToast('Failed to delete task.', 'error');
            // Revert animation state if delete fails
            setExitingTaskIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }, 500);
  };
  
  const handleClearHistory = async () => {
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/api/tasks/history`, {
            method: 'DELETE',
            headers,
        });
        if (!response.ok) throw new Error('Failed to clear history');
        setTasks(tasks.filter(t => !t.completed));
        showToast('Completed tasks cleared.', 'success');
    } catch (error) {
        console.error(error);
        showToast('Failed to clear history.', 'error');
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPage />;
  }
  
  return (
    <div className={`min-h-screen font-sans antialiased bg-gray-100 dark:bg-black transition-colors duration-500 ${isFocusMode ? 'focus-mode' : ''}`}>
      <div className={`fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ${theme === 'dark' ? 'bg-[url(/night.jpg)] opacity-100' : 'bg-[url(/day.jpg)] opacity-100'}`}></div>
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40"></div>
      
      <div className="relative z-10">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <FocusModeToggle isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
        {user && <Header user={user} onLogout={handleLogout} />}

        <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 sm:pt-4">
            <div className={`flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out ${isFocusMode ? 'scale-125' : 'scale-100'}`}>
                <FlipClock
                    hours={currentTime.getHours()}
                    minutes={currentTime.getMinutes()}
                    seconds={currentTime.getSeconds()}
                />
                <div className={`transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
                    <DateDisplay date={currentTime} />
                </div>
            </div>

            <div className={`w-full container mx-auto px-4 mt-12 transition-all duration-500 ease-in-out ${isFocusMode ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-full'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="md:col-span-1">
                        <TodoList
                            tasks={tasks}
                            exitingTaskIds={exitingTaskIds}
                            isFocusMode={isFocusMode}
                            onAddTask={handleAddTask}
                            onToggleTask={handleToggleTask}
                            onDeleteTask={handleDeleteTask}
                            onClearHistory={handleClearHistory}
                        />
                    </div>
                    <div className="md:col-span-1 flex flex-col gap-8">
                        <ProductivityStats tasks={tasks} onViewReport={() => setIsReportModalOpen(true)} />
                    </div>
                </div>
            </div>
        </main>
        
        <WeeklyReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          tasks={tasks}
        />
        
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
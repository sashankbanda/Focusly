/// <reference types="vite/client" />

import React, { useState, useEffect, useCallback } from 'react';
import { auth } from './firebase';
import firebase from 'firebase/compat/app';

import FlipClock from './components/FlipClock';
import DateDisplay from './components/DateDisplay';
import TodoList from './components/TodoList';
import ProductivityStats from './components/ProductivityStats';
import WeeklyReportModal from './components/WeeklyReportModal';
import LoginPage from './components/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar'; 

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
  repeatDaily?: boolean; // New property
}

type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'tasks' | 'stats' | null>(null);
  const [shownReminders, setShownReminders] = useState<Set<string>>(new Set());

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
  
  const checkAndResetDailyTasks = useCallback(async (tasksFromServer: any[]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tasksToReset = tasksFromServer.filter(
          (task) => task.repeatDaily && task.completed && new Date(task.completionDate) < today
      );

      if (tasksToReset.length > 0) {
          const headers = await getAuthHeader();
          // Reset each task
          await Promise.all(
              tasksToReset.map(task =>
                  fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
                      method: 'PUT',
                      headers,
                      body: JSON.stringify({ completed: false }),
                  })
              )
          );
          // Return true if tasks were reset, so we can refetch
          return true;
      }
      return false;
  }, [getAuthHeader]);


  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/tasks`, { headers });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      
      const wereTasksReset = await checkAndResetDailyTasks(data);
      if (wereTasksReset) {
          // Refetch if daily tasks were reset to get their updated state
          fetchTasks();
          return;
      }

      const mappedTasks = data.map((task: any) => ({
        ...task,
        id: task._id,
        text: task.title,
        reminderEnabled: task.reminder,
        reminderLeadTime: task.reminderLeadTime,
        repeatDaily: task.repeatDaily,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error(error);
      showToast('Could not load tasks.', 'error');
    }
  }, [user, getAuthHeader, checkAndResetDailyTasks]);

  useEffect(() => {
    if (user) {
        fetchTasks();
    }
  }, [user, fetchTasks]);
  
  useEffect(() => {
    const reminderInterval = setInterval(() => {
        const now = new Date();
        tasks.forEach(task => {
            if (task.reminderEnabled && task.dueDate && !task.completed && typeof task.reminderLeadTime === 'number') {
                const dueDate = new Date(task.dueDate);
                const reminderTime = new Date(dueDate.getTime() - task.reminderLeadTime * 60 * 1000);
                if (reminderTime <= now && dueDate > now && !shownReminders.has(task.id)) {
                    showToast(`Reminder: "${task.text}" is due soon!`, 'info');
                    setShownReminders(prev => new Set(prev).add(task.id));
                }
            }
        });
    }, 60000); 

    return () => clearInterval(reminderInterval);
}, [tasks, shownReminders]);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleLogout = async () => {
    await auth.signOut();
    setTasks([]);
  };

  const handleAddTask = async (taskDetails: { text: string; dueDate?: string; priority?: Priority; tag?: string; reminderEnabled?: boolean; reminderLeadTime?: number; repeatDaily?: boolean; }) => {
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
            reminderLeadTime: taskDetails.reminderLeadTime,
            repeatDaily: taskDetails.repeatDaily,
         }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      showToast('✅ Synced with Cloud', 'success');
      fetchTasks();
    } catch (error) {
      console.error(error);
      showToast('Failed to add task.', 'error');
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ ...updates, title: updates.text }), // Ensure backend 'title' field is used
        });
        if (!response.ok) throw new Error('Failed to update task');
        showToast('Task updated.', 'success');
        fetchTasks(); // Refetch to get updated list
    } catch (error) {
        console.error(error);
        showToast('Failed to update task.', 'error');
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
            setShownReminders(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (error) {
            console.error(error);
            showToast('Failed to delete task.', 'error');
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
        setTasks(tasks.filter(t => !t.completed || t.repeatDaily));
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
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
        />

        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className={`flex flex-col items-center justify-center gap-4 sm:gap-8 transition-all duration-500 ease-in-out ${isFocusMode ? 'scale-125' : 'scale-100'}`}>
                <FlipClock
                    hours={currentTime.getHours()}
                    minutes={currentTime.getMinutes()}
                    seconds={currentTime.getSeconds()}
                />
                <div className={`transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
                    <DateDisplay date={currentTime} />
                </div>
            </div>
            
            <div className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-8 sm:mt-12 transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
                <button
                    onClick={() => setActiveView(activeView === 'tasks' ? null : 'tasks')}
                    className={`w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${activeView === 'tasks' ? 'bg-blue-600 text-white' : 'bg-white/50 dark:bg-neutral-800/50 text-gray-800 dark:text-gray-200'}`}
                >
                    Daily Tasks
                </button>
                <button
                    onClick={() => setActiveView(activeView === 'stats' ? null : 'stats')}
                    className={`w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${activeView === 'stats' ? 'bg-blue-600 text-white' : 'bg-white/50 dark:bg-neutral-800/50 text-gray-800 dark:text-gray-200'}`}
                >
                    Productivity Stats
                </button>
            </div>

            <div className={`w-full container mx-auto px-2 sm:px-4 mt-8 sm:mt-12 transition-all duration-500 ease-in-out ${isFocusMode || activeView === null ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-full'}`}>
                <div className="flex justify-center">
                    {activeView === 'tasks' && (
                        <TodoList
                            tasks={tasks}
                            exitingTaskIds={exitingTaskIds}
                            isFocusMode={isFocusMode}
                            onAddTask={handleAddTask}
                            onToggleTask={handleToggleTask}
                            onDeleteTask={handleDeleteTask}
                            onClearHistory={handleClearHistory}
                            onUpdateTask={handleUpdateTask}
                        />
                    )}
                    {activeView === 'stats' && (
                        <ProductivityStats tasks={tasks} onViewReport={() => setIsReportModalOpen(true)} />
                    )}
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
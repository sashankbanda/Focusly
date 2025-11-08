import React from 'react';
import { Task } from '../App';

interface ProductivityStatsProps {
  tasks: Task[];
  onViewReport: () => void;
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ tasks, onViewReport }) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tasksCreatedTodayCount = tasks.filter(task => new Date(task.createdAt) >= todayStart).length;

  const tasksCompletedTodayCount = tasks.filter(task => 
    task.completed && task.completionDate && new Date(task.completionDate) >= todayStart
  ).length;

  const progress = tasksCreatedTodayCount > 0 
    ? Math.round((tasksCompletedTodayCount / tasksCreatedTodayCount) * 100)
    : 0;

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1) )); // Monday as start of week
  startOfWeek.setHours(0, 0, 0, 0);

  const tasksThisWeek = tasks.filter(task => {
    const createdDate = new Date(task.createdAt);
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    return createdDate >= startOfWeek || (dueDate && dueDate >= startOfWeek);
  });
  
  const completedThisWeekCount = tasksThisWeek.filter(task => task.completed && task.completionDate && new Date(task.completionDate) >= startOfWeek).length;
  
  const weeklyCompletionPercentage = tasksThisWeek.length > 0 ? Math.round((completedThisWeekCount / tasksThisWeek.length) * 100) : 0;


  const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-neutral-800/50 p-4 rounded-lg shadow-md">
      <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</span>
      <span className="text-xs text-center text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 rounded-2xl shadow-lg bg-gray-200/30 dark:bg-neutral-900/50 backdrop-blur-sm animate-fadeIn">
      <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-300 mb-4 text-center">Productivity Stats</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <StatCard label="Created Today" value={tasksCreatedTodayCount} />
        <StatCard label="Completed Today" value={tasksCompletedTodayCount} />
        <StatCard label="Weekly" value={`${weeklyCompletionPercentage}%`} />
      </div>
      <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Today's Progress</span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={onViewReport}
          className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-neutral-800/60 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-neutral-700/60 transition"
        >
          View Reports
        </button>
      </div>
    </div>
  );
};

export default ProductivityStats;
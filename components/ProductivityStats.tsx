import React, { useState } from 'react';
import { Task } from '../App';

interface ProductivityStatsProps {
  tasks: Task[];
  onViewReport: () => void;
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ tasks, onViewReport }) => {
  const [isIncompleteListOpen, setIsIncompleteListOpen] = useState(false);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const totalTasksCount = tasks.length;
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  const tasksCompletedTodayCount = completedTasks.filter(
    task => task.completionDate && new Date(task.completionDate) >= todayStart
  ).length;

  const completionPercentage = totalTasksCount > 0
    ? Math.round((completedTasks.length / totalTasksCount) * 100)
    : 0;

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
        <StatCard label="Total Tasks" value={totalTasksCount} />
        <StatCard label="Completed Today" value={tasksCompletedTodayCount} />
        <StatCard label="Incomplete" value={incompleteTasks.length} />
      </div>
      <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Overall Progress</span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${completionPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setIsIncompleteListOpen(!isIncompleteListOpen)}
          className="w-full text-left text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
        >
          {isIncompleteListOpen ? 'Hide' : 'Show'} Incomplete Tasks ({incompleteTasks.length})
        </button>
        {isIncompleteListOpen && (
          <div className="mt-2 pl-4 border-l-2 border-neutral-300 dark:border-neutral-600 max-h-40 overflow-y-auto">
            {incompleteTasks.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300">
                {incompleteTasks.map(task => <li key={task.id}>{task.text}</li>)}
              </ul>
            ) : (
              <p className="text-sm italic text-zinc-500">All tasks completed!</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onViewReport}
          className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white/60 dark:bg-neutral-800/60 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-neutral-700/60 transition"
        >
          View Custom Reports
        </button>
      </div>
    </div>
  );
};

export default ProductivityStats;
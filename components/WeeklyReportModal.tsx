import React, { useState, useMemo } from 'react';
import { Task } from '../App';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, tasks }) => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6); // Default to last 7 days
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { groupedTasks, sortedDays, totalCompleted } = useMemo(() => {
    if (!startDate || !endDate) {
      return { groupedTasks: {}, sortedDays: [], totalCompleted: 0 };
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = tasks.filter(task =>
      task.completed && task.completionDate &&
      new Date(task.completionDate) >= start &&
      new Date(task.completionDate) <= end
    );

    const grouped = filtered.reduce((acc, task) => {
      const completionDate = new Date(task.completionDate!).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[completionDate]) {
        acc[completionDate] = [];
      }
      acc[completionDate].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    const sorted = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    return { groupedTasks: grouped, sortedDays: sorted, totalCompleted: filtered.length };
  }, [tasks, startDate, endDate]);

  if (!isOpen) {
    return null;
  }
  
  const inputStyles = "w-full bg-gray-200 dark:bg-neutral-800 text-black dark:text-white px-3 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors z-10"
          aria-label="Close report"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Productivity Report</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-700 pb-6">
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Start Date</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputStyles} />
            </div>
            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">End Date</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputStyles} />
            </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <p className="text-center text-zinc-500 dark:text-zinc-400 mb-6">You've completed <span className="font-bold text-blue-600 dark:text-blue-400">{totalCompleted}</span> tasks in the selected period.</p>

            {sortedDays.length > 0 ? (
              <div className="space-y-6">
                {sortedDays.map(day => (
                  <div key={day}>
                    <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-300 border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-3">{day}</h3>
                    <ul className="space-y-2">
                      {groupedTasks[day].map(task => (
                        <li key={task.id} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="flex-grow">{task.text}</span>
                          {task.tag && <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">{task.tag}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500 italic py-8">No tasks completed in this date range.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

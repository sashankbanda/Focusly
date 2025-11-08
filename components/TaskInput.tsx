
import React, { useState } from 'react';
// FIX: Correctly import Priority type from the parent App component.
import { Priority } from '../App';

interface TaskInputProps {
  onAddTask: (details: { text: string; dueDate?: string; priority?: Priority; tag?: string; reminderEnabled?: boolean; reminderLeadTime?: number }) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [inputValue, setInputValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [tag, setTag] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderLeadTime, setReminderLeadTime] = useState(15); // Default to 15 mins before

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTask();
  };
  
  const submitTask = () => {
    if (inputValue.trim()) {
      let dueDate: string | undefined = undefined;
      if (dateValue) {
        const localDate = new Date(dateValue + 'T' + (timeValue || '00:00:00'));
        dueDate = localDate.toISOString();
      }
      onAddTask({
        text: inputValue.trim(),
        dueDate,
        priority: priority || undefined,
        tag: tag.trim() || undefined,
        reminderEnabled: reminderEnabled && !!dueDate,
        reminderLeadTime: reminderEnabled && !!dueDate ? reminderLeadTime : undefined,
      });
      setInputValue('');
      setDateValue('');
      setTimeValue('');
      setPriority('');
      setTag('');
      setReminderEnabled(false);
      setReminderLeadTime(15);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      submitTask();
    }
  }
  
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone access was denied. Please allow microphone access in your browser settings to use this feature.');
            } else {
                alert(`Voice recognition failed: ${event.error}. Please try again.`);
            }
        };
        recognition.start();
    } else {
        alert('Sorry, your browser does not support voice recognition.');
    }
  };


  const inputStyles = "bg-gray-100 dark:bg-neutral-800 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 px-3 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task... (Ctrl+Enter to add)"
          className={`flex-grow ${inputStyles}`}
          aria-label="New task input"
        />
         <button
          type="button"
          onClick={handleVoiceInput}
          className="bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-zinc-600 dark:text-zinc-300 font-semibold px-3 py-2 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-label="Add task by voice"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 3a1 1 0 11-2 0V4a1 1 0 112 0v3zM4 9a1 1 0 00-1 1v1a5 5 0 005 5h1a5 5 0 005-5v-1a1 1 0 10-2 0v1a3 3 0 01-3 3h-1a3 3 0 01-3-3v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-black transition-all disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed disabled:shadow-none"
          aria-label="Add new task"
          disabled={!inputValue.trim()}
        >
          Add
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
            type="date"
            value={dateValue}
            onChange={e => setDateValue(e.target.value)}
            className={`${inputStyles}`}
            aria-label="Due date"
        />
        <input
            type="time"
            value={timeValue}
            onChange={e => setTimeValue(e.target.value)}
            className={`${inputStyles}`}
            aria-label="Due time"
            disabled={!dateValue}
        />
        <select value={priority} onChange={e => setPriority(e.target.value as Priority | '')} className={`${inputStyles}`} aria-label="Priority">
            <option value="">Priority: Low</option>
            <option value="Medium">Priority: Medium</option>
            <option value="High">Priority: High</option>
        </select>
         <input
            type="text"
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="Tag (e.g., Work)"
            className={`${inputStyles}`}
            aria-label="Task tag"
        />
      </div>
       <div className="flex items-center justify-start pt-1 space-x-4">
          <label className="flex items-center cursor-pointer text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={e => setReminderEnabled(e.target.checked)}
              disabled={!dateValue}
              className="h-4 w-4 rounded bg-gray-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2">Set Reminder</span>
          </label>
          {reminderEnabled && dateValue && (
            <select
              value={reminderLeadTime}
              onChange={e => setReminderLeadTime(Number(e.target.value))}
              className={`${inputStyles} text-sm !py-1 w-auto`}
              aria-label="Reminder time"
            >
              <option value={0}>At time of event</option>
              <option value={5}>5 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          )}
        </div>
    </form>
  );
};

export default TaskInput;

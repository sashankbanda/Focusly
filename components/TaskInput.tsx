import React, { useState } from 'react';
import { Priority } from '../App';

interface TaskInputProps {
  onAddTask: (details: { text: string; dueDate?: string; priority?: Priority; tag?: string; reminderEnabled?: boolean; reminderLeadTime?: number; repeatDaily?: boolean; }) => void;
}

const PREMADE_TAGS = ['Work', 'Self Care', 'Food', 'Assignment'];

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [inputValue, setInputValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [tag, setTag] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderLeadTime, setReminderLeadTime] = useState(15);
  const [repeatDaily, setRepeatDaily] = useState(false); // New state for daily repeat

  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);

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
        repeatDaily,
      });
      setInputValue('');
      setDateValue('');
      setTimeValue('');
      setPriority('');
      setTag('');
      setReminderEnabled(false);
      setReminderLeadTime(15);
      setRepeatDaily(false);
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
            alert(`Voice recognition failed: ${event.error}. Please try again.`);
        };
        recognition.start();
    } else {
        alert('Sorry, your browser does not support voice recognition.');
    }
  };

  const inputStyles = "w-full bg-gray-100 dark:bg-neutral-800 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 px-3 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task... (Ctrl+Enter)"
          className={`flex-grow min-w-0 ${inputStyles}`}
          aria-label="New task input"
        />
        <div className="flex items-center gap-2">
            <button
            type="button"
            onClick={handleVoiceInput}
            className="flex-shrink-0 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-zinc-600 dark:text-zinc-300 font-semibold px-3 py-2 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Add task by voice"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 3a1 1 0 11-2 0V4a1 1 0 112 0v3zM4 9a1 1 0 00-1 1v1a5 5 0 005 5h1a5 5 0 005-5v-1a1 1 0 10-2 0v1a3 3 0 01-3 3h-1a3 3 0 01-3-3v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </button>
            <button
            type="submit"
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-black transition-all disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Add new task"
            disabled={!inputValue.trim()}
            >
            Add
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
            <input
                type={isDateFocused || dateValue ? 'date' : 'text'}
                value={dateValue}
                onFocus={() => setIsDateFocused(true)}
                onBlur={() => setIsDateFocused(false)}
                onChange={e => setDateValue(e.target.value)}
                placeholder="dd-mm-yyyy"
                className={`${inputStyles}`}
                aria-label="Due date"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        <input
            type={isTimeFocused || timeValue ? 'time' : 'text'}
            value={timeValue}
            onFocus={() => setIsTimeFocused(true)}
            onBlur={() => setIsTimeFocused(false)}
            onChange={e => setTimeValue(e.target.value)}
            placeholder="--:--"
            className={`${inputStyles}`}
            aria-label="Due time"
            disabled={!dateValue}
        />
        <select value={priority} onChange={e => setPriority(e.target.value as Priority | '')} className={`${inputStyles}`} aria-label="Priority">
            <option value="">Priority: Low</option>
            <option value="Medium">Priority: Medium</option>
            <option value="High">Priority: High</option>
        </select>
        <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                {PREMADE_TAGS.map(t => (
                    <button type="button" key={t} onClick={() => setTag(t)} className={`px-2 py-1 text-xs rounded-full ${tag === t ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}>{t}</button>
                ))}
            </div>
             <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="Or a custom tag"
                className={`${inputStyles}`}
                aria-label="Task tag"
            />
        </div>
      </div>
       <div className="flex items-center justify-between pt-1">
          <label className="flex items-center cursor-pointer text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={repeatDaily}
              onChange={e => setRepeatDaily(e.target.checked)}
              className="h-4 w-4 rounded bg-gray-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2">Repeat daily</span>
          </label>
          <div className="flex items-center space-x-4">
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
       </div>
    </form>
  );
};

export default TaskInput;
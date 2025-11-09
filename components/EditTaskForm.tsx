import React, { useState } from 'react';
import { Task, Priority } from '../App';

interface EditTaskFormProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onCancel: () => void;
}

const PREMADE_TAGS = ['Work', 'Self Care', 'Food', 'Assignment'];

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onUpdate, onCancel }) => {
  const [text, setText] = useState(task.text);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [priority, setPriority] = useState<Priority>(task.priority || 'Low');
  const [tag, setTag] = useState(task.tag || '');
  const [repeatDaily, setRepeatDaily] = useState(task.repeatDaily || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onUpdate(task.id, {
        text: text.trim(),
        dueDate: dueDate || undefined,
        priority,
        tag: tag.trim() || undefined,
        repeatDaily,
      });
    }
  };

  const inputStyles = "w-full bg-gray-100 dark:bg-neutral-800 text-black dark:text-white placeholder-zinc-500 px-3 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white/70 dark:bg-neutral-800 rounded-lg space-y-3 animate-fadeIn">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={inputStyles}
        aria-label="Edit task title"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={inputStyles}
          aria-label="Edit due date"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputStyles} aria-label="Edit priority">
          <option value="Low">Priority: Low</option>
          <option value="Medium">Priority: Medium</option>
          <option value="High">Priority: High</option>
        </select>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
            {PREMADE_TAGS.map(t => (
                <button type="button" key={t} onClick={() => setTag(t)} className={`px-2 py-1 text-xs rounded-full ${tag === t ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-700'}`}>{t}</button>
            ))}
        </div>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Or custom tag"
          className={inputStyles}
          aria-label="Edit task tag"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`repeat-${task.id}`}
          checked={repeatDaily}
          onChange={(e) => setRepeatDaily(e.target.checked)}
          className="h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
        />
        <label htmlFor={`repeat-${task.id}`} className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">Repeat daily</label>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Save</button>
      </div>
    </form>
  );
};

export default EditTaskForm;
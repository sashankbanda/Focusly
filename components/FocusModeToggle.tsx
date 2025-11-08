import React from 'react';

interface FocusModeToggleProps {
  isFocusMode: boolean;
  setIsFocusMode: (isFocus: boolean) => void;
}

const FocusModeToggle: React.FC<FocusModeToggleProps> = ({ isFocusMode, setIsFocusMode }) => {
  return (
    <button
      onClick={() => setIsFocusMode(!isFocusMode)}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/50 dark:bg-neutral-800/50 text-gray-800 dark:text-gray-200 shadow-md backdrop-blur-sm hover:scale-110 transition-transform"
      aria-label="Toggle Focus Mode"
    >
      {isFocusMode ? (
        // Eye slash icon for "Exit Focus Mode"
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
      ) : (
        // Eye icon for "Enter Focus Mode"
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C3.732 4.943 7.523 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-7.03 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default FocusModeToggle;
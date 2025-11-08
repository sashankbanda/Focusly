import React from 'react';
import firebase from 'firebase/compat/app';

interface SidebarProps {
  user: firebase.User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isFocusMode: boolean;
  setIsFocusMode: (isFocus: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogout,
  theme,
  setTheme,
  isFocusMode,
  setIsFocusMode,
  isOpen,
  setIsOpen,
}) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/50 dark:bg-neutral-800/50 text-gray-800 dark:text-gray-200 shadow-md backdrop-blur-sm hover:scale-110 transition-transform"
        aria-label="Toggle Sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 p-6`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            {user.photoURL && (
              <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
            )}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.displayName}</span>
          </div>

          <nav className="flex flex-col space-y-4 text-lg text-zinc-800 dark:text-zinc-200">
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
            >
              {isFocusMode ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C3.732 4.943 7.523 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-7.03 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
              <span>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </nav>

          <button
            onClick={onLogout}
            className="mt-auto flex items-center justify-center gap-3 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
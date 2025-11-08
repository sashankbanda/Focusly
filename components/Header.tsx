
import React from 'react';
// FIX: Use firebase/compat/app to get the v8-compatible User type.
import firebase from 'firebase/compat/app';

interface HeaderProps {
    user: firebase.User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-md">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    {user.photoURL && (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                    )}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 hidden sm:block">{user.displayName}</span>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-black transition-all"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;

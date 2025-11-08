import React from 'react';
import { auth, googleProvider } from '../firebase';

const LoginPage: React.FC = () => {
    const handleGoogleSignIn = async () => {
        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-gray-800 dark:text-white antialiased transition-colors duration-300">
            {/* Container to center content and set a max-width for readability */}
            <div className="text-center max-w-md w-full animate-fadeIn">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    Productivity Hub
                </h1>
                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 mb-8">
                    Sign in to manage your tasks and time.
                </p>
                <button
                    onClick={handleGoogleSignIn}
                    // Using inline-flex to make the button width fit its content
                    className="inline-flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 text-black dark:text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-black transition-all hover:scale-105"
                >
                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M24 9.5c3.9 0 6.9 1.6 9.2 3.8l6.9-6.9C35.9 2.5 30.4 0 24 0 14.5 0 6.5 5.5 2.8 13.5l7.7 6C12.3 13.2 17.7 9.5 24 9.5z"></path>
                        <path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.4-.5-5H24v9.3h12.5c-.5 3-2.1 5.6-4.6 7.3l7.3 5.7c4.3-4 6.5-10 6.5-17.3z"></path>
                        <path fill="#FBBC05" d="M10.5 28.5c-.7-2.1-.7-4.4 0-6.5l-7.7-6C.9 19.9 0 23.9 0 28.5s.9 8.6 2.8 12.5l7.7-6c-.7-2.1-.7-4.4 0-6.5z"></path>
                        <path fill="#EA4335" d="M24 48c6.4 0 11.9-2.1 15.9-5.7l-7.3-5.7c-2.1 1.4-4.8 2.2-7.6 2.2-6.3 0-11.7-3.7-13.7-9l-7.7 6C6.5 42.5 14.5 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
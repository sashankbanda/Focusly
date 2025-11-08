
// FIX: Add a reference to Vite's client types to provide type definitions for `import.meta.env`.
/// <reference types="vite/client" />

// FIX: Updated Firebase imports for v9 with compat layer.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check for missing Firebase configuration
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  // Render a user-friendly error message on the page
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: sans-serif; padding: 2rem; text-align: center; color: #dc2626; background-color: #fef2f2; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Firebase Configuration Error</h1>
        <p style="margin-top: 1rem;">The Firebase configuration is missing or invalid. Please ensure that your environment variables (VITE_FIREBASE_*) are set up correctly in your .env file.</p>
        <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #991b1b;">This error is often caused by a missing <code>.env</code> file or incorrect variable names.</p>
      </div>
    `;
  }
  // Also throw an error to stop execution and log to console
  throw new Error("Firebase configuration is missing. Please check your environment variables.");
}

// FIX: Changed to Firebase v8 compatible initialization
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider };
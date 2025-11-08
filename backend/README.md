# Productivity App Backend

This folder contains the Node.js, Express, and MongoDB backend for the productivity application. It handles user authentication verification and provides a RESTful API for task management.

## Features

-   **Secure API:** Endpoints are protected using Firebase ID token verification.
-   **CRUD for Tasks:** Full create, read, update, and delete functionality for tasks.
-   **MongoDB Integration:** Uses Mongoose for elegant data modeling and connection to MongoDB Atlas.
-   **Production Ready:** Includes environment variable management, CORS, and rate-limiting.

---

## Environment Setup

Before running the backend, you need to set up environment variables for both the frontend and the backend.

### 1. Backend `.env` Setup

1.  Navigate to the `backend` directory.
2.  Create a file named `.env`.
3.  Copy the contents of `.env.example` into your new `.env` file.
4.  Fill in the values for each variable:

```env
# MongoDB Atlas Connection String
# Example: mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
MONGODB_URI=

# Server Port (5000 is the default)
PORT=5000

# Frontend URL (for CORS security)
# Use your frontend development server URL
FRONTEND_ORIGIN=http://localhost:5173

# --- Firebase Admin SDK Service Account Credentials ---
# 1. Go to your Firebase Project Settings > Service accounts.
# 2. Click "Generate new private key". A JSON file will be downloaded.
# 3. Open the JSON file and copy the values into the variables below.
#
# IMPORTANT for FIREBASE_PRIVATE_KEY:
# The private key in the JSON file has newline characters (\n).
# You must copy the key exactly as it is and wrap it in double quotes ("") in your .env file
# to preserve these newlines.

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### 2. Frontend `.env.local` Setup

The frontend also requires environment variables for the Firebase client-side SDK.

1.  Navigate to the root directory of the project (outside of `backend`).
2.  Create a file named `.env.local`.
3.  Add the following variables, replacing the values with your Firebase project's web app credentials. You can find these in your **Firebase Project Settings > General > Your apps > Web app**.

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

---

## Installation and Running

Make sure you have [Node.js](https://nodejs.org/) installed.

1.  **Install Dependencies:**
    Open a terminal in the `backend` directory and run:
    ```bash
    npm install
    ```

2.  **Run in Development Mode:**
    This will start the server using `nodemon`, which automatically restarts on file changes.
    ```bash
    npm start
    ```
    The server should now be running on the port specified in your `.env` file (e.g., `http://localhost:5000`).

3.  **Run in Production Mode:**
    This runs the server directly with `node`.
    ```bash
    npm run start:prod
    ```

# Full-Stack Productivity Hub

This is a modern, full-stack productivity web application built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Firebase for authentication. It features a sleek digital clock and a powerful to-do list designed to help users manage their time and tasks efficiently.

## Features

-   **Secure Google Sign-In:** Authentication handled by Firebase.
-   **Full-Stack CRUD:** Tasks are created, read, updated, and deleted from a MongoDB database.
-   **Advanced Task Management:** Includes priorities, tags, scheduling, and proactive reminders.
-   **Cloud Sync:** All data is securely stored in the cloud and synced across sessions.
-   **Productivity Stats:** Visual panel with daily/weekly progress and custom reports.
-   **Focus Mode:** A distraction-free UI mode to concentrate on active tasks.
-   **Light/Dark Theme:** Supports theme switching and respects system preference.
-   **Responsive Design:** Looks great on both desktop and mobile devices.

---

## Tech Stack

-   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS
-   **Backend:** Node.js, Express, Mongoose
-   **Database:** MongoDB Atlas
-   **Authentication:** Firebase Authentication (Google Sign-In)

---

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [Git](https://git-scm.com/)
-   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier is sufficient)
-   A [Firebase](https://firebase.google.com/) project

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Backend Setup (`backend/.env`)

1.  Navigate to the `backend` directory.
2.  Create a file named `.env` and copy the contents from `backend/.env.example`.
3.  Fill in the values:
    -   `MONGODB_URI`: Your MongoDB Atlas connection string.
    -   `PORT`: The port for the backend server (default is `5000`).
    -   `FRONTEND_ORIGIN`: The URL of your frontend app (e.g., `http://localhost:5173` for local development).
    -   `FIREBASE_*` variables: Go to **Firebase Project Settings > Service accounts**, generate a new private key, and copy the `project_id`, `client_email`, and `private_key` from the downloaded JSON file. **Important:** Wrap the `FIREBASE_PRIVATE_KEY` in double quotes (`""`) in your `.env` file to preserve formatting.

### 3. Frontend Setup (`.env`)

1.  Navigate to the **root** directory of the project.
2.  Create a file named `.env` and copy the contents from `.env.example`.
3.  Fill in the values from your **Firebase Project Settings > General > Your apps > Web app**.
    -   `VITE_API_BASE_URL`: The full URL of your backend server (e.g., `http://localhost:5000`).
    -   `VITE_FIREBASE_*` variables: Your Firebase web app's client-side configuration.

---

## Running Locally

1.  **Install All Dependencies:**
    From the **root** directory, run:
    ```bash
    npm install
    npm install --prefix backend
    ```

2.  **Start the Backend Server:**
    Open a terminal and run from the **root** directory:
    ```bash
    npm run start:backend
    ```

3.  **Start the Frontend Development Server:**
    Open a **second** terminal and run from the **root** directory:
    ```bash
    npm run start:frontend
    ```
    Your application should now be running at `http://localhost:5173`.

---

## Deployment

### Backend (e.g., on Render)

1.  Create a new **Web Service** on Render and connect your Git repository.
2.  **Build Command:** `npm install`
3.  **Start Command:** `npm run start:prod`
4.  **Environment Variables:** Add all the variables from your `backend/.env` file to the Render service's environment settings. Set `FRONTEND_ORIGIN` to your deployed frontend URL.

### Frontend (e.g., on Vercel)

1.  Create a new project on Vercel and connect your Git repository.
2.  **Build Command:** `npm run build` (or `vite build`)
3.  **Output Directory:** `dist`
4.  **Environment Variables:** Add all the variables from your root `.env` file (the ones prefixed with `VITE_`). Set `VITE_API_BASE_URL` to your deployed backend's URL.
5.  Deploy!

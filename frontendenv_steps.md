# How to Get Firebase Config Variables for Vite

Follow these steps to obtain the Firebase config variables needed for your Vite environment variables (`.env` file).

---

## Step 1: Go to Firebase Console

- Open [Firebase Console](https://console.firebase.google.com/)
- Sign in with your Google account

---

## Step 2: Select or Create a Firebase Project

- Choose an existing project or click **Add project** to create a new one
- Follow the prompts to set up your project if creating new

---

## Step 3: Open Project Settings

- In the Firebase Console, click the gear icon ⚙️ next to **Project Overview** in the left sidebar
- Click **Project settings**

---

## Step 4: Add a Web App (if not added)

- Scroll down to the **Your apps** section
- Click the **"</>" (Web)** icon to add a web app
- Enter an app nickname (e.g., "MyViteApp")
- Optionally enable Firebase Hosting
- Click **Register app**

---

## Step 5: Locate Your Firebase SDK Config

- After registering your web app, you will see the Firebase SDK configuration object
- It looks like this:
```
const firebaseConfig = {
apiKey: "AIzaSy****",
authDomain: "yourapp.firebaseapp.com",
projectId: "yourapp",
storageBucket: "yourapp.appspot.com",
messagingSenderId: "****",
appId: "1:eb:**",
measurementId: "G-" // optional if Analytics enabled
};
```

---

## Step 6: Copy Config Variables to Your `.env` File

Create or open your `.env` file in the root of your Vite project and add the following with the prefix `VITE_`:

```
VITE_FIREBASE_API_KEY=AIzaSy****
VITE_FIREBASE_AUTH_DOMAIN=yourapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourapp
VITE_FIREBASE_STORAGE_BUCKET=yourapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=****
VITE_FIREBASE_APP_ID=1:eb:
VITE_FIREBASE_MEASUREMENT_ID=G-** # Optional
VITE_API_BASE_URL=http://localhost:5000
```

---

## Step 7: Use Env Variables in Vite

Access these variables in your app with:

```
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

---

# Summary

- Go to Firebase Console and select/create project
- Add a web app and get config
- Copy config keys to `.env` file with `VITE_` prefix
- Use `import.meta.env.VITE_*` in your Vite app

This setup securely injects Firebase config variables into your Vite app.
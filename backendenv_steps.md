# How to Get MongoDB URI and Firebase Service Account Credentials

This guide provides step-by-step instructions on how to obtain the necessary credentials for configuring your backend environment variables, specifically for MongoDB Atlas and Firebase Admin SDK access.

## MongoDB URI (`MONGODB_URI`)

To connect your application to your MongoDB Atlas cluster:

1.  Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in to your account.
2.  Select the cluster you intend to connect to, or create a new one if you haven't already.
3.  On your cluster dashboard, click the **Connect** button.
4.  Choose the **Connect your application** option.
5.  Copy the connection string provided under **Connection String Only**.
6.  Remember to replace the `<username>` and `<password>` placeholders in the copied string with the actual credentials of your MongoDB database user.

**Example Connection String Format:**

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/todo
```

## Backend Port (`PORT`)

This environment variable specifies the port number on which your backend server will listen for incoming requests.

-   Set this value to your desired port, for example, `5000`.
-   This configuration is typically handled within your server setup (e.g., an Express.js application).

## Firebase Project ID (`FIREBASE_PROJECT_ID`)

To identify your Firebase project:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your specific Firebase project.
3.  In the **Project Overview** section, locate your Project ID. It is usually displayed beneath your project name.
    -   This ID is a unique string, often similar to `yourapp`.

## Firebase Service Account Email and Private Key (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)

To authenticate your backend server with Firebase using the Firebase Admin SDK:

1.  Access your project within the Firebase Console.
2.  Click the gear icon ⚙️ next to **Project Overview** and select **Project settings**.
3.  Navigate to the **Service accounts** tab.
4.  Within the **Firebase Admin SDK** section, click **Generate new private key**. This action will download a JSON file to your computer.
5.  Open the downloaded JSON file. You will find two key pieces of information:
    -   `client_email` — Use this value for the `FIREBASE_CLIENT_EMAIL` environment variable.
    -   `private_key` — Use this entire string for the `FIREBASE_PRIVATE_KEY` environment variable. It is crucial to keep all newlines (`\n`) exactly as they appear in the JSON file.

**Example Environment Variable Setup:**

```bash
FIREBASE_CLIENT_EMAIL=your-service-account@yourapp.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Summary of Environment Variables Example

Here's a consolidated example of how your environment variables might look:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo
PORT=5000
FIREBASE_PROJECT_ID=yourapp
FIREBASE_CLIENT_EMAIL=your-service-account@yourapp.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

**Important Security Note:** Keep your private key (`FIREBASE_PRIVATE_KEY`) secure and **never** share it publicly or commit it to version control systems.
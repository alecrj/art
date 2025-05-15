import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration - VERIFIED VALUES
const firebaseConfig = {
  apiKey: "AIzaSyD_6zJoJWjIzQ-_3WjgCNlIOs_NM0t4yDs",
  authDomain: "artapp-2a501.firebaseapp.com",
  projectId: "artapp-2a501",
  storageBucket: "artapp-2a501.firebasestorage.app",
  messagingSenderId: "404812700240",
  appId: "1:404812700240:web:1f0876f167837e59eacf55",
  measurementId: "G-FCGWQZLHTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;
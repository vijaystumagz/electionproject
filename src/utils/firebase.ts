import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// All keys loaded from environment variables — never hardcoded
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let db: Firestore | null = null;

const isConfigValid = Object.values(firebaseConfig).every(
  (val) => val && !val.includes('PLACEHOLDER') && !val.includes('YOUR_')
);

if (isConfigValid) {
  try {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
  }
} else {
  console.info('[Firebase] Running with placeholder config. Firestore writes are disabled.');
}

/**
 * Submits user feedback to the Firestore 'feedback' collection.
 * @param feedbackText - Sanitized feedback string from user.
 * @returns True if write succeeded, false otherwise.
 */
export const submitFeedback = async (feedbackText: string): Promise<boolean> => {
  if (!db) {
    console.warn('[Firestore] Database not initialized.');
    return false;
  }

  try {
    // 1. Save to Firestore (Primary Storage)
    await addDoc(collection(db, 'feedback'), {
      text: feedbackText,
      createdAt: serverTimestamp(),
    });

    // 2. Stream to BigQuery via Proxy (Optional/Free Tier Alternative)
    const proxyUrl = import.meta.env.VITE_ANALYTICS_PROXY_URL;
    if (proxyUrl) {
      fetch(proxyUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple redirects
        body: JSON.stringify({ text: feedbackText }),
      }).catch(err => console.error('[Analytics] Proxy error:', err));
    }

    return true;
  } catch (error) {
    console.error('[Firestore] Write error:', error);
    return false;
  }
};

export { db };

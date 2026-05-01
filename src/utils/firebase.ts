/**
 * @file firebase.ts
 * @description Configuration and interaction methods for Firebase services (Firestore).
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

/**
 * Interface representing the required Firebase configuration keys.
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// All keys loaded from environment variables — never hardcoded in source.
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let db: Firestore | null = null;

/**
 * Validates if the configuration contains actual keys or just placeholders.
 */
const isConfigValid = Object.values(firebaseConfig).every(
  (val) => val && !val.includes('PLACEHOLDER') && !val.includes('YOUR_')
);

if (isConfigValid) {
  try {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Initialize App Check to prevent unauthorized API access
    if (typeof window !== 'undefined' && import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      });
      console.info('[Firebase] App Check initialized.');
    }
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
  }
} else {
  console.info('[Firebase] Running with placeholder config. Firestore writes are disabled.');
}

/**
 * Submits user feedback to the Firestore 'feedback' collection and optional analytics proxy.
 * 
 * @param {string} feedbackText - The sanitized feedback string from the user.
 * @returns {Promise<boolean>} - True if the write operation succeeded, false otherwise.
 */
export const submitFeedback = async (feedbackText: string): Promise<boolean> => {
  if (!db) {
    console.warn('[Firestore] Database not initialized.');
    return false;
  }

  try {
    // 1. Save to Firestore (Primary persistent storage)
    await addDoc(collection(db, 'feedback'), {
      text: feedbackText,
      createdAt: serverTimestamp(),
    });

    // 2. Stream to BigQuery via Analytics Proxy (Optional/Free-tier bridge)
    const proxyUrl = import.meta.env.VITE_ANALYTICS_PROXY_URL;
    if (proxyUrl) {
      fetch(proxyUrl, {
        method: 'POST',
        mode: 'no-cors', // Essential for Apps Script simple redirects
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

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Server-side Firebase (Admin SDK).
 *
 * All reads/writes go through our own API routes, so Firestore & Storage
 * security rules can stay fully locked ("allow read, write: if false").
 *
 * Required environment variables (set them in Vercel → Project → Settings → Environment Variables):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY        (the full "-----BEGIN PRIVATE KEY-----..." string)
 *   FIREBASE_STORAGE_BUCKET     (e.g. "your-project.firebasestorage.app")
 */

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  if (!isFirebaseConfigured()) {
    throw new Error("Firebase Admin is not configured. Set FIREBASE_* environment variables.");
  }

  // Vercel stores multi-line values with literal "\n" — convert them back to real newlines.
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export function getDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getBucket() {
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error("FIREBASE_STORAGE_BUCKET is not set.");
  }
  return getStorage(getAdminApp()).bucket(process.env.FIREBASE_STORAGE_BUCKET);
}

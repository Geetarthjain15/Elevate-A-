import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export let isFirebaseAdminConfigured = false;

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Check if real Firebase credentials are provided
  if (
    !projectId ||
    !clientEmail ||
    !privateKey ||
    projectId.startsWith("mock") ||
    clientEmail.startsWith("mock")
  ) {
    console.warn(
      "⚠️  Firebase Admin credentials not configured. Running in DEMO mode."
    );
    return { auth: null as any, db: null as any };
  }

  try {
    const apps = getApps();

    if (!apps.length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    }

    isFirebaseAdminConfigured = true;
    return {
      auth: getAuth(),
      db: getFirestore(),
    };
  } catch (error) {
    console.warn(
      "⚠️  Firebase Admin failed to initialize. Running in DEMO mode.",
      error
    );
    return { auth: null as any, db: null as any };
  }
}

export const { auth, db } = initFirebaseAdmin();

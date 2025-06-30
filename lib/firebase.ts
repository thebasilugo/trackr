import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Validate Firebase configuration
const isValidConfig = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  return requiredFields.every(
    (field) =>
      firebaseConfig[field as keyof typeof firebaseConfig] &&
      firebaseConfig[field as keyof typeof firebaseConfig] !== `demo-${field.toLowerCase().replace("_", "-")}`,
  )
}

// Initialize Firebase app (singleton pattern)
const initializeFirebaseApp = () => {
  try {
    // Check if Firebase app is already initialized
    if (getApps().length > 0) {
      return getApp()
    }

    return initializeApp(firebaseConfig)
  } catch (error) {
    console.error("Failed to initialize Firebase app:", error)
    throw new Error("Firebase initialization failed")
  }
}

// Initialize services with error handling
let app: ReturnType<typeof initializeFirebaseApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null

export const initializeFirebaseServices = async () => {
  try {
    // Initialize app
    app = initializeFirebaseApp()

    // Initialize Auth
    auth = getAuth(app)

    // Initialize Firestore with retry logic
    db = getFirestore(app)

    // Connect to emulators in development
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      try {
        // Only connect to emulators if not already connected
        if (!auth._delegate._config?.emulator) {
          connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
        }
        if (!db._delegate._databaseId.projectId.includes("localhost")) {
          connectFirestoreEmulator(db, "localhost", 8080)
        }
      } catch (emulatorError) {
        console.warn("Could not connect to Firebase emulators:", emulatorError)
      }
    }

    return { app, auth, db }
  } catch (error) {
    console.error("Failed to initialize Firebase services:", error)
    return { app: null, auth: null, db: null }
  }
}

// Export getters with lazy initialization
export const getFirebaseApp = () => {
  if (!app) {
    throw new Error("Firebase app not initialized. Call initializeFirebaseServices first.")
  }
  return app
}

export const getFirebaseAuth = () => {
  if (!auth) {
    throw new Error("Firebase auth not initialized. Call initializeFirebaseServices first.")
  }
  return auth
}

export const getFirebaseDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Call initializeFirebaseServices first.")
  }
  return db
}

// Network management utilities
export const enableFirestoreNetwork = async () => {
  try {
    if (db) {
      await enableNetwork(db)
    }
  } catch (error) {
    console.error("Failed to enable Firestore network:", error)
  }
}

export const disableFirestoreNetwork = async () => {
  try {
    if (db) {
      await disableNetwork(db)
    }
  } catch (error) {
    console.error("Failed to disable Firestore network:", error)
  }
}

// Configuration validation
export const isFirebaseConfigured = () => {
  return isValidConfig()
}

// Service availability check
export const checkFirebaseServices = async () => {
  const services = {
    app: !!app,
    auth: !!auth,
    firestore: !!db,
    configured: isValidConfig(),
  }

  return services
}

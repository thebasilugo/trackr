"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { doc, setDoc, getDoc, enableIndexedDbPersistence } from "firebase/firestore"
import type { LearningPath } from "@/types"
import { useToast } from "@/hooks/use-toast"
import {
  initializeFirebaseServices,
  getFirebaseDb,
  checkFirebaseServices,
  enableFirestoreNetwork,
  disableFirestoreNetwork,
} from "@/lib/firebase"

interface FirebaseContextType {
  isOnline: boolean
  isFirebaseAvailable: boolean
  syncData: (paths: LearningPath[]) => Promise<void>
  loadData: () => Promise<LearningPath[]>
  isAuthenticated: boolean
  retryConnection: () => Promise<void>
  firebaseStatus: {
    app: boolean
    auth: boolean
    firestore: boolean
    configured: boolean
  }
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [firebaseStatus, setFirebaseStatus] = useState({
    app: false,
    auth: false,
    firestore: false,
    configured: false,
  })
  const [initializationAttempts, setInitializationAttempts] = useState(0)
  const { toast } = useToast()

  // Exponential backoff for retries
  const getRetryDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 30000)

  // Initialize Firebase with retry logic
  const initializeFirebase = useCallback(
    async (attempt = 0) => {
      try {
        console.log(`Initializing Firebase (attempt ${attempt + 1})...`)

        const services = await initializeFirebaseServices()
        const status = await checkFirebaseServices()

        setFirebaseStatus(status)

        if (services.auth && services.db) {
          setIsFirebaseAvailable(true)

          // Enable offline persistence for Firestore
          try {
            await enableIndexedDbPersistence(services.db)
            console.log("Firestore offline persistence enabled")
          } catch (persistenceError: any) {
            if (persistenceError.code === "failed-precondition") {
              console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time")
            } else if (persistenceError.code === "unimplemented") {
              console.warn("The current browser doesn't support persistence")
            }
          }

          // Set up auth state listener
          const unsubscribe = onAuthStateChanged(services.auth, async (user) => {
            if (user) {
              setUserId(user.uid)
              setIsAuthenticated(true)
              console.log("User authenticated:", user.uid)
            } else {
              try {
                console.log("Signing in anonymously...")
                const userCredential = await signInAnonymously(services.auth!)
                setUserId(userCredential.user.uid)
                setIsAuthenticated(true)
                console.log("Anonymous sign-in successful:", userCredential.user.uid)
              } catch (authError) {
                console.error("Anonymous auth failed:", authError)
                // Fallback to demo user
                const demoUserId = `demo-user-${Date.now()}`
                setUserId(demoUserId)
                setIsAuthenticated(true)
                console.log("Using demo user:", demoUserId)
              }
            }
          })

          return unsubscribe
        } else {
          throw new Error("Failed to initialize Firebase services")
        }
      } catch (error) {
        console.error(`Firebase initialization attempt ${attempt + 1} failed:`, error)
        setIsFirebaseAvailable(false)

        // Retry with exponential backoff
        if (attempt < 3) {
          const delay = getRetryDelay(attempt)
          console.log(`Retrying Firebase initialization in ${delay}ms...`)
          setTimeout(() => {
            setInitializationAttempts(attempt + 1)
            initializeFirebase(attempt + 1)
          }, delay)
        } else {
          console.error("Max Firebase initialization attempts reached")
          toast({
            title: "Firebase Connection Failed",
            description: "Using offline mode. Some features may be limited.",
            variant: "destructive",
          })

          // Fallback to demo user for offline mode
          const demoUserId = `offline-user-${Date.now()}`
          setUserId(demoUserId)
          setIsAuthenticated(true)
        }

        return null
      }
    },
    [toast],
  )

  // Retry connection manually
  const retryConnection = useCallback(async () => {
    setInitializationAttempts(0)
    await initializeFirebase(0)
  }, [initializeFirebase])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    // Initialize Firebase
    initializeFirebase().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub
      }
    })

    // Monitor online status
    const handleOnline = async () => {
      setIsOnline(true)
      if (isFirebaseAvailable) {
        await enableFirestoreNetwork()
      }
      toast({
        title: "Back online",
        description: "Your data will sync automatically.",
      })
    }

    const handleOffline = async () => {
      setIsOnline(false)
      if (isFirebaseAvailable) {
        await disableFirestoreNetwork()
      }
      toast({
        title: "You're offline",
        description: "Changes will sync when you're back online.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [initializeFirebase, isFirebaseAvailable, toast])

  const syncData = async (paths: LearningPath[]) => {
    // Always store in localStorage first (offline-first approach)
    try {
      localStorage.setItem("trackr-paths", JSON.stringify(paths))
      localStorage.setItem("trackr-last-sync", new Date().toISOString())
    } catch (storageError) {
      console.error("Failed to save to localStorage:", storageError)
      toast({
        title: "Storage Error",
        description: "Failed to save data locally. Please check your browser storage.",
        variant: "destructive",
      })
      return
    }

    // Sync to Firebase if available and online
    if (!isFirebaseAvailable || !userId || !isOnline) {
      return
    }

    try {
      const db = getFirebaseDb()
      await setDoc(
        doc(db, "users", userId),
        {
          paths,
          lastUpdated: new Date().toISOString(),
          version: "1.0.0",
        },
        { merge: true },
      )

      console.log("Data synced to Firebase successfully")
    } catch (error: any) {
      console.error("Sync to Firebase failed:", error)

      // Handle specific Firebase errors
      if (error.code === "permission-denied") {
        toast({
          title: "Sync Failed",
          description: "Permission denied. Please check your Firebase rules.",
          variant: "destructive",
        })
      } else if (error.code === "unavailable") {
        toast({
          title: "Sync Failed",
          description: "Firebase is temporarily unavailable. Data saved locally.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sync Failed",
          description: "Data saved locally and will sync when connection is restored.",
          variant: "destructive",
        })
      }
    }
  }

  const loadData = async (): Promise<LearningPath[]> => {
    // Always try localStorage first for faster loading
    let localPaths: LearningPath[] = []

    try {
      const localData = localStorage.getItem("trackr-paths")
      if (localData) {
        localPaths = JSON.parse(localData)
      }
    } catch (storageError) {
      console.error("Failed to load from localStorage:", storageError)
    }

    // If Firebase is not available or we're offline, return local data
    if (!isFirebaseAvailable || !userId || !isOnline) {
      return localPaths
    }

    try {
      const db = getFirebaseDb()
      const docRef = doc(db, "users", userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const cloudData = docSnap.data()
        const cloudPaths = cloudData.paths || []

        // Simple conflict resolution: use the data with the most recent update
        const localLastSync = localStorage.getItem("trackr-last-sync")
        const cloudLastUpdated = cloudData.lastUpdated

        if (cloudLastUpdated && (!localLastSync || new Date(cloudLastUpdated) > new Date(localLastSync))) {
          try {
            localStorage.setItem("trackr-paths", JSON.stringify(cloudPaths))
            localStorage.setItem("trackr-last-sync", cloudLastUpdated)
            console.log("Loaded data from Firebase and updated local storage")
            return cloudPaths
          } catch (storageError) {
            console.error("Failed to update localStorage with cloud data:", storageError)
          }
        }
      }
    } catch (error: any) {
      console.error("Load from Firebase failed:", error)

      if (error.code === "permission-denied") {
        toast({
          title: "Load Failed",
          description: "Permission denied. Using local data.",
          variant: "destructive",
        })
      }
    }

    return localPaths
  }

  return (
    <FirebaseContext.Provider
      value={{
        isOnline,
        isFirebaseAvailable,
        syncData,
        loadData,
        isAuthenticated,
        retryConnection,
        firebaseStatus,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

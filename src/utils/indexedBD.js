import { openDB } from "idb";

const DB_NAME = "QuizDB";
const DB_VERSION = 1;
const STORE_HISTORY = "quizHistory";
const STORE_CURRENT_SESSION = "currentSession";

// Initialize IndexedDB
const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_HISTORY)) {
                db.createObjectStore(STORE_HISTORY, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(STORE_CURRENT_SESSION)) {
                db.createObjectStore(STORE_CURRENT_SESSION, { keyPath: "id" });
            }
        },
    });
};

// Save Quiz Attempt
export const saveQuizAttempt = async (attempt) => {
    const db = await initDB();
    const tx = db.transaction(STORE_HISTORY, "readwrite");
    await tx.objectStore(STORE_HISTORY).add(attempt);
    await tx.done;
    
    // Clear current session when a quiz is completed
    await clearCurrentSession();
};

// Fetch Quiz Attempts
export const getQuizAttempts = async () => {
    const db = await initDB();
    return db.getAll(STORE_HISTORY);
};

// Clear Quiz History
export const clearQuizHistory = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_HISTORY, "readwrite");
    await tx.objectStore(STORE_HISTORY).clear();
    await tx.done;
};

// Save Current Quiz Session
export const saveCurrentSession = async (sessionData) => {
    const db = await initDB();
    const tx = db.transaction(STORE_CURRENT_SESSION, "readwrite");
    
    // Always use id=1 to maintain a single current session
    const session = {...sessionData, id: 1, lastUpdated: new Date().toISOString()};
    await tx.objectStore(STORE_CURRENT_SESSION).put(session);
    await tx.done;
};

// Get Current Quiz Session
export const getCurrentSession = async () => {
    const db = await initDB();
    try {
        return db.get(STORE_CURRENT_SESSION, 1);
    } catch (error) {
        console.error("Failed to retrieve quiz session:", error);
        return null;
    }
};

// Clear Current Session
export const clearCurrentSession = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_CURRENT_SESSION, "readwrite");
    await tx.objectStore(STORE_CURRENT_SESSION).delete(1);
    await tx.done;
};

// Check if there's an active session
export const hasActiveSession = async () => {
    const session = await getCurrentSession();
    return session !== undefined && session !== null;
};
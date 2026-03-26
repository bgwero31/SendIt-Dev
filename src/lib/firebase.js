import { initializeApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

/*
  🧠 Using NEW Firebase project (jetx-predictor)
  Realtime Database only
*/

const firebaseConfig = {
  apiKey: "AIzaSyB7BV6jQf1QAgrihNIWIo0Yf1BnJIOPVKg",
  authDomain: "jetx-predictor-8deac.firebaseapp.com",
  databaseURL: "https://jetx-predictor-8deac-default-rtdb.firebaseio.com",
  projectId: "jetx-predictor-8deac",
  storageBucket: "jetx-predictor-8deac.firebasestorage.app",
  messagingSenderId: "696880972185",
  appId: "1:696880972185:web:d2c466d3038c50932b9308"
}

/*
  🔥 Prevent multiple initialization (Next.js safe)
*/
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0]

export { app }

/* ✅ Realtime Database */
export const db = getDatabase(app)

/* ✅ Authentication */
export const auth = getAuth(app)

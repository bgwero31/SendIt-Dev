import { initializeApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
import { getMessaging, isSupported } from "firebase/messaging"

/*
  🧠 Realtime Database only
  No Firestore anywhere in the project
*/

const firebaseConfig = {
  apiKey: "AIzaSyD7K7snV0HJfnW7PDZdlRjBc70Wq5uvPv0",
  authDomain: "sendit-16cbe.firebaseapp.com",
  databaseURL: "https://sendit-16cbe-default-rtdb.firebaseio.com",
  projectId: "sendit-16cbe",
  storageBucket: "sendit-16cbe.appspot.com",
  messagingSenderId: "594550385469",
  appId: "1:594550385469:web:0d287f28af74249c8ef354"
}

/*
  🔥 Prevents Next.js hot-reload double initialization crashes
*/
const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig)

export { app }

/* ✅ Realtime Database */
export const db = getDatabase(app)

/* ✅ Authentication */
export const auth = getAuth(app)

/* ✅ Messaging (only if supported) */
export const messaging = async () => {
  if (await isSupported()) {
    return getMessaging(app)
  }
  return null
}

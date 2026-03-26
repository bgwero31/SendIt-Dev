import admin from "firebase-admin"

if (!admin.apps.length) {

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://jetx-purple-default-rtdb.firebaseio.com"
  })

}

export const db = admin.database()

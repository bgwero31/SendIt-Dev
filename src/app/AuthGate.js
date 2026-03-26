'use client'

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter, usePathname } from "next/navigation"
import { auth, db } from "../lib/firebase"
import { ref, update, get } from "firebase/database"

export default function AuthGate({ children }) {
  const router = useRouter()
  const path = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {

    let goOffline = null
    let handleVisibility = null

    const unsub = onAuthStateChanged(auth, async user => {

      if (!user && path !== "/login") {
        router.replace("/login")
        return
      }

      if (user && path === "/login") {
        router.replace("/")
      }

      if (user) {
        const uid = user.uid
        const userRef = ref(db, `users/${uid}`)

        try {
          const snap = await get(userRef)

          // ✅ ONLY update if profile exists
          if (snap.exists()) {

            await update(userRef, {
              online: true,
              lastSeen: Date.now()
            })

            goOffline = () => {
              update(userRef, {
                online: false,
                lastSeen: Date.now()
              })
            }

            handleVisibility = () => {
              if (document.hidden) {
                goOffline()
              } else {
                update(userRef, { online: true })
              }
            }

            window.addEventListener("beforeunload", goOffline)
            document.addEventListener("visibilitychange", handleVisibility)

          } else {
            console.log("⚠️ User exists in auth but not DB yet")
          }

        } catch (err) {
          console.error("AuthGate error:", err)
        }
      }

      setReady(true)
    })

    return () => {
      unsub()

      if (goOffline) {
        window.removeEventListener("beforeunload", goOffline)
      }

      if (handleVisibility) {
        document.removeEventListener("visibilitychange", handleVisibility)
      }
    }

  }, [path, router])

  if (!ready) return null
  return children
              }

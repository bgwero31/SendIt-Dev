'use client'

import { useEffect, useState } from "react"
import { auth, db } from "../lib/firebase"
import { ref, onValue } from "firebase/database"

export default function CreditsBadge() {
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const balanceRef = ref(db, `wallets/${uid}/balance`)
    return onValue(balanceRef, snap => {
      setCredits(snap.val() || 0)
    })
  }, [])

  return (
    <div className="
      fixed top-4 right-4 z-40
      bg-indigo-600 text-white
      px-4 py-2 rounded-full
      shadow-lg backdrop-blur
      text-sm font-semibold
    ">
      CR <span className="ml-1 text-base">{credits}</span>
    </div>
  )
}


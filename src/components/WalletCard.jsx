'use client'

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db, auth } from "../lib/firebase"

export default function WalletCard() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  /* ================= AUTH + LIVE BALANCE ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (!user) {
        setBalance(0)
        setLoading(false)
        return
      }

      const balRef = ref(db, `wallets/${user.uid}/balance`)

      return onValue(balRef, snap => {
        setBalance(Number(snap.val() || 0))
        setLoading(false)
      })
    })

    return () => unsub()
  }, [])

  /* ================= UI ================= */
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl">

      {/* 🔮 BACKGROUND GLOW */}
      <div className="
        absolute inset-0
        bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700
      " />

      {/* ✨ FUTURE CAROUSEL SLOT */}
      <div className="
        absolute inset-0
        opacity-10
        bg-[radial-gradient(circle_at_top,white,transparent)]
      " />

      {/* CONTENT */}
      <div className="relative p-7 text-white">

        {/* HEADER */}
        <p className="text-sm opacity-90 tracking-wide">
          Available Credits
        </p>

        {/* BALANCE */}
        <h2 className="text-5xl font-extrabold mt-2 tracking-tight">
          {loading ? "…" : `${balance} Credits`}
        </h2>

        {/* CTA / CAROUSEL CONTROL */}
        <div className="mt-6 flex gap-3">
          <button
            className="
              flex-1
              bg-white/20
              backdrop-blur
              py-2.5
              rounded-xl
              text-sm font-semibold
              active:scale-95
              transition
            "
          >
            Activity
          </button>
        </div>

        {/* 🚧 CAROUSEL NOTE */}
        {/* 
          Later you can replace everything above with:
          - sliding banners
          - promos
          - ads
          - tips
          Balance stays untouched & live
        */}

      </div>
    </div>
  )
        }

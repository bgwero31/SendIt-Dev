'use client'

import { useEffect, useState, useMemo } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../../lib/firebase"
import { auth } from "../../lib/firebase"
import Navbar from "../../components/Navbar"

export default function Wallet() {

  const [balance, setBalance] = useState(0)
  const [txs, setTxs] = useState([])
  const [uid, setUid] = useState(null)
  const [openDay, setOpenDay] = useState(null)

  /* ================= AUTH UID ================= */
  useEffect(() => {
    if (!auth.currentUser) return
    setUid(auth.currentUser.uid)
  }, [])

  /* ================= LIVE BALANCE ================= */
  useEffect(() => {
    if (!uid) return

    const balRef = ref(db, `wallets/${uid}/balance`)
    return onValue(balRef, snap => {
      setBalance(Number(snap.val() || 0))
    })
  }, [uid])

  /* ================= LIVE TRANSACTIONS ================= */
  useEffect(() => {
    if (!uid) return

    const txRef = ref(db, `wallets/${uid}/transactions`)
    return onValue(txRef, snap => {
      const data = snap.val() || {}
      const list = Object.values(data).sort((a, b) => b.at - a.at)
      setTxs(list)
    })
  }, [uid])

/* ================= STATS ================= */

const todayEarned = useMemo(() => {
  const today = new Date().toDateString()

  return txs
    .filter(tx =>
      tx.type === "credit" &&
      tx.source === "earning" &&
      new Date(tx.at).toDateString() === today
    )
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}, [txs])


const weekEarned = useMemo(() => {
  const now = new Date()

  // Monday as week start
  const day = now.getDay() || 7
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - day + 1)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  return txs
    .filter(tx => {
      if (tx.type !== "credit") return false
      if (tx.source !== "earning") return false
      const d = new Date(tx.at)
      return d >= weekStart && d < weekEnd
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}, [txs])


const monthEarned = useMemo(() => {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  return txs
    .filter(tx => {
      if (tx.type !== "credit") return false
      if (tx.source !== "earning") return false
      const d = new Date(tx.at)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}, [txs])

  /* ================= GROUP BY DAY ================= */
  const groupedByDay = useMemo(() => {
    const groups = {}
    txs.forEach(tx => {
      const day = new Date(tx.at).toDateString()
      if (!groups[day]) groups[day] = []
      groups[day].push(tx)
    })
    return groups
  }, [txs])

  const recentDays = useMemo(() => {
    return Object.keys(groupedByDay)
      .sort((a, b) => new Date(b) - new Date(a))
      .slice(0, 7)
  }, [groupedByDay])

  /* ================= UI ================= */
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#11183a] pb-32">
    
      <h1 className="text-2xl font-bold pt-6 text-indigo-700">
        Wallet
      </h1>

      {/* BALANCE */}
      <div className="mt-6 rounded-3xl p-7 text-white shadow-2xl bg-gradient-to-r from-indigo-600 to-blue-600">
        <p className="text-sm opacity-90">Available Credits</p>
        <h2 className="text-4xl font-extrabold mt-2">
          {balance} credits
        </h2>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <Stat label="Today" value={`${todayEarned} cr`} />
        <Stat label="Week" value={`${weekEarned} cr`} />
        <Stat label="Month" value={`${monthEarned} cr`} />
      </div>

      {/* ACTIVITY */}
      <div className="mt-10">
        <h3 className="font-semibold text-indigo-700 mb-4 text-lg">
          Recent Activity
        </h3>

        {recentDays.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-sm text-blue-400">
              No transactions yet
            </p>
          </div>
        )}

        {recentDays.map(day => (
          <div
            key={day}
            className="bg-white rounded-2xl shadow mb-4 overflow-hidden"
          >
            <button
              onClick={() => setOpenDay(openDay === day ? null : day)}
              className="w-full px-5 py-4 flex justify-between items-center font-semibold text-indigo-700"
            >
              <span>{day}</span>
              <span className="text-xl">
                {openDay === day ? "−" : "+"}
              </span>
            </button>

            {openDay === day && (
              <div className="px-5 pb-4 space-y-3">
                {groupedByDay[day].map((tx, i) => (
                  <TxRow key={i} {...tx} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Navbar />
    </main>
  )
}

/* ================= SMALL COMPONENTS ================= */

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      <p className="text-xs text-blue-500 font-medium">
        {label}
      </p>
      <p className="font-semibold text-lg text-indigo-700">
        {value}
      </p>
    </div>
  )
}

function TxRow({ title, amount, type, at }) {
  const positive = type === "credit"
  const isInfo = type === "info"

  const time = new Date(at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>

      <span
        className={`font-semibold ${
          positive
            ? "text-green-600"
            : isInfo
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        {isInfo ? "—" : positive ? "+" : "-"}
        {!isInfo && amount}
      </span>
    </div>
  )
          }

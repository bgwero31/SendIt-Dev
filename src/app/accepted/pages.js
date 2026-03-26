'use client'

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../../lib/firebase"

import TaskCard from "../../components/TaskCard"
import Navbar from "../../components/Navbar"

export default function Accepted() {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [city, setCity] = useState(null)
  const [uid, setUid] = useState(null)


  /* ================= LOAD USER + CITY ================= */
  useEffect(() => {
    setCity(localStorage.getItem("sendit-city") || "Harare")
    setUid(localStorage.getItem("uid"))
  }, [])


  /* ================= REALTIME ACCEPTED LISTENER ================= */
  
useEffect(() => {

  if (!city || !uid) return

  const tasksRef = ref(db, `tasks/${city}`)

  return onValue(tasksRef, (snap) => {

    const data = snap.val() || {}

    const list = Object.entries(data).map(([id, t]) => ({
      id,
      ...t,
      viewsCount: Object.keys(t.views || {}).length,
      bidsCount: Object.keys(t.bids || {}).length
    }))

    // 🔥 show accepted tasks for me only
    const accepted = list.filter(t =>
      t.status === "accepted" &&
      (t.runnerId === uid || t.ownerId === uid)
    )

    setTasks(accepted)
    setLoading(false)

  })

}, [city, uid])


  /* ================= UI ================= */
  return (
    <main className="min-h-screen bg-gray-50 pb-28">

      <div className="px-6 pt-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Accepted Tasks
        </h1>

        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {tasks.length}
        </span>
      </div>


      <div className="px-6 mt-6 space-y-4">

        {loading && (
          <p className="text-center text-gray-400">
            Loading...
          </p>
        )}

        {!loading && tasks.length === 0 && (
          <p className="text-center text-gray-400">
            No accepted tasks yet
          </p>
        )}

        {tasks.map(task => (
          <TaskCard
            key={task.id}
            {...task}
            city={city}
          />
        ))}

      </div>

      <Navbar />

    </main>
  )
}

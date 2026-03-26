'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ref, onValue } from "firebase/database"

import { db, auth } from "../../lib/firebase"
import TaskCard from "../../components/TaskCard"
import Navbar from "../../components/Navbar"

export default function Tasks() {
  const router = useRouter()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [city, setCity] = useState(null)
  const [role, setRole] = useState(null)

  // ✅ ADDED: task count for navbar badge
  const [taskCount, setTaskCount] = useState(0)

  /* ================= AUTH + USER PROFILE ================= */
  useEffect(() => {
    let offUser = null

    const unsubAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        router.replace("/login")
        return
      }

      const userRef = ref(db, `users/${user.uid}`)

      offUser = onValue(userRef, snap => {
        const data = snap.val()

        if (!data || data.role !== "runner") {
          router.replace("/")
          return
        }

        setRole("runner")

        // reset before loading tasks
        setLoading(true)

        if (!data.city) {
          setCity(null)
          setTasks([])
          setLoading(false)
          return
        }

        setCity(data.city)
      })
    })

    return () => {
      unsubAuth()
      if (offUser) offUser()
    }
  }, [router])

  /* ================= TASK LISTENER (RUNNER FEED) ================= */
  useEffect(() => {
    if (!city || role !== "runner") return

    const tasksRef = ref(db, `tasks/${city}`)

    const offTasks = onValue(tasksRef, snap => {
      const data = snap.val() || {}

      const list = Object.entries(data)
        .map(([id, task]) => ({
          id,
          ...task,
          city
        }))
        .filter(task =>
          task.status === "waiting_for_runner" ||
          task.status === "bidding"
        )
        .sort((a, b) => b.createdAt - a.createdAt)

      setTasks(list)

      // ✅ ADDED: update navbar badge count
      setTaskCount(list.length)

      setLoading(false)
    })

    return () => offTasks()
  }, [city, role])

  /* ================= SEARCH ================= */
  const filtered = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase())
  )

  /* ================= UI ================= */
return (
  <main className="relative min-h-screen pb-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">

    {/* animated background glow */}
    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl bg-animate-slow"></div>

    <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl bg-animate-slow"></div>

    <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-3xl bg-animate-slow"></div>

    <div className="relative z-10">

      {/* Header */}
      <div className="px-6 pt-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">
          Available Tasks
        </h1>

        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          {filtered.length}
        </span>
      </div>

      {/* Search */}
      <div className="px-6 mt-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search errands…"
          className="w-full p-3 border border-white/40 bg-white/40 backdrop-blur-md rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Task list */}
      <div className="px-6 mt-6 space-y-5">

        {loading && (
          <p className="text-center text-gray-500">
            Loading tasks…
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500">
            No available tasks right now
          </p>
        )}

        {filtered.map(task => (
          <TaskCard
            key={task.id}
            {...task}
          />
        ))}

      </div>

    </div>

    {/* ✅ UPDATED: pass task count to navbar */}
    <Navbar taskCount={taskCount} />

  </main>
)
            }

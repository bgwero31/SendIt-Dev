'use client'

import { useEffect, useMemo, useState } from "react"
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
  const [taskCount, setTaskCount] = useState(0)

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
        setLoading(true)

        if (!data.city) {
          setCity(null)
          setTasks([])
          setTaskCount(0)
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

  useEffect(() => {
    if (!city || role !== "runner") return

    const tasksRef = ref(db, `tasks/${city}`)

    const offTasks = onValue(tasksRef, snap => {
      const data = snap.val() || {}

      const list = Object.entries(data)
        .map(([id, task]) => {
          const isPharmacy = task.type === "pharmacy_delivery"

          return {
            id,
            ...task,
            city,

            // ✅ Makes pharmacy jobs readable inside your normal TaskCard
            title: isPharmacy
              ? `Pharmacy delivery from ${task.pickupName || "Alliance Pharmacy"}`
              : task.title || "SendIt task",

            description: isPharmacy
              ? `Deliver to ${task.customerName || "customer"} • ${task.dropoffAddress || "No address"}`
              : task.description || task.note || "",

            pickup: task.pickupAddress || task.pickupName || task.pickup || "",
            dropoff: task.dropoffAddress || task.dropoff || "",

            // ✅ Your TaskCard may use price/amount/fare depending on old code
            price: task.runnerFee || task.price || task.deliveryFee || 0,
            amount: task.runnerFee || task.amount || task.price || task.deliveryFee || 0,
            fare: task.runnerFee || task.fare || task.price || task.deliveryFee || 0,

            // ✅ Special data for pharmacy pickup page
            isPharmacyDelivery: isPharmacy,
            pharmacyOrderId: task.pharmacyOrderId || "",
            pickupCodeRequired: isPharmacy
          }
        })
        .filter(task =>
          task.status === "waiting_for_runner" ||
          task.status === "bidding"
        )
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      setTasks(list)
      setTaskCount(list.length)
      setLoading(false)
    })

    return () => offTasks()
  }, [city, role])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()

    if (!q) return tasks

    return tasks.filter(task => {
      const text = `
        ${task.title || ""}
        ${task.description || ""}
        ${task.pickup || ""}
        ${task.dropoff || ""}
        ${task.customerName || ""}
        ${task.customerPhone || ""}
        ${task.type || ""}
      `.toLowerCase()

      return text.includes(q)
    })
  }, [tasks, search])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-32">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-300/25 blur-3xl bg-animate-slow" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-green-300/20 blur-3xl bg-animate-slow" />
      <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-lime-200/20 blur-3xl bg-animate-slow" />

      <div className="relative z-10">
        <div className="px-6 pt-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-[-0.04em] text-emerald-800">
                Available Tasks
              </h1>
              <p className="mt-1 text-[12px] font-semibold text-neutral-500">
                {city ? `${city} runner feed` : "Runner feed"}
              </p>
            </div>

            <span className="rounded-full bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-black text-white shadow-md">
              {filtered.length}
            </span>
          </div>
        </div>

        <div className="px-6 mt-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search errands, pharmacy deliveries, customer or address…"
            className="w-full rounded-xl border border-emerald-100 bg-white/70 p-3 text-[13px] font-semibold outline-none shadow-sm backdrop-blur-md focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="px-6 mt-6 space-y-5">
          {loading && (
            <p className="text-center text-gray-500">
              Loading tasks…
            </p>
          )}

          {!loading && !city && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-center">
              <p className="font-bold text-amber-800">
                Your runner city is not set.
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Add city to your user profile first.
              </p>
            </div>
          )}

          {!loading && city && filtered.length === 0 && (
            <p className="text-center text-gray-500">
              No available tasks right now
            </p>
          )}

          {filtered.map(task => (
            <div key={task.id} className="relative">
              {task.isPharmacyDelivery && (
                <div className="mb-2 inline-flex rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-black text-white shadow-sm">
                  ALLIANCE PHARMACY DELIVERY
                </div>
              )}

              <TaskCard {...task} />

              {task.isPharmacyDelivery && task.pharmacyOrderId && (
                <button
                  onClick={() =>
                    router.push(`/runner/pharmacy-pickup/${task.pharmacyOrderId}`)
                  }
                  className="mt-3 w-full rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white shadow-lg"
                >
                  Confirm pharmacy pickup code
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Navbar taskCount={taskCount} />
    </main>
  )
}

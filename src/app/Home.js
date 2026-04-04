'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { db, auth } from "../lib/firebase"
import {
  ref,
  push,
  set,
  get,
  onValue,
  runTransaction,
  update
} from "firebase/database"

import Navbar from "../components/Navbar"
import PostTaskModal from "../components/PostTaskModal"
import SuccessToast from "../components/SuccessToast"
import CityPicker from "../components/CityPicker"
import CreditsBadge from "../components/CreditsBadge"
import HomePromoCarousel from "../components/HomePromoCarousel"
import ActivityTicker from "../components/ActivityTicker"
import TrendingDealsSection from "../components/TrendingDealsSection"
import FilterChips from "../components/FilterChips"

export default function Home() {
  const router = useRouter()

  /* ================= GLOBAL CITY ================= */
  const [city, setCity] = useState(null)
  const [showPicker, setShowPicker] = useState(false)

  /* 🔥 DEBUG ADDED */
  useEffect(() => {
    console.log("🔥 CURRENT USER CITY STATE:", city)
  }, [city])

  /* ================= ROLE ================= */
  const [role, setRole] = useState("user")

  /* ================= UI STATE ================= */
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toastText, setToastText] = useState("")
  const [activeTask, setActiveTask] = useState(null)
  const [postedTaskId, setPostedTaskId] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  /* NEW: confirm modal state */
  const [confirmTask, setConfirmTask] = useState(null)

  /* prevent toast spam */
  const seenViews = useRef({})

  const homeCategories = [
    {
      title: "Food",
      subtitle: "Meals & drinks",
      emoji: "🍔",
      bg: "from-orange-50 to-amber-100",
      iconBg: "bg-orange-500",
      href: "/food"
    },
    {
      title: "Groceries",
      subtitle: "Daily essentials",
      emoji: "🛒",
      bg: "from-emerald-50 to-green-100",
      iconBg: "bg-emerald-500",
      href: "/groceries"
    },
    {
      title: "Pharmacy",
      subtitle: "Meds & health",
      emoji: "💊",
      bg: "from-sky-50 to-cyan-100",
      iconBg: "bg-sky-500",
      href: "/pharmacy"
    },
    {
      title: "Parcels",
      subtitle: "Send packages",
      emoji: "📦",
      bg: "from-violet-50 to-indigo-100",
      iconBg: "bg-indigo-500",
      href: "/parcels"
    },
    {
      title: "Errands",
      subtitle: "Custom requests",
      emoji: "⚡",
      bg: "from-blue-50 to-indigo-100",
      iconBg: "bg-blue-600",
      href: "/errands"
    },
    {
      title: "Pickups",
      subtitle: "Collect items",
      emoji: "🛍️",
      bg: "from-pink-50 to-rose-100",
      iconBg: "bg-rose-500",
      href: "/pickups"
    }
  ]

  const openCategory = (item) => {
    if (!city) {
      setShowPicker(true)
      return
    }

    router.push(item.href)
  }

  /* ================= AUTH + USER PROFILE ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (!user) {
        router.replace("/login")
        return
      }

      const uid = user.uid
      const userRef = ref(db, `users/${uid}`)

      onValue(userRef, snap => {
        const data = snap.val() || {}

        setRole(data.role || "user")

        if (data.city) {
          setCity(data.city)
          setShowPicker(false)
        } else {
          setShowPicker(true)
        }
      })
    })

    return () => unsub()
  }, [router])

  /* ================= ONESIGNAL CITY TAG ================= */
  useEffect(() => {
    if (!city || !role) return
    if (typeof window === "undefined") return

    window.OneSignalDeferred = window.OneSignalDeferred || []

    window.OneSignalDeferred.push(async function (OneSignal) {
      const subId = await OneSignal.User.PushSubscription.id

      if (!subId) {
        console.log("No OneSignal subscription yet")
        return
      }

      await OneSignal.User.addTag("city", city)
      await OneSignal.User.addTag("role", role)
    })
  }, [city, role])

  /* ================= INIT WALLET ================= */
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const balanceRef = ref(db, `wallets/${uid}/balance`)

    get(balanceRef).then(snap => {
      if (!snap.exists()) {
        set(balanceRef, 100)

        push(ref(db, `wallets/${uid}/transactions`), {
          type: "credit",
          amount: 100,
          title: "Welcome bonus",
          at: Date.now()
        })
      }
    })
  }, [])

  /* ================= TASK VIEW TOAST ================= */
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const tasksRef = ref(db, "tasks")

    return onValue(tasksRef, snap => {
      const data = snap.val() || {}

      Object.values(data).forEach(cityTasks => {
        Object.entries(cityTasks || {}).forEach(([taskId, task]) => {
          if (task.ownerId !== uid) return
          if (!task.views) return
          if (seenViews.current[taskId]) return

          seenViews.current[taskId] = true

          setToastText("Someone viewed your task 👀")
          setSuccess(true)

          setTimeout(() => setSuccess(false), 2000)
        })
      })
    })
  }, [])

  /* ================= ACTIVE TASK LISTENER ================= */
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid || !city) return

    const tasksRef = ref(db, `tasks/${city}`)

    return onValue(tasksRef, snap => {
      const data = snap.val() || {}
      let found = null

      Object.entries(data).forEach(([id, task]) => {
        if (
          task.ownerId === uid &&
          (
            task.status === "waiting_for_runner" ||
            task.status === "bidding" ||
            task.status === "accepted"
          )
        ) {
          found = { id, ...task }
        }
      })

      setActiveTask(found)
    })
  }, [city])

  /* ================= KEEP MODAL ALIVE ================= */
  useEffect(() => {
    if (!activeTask) {
      setOpen(false)
      setPostedTaskId(null)
      return
    }

    if (activeTask.status === "accepted") {
      setOpen(false)
      setPostedTaskId(null)
      return
    }

    setPostedTaskId(activeTask.id)
    setOpen(true)
  }, [activeTask])

  /* ================= SOUND ================= */
  const playDing = () => {
    const audio = new Audio("/ding.mp3")
    audio.play().catch(() => {})
  }

  /* ================= POST TASK ================= */
  const postTask = async ({ title, offerPrice }) => {
    const amount = Number(offerPrice)
    if (!title || isNaN(amount) || amount <= 0 || !city) return

    setConfirmTask({ title, amount })
  }

  /* ================= CONFIRM TASK ================= */
  const confirmPostTask = async () => {
    const { title, amount } = confirmTask
    setConfirmTask(null)

    const uid = auth.currentUser?.uid
    if (!uid) return

    setLoading(true)
    playDing()

    const userSnap = await get(ref(db, `users/${uid}`))
    const phone = userSnap.val()?.phone || ""

    const balanceRef = ref(db, `wallets/${uid}/balance`)

    const tx = await runTransaction(balanceRef, current => {
      if (current === null) return current
      if (current < amount) return current
      return current - amount
    })

    if (!tx.committed) {
      setToastText("Not enough credits ❌")
      setSuccess(true)
      setLoading(false)
      return
    }

    const tasksRef = ref(db, `tasks/${city}`)
    const newTask = push(tasksRef)

    await set(newTask, {
      title,
      offerPrice: amount,
      ownerPhone: phone,
      city: city,
      status: "waiting_for_runner",
      ownerId: uid,
      createdAt: Date.now()
    })

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      await update(newTask, {
        pickupLat: lat,
        pickupLng: lng
      })
    })

    setPostedTaskId(newTask.key)

    fetch("https://sendit-notifier.onrender.com/notify-new-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: city,
        taskId: newTask.key,
        title,
        credits: amount
      })
    })

    await push(ref(db, `wallets/${uid}/transactions`), {
      type: "debit",
      amount,
      title: `Posted task: ${title}`,
      at: Date.now()
    })

    setToastText("Task posted — waiting for a runner 🚀")
    setSuccess(true)

    setTimeout(() => setSuccess(false), 1500)

    setLoading(false)
  }

  /* ================= UI ================= */
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#11183a] pb-32">
      <SuccessToast show={success} text={toastText} />

      <CityPicker
        open={showPicker}
        setCity={async c => {
          const uid = auth.currentUser?.uid
          if (!uid) return
          await update(ref(db, `users/${uid}`), {
            city: c
          })
          setCity(c)
          setShowPicker(false)
        }}
      />

      <HomePromoCarousel userCity={city || ""} />

      <ActivityTicker />

      {/* Glovo-style categories */}
      <section className="px-4 mt-4">
        <div className="rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-neutral-900">
                Explore categories
              </p>
              <p className="text-[11px] text-neutral-500">
                Tap a category to open
              </p>
            </div>

            <div className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-600">
              {city || "Choose city"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {homeCategories.map((item) => (
              <button
                key={item.title}
                onClick={() => openCategory(item)}
                className={`group rounded-[20px] border border-black/5 bg-gradient-to-br ${item.bg} p-3 text-left transition active:scale-[0.98]`}
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-[14px] ${item.iconBg} text-[20px] shadow-[0_10px_20px_rgba(0,0,0,0.10)]`}
                >
                  <span>{item.emoji}</span>
                </div>

                <p className="text-[13px] font-semibold tracking-[-0.02em] text-neutral-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[10px] leading-4 text-neutral-600">
                  {item.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4">
        <FilterChips
          active={activeFilter}
          setActive={setActiveFilter}
        />
      </div>

      <TrendingDealsSection filter={activeFilter} />

      {role === "user" && !activeTask && (
        <div className="px-6 mt-6">
          <button
            onClick={() => setOpen(true)}
            disabled={!city}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold shadow-xl"
          >
            + Post Task
          </button>
        </div>
      )}

      <PostTaskModal
        open={open}
        setOpen={setOpen}
        onSubmit={postTask}
        loading={loading}
        taskId={postedTaskId}
      />

      {/* CONFIRM TASK MODAL */}
      {confirmTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <div className="relative w-[320px] p-6 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl text-white">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-indigo-200">
                Confirm Task
              </p>

              <p className="text-sm mb-6 text-gray-200">
                {confirmTask.title} | ${confirmTask.amount}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmTask(null)}
                  className="flex-1 py-3 rounded-xl bg-white/20 border border-white/30"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmPostTask}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </main>
  )
  }

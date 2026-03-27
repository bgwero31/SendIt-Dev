'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, useMemo } from "react"
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
import CategorySlider from "../components/CategorySlider"
import TrendingDealsSection from "../components/TrendingDealsSection"
import FilterChips from "../components/FilterChips"

export default function Home() {
  const router = useRouter()

  /* ================= GLOBAL CITY ================= */
  const [city, setCity] = useState(null)
  const [showPicker, setShowPicker] = useState(false)

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
  const [confirmTask, setConfirmTask] = useState(null)

  /* ================= USER ================= */
  const [uid, setUid] = useState(null)
  const [userName, setUserName] = useState("")
  const [walletBalance, setWalletBalance] = useState(0)

  /* prevent toast spam */
  const seenViews = useRef({})

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  /* ================= AUTH + USER PROFILE ================= */
  useEffect(() => {
    let unsubscribeUser = null

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/login")
        return
      }

      setUid(user.uid)

      const userRef = ref(db, `users/${user.uid}`)

      unsubscribeUser = onValue(userRef, (snap) => {
        const data = snap.val() || {}

        setRole(data.role || "user")
        setUserName(data.name || data.fullName || "")

        if (data.city) {
          setCity(data.city)
          setShowPicker(false)
        } else {
          setShowPicker(true)
        }
      })
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeUser) unsubscribeUser()
    }
  }, [router])

  /* ================= ONESIGNAL CITY TAG ================= */
  useEffect(() => {
    if (!city || !role || typeof window === "undefined") return

    window.OneSignalDeferred = window.OneSignalDeferred || []

    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        const subId = await OneSignal.User.PushSubscription.id
        if (!subId) return

        await OneSignal.User.addTag("city", city)
        await OneSignal.User.addTag("role", role)
      } catch (err) {
        console.log("OneSignal tag error:", err)
      }
    })
  }, [city, role])

  /* ================= INIT WALLET + LISTEN BALANCE ================= */
  useEffect(() => {
    if (!uid) return

    const balanceRef = ref(db, `wallets/${uid}/balance`)

    get(balanceRef).then((snap) => {
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

    const unsubscribe = onValue(balanceRef, (snap) => {
      setWalletBalance(Number(snap.val() || 0))
    })

    return () => unsubscribe()
  }, [uid])

  /* ================= TASK VIEW TOAST ================= */
  useEffect(() => {
    if (!uid) return

    const tasksRef = ref(db, "tasks")

    const unsubscribe = onValue(tasksRef, (snap) => {
      const data = snap.val() || {}

      Object.values(data).forEach((cityTasks) => {
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

    return () => unsubscribe()
  }, [uid])

  /* ================= ACTIVE TASK LISTENER ================= */
  useEffect(() => {
    if (!uid || !city) return

    const tasksRef = ref(db, `tasks/${city}`)

    const unsubscribe = onValue(tasksRef, (snap) => {
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

    return () => unsubscribe()
  }, [uid, city])

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
    try {
      const audio = new Audio("/ding.mp3")
      audio.play().catch(() => {})
    } catch {}
  }

  /* ================= POST TASK ================= */
  const postTask = async ({ title, offerPrice }) => {
    const amount = Number(offerPrice)
    if (!title || isNaN(amount) || amount <= 0 || !city) return
    setConfirmTask({ title, amount })
  }

  /* ================= CONFIRM TASK ================= */
  const confirmPostTask = async () => {
    if (!confirmTask || !uid) return

    const { title, amount } = confirmTask
    setConfirmTask(null)
    setLoading(true)
    playDing()

    try {
      const userSnap = await get(ref(db, `users/${uid}`))
      const phone = userSnap.val()?.phone || ""

      const balanceRef = ref(db, `wallets/${uid}/balance`)

      const tx = await runTransaction(balanceRef, (current) => {
        if (current === null) return current
        if (current < amount) return current
        return current - amount
      })

      if (!tx.committed) {
        setToastText("Not enough credits ❌")
        setSuccess(true)
        setLoading(false)
        setTimeout(() => setSuccess(false), 1800)
        return
      }

      const tasksRef = ref(db, `tasks/${city}`)
      const newTask = push(tasksRef)

      await set(newTask, {
        title,
        offerPrice: amount,
        ownerPhone: phone,
        city,
        status: "waiting_for_runner",
        ownerId: uid,
        createdAt: Date.now()
      })

      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              await update(newTask, {
                pickupLat: pos.coords.latitude,
                pickupLng: pos.coords.longitude
              })
            } catch (err) {
              console.log("Geolocation update error:", err)
            }
          },
          (err) => {
            console.log("Geolocation permission/error:", err)
          },
          { enableHighAccuracy: true, timeout: 10000 }
        )
      }

      setPostedTaskId(newTask.key)

      try {
        await fetch("https://sendit-notifier.onrender.com/notify-new-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: city,
            taskId: newTask.key,
            title,
            credits: amount
          })
        })
      } catch (err) {
        console.log("Notify error:", err)
      }

      await push(ref(db, `wallets/${uid}/transactions`), {
        type: "debit",
        amount,
        title: `Posted task: ${title}`,
        at: Date.now()
      })

      setToastText("Task posted — waiting for a runner 🚀")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 1800)
    } catch (err) {
      console.log("Task post error:", err)
      setToastText("Something went wrong ❌")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 1800)
    } finally {
      setLoading(false)
    }
  }

  const activeTaskStatusText = useMemo(() => {
    if (!activeTask) return ""
    if (activeTask.status === "waiting_for_runner") return "Looking for a runner"
    if (activeTask.status === "bidding") return "Runners are bidding"
    if (activeTask.status === "accepted") return "Runner assigned"
    return activeTask.status
  }, [activeTask])

  return (
    <main className="min-h-screen bg-[#f8f8f8] text-[#111111] pb-28">
      <SuccessToast show={success} text={toastText} />

      <CityPicker
        open={showPicker}
        setCity={async (c) => {
          if (!uid) return
          await update(ref(db, `users/${uid}`), { city: c })
          setCity(c)
          setShowPicker(false)
        }}
      />

      {/* Top spacing */}
      <div className="mx-auto w-full max-w-md px-4 pt-4">
        {/* Header */}
        <section className="rounded-[28px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-neutral-500">
                {greeting}
              </p>
              <h1 className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.02em] text-neutral-900">
                {userName ? `${userName}, send anything fast.` : "Send anything fast."}
              </h1>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowPicker(true)}
                  className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-semibold text-neutral-700"
                >
                  📍 {city || "Choose city"}
                </button>

                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
                  {role === "runner" ? "Runner mode" : "Customer mode"}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <CreditsBadge />
            </div>
          </div>

          {/* Strong CTA block */}
          {role === "user" && !activeTask && (
            <div className="mt-5 rounded-[24px] bg-neutral-900 p-4 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium text-white/70">
                    Quick action
                  </p>
                  <h2 className="mt-1 text-[18px] font-semibold leading-snug">
                    Need food, parcels or errands handled?
                  </h2>
                  <p className="mt-1 text-[13px] leading-5 text-white/75">
                    Post a task and get matched with a nearby runner in your city.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
                  <p className="text-[11px] text-white/60">Balance</p>
                  <p className="text-[16px] font-bold">${walletBalance}</p>
                </div>
              </div>

              <button
                onClick={() => setOpen(true)}
                disabled={!city}
                className="mt-4 w-full rounded-2xl bg-white px-4 py-3.5 text-[15px] font-semibold text-neutral-900 transition active:scale-[0.99] disabled:opacity-50"
              >
                + Post a task
              </button>
            </div>
          )}

          {/* Active task card */}
          {activeTask && (
            <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-amber-700">
                    Active task
                  </p>
                  <h3 className="mt-1 text-[17px] font-semibold text-neutral-900">
                    {activeTask.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-neutral-600">
                    {activeTaskStatusText}
                  </p>
                </div>

                <div className="rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-neutral-900 shadow-sm">
                  ${activeTask.offerPrice}
                </div>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="mt-4 w-full rounded-2xl bg-neutral-900 px-4 py-3 text-[14px] font-semibold text-white active:scale-[0.99]"
              >
                View task progress
              </button>
            </div>
          )}
        </section>

        {/* Promo */}
        <section className="mt-4 overflow-hidden rounded-[28px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5">
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-neutral-900">
                  Offers & promos
                </p>
                <p className="mt-0.5 text-[12px] text-neutral-500">
                  Better deals in {city || "your city"}
                </p>
              </div>
            </div>
          </div>
          <HomePromoCarousel userCity={city || ""} />
        </section>

        {/* Live activity */}
        <section className="mt-4 rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 p-4">
          <div className="mb-3">
            <p className="text-[15px] font-semibold text-neutral-900">
              Live activity
            </p>
            <p className="text-[12px] text-neutral-500">
              What’s happening on SendIt right now
            </p>
          </div>
          <ActivityTicker />
        </section>

        {/* Categories */}
        <section className="mt-4 rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 p-4">
          <div className="mb-3">
            <p className="text-[15px] font-semibold text-neutral-900">
              Explore categories
            </p>
            <p className="text-[12px] text-neutral-500">
              Food, errands, parcels and more
            </p>
          </div>
          <CategorySlider />
        </section>

        {/* Deals */}
        <section className="mt-4 rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 p-4">
          <div className="mb-3">
            <p className="text-[15px] font-semibold text-neutral-900">
              Trending deals
            </p>
            <p className="text-[12px] text-neutral-500">
              Curated picks for faster ordering
            </p>
          </div>

          <div className="mb-4">
            <FilterChips
              active={activeFilter}
              setActive={setActiveFilter}
            />
          </div>

          <TrendingDealsSection filter={activeFilter} />
        </section>
      </div>

      <PostTaskModal
        open={open}
        setOpen={setOpen}
        onSubmit={postTask}
        loading={loading}
        taskId={postedTaskId}
      />

      {/* Confirm task modal */}
      {confirmTask && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-indigo-600">
                  Confirm task
                </p>
                <h3 className="mt-1 text-[18px] font-bold text-neutral-900">
                  Post this request?
                </h3>
              </div>

              <div className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-bold text-neutral-900">
                ${confirmTask.amount}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <p className="text-[14px] font-medium text-neutral-900">
                {confirmTask.title}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-neutral-500">
                Your credits will be reserved immediately and runners in {city || "your city"} will be notified.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmTask(null)}
                className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] font-semibold text-neutral-700"
              >
                Cancel
              </button>

              <button
                onClick={confirmPostTask}
                className="rounded-2xl bg-neutral-900 px-4 py-3 text-[14px] font-semibold text-white active:scale-[0.99]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </main>
  )
  }

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
    <main className="min-h-screen bg-[#f6f7fb] text-[#111111] pb-24">
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

      <div className="mx-auto w-full max-w-md px-3.5 pt-3.5">
        {/* Header / Hero */}
        <section className="relative overflow-hidden rounded-[26px] border border-black/5 bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-blue-100 blur-3xl opacity-80" />
            <div className="absolute right-0 top-8 h-28 w-28 rounded-full bg-indigo-100 blur-3xl opacity-80" />
            <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-sky-100 blur-2xl opacity-60" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none text-[52px] font-extrabold tracking-[-0.06em] text-blue-700/[0.04]">
                SendIt
              </span>
            </div>
          </div>

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-neutral-500">
                {greeting}
              </p>

              <h1 className="mt-1 text-[21px] font-bold leading-tight tracking-[-0.03em] text-neutral-900">
                {userName ? `${userName}, send anything fast.` : "Send anything fast."}
              </h1>

              <p className="mt-2 max-w-[250px] text-[12px] leading-5 text-neutral-600">
                Food, parcels and errands delivered quickly by nearby runners.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowPicker(true)}
                  className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-semibold text-neutral-700"
                >
                  📍 {city || "Choose city"}
                </button>

                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                  {role === "runner" ? "Runner mode" : "Customer mode"}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700">
                SendIt
              </div>
            </div>
          </div>

          {role === "user" && !activeTask && (
            <div className="relative z-10 mt-4 rounded-[22px] border border-blue-100/80 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e3a8a] p-4 text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200/90">
                    Quick post
                  </p>
                  <h2 className="mt-1 text-[16px] font-semibold leading-snug">
                    Need something delivered?
                  </h2>
                  <p className="mt-1 text-[12px] leading-5 text-white/72">
                    Food, parcel or errand in {city || "your city"}.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(true)}
                disabled={!city}
                className="mt-4 w-full rounded-[18px] bg-white px-4 py-3 text-left text-neutral-900 shadow-sm transition active:scale-[0.99] disabled:opacity-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold">Post a task</p>
                    <p className="text-[11px] text-neutral-500">
                      Tap to request delivery now
                    </p>
                  </div>
                  <span className="text-[18px] font-bold">+</span>
                </div>
              </button>
            </div>
          )}

          {activeTask && (
            <div className="relative z-10 mt-4 rounded-[22px] border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                    Active task
                  </p>
                  <h3 className="mt-1 truncate text-[15px] font-semibold text-neutral-900">
                    {activeTask.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-neutral-600">
                    {activeTaskStatusText}
                  </p>
                </div>

                <div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-neutral-900 shadow-sm">
                  ${activeTask.offerPrice}
                </div>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="mt-4 w-full rounded-[18px] bg-neutral-900 px-4 py-3 text-left text-white active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">Your posted task</p>
                    <p className="max-w-[220px] truncate text-[11px] text-white/70">
                      {activeTask.title}
                    </p>
                  </div>
                  <span className="text-[12px] font-semibold">Open</span>
                </div>
              </button>
            </div>
          )}
        </section>

        {/* Promo */}
        <section className="mt-3.5 overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[12px] font-semibold text-neutral-900">
              Offers & promos
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              Better deals in {city || "your city"}
            </p>
          </div>
          <HomePromoCarousel userCity={city || ""} />
        </section>

        {/* Live activity */}
        <section className="mt-3.5 rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-neutral-900">
                Live activity
              </p>
              <p className="text-[11px] text-neutral-500">
                What’s happening on SendIt right now
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
              Live
            </div>
          </div>

          <div className="rounded-[16px] bg-[#f8fbff] px-3 py-2">
            <ActivityTicker />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-3.5 rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="mb-3">
            <p className="text-[13px] font-semibold text-neutral-900">
              Explore categories
            </p>
            <p className="text-[11px] text-neutral-500">
              Food, errands, parcels and more
            </p>
          </div>
          <CategorySlider />
        </section>

        {/* Deals */}
        <section className="mt-3.5 rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
          <div className="mb-3">
            <p className="text-[13px] font-semibold text-neutral-900">
              Trending deals
            </p>
            <p className="text-[11px] text-neutral-500">
              Curated picks for faster ordering
            </p>
          </div>

          <div className="mb-3">
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/38 px-4 pb-28 pt-6 backdrop-blur-[6px]">
          <div className="relative w-full max-w-[350px] overflow-hidden rounded-[30px] border border-white/35 bg-white/78 p-4 shadow-[0_24px_80px_rgba(40,58,255,0.22)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-12 top-0 h-36 w-36 rounded-full bg-blue-500/18 blur-3xl" />
              <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-indigo-500/18 blur-3xl" />
              <div className="absolute bottom-0 left-8 h-32 w-32 rounded-full bg-sky-400/14 blur-3xl" />
              <div className="absolute bottom-2 right-4 h-28 w-28 rounded-full bg-blue-600/14 blur-3xl" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="select-none text-[54px] font-extrabold tracking-[-0.06em] text-blue-700/[0.06]">
                  SendIt
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    Confirm task
                  </p>
                  <h3 className="mt-1 text-[16px] font-bold leading-tight text-neutral-900">
                    Post this request?
                  </h3>
                </div>

                <div className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-[13px] font-bold text-neutral-900 shadow-sm">
                  ${confirmTask.amount}
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-white/50 bg-white/52 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <p className="text-[15px] font-semibold leading-snug text-neutral-900">
                  {confirmTask.title}
                </p>
                <p className="mt-2 text-[12px] leading-5 text-neutral-600">
                  Credits will be reserved immediately and nearby runners in{" "}
                  <span className="font-semibold text-neutral-800">
                    {city || "your city"}
                  </span>{" "}
                  will be notified.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmTask(null)}
                  className="rounded-[18px] border border-neutral-200 bg-white/90 px-4 py-3 text-[14px] font-semibold text-neutral-700 shadow-sm transition active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmPostTask}
                  className="rounded-[18px] bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.34)] transition active:scale-[0.98]"
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

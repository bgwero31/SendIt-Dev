'use client'

import { useState, useEffect, useRef } from "react"
import { ref, onValue, update, set, remove, get } from "firebase/database"
import { useRouter } from "next/navigation"
import { db } from "../lib/firebase"

export default function PostTaskModal({
  open,
  setOpen,
  onSubmit,
  loading,
  taskId
}) {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [credits, setCredits] = useState("")
  const [task, setTask] = useState(null)

  const [timeLeft, setTimeLeft] = useState(120)
  const [progress, setProgress] = useState(100)

  const [isEditing, setIsEditing] = useState(false)
  const [ownerOnline, setOwnerOnline] = useState(false)
  const [runnerOnline, setRunnerOnline] = useState(false)
  const textareaRef = useRef(null)

  // ✅ EXISTING
  const [ownerName, setOwnerName] = useState("")
  const [runnerName, setRunnerName] = useState("")

  // ✅ NEW (ADDED ONLY)
  const [ownerPhoto, setOwnerPhoto] = useState("")
  const [runnerPhoto, setRunnerPhoto] = useState("")

  useEffect(() => {
    if (!open) {
      setTitle("")
      setCredits("")
      setTask(null)
      setIsEditing(false)
    }
  }, [open])

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px"
  }, [title])

  /* FETCH TASK */
  useEffect(() => {
    if (!taskId) return

    const tasksRef = ref(db, "tasks")
    return onValue(tasksRef, snap => {
      const data = snap.val() || {}
      Object.values(data).forEach(cityTasks => {
        Object.entries(cityTasks || {}).forEach(([id, t]) => {
          if (id === taskId) setTask(t)
        })
      })
    })
  }, [taskId])

  /* OWNER NAME + PHOTO */
  useEffect(() => {
    if (!task?.ownerId) return

    const fetchOwner = async () => {
      const snap = await get(ref(db, `users/${task.ownerId}`))
      if (snap.exists()) {
        const data = snap.val()
        setOwnerName(data.name || "")
        setOwnerPhoto(data.photo || "")
        setOwnerOnline(data.online || false)
      }
    }

    fetchOwner()
  }, [task?.ownerId])

  /* RUNNER NAME + PHOTO */
  useEffect(() => {
    if (!task?.latestBid?.runnerId) return

    const fetchRunner = async () => {
      const snap = await get(ref(db, `users/${task.latestBid.runnerId}`))
      if (snap.exists()) {
        const data = snap.val()
        setRunnerName(data.name || "")
        setRunnerPhoto(data.photo || "")
        setRunnerOnline(data.online || false)
      }
    }

    fetchRunner()
  }, [task?.latestBid?.runnerId])

  /* AUTO CHAT */
  useEffect(() => {
    if (task?.status === "accepted") {
      setOpen(false)
      router.push(`/chat/${taskId}`)
    }
  }, [task])

  /* TIMER */
  useEffect(() => {
    if (!task) return

    const interval = setInterval(async () => {

      const now = Date.now()

      const expiry =
        task.expiresAt ||
        (task.createdAt ? task.createdAt + 120000 : now + 120000)

      const remaining = Math.floor((expiry - now) / 1000)

      if (remaining <= 0) {
        clearInterval(interval)

        await remove(ref(db, `tasks/${task.city}/${taskId}`))

        setOpen(false)
        return
      }

      setTimeLeft(remaining)
      setProgress((remaining / 120) * 100)

    }, 1000)

    return () => clearInterval(interval)

  }, [task])

  if (!open) return null

  const isLive = Boolean(taskId)

  const handleSubmit = () => {
    if (!title || !credits) return

    onSubmit({
      title: title.trim(),
      offerPrice: Number(credits)
    })
  }

  const displayPrice =
    task?.finalPrice ??
    task?.latestBid?.amount ??
    task?.offerPrice

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" />

      <div className="fixed bottom-20 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl">

        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {!isLive && (
          <>
            <h2 className="text-lg font-semibold mb-4">Post a new task</h2>

            <textarea
              ref={textareaRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              rows={1}
              placeholder="Describe clearly what you need done…"
              className="w-full resize-none overflow-hidden p-3 border rounded-xl mb-3"
            />

            <input
              value={credits}
              onChange={e => setCredits(e.target.value)}
              type="number"
              placeholder="Offer (USD)"
              className="w-full p-3 border rounded-xl mb-4"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Posting…" : "Post Task"}
            </button>
          </>
        )}

        {isLive && task && (
          <div className="space-y-6 text-center">

        {/* 🔥 OWNER WITH PROFILE PIC */}
<div className="flex items-center justify-center gap-3">

  <div className="relative flex items-center justify-center">

    {/* RADAR RINGS */}
    <span className="absolute w-16 h-16 border border-indigo-400 rounded-full animate-ping"></span>
    <span className="absolute w-24 h-24 border border-indigo-400 rounded-full animate-ping delay-300"></span>
    <span className="absolute w-32 h-32 border border-indigo-400 rounded-full animate-ping delay-700"></span>

    {/* PROFILE IMAGE (CENTER) */}
<img
  src={ownerPhoto || "/user.png"}
  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 z-10 shadow-[0_0_20px_rgba(99,102,241,0.7)]"
/>

  </div>

  <div className="flex flex-col items-start">
    <p className="text-sm font-bold text-gray-700">
      {ownerName || task.ownerName || task.ownerPhone || "Sender"}
    </p>

    <span className="text-xs">
      {ownerOnline ? "🟢 Online" : "Last seen recently"}
    </span>
  </div>

</div>

            {task.status === "waiting_for_runner" && (
              <>
                <p className="text-xl font-semibold">
                  Searching for runners<span className="animate-pulse">...</span>
                </p>

                <div className="w-full mt-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-2xl font-bold text-indigo-700">
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </p>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-3 border rounded-xl"
                    />
                    <input
                      value={credits}
                      onChange={e => setCredits(e.target.value)}
                      type="number"
                      className="w-full p-3 border rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="bg-white/40 backdrop-blur-xl border rounded-2xl p-4 text-left">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Offer: ${task.offerPrice}
                    </p>
                    <p className="text-sm text-gray-500">
                      Contact: {task.ownerPhone}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={async () => {
                      await remove(ref(db, `tasks/${task.city}/${taskId}`))
                      setOpen(false)
                    }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {

                      if (isEditing) {
                        await update(ref(db, `tasks/${task.city}/${taskId}`), {
                          title,
                          offerPrice: Number(credits),
                          createdAt: Date.now()
                        })
                        setIsEditing(false)
                      } else {
                        setTitle(task.title)
                        setCredits(task.offerPrice)
                        setIsEditing(true)
                      }

                    }}
                    className="flex-1 bg-yellow-500 text-white py-3 rounded-xl"
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>

                </div>
              </>
            )}

            {task.status === "bidding" && (
              <>
{/* 🔥 RUNNER WITH PROFILE PIC */}
<div className="flex items-center justify-center gap-3">

  <img
    src={runnerPhoto || "/user.png"}
    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
  />

  <div className="flex flex-col items-start">
    <p className="text-xl font-semibold">
      {runnerName || task.latestBid?.runnerName || "Runner"} made an offer
    </p>

    <span className="text-xs">
      {runnerOnline ? "🟢 Online" : "Last seen recently"}
    </span>
  </div>

</div>
                  
                <div className="w-full mt-4 space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-sm font-semibold text-indigo-600">
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </p>
                </div>

                <div className="bg-indigo-50 border rounded-2xl p-5">
                  <p className="text-4xl font-bold text-indigo-700">
                    ${displayPrice}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={async () => {

                      await update(
                        ref(db, `tasks/${task.city}/${taskId}`),
                        {
                          status: "accepted",
                          runnerId: task.latestBid?.runnerId,
                          runnerName: runnerName || task.latestBid?.runnerName || "Runner",
                          runnerPhone: task.latestBid?.runnerPhone || "",
                          finalPrice: displayPrice,
                          acceptedAt: Date.now()
                        }
                      )

                      await set(ref(db,`chats/${taskId}`),{
                        taskId:taskId,
                        city:task.city,
                        ownerId:task.ownerId,
                        runnerId:task.latestBid?.runnerId,
                        ownerName:ownerName || "Sender",
                        runnerName:runnerName || "Runner",
                        members:{
                          [task.ownerId]:true,
                          [task.latestBid?.runnerId]:true
                        },
                        createdAt:Date.now(),
                        lastMessage:"",
                        lastAt:Date.now()
                      })

                      router.push(`/chat/${taskId}`)

                    }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Accept
                  </button>

                  <button
                    onClick={async () => {

  // ✅ STEP 1: STORE BID BEFORE CLEARING
  const declinedBid = task.latestBid

  // ✅ STEP 2: UPDATE TASK
  await update(
    ref(db, `tasks/${task.city}/${taskId}`),
    {
      status: "waiting_for_runner",
      latestBid: null
    }
  )

  // ❌ if no bid, stop
  if (!declinedBid?.runnerId) return

  // 🔔 STEP 3: NOTIFY RUNNER
  try {
    const runnerSnap = await get(
      ref(db, `users/${declinedBid.runnerId}`)
    )

    const runnerSignalId = runnerSnap.val()?.oneSignalId

    if (runnerSignalId) {
      await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic YOUR_REST_API_KEY"
        },
        body: JSON.stringify({
          app_id: "cea0d2bd-0c2f-4126-85dc-b404c3482341",

          include_player_ids: [runnerSignalId],

          headings: { en: "Offer Declined ❌" },
          contents: { en: "Your offer was declined. Try another task." },

          data: {
            type: "task",
            taskId: taskId
          }
        })
      })
    }
  } catch (e) {
    console.log("Decline notification error:", e)
  }

}}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                  >
                    Decline
                  </button>

                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

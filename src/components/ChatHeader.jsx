'use client'

import { useEffect, useState } from "react"
import { ref, onValue, update, get, push, set } from "firebase/database"
import { db, auth } from "../lib/firebase"

export default function ChatHeader({ taskId }) {

  const uid = auth.currentUser?.uid || null
  const [task, setTask] = useState(null)
  const [busy, setBusy] = useState(false)

  const [otherUserName, setOtherUserName] = useState("")
  const [otherUserPhoto, setOtherUserPhoto] = useState("")

  /* 🔥 MODALS */
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [reasonText, setReasonText] = useState("")

  /* ================= LOAD TASK ================= */
  useEffect(() => {
    if (!taskId) return

    const tasksRef = ref(db, "tasks")
    return onValue(tasksRef, snap => {
      const data = snap.val() || {}
      for (const [city, cityTasks] of Object.entries(data)) {
        if (cityTasks?.[taskId]) {
          setTask({ id: taskId, city, ...cityTasks[taskId] })
          break
        }
      }
    })
  }, [taskId])

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (!task || !uid) return

    const otherUid =
      uid === task.ownerId ? task.runnerId :
      uid === task.runnerId ? task.ownerId :
      null

    if (!otherUid) return

    return onValue(ref(db, `users/${otherUid}`), snap => {
      const data = snap.val()
      if (data) {
        setOtherUserName(data.name || "User")
        setOtherUserPhoto(data.photo || "")
      }
    })
  }, [task, uid])

  if (!task || !uid) {
    return <div className="p-4 text-gray-400">Loading...</div>
  }

  /* ================= STATES ================= */
  const isOwner = uid === task.ownerId
  const isRunner = uid === task.runnerId

  const isAccepted = task.status === "accepted"
  const isPending = task.status === "completed_pending"
  const isCompleted = task.status === "completed"
  const isCancelled = task.status === "cancelled"
  const isDisputed = task.status === "disputed"
  const isCancelRequested = task.status === "cancel_requested"

  const isChatLocked =
    isCompleted || isCancelled || isDisputed

  const taskRef = ref(db, `tasks/${task.city}/${taskId}`)
  const chatMsgRef = ref(db, `chats/${taskId}/messages`)
  const escrowRef = ref(db, `escrow/${taskId}`)

  const callNumber =
    uid === task.ownerId ? task.runnerPhone : task.ownerPhone

  /* ================= COMPLETE ================= */
  const markCompleted = async () => {
    if (busy || !isRunner || !isAccepted) return
    setBusy(true)

    await update(taskRef, { status: "completed_pending" })

    await push(chatMsgRef, {
      system: true,
      text: "✅ Task marked completed",
      at: Date.now()
    })

    setBusy(false)
  }

  /* ================= CONFIRM ================= */
  const confirmCompletion = async () => {
    if (busy || !isOwner || !isPending) return
    setBusy(true)

    const credits = Number(task.finalPrice || task.offerPrice || 0)

    const balanceRef = ref(db, `wallets/${task.runnerId}/balance`)
    const snap = await get(balanceRef)
    const current = Number(snap.val() || 0)

    await set(balanceRef, current + credits)

    await update(taskRef, { status: "completed" })

    await push(chatMsgRef, {
      system: true,
      text: "🎉 Task completed successfully",
      at: Date.now()
    })

    setBusy(false)
  }

  /* ================= CANCEL ================= */
  const submitCancel = async () => {
    if (!reasonText) return
    setBusy(true)

    await update(taskRef, {
      status: "cancel_requested",
      cancelReason: reasonText,
      cancelRequestedBy: uid,
      cancelRequestedAt: Date.now()
    })

    await push(chatMsgRef, {
      system: true,
      text: `❌ Cancel requested: ${reasonText}`,
      at: Date.now()
    })

    setShowCancelModal(false)
    setReasonText("")
    setBusy(false)
  }

  /* ================= AGREE CANCEL ================= */
  const agreeCancel = async () => {
    setBusy(true)

    await update(taskRef, { status: "cancelled" })

    await push(chatMsgRef, {
      system: true,
      text: "⚠️ Task cancelled",
      at: Date.now()
    })

    setBusy(false)
  }

  /* ================= DISPUTE ================= */
  const submitDispute = async () => {
    if (!reasonText) return
    setBusy(true)

    await update(taskRef, {
      status: "disputed",
      disputeReason: reasonText
    })

    await push(chatMsgRef, {
      system: true,
      text: `⚖️ Dispute: ${reasonText}`,
      at: Date.now()
    })

    setShowDisputeModal(false)
    setReasonText("")
    setBusy(false)
  }

  /* ================= UI ================= */

  if (isDisputed) {
    return (
      <div className="p-4 text-center bg-yellow-100 text-yellow-700 text-sm">
        ⚖️ Task under dispute. Admin reviewing...
      </div>
    )
  }

  return (
    <>
      {/* HEADER */}
      <div className="p-3 bg-white flex justify-between items-center shadow">

        <div className="flex items-center gap-3">

          <img
            src={otherUserPhoto || "/default.png"}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="text-sm font-semibold">{otherUserName}</p>
            <p className="text-xs text-gray-400 capitalize">
              {task.status.replace("_", " ")}
            </p>
          </div>

          {callNumber && (
            <a href={`tel:${callNumber}`} className="ml-2 text-lg">📞</a>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">

          {isAccepted && isRunner && !isChatLocked && (
            <button onClick={markCompleted}
              className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs">
              Done
            </button>
          )}

          {isPending && isOwner && !isChatLocked && (
            <button onClick={confirmCompletion}
              className="px-3 py-1 rounded-full bg-green-600 text-white text-xs">
              Confirm
            </button>
          )}

          {isCancelRequested && uid !== task.cancelRequestedBy && (
            <button onClick={agreeCancel}
              className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs">
              Agree
            </button>
          )}

          {!isChatLocked && (
            <button onClick={() => setShowCancelModal(true)}
              className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">
              Cancel
            </button>
          )}

          {!isChatLocked && (
            <button onClick={() => setShowDisputeModal(true)}
              className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs">
              Dispute
            </button>
          )}

        </div>
      </div>

      {/* 🔥 GLASS MODAL (CANCEL + DISPUTE SHARED STYLE) */}
      {(showCancelModal || showDisputeModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowCancelModal(false)
              setShowDisputeModal(false)
            }}
          />

          <div className="relative w-[90%] max-w-sm p-5 rounded-3xl
            bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

            <h2 className="text-white text-center font-semibold text-lg">
              SendIt
            </h2>

            <p className="text-white/70 text-center text-sm mt-1">
              {showCancelModal ? "Cancel task?" : "Explain dispute"}
            </p>

            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl bg-white/20 text-white
              placeholder-white/60 border border-white/20 outline-none"
              placeholder="Type reason..."
            />

            <div className="flex gap-3 mt-5">

              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setShowDisputeModal(false)
                }}
                className="flex-1 py-2 rounded-xl bg-white/20 text-white">
                Close
              </button>

              <button
                onClick={showCancelModal ? submitCancel : submitDispute}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white">
                Send
              </button>

            </div>
          </div>
        </div>
      )}

    </>
  )
    }

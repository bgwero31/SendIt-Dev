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

/* NEW: confirm modal state */
const [confirmTask, setConfirmTask] = useState(null)

/* prevent toast spam */
const seenViews = useRef({})

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

await set(newTask,{  
  title,  
  offerPrice: amount,  
  ownerPhone: phone,  
  city: city,  
  status: "waiting_for_runner",  
  ownerId: uid,  
  createdAt: Date.now()  
})  

navigator.geolocation.getCurrentPosition(async (pos)=>{  

  const lat = pos.coords.latitude  
  const lng = pos.coords.longitude  

  await update(newTask,{  
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

    await push(ref(db, `wallets/${uid}/transactions`),{
      type:"debit",
      amount,
      title:`Posted task: ${title}`,
      at: Date.now()
    })

    setToastText("Task posted — waiting for a runner 🚀")
    setSuccess(true)

    setTimeout(()=>setSuccess(false),1500)

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
 <TrendingDealsSection />
      
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

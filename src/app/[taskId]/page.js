'use client'

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ref, onValue, push, update } from "firebase/database"
import { db, auth } from "../../../lib/firebase"
import Navbar from "../../../components/Navbar"
import ChatHeader from "../../../components/ChatHeader"

/* ===== TIME FORMAT ===== */
function formatTime(ts) {
if (!ts) return ""
return new Date(ts).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
})
}

/* ===== DISTANCE CALCULATOR ===== */
function getDistance(lat1, lon1, lat2, lon2) {
const R = 6371
const dLat = (lat2 - lat1) * Math.PI / 180
const dLon = (lon2 - lon1) * Math.PI / 180

const a =
Math.sin(dLat / 2) * Math.sin(dLat / 2) +
Math.cos(lat1 * Math.PI / 180) *
Math.cos(lat2 * Math.PI / 180) *
Math.sin(dLon / 2) * Math.sin(dLon / 2)

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
return R * c
}

/* ===== IMGBB ===== */
const IMGBB_KEY = "30df4aa05f1af3b3b58ee8a74639e5cf"

/* ===== IMAGE COMPRESSION ===== */
function compressImage(file, maxWidth = 1280, quality = 0.7) {
return new Promise(resolve => {
const img = new Image()
const reader = new FileReader()

reader.onload = e => (img.src = e.target.result)

img.onload = () => {
const scale = Math.min(1, maxWidth / img.width)
const canvas = document.createElement("canvas")
canvas.width = img.width * scale
canvas.height = img.height * scale
canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
canvas.toBlob(b => resolve(b), "image/jpeg", quality)
}

reader.readAsDataURL(file)
})
}

export default function ChatByTask() {
const router = useRouter()
const { taskId } = useParams()

const [myUid, setMyUid] = useState(null)
const [messages, setMessages] = useState([])
const [text, setText] = useState("")
const [locked, setLocked] = useState(false)
const [uploading, setUploading] = useState(false)
const [previewImg, setPreviewImg] = useState(null)

/* 🔥 YOUR STATES (UNCHANGED + ADDED) */
const [task, setTask] = useState(null)
const [myLocation, setMyLocation] = useState(null)
const [runnerLocation, setRunnerLocation] = useState(null) // ✅ ADDED

const bottomRef = useRef(null)
const fileRef = useRef(null)

/* ================= AUTH ================= */
useEffect(() => {
return auth.onAuthStateChanged(user => {
if (!user) router.replace("/login")
else setMyUid(user.uid)
})
}, [router])

/* 🔥 LIVE GET USER LOCATION (FIXED) */

  /* 🔥 SINGLE SOURCE OF TRUTH (FIXED) */
useEffect(() => {
  if (!navigator.geolocation || !myUid) return

  const watch = navigator.geolocation.watchPosition(
    pos => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      // ✅ UI
      setMyLocation({ lat, lng })

      // ✅ Firebase (for other user)
      update(ref(db, `users/${myUid}/liveLocation`), {
        lat,
        lng,
        updatedAt: Date.now()
      })
    },
    err => console.log(err),
    { enableHighAccuracy: true }
  )

  return () => navigator.geolocation.clearWatch(watch)
}, [myUid])

/* 🔥 LOAD TASK (UPDATED SMALL ONLY) */
useEffect(() => {
if (!taskId) return

const tasksRef = ref(db, "tasks")

return onValue(tasksRef, snap => {
const data = snap.val() || {}

for (const [city, cityTasks] of Object.entries(data)) {
if (cityTasks?.[taskId]) {

const t = { id: taskId, city, ...cityTasks[taskId] }
setTask(t)

/* 🔒 LOCK CHAT */
if (t.status === "completed" || t.status === "disputed") {
setLocked(true)
}

/* 🔥 LOAD RUNNER LOCATION */
if (t.runnerId) {
onValue(ref(db, `users/${t.runnerId}/liveLocation`), snap => {
const data = snap.val()
if (data) setRunnerLocation(data)
})
}

break
}
}
})
}, [taskId])

/* ================= MARK CHAT AS READ ================= */
useEffect(() => {
if (!taskId || !myUid) return

const msgRef = ref(db, `chats/${taskId}/messages`)

onValue(msgRef, snap => {
const data = snap.val() || {}

Object.entries(data).forEach(([id, m]) => {
if (m.from !== myUid && !m?.seenBy?.[myUid]) {
update(
ref(db, `chats/${taskId}/messages/${id}/seenBy`),
{ [myUid]: true }
)
}
})
}, { onlyOnce: true })

}, [taskId, myUid])

/* ================= LOAD CHAT ================= */
useEffect(() => {
if (!taskId || !myUid) return

const msgRef = ref(db, `chats/${taskId}/messages`)
return onValue(msgRef, snap => {
const data = snap.val() || {}
const list = Object.entries(data)
.map(([id, m]) => ({ id, ...m }))
.sort((a, b) => a.at - b.at)

setMessages(list)

list.forEach(m => {
if (m.from !== myUid && !m?.seenBy?.[myUid]) {
update(ref(db, `chats/${taskId}/messages/${m.id}/seenBy`), {
[myUid]: true
})
}
})
})
}, [taskId, myUid])

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages.length])

/* ================= SEND TEXT ================= */
const sendText = async () => {
if (!text.trim() || locked) return

const msgRef = push(ref(db, `chats/${taskId}/messages`))

await update(ref(db, `chats/${taskId}`), {
lastMessage: text,
lastAt: Date.now()
})

await update(msgRef, {
type: "text",
text,
from: myUid,
at: Date.now(),
seenBy: {}
})

setText("")
}

/* ================= SEND IMAGE ================= */
const sendImage = async file => {
if (!file || locked) return
setUploading(true)

const blob = await compressImage(file)
const form = new FormData()
form.append("image", blob)

const res = await fetch(
`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
{ method: "POST", body: form }
)

const imageUrl = (await res.json())?.data?.url
if (!imageUrl) return setUploading(false)

const msgRef = push(ref(db, `chats/${taskId}/messages`))

await update(ref(db, `chats/${taskId}`), {
lastMessage: "📷 Photo",
lastAt: Date.now()
})

await update(msgRef, {
type: "image",
image: imageUrl,
from: myUid,
at: Date.now(),
seenBy: {}
})

setUploading(false)
}

/* ================= SEND LOCATION ================= */
const sendCurrentLocation = () => {
if (!navigator.geolocation) return alert("Location not supported")

navigator.geolocation.getCurrentPosition(async pos => {
const msgRef = push(ref(db, `chats/${taskId}/messages`))

await update(ref(db, `chats/${taskId}`), {
lastMessage: "📍 Location",
lastAt: Date.now()
})

await update(msgRef, {
type: "location",
lat: pos.coords.latitude,
lng: pos.coords.longitude,
from: myUid,
at: Date.now(),
seenBy: {}
})
})
}

return (
<main className="min-h-screen bg-[#ece5dd] flex flex-col pb-24">

<ChatHeader taskId={taskId} />

{/* 🔥 TASK CARD */}
{task && (
<div className="px-3 pt-2">
<div className="relative overflow-hidden rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">

{/* 🔥 FLOATING SENDIT BACKGROUND */}
<div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
  <div className="text-5xl font-black tracking-widest text-gray-800 animate-bounce">
    SENDIT
  </div>
</div>

<div className="relative z-10">

<p className="font-semibold text-sm text-gray-800">
{task.title}
</p>

<div className="mt-2 text-xs text-gray-500 space-y-1">

<p>💰 ${task.finalPrice || task.offerPrice}</p>

<p>
📍 {task.city}

{/* 🟢 RUNNER VIEW */}
{task.pickupLat && myLocation && myUid !== task.ownerId && (
  <span className="ml-1 text-green-600 font-semibold">
    {(() => {
      const d = getDistance(
        myLocation.lat,
        myLocation.lng,
        task.pickupLat,
        task.pickupLng
      )
      const fixed = Math.max(0, d - 0.05)
      return `${fixed.toFixed(1)} km away`
    })()}
  </span>
)}

{/* 🔵 OWNER VIEW */}
{runnerLocation && myLocation && myUid === task.ownerId && (
  <span className="ml-1 text-blue-600 font-semibold">
    {(() => {
      const d = getDistance(
        myLocation.lat,
        myLocation.lng,
        runnerLocation.lat,
        runnerLocation.lng
      )
      const fixed = Math.max(0, d - 0.05)
      return `Runner ${fixed.toFixed(1)} km away`
    })()}
  </span>
)}

</p>

</div>
</div>
</div>
</div>
)}

{/* MESSAGES */}
<div className="flex-1 overflow-y-auto p-3 space-y-2">
{messages.map(m => {
const mine = m.from === myUid
return (
<div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
<div className={`rounded-2xl max-w-[75%] px-3 py-2 ${mine ? "bg-[#dcf8c6]" : "bg-white shadow"}`}>

{m.image && (
<img
src={m.image}
onClick={() => setPreviewImg(m.image)}
className="w-40 h-40 object-cover rounded-xl mb-1 cursor-pointer"
/>
)}

{m.type === "location" && (
<a
href={`https://maps.google.com/?q=${m.lat},${m.lng}`}
target="_blank"
className="text-blue-600 underline text-sm"
>
📍 View live location
</a>
)}

{m.text && <p className="text-sm">{m.text}</p>}

<div className="text-[10px] text-gray-500 text-right mt-1">
{formatTime(m.at)}
</div>
</div>
</div>
)
})}
<div ref={bottomRef} />
</div>

{/* INPUT */}
<div className="bg-white p-2 flex items-center gap-2 border-t">
<button onClick={sendCurrentLocation}>📍</button>

<button onClick={() => fileRef.current.click()}>📎</button>
<input ref={fileRef} type="file" hidden onChange={e => sendImage(e.target.files[0])} />

<input
value={text}
onChange={e => setText(e.target.value)}
className="flex-1 bg-gray-100 rounded-full px-4 py-2"
placeholder={locked ? "Chat closed" : "Message"}
/>

<button onClick={sendText}>➤</button>
</div>

<Navbar />
</main>
)
  }

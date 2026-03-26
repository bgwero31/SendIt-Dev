'use client'

import { useEffect, useState, useRef } from "react"
import { ref, onValue, get, set } from "firebase/database"
import { useRouter } from "next/navigation"
import { db, auth } from "../../lib/firebase"
import Navbar from "../../components/Navbar"

/* ===== TIME FORMAT (ADDED) ===== */
function formatChatTime(ts) {
  if (!ts) return ""
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function ChatsPage() {
  const router = useRouter()

  const [uid, setUid] = useState(null)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  /* ===== LONG PRESS ===== */
  const pressTimer = useRef(null)
  const [menuChat, setMenuChat] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (!user) {
        router.replace("/login")
        return
      }
      setUid(user.uid)
      setLoading(false)
    })
    return () => unsub()
  }, [router])

  /* ================= LOAD CHATS ================= */
  useEffect(() => {
    if (!uid) return

    const chatsRef = ref(db, "chats")

    return onValue(chatsRef, async snap => {
      const data = snap.val() || {}

      const list = await Promise.all(
        Object.entries(data)
          .filter(([_, chat]) => chat?.members?.[uid])
          .map(async ([_, chat]) => {

            const otherUid =
              chat.ownerId === uid ? chat.runnerId : chat.ownerId

            let displayName = "User"
            let photo = ""

            if (otherUid) {
              const userSnap = await get(ref(db, `users/${otherUid}`))
              if (userSnap.exists()) {
                const userData = userSnap.val()
                displayName = userData.name || "User"
                photo = userData.photo || ""
              }
            }

            const read = chat.read?.[uid] === true

            if (!read && chat.taskId) {
              await set(ref(db, `chats/${chat.taskId}/read/${uid}`), true)
            }

            return {
              taskId: chat.taskId,
              name: displayName,
              photo: photo || "",
              lastMessage:
                chat.lastType === "location"
                  ? "📍 Location shared"
                  : chat.lastMessage || "No messages yet",
              lastImage: chat.lastImage || null,
              lastAt: chat.lastAt || chat.createdAt || 0,
              read
            }
          })
      )

      list.sort((a, b) => b.lastAt - a.lastAt)

      setChats(list)
    })
  }, [uid])

  /* ===== LONG PRESS HANDLERS ===== */
  const startPress = (chat) => {
    pressTimer.current = setTimeout(() => {
      setMenuChat(chat)
      setMenuOpen(true)
    }, 600)
  }

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading chats…
      </div>
    )
  }

  return (
<main className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#11183a] pb-32">

<h1 className="text-2xl font-bold pt-6 px-6 page title">Chats</h1>

<div className="mt-6 space-y-2 px-4">

{chats.length === 0 && (
<p className="text-sm text-gray-400 text-center">
No conversations yet
</p>
)}

{chats.map(c => (
<button
key={c.taskId}

onMouseDown={() => startPress(c)}
onMouseUp={cancelPress}
onMouseLeave={cancelPress}
onTouchStart={() => startPress(c)}
onTouchEnd={cancelPress}

onClick={() => router.push(`/chat/${c.taskId}`)}

className="w-full p-4 flex justify-between items-center text-left
bg-white/70 backdrop-blur-md
border border-white/40
rounded-xl
shadow-sm
hover:shadow-md
transition
active:scale-[0.97]"
>

{/* LEFT */}
<div className="flex items-center gap-3 min-w-0">

{c.photo ? (
<img
src={c.photo}
className="w-10 h-10 rounded-full object-cover shadow-sm"
/>
) : (
<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs">
?
</div>
)}

<div className="min-w-0">
<p className="font-semibold truncate">
{c.name}
</p>

<p className="text-xs text-gray-400 truncate flex items-center gap-1">
{c.lastImage && <span>📷</span>}
{c.lastMessage}
</p>
</div>

</div>

{/* RIGHT */}
<div className="ml-3 flex flex-col items-end text-xs">

<span className="text-gray-400">
{formatChatTime(c.lastAt)}
</span>

{!c.read && (
<span className="mt-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
)}

<span className="text-sm">
{c.read ? (
<span className="text-purple-600 font-bold">✓✓</span>
) : (
<span className="text-yellow-500 font-bold">✓</span>
)}
</span>

</div>

</button>
))}

</div>

{/* ===== LONG PRESS DELETE MODAL ===== */}
{menuOpen && (
<div className="fixed inset-0 z-50 flex items-center justify-center">

  {/* dark overlay */}
  <div
    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    onClick={() => setMenuOpen(false)}
  />

  {/* modal */}
  <div className="relative bg-white rounded-2xl shadow-xl w-[85%] max-w-sm p-5 animate-scaleIn">

    <p className="text-center font-semibold text-lg">
      {menuChat?.name}
    </p>

    <p className="text-center text-sm text-gray-500 mt-1">
      Delete this conversation?
    </p>

    <div className="flex gap-3 mt-5">

      <button
        onClick={() => setMenuOpen(false)}
        className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium"
      >
        Cancel
      </button>

      <button
        onClick={async () => {
          await set(ref(db, `chats/${menuChat.taskId}/hidden/${uid}`), true)
          setMenuOpen(false)
        }}
        className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold shadow-sm active:scale-95 transition"
      >
        Delete
      </button>

    </div>

  </div>
</div>
)}
<Navbar />

</main>
)
        }

'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Home, ClipboardList, CreditCard, MessagesSquare, CircleUser } from "lucide-react"

import { auth, db } from "../lib/firebase"
import { ref, onValue } from "firebase/database"

export default function Navbar() {
  const path = usePathname()

  const [role, setRole] = useState(null)
  const [city, setCity] = useState(null)
  const [taskCount, setTaskCount] = useState(0)
  const [chatCount, setChatCount] = useState(0)

  /* ================= SAFE LOAD USER ================= */
  useEffect(() => {
    let offUser = null

    const unsubAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        setRole(null)
        setCity(null)
        return
      }

      const uid = user.uid
      const userRef = ref(db, `users/${uid}`)

      offUser = onValue(userRef, snap => {
        const data = snap.val() || {}
        setRole(data.role || "user")
        setCity(data.city || null)
      })
    })

    return () => {
      unsubAuth()
      if (offUser) offUser()
    }
  }, [])

  /* ================= TASK COUNT (RUNNERS ONLY) ================= */
  useEffect(() => {
    if (role !== "runner" || !city) {
      setTaskCount(0)
      return
    }

    const tasksRef = ref(db, `tasks/${city}`)

    const off = onValue(tasksRef, snap => {
      const data = snap.val() || {}
      let open = 0

      Object.values(data).forEach(t => {
        if (
          t?.status === "waiting_for_runner" ||
          t?.status === "bidding"
        ) {
          open++
        }
      })

      setTaskCount(open)
    })

    return () => off()
  }, [role, city])

  /* ================= CHAT COUNT ================= */
  useEffect(() => {
    let offChats = null

    const unsubAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        setChatCount(0)
        if (offChats) offChats()
        return
      }

      const uid = user.uid
      const chatsRef = ref(db, "chats")

      offChats = onValue(chatsRef, snap => {
        const data = snap.val() || {}
        let unreadRooms = 0

        Object.values(data).forEach(room => {
          if (!room.members?.[uid]) return
          if (room.hidden?.[uid]) return
          const hasUnread = Object.values(room.messages || {}).some(
            m => m.from !== uid && !m.readBy?.[uid]
          )

          if (hasUnread) unreadRooms++
        })

        setChatCount(unreadRooms)
      })
    })

    return () => {
      unsubAuth()
      if (offChats) offChats()
    }
  }, [])

  /* ================= NAV ITEM ================= */
const item = (href, icon, label, badge = 0) => {
  const active = path === href

  return (
    <Link
      href={href}
      className="flex flex-col items-center text-[11px] font-medium group"
    >
      <div
        className={`
        relative p-2 rounded-xl
        transition-all duration-200
        ${
          active
            ? "bg-indigo-100 text-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.35)] scale-110"
            : "text-gray-400 group-active:scale-95"
        }
      `}
      >
        {icon}

        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <span
        className={`mt-1 transition-colors ${
          active ? "text-indigo-600" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </Link>
  )
}

  /* ================= UI ================= */
  return (
    <div
      className="
      fixed bottom-4 left-4 right-4
      bg-white/80 backdrop-blur-xl
      border border-white/40
      shadow-[0_10px_40px_rgba(0,0,0,0.12)]
      rounded-2xl
      flex justify-around py-3
      z-50
    "
    >
{item("/", <Home size={20} />, "Home")}

{role === "runner" &&
  item("/tasks", <ClipboardList size={20} />, "Tasks", taskCount)
}

{item("/chat", <MessagesSquare size={20} />, "Chats", chatCount)}

{item("/wallet", <CreditCard size={20} />, "Wallet")}

{item("/profile", <CircleUser size={20} />, "Profile")}
    </div>
  )
                }

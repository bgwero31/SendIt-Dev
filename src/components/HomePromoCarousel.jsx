'use client'

import { useEffect, useRef, useState } from "react"
import { ref, runTransaction, onValue } from "firebase/database"
import { db } from "../lib/firebase"

/**
 PROMO SLIDES (MANUAL - KEEP ALL)
*/
const manualSlides = [
{
id: "fastlane-groceries",
type: "flash",
city: "ALL",
title: "Groceries delivered",
subtitle: "From nearby stores to your door",
image: "/promo/fastlane.png",
action: { type: "external", url: "https://wa.me/263774309795" }
},
{
id: "pharmacy-delivery",
type: "promo",
city: "ALL",
title: "",
subtitle: "",
image: "/promo/alliancephamarcy.png",
action: { type: "external", url: "https://wa.me/263774309795?text=Hi%20I%20need%20medicine%20delivery" }
},
{
id: "same-day-errands-1",
type: "onboarding",
city: "ALL",
title: "Same-day errands",
subtitle: "Fast runners around you",
image: "/promo/errandsbj2.png",
action: { type: "internal", url: "/tasks" }
},
{
id: "same-day-errands-2",
type: "promo",
city: "ALL",
title: "Food delivery",
subtitle: "Fast runners around you",
image: "/promo/errandsbj1.png",
action: { type: "internal", url: "/tasks" }
},
{
id: "same-day-errands-3",
type: "promo",
city: "ALL",
title: "Grocery deliveries within minutes",
subtitle: "Fast runners around you",
image: "/promo/sendit-grocery-banner.png",
action: { type: "internal", url: "/tasks" }
},
{
id: "sendit-brand",
type: "promo",
city: "ALL",
title: "Save your time",
subtitle: "Let SendIt handle it",
image: "/promo/sendit.png",
action: { type: "internal", url: "/tasks" }
}
]

// ⏱ TIMING
const TIMING = { promo: 7000, onboarding: 6000, flash: 5000 }

export default function HomePromoCarousel({ userCity }) {

const [index, setIndex] = useState(0)
const [visible, setVisible] = useState(true)
const [firebaseSlides, setFirebaseSlides] = useState([])
const [direction, setDirection] = useState("right")

const directions = ["left", "right", "top", "bottom"]
const timerRef = useRef(null)
const touchStartX = useRef(0)

/* FETCH */
useEffect(() => {
  const businessRef = ref(db, "businesses")

  return onValue(businessRef, (snap) => {
    const data = snap.val() || {}

    const list = Object.entries(data)
      .filter(([_, b]) => b.active)
      .map(([id, b]) => ({
        id,
        type: "promo",
        city: (b.city || "ALL").trim(),
        title: b.name,
        subtitle: "Fast delivery",
        image: b.image,
        promoText: b.promoText,
        plan: b.plan || "normal",
        action: { type: "external", url: `https://wa.me/${b.whatsapp}` }
      }))

    setFirebaseSlides(list)
  })
}, [])

/* RESET */
useEffect(() => { setIndex(0) }, [firebaseSlides])

/* MERGE + SORT */
const slides = [...firebaseSlides, ...manualSlides]

const sortedSlides = [...slides].sort((a, b) => {
  const order = { priority: 3, promo: 2, normal: 1 }
  return (order[b.plan] || 0) - (order[a.plan] || 0)
})

/* FILTER */
const finalSlides = sortedSlides.filter(s => {
  const slideCity = (s.city || "").toLowerCase()
  const user = (userCity || "").toLowerCase()
  if (!user || slideCity === "all") return true
  return slideCity === user
})

const slide = finalSlides[index]

/* ANALYTICS */
useEffect(() => {
  if (!slide?.id) return
  runTransaction(ref(db, `promoAnalytics/${slide.id}/views`), v => (v || 0) + 1)
}, [index])

/* AUTO SLIDE */
useEffect(() => {
  if (!slide) return

  clearTimeout(timerRef.current)

  timerRef.current = setTimeout(() => {
    setVisible(false)

    setTimeout(() => {
      setDirection(directions[Math.floor(Math.random() * directions.length)])
      setIndex(i => (i + 1) % finalSlides.length)
      setVisible(true)
    }, 250)

  }, TIMING[slide.type] || 5000)

  return () => clearTimeout(timerRef.current)
}, [index])

/* TOUCH */
const onTouchStart = e => touchStartX.current = e.touches[0].clientX

const onTouchEnd = e => {
  const diff = e.changedTouches[0].clientX - touchStartX.current
  if (diff > 40) setIndex(i => (i - 1 + finalSlides.length) % finalSlides.length)
  if (diff < -40) setIndex(i => (i + 1) % finalSlides.length)
}

/* CLICK */
const handleTap = () => {
  if (!slide?.action) return

  runTransaction(ref(db, `promoAnalytics/${slide.id}/clicks`), c => (c || 0) + 1)

  if (slide.action.type === "external") {
    window.open(slide.action.url, "_blank")
  } else {
    window.location.href = slide.action.url
  }
}

/* ANIMATION */
const getAnimation = () => {
  switch (direction) {
    case "left": return visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
    case "right": return visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    case "top": return visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    case "bottom": return visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
    default: return ""
  }
}

/* 🔥 DASH SYSTEM (FIXED) */
const visibleDots = 5

const getVisibleIndexes = () => {
  const start = Math.floor(index / visibleDots) * visibleDots
  const end = Math.min(start + visibleDots, finalSlides.length)
  return Array.from({ length: end - start }, (_, i) => start + i)
}

const colors = ["bg-blue-500", "bg-purple-500", "bg-amber-400"]

const getColor = () => colors[Math.floor(index / visibleDots) % colors.length]

if (!slide) return null

return (
<section className="relative w-full h-[260px] overflow-hidden">

<div
  onClick={handleTap}
  onTouchStart={onTouchStart}
  onTouchEnd={onTouchEnd}
  className="absolute inset-0 cursor-pointer overflow-hidden"
>

<img
  src={slide.image}
  className={`w-full h-full object-cover transition-all duration-[900ms] ${getAnimation()}`}
/>

{/* DEAL */}
{slide.promoText && (
  <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] px-3 py-1 rounded-full">
    DEAL ⚡
  </div>
)}

{/* ORDER */}
{slide.promoText && (
  <button className="absolute top-3 right-3 bg-black/90 text-white text-[11px] px-4 py-2 rounded-full">
    Order now
  </button>
)}

{/* GRADIENT */}
<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

{/* TEXT */}
<div className="absolute bottom-6 left-6 right-6">
  <h2 className="text-2xl font-bold text-white">{slide.title}</h2>
  <p className="text-sm text-white/90 mt-1">{slide.subtitle}</p>
</div>

{/* 🔥 DASHES (FULLY FIXED) */}
<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
  {getVisibleIndexes().map((i) => (
    <div
      key={i}
      className="relative w-5 h-[3px] bg-white/30 rounded-full overflow-hidden"
    >
      {i === index && (
        <div
          className={`absolute inset-0 ${getColor()} overflow-hidden`}
        >
          {/* 🔥 LIQUID FLOW */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
              animation: `liquidMove ${(TIMING[slide.type] || 5000)}ms linear infinite`
            }}
          />

          {/* 🔥 GLOW */}
          <div className="absolute inset-0 blur-[4px] opacity-40 bg-white animate-pulse" />
        </div>
      )}
    </div>
  ))}
</div>
 
</div>
</section>
)
         }

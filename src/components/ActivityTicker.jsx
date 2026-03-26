'use client'

import { useEffect, useState } from "react"

export default function ActivityTicker() {
  const cities = ["Zvishavane", "Harare", "Harare CBD", "Gweru"]

  const [city, setCity] = useState("Zvishavane")
  const [posts, setPosts] = useState(0)
  const [runners, setRunners] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

 const messages = [
  "⏱ Fast pickups happening right now",
  "✅ Trusted runners nearby ready to help",
  "📦 Small errands moving across the city",
  "🏍️ FASTLANE bikers delivering fast today",
  "⚡ Tasks getting accepted in seconds",

  "💊 Pharmacy pickups made simple",
  "📄 Send documents across town instantly",
  "📑 Urgent paperwork delivered safely",
  "🏥 Medicine deliveries happening today",

  "🛒 Grocery pickups available nearby",
  "🍔 Food deliveries moving fast",
  "📦 Quick parcel drop-offs available",

  "🚴 Local runners online right now",
  "📍 Someone near you is ready to run your errand",
  "⚡ SendIt runners responding quickly",

  "🏍️ FASTLANE bikers covering the city",
  "📦 Fastlane riders moving parcels today",
  "🚀 Speedy deliveries with FASTLANE bikers",

  "📄 Offices sending documents with SendIt",
  "💼 Business errands handled quickly",
  "📦 Packages moving between offices today",

  "⚡ Post a task and get help fast",
  "📍 Your errand could be the next delivery",
  "🚀 SendIt keeps the city moving"
]

  /* ===== PICK RANDOM 5 MESSAGES ===== */
  const pickRandomBatch = () => {
    const shuffled = [...messages].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 5)
  }

  const [currentBatch, setCurrentBatch] = useState(pickRandomBatch())

  /* ================= TIME LOGIC ================= */
  const isActiveHours = () => {
    const hour = new Date().getHours()
    return hour >= 7 && hour < 22
  }

  /* ================= RANDOM CITY ================= */
  const pickRandomCity = () => {
    const index = Math.floor(Math.random() * cities.length)
    setCity(cities[index])
  }

  /* ================= FAKE LIVE ACTIVITY ================= */
  useEffect(() => {
    const generateActivity = () => {
      if (!isActiveHours()) {
        setPosts(0)
        setRunners(0)
        return
      }

      setPosts(Math.floor(Math.random() * 6))
      setRunners(Math.floor(Math.random() * 4))
    }

    generateActivity()

    const activityInterval = setInterval(
      generateActivity,
      45000 + Math.random() * 45000
    )

    return () => clearInterval(activityInterval)
  }, [])

  /* ================= ROTATE CITY ================= */
  useEffect(() => {
    pickRandomCity()

    const cityInterval = setInterval(
      pickRandomCity,
      120000 + Math.random() * 120000
    )

    return () => clearInterval(cityInterval)
  }, [])

  /* ================= ROTATE MESSAGE ================= */
  useEffect(() => {

    const interval = setInterval(() => {

      setMessageIndex(i => {

        const next = i + 1

        if (next >= currentBatch.length) {
          setCurrentBatch(pickRandomBatch())
          return 0
        }

        return next
      })

    }, 6000)

    return () => clearInterval(interval)

  }, [currentBatch])

  return (
  <div className="relative overflow-hidden py-3">
  <div className="activity-track text-[13px] font-medium text-indigo-200 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] tracking-wide">

      <span className="brand text-indigo-300 font-semibold mr-2">SendIt</span>

      🔥 {posts} people posting errands in {city}
      <span className="dot mx-3 opacity-50">•</span>

      🚴 {runners} runners active near you
      <span className="dot mx-3 opacity-50">•</span>

      {currentBatch[messageIndex]}

    </div>
  </div>
)
}

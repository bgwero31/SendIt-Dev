'use client'

import { useEffect, useRef, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../lib/firebase"

export default function TrendingDealsSection() {

  /* 🔥 STATIC FALLBACK */
  const staticDeals = [
    {
      title: "Burger Combo",
      desc: "50% OFF • Fast delivery",
      img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
    },
    {
      title: "Pizza Deal",
      desc: "Free delivery",
      img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65"
    },
    {
      title: "Chicken & Chips",
      desc: "Hot & fresh",
      img: "https://images.unsplash.com/photo-1604908176997-4319bda1b1f3"
    },
    {
      title: "Healthy Meals",
      desc: "Under $5",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
    }
  ]

  /* 🔥 STATE */
  const [deals, setDeals] = useState(staticDeals)
  const [loading, setLoading] = useState(true)

  const sliderRef = useRef(null)

  /* 🔥 FETCH FROM FIREBASE */
  useEffect(() => {
    const dealsRef = ref(db, "deals")

    return onValue(dealsRef, snap => {
      const data = snap.val()

      if (data) {
        const list = Object.values(data)
        setDeals(list)
      }

      setLoading(false)
    })
  }, [])

  /* 🔥 AUTO SCROLL (TUNED FOR SMALL CARDS) */
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let scrollAmount = 0

    const interval = setInterval(() => {
      slider.scrollBy({ left: 130, behavior: "smooth" })
      scrollAmount += 130

      if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" })
        scrollAmount = 0
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="px-4 mt-4">

      {/* 🔥 TITLE */}
      <h2 className="text-[16px] font-semibold mb-2 text-white">
        🔥 Trending Deals
      </h2>

      {loading ? (
        <p className="text-gray-400 text-xs">Loading deals...</p>
      ) : (

        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >

          {deals
  .filter(deal => {

    if (filter === "All") return true

    if (filter === "Under $5") {
      return deal.price <= 5
    }

    if (filter === "Near & Fast") {
      return deal.fast === true
    }

    if (filter === "Top Rated") {
      return deal.rating >= 4.5
    }

    if (filter === "Popular") {
      return deal.popular === true
    }

    return true
  })
  .map((deal, i) => (

            <div
              key={i}
              className="min-w-[120px] flex flex-col snap-start cursor-pointer active:scale-95 transition"
            >

              {/* 🔥 IMAGE */}
              <div className="w-[120px] h-[85px] rounded-lg overflow-hidden">
                <img
                  src={deal.img}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 🔥 TEXT */}
              <div className="mt-1">
                <h3 className="text-[13px] font-medium text-white leading-tight">
                  {deal.title}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {deal.desc}
                </p>
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
    }

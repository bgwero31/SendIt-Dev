'use client'

import { useEffect, useRef, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../lib/firebase"

export default function TrendingDealsSection({ filter }) {
  
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

  const [deals, setDeals] = useState(staticDeals)
  const [visibleDeals, setVisibleDeals] = useState(staticDeals)

  const [loading, setLoading] = useState(true)
  const [filterLoading, setFilterLoading] = useState(false) // 🔥 NEW

  const sliderRef = useRef(null)

  /* 🔥 FETCH */
  useEffect(() => {
    const dealsRef = ref(db, "deals")

    return onValue(dealsRef, snap => {
      const data = snap.val()

      if (data) {
        const list = Object.values(data)
        setDeals(list)
        setVisibleDeals(list)
      }

      setLoading(false)
    })
  }, [])

  /* 🔥 FILTER WITH VISIBLE LOADING */
  useEffect(() => {
    if (!deals) return

    setFilterLoading(true) // 🔥 SHOW SHIMMER

    const timeout = setTimeout(() => {

      const filtered = deals.filter(deal => {

        if (filter === "All") return true

        if (filter === "Under $5") return (deal.price || 0) <= 5
        if (filter === "Near & Fast") return deal.fast === true
        if (filter === "Top Rated") return (deal.rating || 0) >= 4.5
        if (filter === "Popular") return deal.popular === true

        return true
      })

      setVisibleDeals(filtered.length ? filtered : deals)

      setFilterLoading(false) // 🔥 HIDE SHIMMER

    }, 700) // 🔥 LONG ENOUGH TO SEE

    return () => clearTimeout(timeout)

  }, [filter, deals])

  /* 🔥 AUTO SCROLL */
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

      <h2 className="text-[16px] font-semibold mb-2 text-white">
        🔥 Trending Deals
      </h2>

      {/* 🔥 GLOBAL LOADING */}
      {loading ? (
        <p className="text-gray-400 text-xs">Loading deals...</p>
      ) : (

        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >

          {/* 🔥 FILTER SHIMMER */}
          {filterLoading ? (

            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[120px]">

                <div className="w-[120px] h-[85px] rounded-lg shimmer" />

                <div className="mt-2 space-y-1">
                  <div className="h-3 w-20 rounded shimmer" />
                  <div className="h-2 w-14 rounded shimmer" />
                </div>

              </div>
            ))

          ) : (

            visibleDeals.map((deal, i) => (

              <div
                key={i}
                className="min-w-[120px] flex flex-col snap-start cursor-pointer transition-all duration-500 hover:scale-95"
              >

                <div className="w-[120px] h-[85px] rounded-lg overflow-hidden">
                  <img src={deal.img} className="w-full h-full object-cover" />
                </div>

                <div className="mt-1">
                  <h3 className="text-[13px] font-medium text-white">
                    {deal.title}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {deal.desc}
                  </p>
                </div>

              </div>

            ))

          )}

        </div>

      )}

      {/* 🔥 SHIMMER STYLE */}
      <style jsx>{`
        .shimmer {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.1);
        }

        .shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -150px;
          height: 100%;
          width: 150px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.3),
            transparent
          );
          animation: shimmer 1.2s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(300px);
          }
        }
      `}</style>

    </div>
  )
      }

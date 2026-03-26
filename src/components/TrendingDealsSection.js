'use client'

import { useEffect, useRef, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "../lib/firebase"

export default function TrendingDealsSection({ filter }) {
  
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
  const [visibleDeals, setVisibleDeals] = useState(staticDeals)
  const [loading, setLoading] = useState(true)
  const [animating, setAnimating] = useState(false)

  const sliderRef = useRef(null)

  /* 🔥 FETCH FROM FIREBASE */
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

  /* 🔥 FILTER + ANIMATION */
  useEffect(() => {
    if (!deals) return

    setAnimating(true)

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

      setAnimating(false)

    }, 400) // 🔥 slightly longer for shimmer visibility

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

          {/* 🔥 SKELETON WHEN FILTERING */}
          {animating ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[120px] animate-pulse">

                <div className="w-[120px] h-[85px] rounded-lg bg-gray-300/20 shimmer" />

                <div className="mt-2 space-y-1">
                  <div className="h-3 w-20 bg-gray-300/20 rounded shimmer" />
                  <div className="h-2 w-14 bg-gray-300/20 rounded shimmer" />
                </div>

              </div>
            ))
          ) : (

            visibleDeals.map((deal, i) => (

              <div
                key={i}
                className={`
                  min-w-[120px] flex flex-col snap-start cursor-pointer
                  transition-all duration-500 ease-out
                  ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
                `}
                style={{
                  transitionDelay: `${i * 60}ms`
                }}
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

            ))

          )}

        </div>

      )}

      {/* 🔥 SHIMMER STYLE */}
      <style jsx>{`
        .shimmer {
          position: relative;
          overflow: hidden;
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
            rgba(255,255,255,0.2),
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

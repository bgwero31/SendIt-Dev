'use client'

import { useEffect, useRef } from "react"

export default function TrendingDealsSection() {

  const deals = [
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

  useEffect(() => {
  const slider = sliderRef.current
  if (!slider) return

  let scrollAmount = 0

  const interval = setInterval(() => {
    slider.scrollBy({ left: 250, behavior: "smooth" })
    scrollAmount += 250

    if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
      slider.scrollTo({ left: 0, behavior: "smooth" })
      scrollAmount = 0
    }
  }, 3500)

  return () => clearInterval(interval)
}, [])
  
  return (
    <div className="px-4 mt-6">

      {/* 🔥 SECTION TITLE */}
      <h2 className="text-lg font-semibold mb-3 text-white">
        🔥 Trending Deals
      </h2>

      {/* 🔥 SLIDER */}
<div
  ref={sliderRef}
  className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory"
>

        {deals.map((deal, i) => (

          <div
            key={i}
            className="min-w-[220px] bg-white rounded-2xl shadow-md overflow-hidden snap-start hover:scale-[1.03] transition"
          >

            {/* IMAGE */}
            <img
              src={deal.img}
              className="w-full h-[130px] object-cover"
            />

            {/* INFO */}
            <div className="p-3">
              <h3 className="text-sm font-semibold">{deal.title}</h3>
              <p className="text-xs text-gray-500">{deal.desc}</p>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

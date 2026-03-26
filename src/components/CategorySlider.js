'use client'

import { useRef } from "react"

export default function CategorySlider() {

  const sliderRef = useRef(null)

  const categories = [
    { name: "Pizza", img: "https://images.unsplash.com/photo-1601924638867-3ec3c0b7c2d2" },
    { name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    { name: "Rolls", img: "https://images.unsplash.com/photo-1604908176997-4319bda1b1f3" },
    { name: "Chicken", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086" },
    { name: "Snacks", img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087" }
  ]

  return (
    <div className="px-4 mt-3">

      <div className="relative">

        {/* 🔥 STATIC CARD (LIKE ₹250) */}
        <div className="absolute left-0 top-0 z-10">

          <div className="flex flex-col items-center w-[75px]">

            <div className="w-[65px] h-[65px] rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-semibold shadow-md">
              UNDER<br/>$5
            </div>

            <p className="text-[11px] text-white mt-1 text-center">
              Explore
            </p>

          </div>

        </div>

        {/* 🔥 SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pl-[90px]"
        >

          {categories.map((cat, i) => (

            <div
              key={i}
              className="flex flex-col items-center min-w-[70px] cursor-pointer active:scale-95 transition"
            >

              {/* 🔥 IMAGE (REAL FOOD, NO CARTOON) */}
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-white/10">
                <img
                  src={cat.img}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 🔥 TEXT */}
              <p className="text-[11px] text-white mt-1 text-center leading-tight">
                {cat.name}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
    }

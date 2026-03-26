'use client'

import { useRef } from "react"

export default function CategorySlider() {

  const sliderRef = useRef(null)

  const categories = [
    { name: "Pizza", img: "https://source.unsplash.com/200x200/?pizza" },
    { name: "Burger", img: "https://source.unsplash.com/200x200/?burger" },
    { name: "Rolls", img: "https://source.unsplash.com/200x200/?wrap" },
    { name: "Chicken", img: "https://source.unsplash.com/200x200/?fried-chicken" },
    { name: "Snacks", img: "https://source.unsplash.com/200x200/?snacks" }
  ]

  return (
    <div className="px-4 mt-3">

      <div className="relative">

        {/* 🔥 MASK (THIS FIXES TEXT SHOWING BEHIND) */}
        <div className="absolute left-0 top-0 h-full w-[85px] bg-gradient-to-r from-[#11183a] to-transparent z-10" />

        {/* 🔥 STATIC CARD */}
        <div className="absolute left-0 top-0 z-20">

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
          className="flex gap-3 overflow-x-auto no-scrollbar pl-[90px]"
        >

          {categories.map((cat, i) => (

            <div
              key={i}
              className="flex flex-col items-center min-w-[65px] cursor-pointer active:scale-95 transition"
            >

              {/* 🔥 IMAGE */}
              <div className="w-[58px] h-[58px] rounded-full overflow-hidden bg-gray-200">
                <img
                  src={cat.img}
                  onError={(e) => e.target.src = "https://via.placeholder.com/200"}
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

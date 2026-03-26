'use client'

import { useRef } from "react"

export default function CategorySlider() {

  const sliderRef = useRef(null)

  const categories = [
    {
      name: "Pizza",
      img: "/images/pizza.png",
      fallback: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png"
    },
    {
      name: "Burger",
      img: "/images/burger.png",
      fallback: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
    },
    {
      name: "Rolls",
      img: "/images/rolls.png",
      fallback: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png"
    },
    {
      name: "Chicken",
      img: "/images/chicken.png",
      fallback: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
    },
    {
      name: "Snacks",
      img: "/images/snacks.png",
      fallback: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
    }
  ]

  return (
    <div className="px-4 mt-3">

      <div className="relative">

        {/* 🔥 LEFT FADE */}
        <div className="absolute left-0 top-0 h-full w-[80px] bg-gradient-to-r from-[#11183a] to-transparent z-10" />

        {/* 🔥 STATIC CARD */}
        <div className="absolute left-0 top-0 z-20">

          <div className="flex flex-col items-center w-[75px]">

            <div className="w-[65px] h-[65px] rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-semibold shadow-lg">
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
          className="flex gap-4 overflow-x-auto no-scrollbar pl-[95px]"
        >

          {categories.map((cat, i) => (

            <div
              key={i}
              className="flex flex-col items-center min-w-[72px] cursor-pointer active:scale-95 transition"
            >

              {/* 🔥 PERFECT SIZE ICON */}
              <div className="w-[56px] h-[56px] flex items-center justify-center">
                <img
                  src={cat.img}
                  onError={(e) => (e.currentTarget.src = cat.fallback)}
                  className="w-[50px] h-[50px] object-contain drop-shadow-lg"
                />
              </div>

              {/* 🔥 TEXT */}
              <p className="text-[11px] text-white mt-[4px] text-center leading-tight">
                {cat.name}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
    }

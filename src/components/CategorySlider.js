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

        {/* 🔥 LEFT FADE MASK */}
        <div className="absolute left-0 top-0 h-full w-[70px] bg-gradient-to-r from-[#11183a] to-transparent z-10" />

        {/* 🔥 STATIC CARD */}
        <div className="absolute left-0 top-0 z-20">

          <div className="flex flex-col items-center w-[65px]">

            <div className="w-[55px] h-[55px] rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-semibold shadow-md">
              UNDER<br/>$5
            </div>

            <p className="text-[10px] text-white mt-1 text-center">
              Explore
            </p>

          </div>

        </div>

        {/* 🔥 SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-2 overflow-x-auto no-scrollbar pl-[75px]"
        >

          {categories.map((cat, i) => (

            <div
              key={i}
              className="flex flex-col items-center min-w-[55px] cursor-pointer active:scale-95 transition"
            >

              {/* 🔥 FLOATING IMAGE (NO BACKGROUND) */}
              <div className="w-[48px] h-[48px] flex items-center justify-center">
                <img
                  src={cat.img}
                  onError={(e) => (e.currentTarget.src = cat.fallback)}
                  className="w-[42px] h-[42px] object-contain drop-shadow-md"
                />
              </div>

              {/* 🔥 TEXT */}
              <p className="text-[10px] text-white mt-[2px] text-center leading-tight">
                {cat.name}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
    }

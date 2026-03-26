'use client'

import { useState } from "react"
import { ZIM_CITIES } from "../lib/cities"

export default function CityPicker({ open, setCity }) {

  const [search, setSearch] = useState("")

  if (!open) return null

  const selectCity = (city) => {
    localStorage.setItem("sendit-city", city)
    setCity(city)
  }

  const filtered = ZIM_CITIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Select your city</h2>

        <input
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3 w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {filtered.map((city) => (
          <button
            key={city}
            onClick={() => selectCity(city)}
            className="
              w-full
              py-2.5
              text-sm
              rounded-lg
              border
              bg-indigo-600
              text-white
              active:scale-95
              transition
            "
          >
            {city}
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-4">
            No city found
          </p>
        )}

      </div>

    </div>
  )
}

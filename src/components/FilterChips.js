'use client'

export default function FilterChips({ active, setActive }) {

  const filters = [
    { label: "Filters", icon: "sliders" },
    { label: "Near & Fast", icon: "bolt" },
    { label: "Top Rated", icon: "star" },
    { label: "Under $5", icon: "cash" },
    { label: "Popular", icon: "fire" }
  ]

  const getIcon = (icon) => {
    switch (icon) {
      case "bolt": return "⚡"
      case "star": return "⭐"
      case "cash": return "💰"
      case "fire": return "🔥"
      default: return "☰"
    }
  }

  return (
    <div className="px-4 mt-3">

      <div className="flex gap-2 overflow-x-auto no-scrollbar">

        {filters.map((f, i) => {

          const isActive = active === f.label

          return (
            <button
              key={i}
              onClick={() => setActive(f.label)}
              className={`
                flex items-center gap-2
                px-4 py-[7px]
                rounded-full
                text-[12px]
                whitespace-nowrap
                transition-all duration-200

                ${isActive 
                  ? "bg-white text-black shadow-md scale-[1.05]" 
                  : "bg-white/10 text-white border border-white/10 backdrop-blur-md"
                }
              `}
            >

              <span className="text-[13px] opacity-90">
                {getIcon(f.icon)}
              </span>

              {f.label}

            </button>
          )
        })}

      </div>

    </div>
  )
                }

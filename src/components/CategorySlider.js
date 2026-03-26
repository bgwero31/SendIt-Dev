'use client'

export default function CategorySlider() {

  const categories = [
    { name: "Fast Food", img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
    { name: "Groceries", img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
    { name: "Pharmacy", img: "https://cdn-icons-png.flaticon.com/512/2966/2966488.png" },
    { name: "Cleaning", img: "https://cdn-icons-png.flaticon.com/512/995/995053.png" },
    { name: "Drinks", img: "https://cdn-icons-png.flaticon.com/512/2405/2405479.png" },
    { name: "Snacks", img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" }
  ]

  return (
    <div className="px-4 mt-4">

      {/* 🔥 ROW */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar">

        {categories.map((cat, i) => (

          <div
            key={i}
            className="flex flex-col items-center min-w-[70px] cursor-pointer"
          >

            {/* 🔥 ICON */}
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <img src={cat.img} className="w-10 h-10 object-contain" />
            </div>

            {/* 🔥 TEXT */}
            <p className="text-xs text-white mt-2 text-center">
              {cat.name}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}

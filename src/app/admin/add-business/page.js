'use client'

import { useEffect, useState } from "react"
import { db } from "../../../lib/firebase"
import { ref, set, onValue, remove } from "firebase/database"
import { uploadToIMGBB } from "../../../lib/upload"

export default function AddBusiness() {

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [category, setCategory] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [promoText, setPromoText] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // 🔥 PLAN STATE
  const [plan, setPlan] = useState("normal")

  const [businesses, setBusinesses] = useState([])

  /* ================= FETCH BUSINESSES ================= */
  useEffect(() => {
    const businessRef = ref(db, "businesses")

    return onValue(businessRef, (snap) => {
      const data = snap.val() || {}

      let list = Object.entries(data).map(([id, b]) => ({
        id,
        ...b
      }))

      list.sort((a, b) => {
        if (a.promoText && !b.promoText) return -1
        if (!a.promoText && b.promoText) return 1
        return 0
      })

      setBusinesses(list)
    })
  }, [])

  /* ================= ADD BUSINESS ================= */
  const handleSubmit = async () => {

    // ✅ ONLY require image + city
    if (!file || !city) return alert("Image and city required")

    setLoading(true)

    try {
      const imageUrl = await uploadToIMGBB(file)

      // ✅ fallback name if empty
      const finalName = name || "Business"

      // ✅ unique id (prevents overwrite)
      const id = finalName.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now()

      await set(ref(db, `businesses/${id}`), {
        name: finalName,
        city,
        category,
        whatsapp,
        image: imageUrl,
        promoText,
        plan,
        active: true,
        createdAt: Date.now()
      })

      // reset
      setName("")
      setCity("")
      setCategory("")
      setWhatsapp("")
      setPromoText("")
      setPlan("normal")
      setFile(null)

      alert("Business added 🚀")

    } catch (err) {
      console.error(err)
      alert("Error bro")
    }

    setLoading(false)
  }

  /* ================= DELETE ================= */
  const deleteBusiness = async (id) => {
    const confirmDelete = confirm("Delete this business?")
    if (!confirmDelete) return

    await remove(ref(db, `businesses/${id}`))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1f] to-[#11183a] text-white p-6">

      <h1 className="text-2xl font-bold mb-6">🚀 Add Business</h1>

      {/* FORM */}
      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl mb-8 space-y-3">

        <input
          placeholder="Business Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        />

        <input
          placeholder="City (e.g Zvishavane)"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        />

        <input
          placeholder="Category (optional)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        />

        <input
          placeholder="WhatsApp (263...)"
          value={whatsapp}
          onChange={e => setWhatsapp(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        />

        <input
          placeholder="Promo text (optional)"
          value={promoText}
          onChange={e => setPromoText(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        />

        {/* PLAN */}
        <select
          value={plan}
          onChange={e => setPlan(e.target.value)}
          className="w-full p-3 rounded-lg text-black"
        >
          <option value="normal">Normal ($5)</option>
          <option value="promo">Promo ($10)</option>
          <option value="priority">Priority ($20)</option>
        </select>

        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          className="text-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 py-3 rounded-xl font-semibold shadow-lg"
        >
          {loading ? "Uploading..." : "Save Business"}
        </button>
      </div>

      {/* LIST */}
      <h2 className="text-lg font-semibold mb-3">📦 Businesses</h2>

      <div className="grid gap-4">

        {businesses.map(b => (
          <div
            key={b.id}
            className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 overflow-hidden"
          >

            <img
              src={b.image}
              className="w-16 h-16 rounded-xl object-cover"
            />

            {/* PLAN BADGES */}
            {b.plan === "priority" && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
                TOP 💰
              </div>
            )}

            {b.plan === "promo" && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-full">
                PROMO ⚡
              </div>
            )}

            {/* DEAL BADGE */}
            {b.promoText && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-full font-semibold shadow-md">
                DEAL
              </div>
            )}

            <div className="flex-1">
              {/* Hide default "Business" name */}
              {b.name !== "Business" && (
                <p className="font-semibold">{b.name}</p>
              )}

              <p className="text-xs text-white/70">{b.city}</p>

              {b.promoText && (
                <p className="text-xs mt-1 text-yellow-300 font-semibold animate-pulse">
                  ⚡ {b.promoText}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteBusiness(b.id)}
              className="bg-red-500 px-3 py-1 rounded-lg text-sm"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  )
    }

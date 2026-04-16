"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onValue, ref } from "firebase/database"
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock3,
  ShieldCheck,
  Pill,
  HeartPulse,
  Baby,
  Sparkles,
  ChevronRight,
  ShoppingCart,
  Store,
  Plus,
  Minus,
  FileText,
  Truck,
  Stethoscope
} from "lucide-react"

import { db } from "../../lib/firebase"

const IMG = {
  paracetamol:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Medication%20Paracetamol.JPG",
  ibuprofen:
    "https://commons.wikimedia.org/wiki/Special:FilePath/200mg%20ibuprofen%20tablets.jpg",
  coughSyrup:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vintage%20Turkish%20pediatric%20cough%20syrup%20bottle.png",
  vitamins:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vitamin%20tablets%20%2827522813860%29.jpg",
  pills:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Paracetamol%20acetaminophen%20500%20mg%20pills.jpg"
}

function ProductImage({ src, alt, className = "" }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4] ${className}`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Pill className="h-6 w-6 text-[#173ea5]" />
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4] ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

const FALLBACK_STORE_META = {
  "alliance-pharmacy": {
    id: "alliance-pharmacy",
    name: "Alliance Pharmacy",
    tagline: "Fast medicine access, trusted local care",
    eta: "18–35 min",
    badge: "Open now",
    coverImage: IMG.vitamins
  },
  "rehome-pharmacy": {
    id: "rehome-pharmacy",
    name: "Rehome Pharmacy",
    tagline: "Daily health essentials and prescription support",
    eta: "20–40 min",
    badge: "Popular",
    coverImage: IMG.ibuprofen
  }
}

const FALLBACK_PROMOS = {
  "alliance-pharmacy": [
    {
      id: "promo1",
      title: "Wellness Week",
      subtitle: "Selected vitamins and essentials",
      tag: "Up to 20% off",
      image: IMG.vitamins
    },
    {
      id: "promo2",
      title: "Fast pickup ready",
      subtitle: "Order now and collect from store",
      tag: "Pickup today",
      image: IMG.paracetamol
    },
    {
      id: "promo3",
      title: "Prescription support",
      subtitle: "Upload your script for pharmacist review",
      tag: "Secure process",
      image: IMG.coughSyrup
    }
  ],
  "rehome-pharmacy": [
    {
      id: "promo1",
      title: "Rehome Care Deals",
      subtitle: "Everyday pharmacy value picks",
      tag: "Fresh offers",
      image: IMG.ibuprofen
    },
    {
      id: "promo2",
      title: "Message before you travel",
      subtitle: "Check if your medicine is available",
      tag: "Quick response",
      image: IMG.coughSyrup
    },
    {
      id: "promo3",
      title: "Family essentials",
      subtitle: "Baby care, vitamins and more",
      tag: "Popular",
      image: IMG.vitamins
    }
  ]
}

const FALLBACK_PRODUCTS = {
  "alliance-pharmacy": [
    {
      id: "a1",
      name: "Panado",
      size: "500mg tablets",
      price: 3.5,
      oldPrice: 4,
      category: "Pain Relief",
      rx: false,
      image: IMG.paracetamol,
      description: "Popular pain relief tablets.",
      stock: "In stock",
      visible: true
    },
    {
      id: "a2",
      name: "Vitamin C",
      size: "1000mg",
      price: 6.99,
      oldPrice: 0,
      category: "Vitamins",
      rx: false,
      image: IMG.vitamins,
      description: "Daily vitamin support.",
      stock: "In stock",
      visible: true
    },
    {
      id: "a3",
      name: "Cough Syrup",
      size: "120ml",
      price: 5.8,
      oldPrice: 0,
      category: "Cold & Flu",
      rx: false,
      image: IMG.coughSyrup,
      description: "Soothing cough syrup.",
      stock: "In stock",
      visible: true
    },
    {
      id: "a9",
      name: "Amoxicillin",
      size: "Capsules",
      price: 0,
      oldPrice: 0,
      category: "Prescription",
      rx: true,
      image: IMG.pills,
      description: "Prescription antibiotic item.",
      stock: "By review",
      visible: true
    }
  ],
  "rehome-pharmacy": [
    {
      id: "r1",
      name: "Ibuprofen",
      size: "400mg",
      price: 4.2,
      oldPrice: 0,
      category: "Pain Relief",
      rx: false,
      image: IMG.ibuprofen,
      description: "Pain relief and inflammation support.",
      stock: "In stock",
      visible: true
    },
    {
      id: "r2",
      name: "Zinc + C",
      size: "Effervescent tabs",
      price: 7.5,
      oldPrice: 0,
      category: "Vitamins",
      rx: false,
      image: IMG.vitamins,
      description: "Immune support formula.",
      stock: "In stock",
      visible: true
    },
    {
      id: "r3",
      name: "Flu Relief",
      size: "Capsules",
      price: 5.6,
      oldPrice: 6.2,
      category: "Cold & Flu",
      rx: false,
      image: IMG.coughSyrup,
      description: "General flu support.",
      stock: "In stock",
      visible: true
    },
    {
      id: "r9",
      name: "Antibiotic Refill",
      size: "Prescription item",
      price: 0,
      oldPrice: 0,
      category: "Prescription",
      rx: true,
      image: IMG.pills,
      description: "Prescription refill flow.",
      stock: "By review",
      visible: true
    }
  ]
}

const BASE_CATEGORIES = [
  { id: "pain", name: "Pain Relief", icon: Pill },
  { id: "cold", name: "Cold & Flu", icon: HeartPulse },
  { id: "vitamins", name: "Vitamins", icon: Sparkles },
  { id: "baby", name: "Baby Care", icon: Baby },
  { id: "care", name: "Personal Care", icon: ShieldCheck },
  { id: "clinic", name: "Clinic", icon: Stethoscope }
]

function priceNumber(value) {
  if (typeof value === "number") return value
  if (!value) return 0
  const cleaned = String(value).replace(/[^0-9.]/g, "")
  return Number(cleaned || 0)
}

function cartKey(storeId) {
  return `sendit_pharmacy_cart_${storeId}`
}

export default function PharmacyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const storeParam = searchParams.get("store") || "alliance-pharmacy"
  const cityParam = searchParams.get("city") || "Harare"

  const [storeMeta, setStoreMeta] = useState({
    ...FALLBACK_STORE_META[storeParam],
    location: cityParam
  })
  const [promos, setPromos] = useState(FALLBACK_PROMOS[storeParam] || [])
  const [products, setProducts] = useState(FALLBACK_PRODUCTS[storeParam] || [])
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [promoIndex, setPromoIndex] = useState(0)
  const [cart, setCart] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cartKey(storeParam))
      setCart(saved ? JSON.parse(saved) : {})
    } catch {
      setCart({})
    }
  }, [storeParam])

  useEffect(() => {
    localStorage.setItem(cartKey(storeParam), JSON.stringify(cart))
  }, [cart, storeParam])

  useEffect(() => {
    const storeRef = ref(db, `pharmacies/${storeParam}`)
    const unsub = onValue(storeRef, (snap) => {
      const data = snap.val()
      if (data) {
        setStoreMeta({
          id: storeParam,
          name: data.name || FALLBACK_STORE_META[storeParam]?.name || "Pharmacy",
          tagline: data.tagline || FALLBACK_STORE_META[storeParam]?.tagline || "",
          eta: data.eta || FALLBACK_STORE_META[storeParam]?.eta || "18–35 min",
          badge: data.badge || FALLBACK_STORE_META[storeParam]?.badge || "Open now",
          coverImage: data.coverImage || FALLBACK_STORE_META[storeParam]?.coverImage || "",
          location: data.city || cityParam
        })
      } else {
        setStoreMeta({
          ...FALLBACK_STORE_META[storeParam],
          location: cityParam
        })
      }
    })

    return () => unsub()
  }, [storeParam, cityParam])

  useEffect(() => {
    const promoRef = ref(db, `pharmacyPromos/${storeParam}`)
    const unsub = onValue(promoRef, (snap) => {
      const data = snap.val()
      if (!data) {
        setPromos(FALLBACK_PROMOS[storeParam] || [])
        return
      }
      const list = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .filter((item) => item.active !== false)

      setPromos(list.length ? list : FALLBACK_PROMOS[storeParam] || [])
    })

    return () => unsub()
  }, [storeParam])

  useEffect(() => {
    const productsRef = ref(db, `pharmacyProducts/${storeParam}`)
    const unsub = onValue(productsRef, (snap) => {
      const data = snap.val()
      if (!data) {
        setProducts(FALLBACK_PRODUCTS[storeParam] || [])
        return
      }

      const list = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
          price: priceNumber(value.price),
          oldPrice: priceNumber(value.oldPrice)
        }))
        .filter((item) => item.visible !== false)

      setProducts(list.length ? list : FALLBACK_PRODUCTS[storeParam] || [])
    })

    return () => unsub()
  }, [storeParam])

  useEffect(() => {
    if (!promos.length) return
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1))
    }, 3500)
    return () => clearInterval(timer)
  }, [promos])

  useEffect(() => {
    if (promoIndex > promos.length - 1) {
      setPromoIndex(0)
    }
  }, [promos, promoIndex])

  const categoryNames = useMemo(() => {
    const dynamic = Array.from(
      new Set(products.map((item) => item.category).filter(Boolean))
    )
    return ["All", ...dynamic]
  }, [products])

  const sections = useMemo(() => {
    const filtered = products.filter((item) => {
      const matchesQuery =
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.size?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase())

      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory

      return matchesQuery && matchesCategory
    })

    return [
      {
        id: "products",
        title: activeCategory === "All" ? "Available medicines" : activeCategory,
        subtitle: "Live from this pharmacy",
        items: filtered
      }
    ]
  }, [products, query, activeCategory])

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  const cartSubtotal = useMemo(() => {
    return products.reduce((sum, item) => {
      const qty = cart[item.id] || 0
      return sum + qty * priceNumber(item.price)
    }, 0)
  }, [cart, products])

  const increaseQty = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const decreaseQty = (id) => {
    setCart((prev) => {
      const nextQty = (prev[id] || 0) - 1
      if (nextQty <= 0) {
        const cloned = { ...prev }
        delete cloned[id]
        return cloned
      }
      return { ...prev, [id]: nextQty }
    })
  }

  const openProduct = (id) => {
    router.push(
      `/pharmacy/product/${id}?store=${storeParam}&city=${encodeURIComponent(cityParam)}`
    )
  }

  const goToCart = () => {
    router.push(`/pharmacy/cart?store=${storeParam}&city=${encodeURIComponent(cityParam)}`)
  }

  const goToCheckout = () => {
    router.push(`/pharmacy/checkout?store=${storeParam}&city=${encodeURIComponent(cityParam)}`)
  }

  const goToPrescription = () => {
    router.push(`/pharmacy/prescription?store=${storeParam}&city=${encodeURIComponent(cityParam)}`)
  }

  const goToRequest = () => {
    router.push(`/pharmacy/request?store=${storeParam}&city=${encodeURIComponent(cityParam)}`)
  }

  const goToOrders = () => {
    router.push(`/pharmacy/orders?store=${storeParam}&city=${encodeURIComponent(cityParam)}`)
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-32">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#142347] to-[#1f3c88] px-4 pb-6 pt-4 text-white">
        <div className="absolute inset-0 opacity-15">
          <img
            src={storeMeta.coverImage || FALLBACK_STORE_META[storeParam]?.coverImage}
            alt={storeMeta.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-8 top-24 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#0f172a]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Store className="h-3.5 w-3.5" />
              {storeMeta.badge}
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              {storeMeta.name}
            </h1>

            <p className="mt-1 max-w-[560px] text-[13px] text-white/80">
              {storeMeta.tagline}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {storeMeta.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {storeMeta.eta}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified store
              </span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max gap-2 pr-4">
              {Object.values(FALLBACK_STORE_META).map((store) => {
                const isActive = store.id === storeParam
                return (
                  <button
                    key={store.id}
                    onClick={() =>
                      router.push(
                        `/pharmacy?store=${store.id}&city=${encodeURIComponent(cityParam)}`
                      )
                    }
                    className={`rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                      isActive
                        ? "bg-white text-[#0f172a]"
                        : "border border-white/15 bg-white/10 text-white"
                    }`}
                  >
                    {store.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-3 rounded-[22px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
              <Search className="h-4.5 w-4.5 text-white/80" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicine, vitamins, syrup..."
                className="w-full bg-transparent text-[13px] text-white placeholder:text-white/55 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-4 px-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={goToPrescription}
            className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
              <FileText className="h-4.5 w-4.5 text-[#173ea5]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">Upload script</p>
            <p className="mt-1 text-[11px] text-neutral-500">For prescriptions</p>
          </button>

          <button
            onClick={goToCheckout}
            className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
              <Truck className="h-4.5 w-4.5 text-[#0c8f4d]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">Pickup / delivery</p>
            <p className="mt-1 text-[11px] text-neutral-500">Fast local handoff</p>
          </button>

          <button
            onClick={goToRequest}
            className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6ee]">
              <Stethoscope className="h-4.5 w-4.5 text-[#c96b16]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">Ask pharmacist</p>
            <p className="mt-1 text-[11px] text-neutral-500">Check availability</p>
          </button>
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] text-white">
            <div className="absolute inset-0">
              <img
                src={promos[promoIndex]?.image}
                alt={promos[promoIndex]?.title}
                className="h-full w-full object-cover opacity-30"
              />
            </div>
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative z-10 flex min-h-[220px] items-center p-5">
              <div className="max-w-[420px]">
                <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold backdrop-blur-xl">
                  {promos[promoIndex]?.tag}
                </div>

                <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em]">
                  {promos[promoIndex]?.title}
                </h2>

                <p className="mt-2 text-[13px] text-white/80">
                  {promos[promoIndex]?.subtitle}
                </p>

                <button
                  onClick={goToOrders}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#101828]"
                >
                  Open orders
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-3">
            {promos.map((promo, index) => (
              <button
                key={promo.id}
                onClick={() => setPromoIndex(index)}
                className={`h-2 rounded-full transition ${
                  promoIndex === index ? "w-7 bg-[#1f3c88]" : "w-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="mb-3">
          <p className="text-[15px] font-semibold text-neutral-900">Explore categories</p>
          <p className="text-[11px] text-neutral-500">Fast way to browse health items</p>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-3 pr-4">
            {categoryNames.map((name) => {
              const fallbackIcon =
                BASE_CATEGORIES.find((item) => item.name === name)?.icon || Pill
              const Icon = fallbackIcon
              const isActive = activeCategory === name

              return (
                <button
                  key={name}
                  onClick={() => setActiveCategory(name)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                    isActive
                      ? "bg-[#10214e] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[20px] border border-neutral-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">Items</p>
            <p className="mt-1 text-[20px] font-semibold text-neutral-900">{products.length}+</p>
          </div>
          <div className="rounded-[20px] border border-neutral-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">Cart</p>
            <p className="mt-1 text-[20px] font-semibold text-neutral-900">{cartCount}</p>
          </div>
          <div className="rounded-[20px] border border-neutral-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">Subtotal</p>
            <p className="mt-1 text-[20px] font-semibold text-neutral-900">${cartSubtotal.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-6">
        {sections.map((section) => {
          if (!section.items.length) return null

          return (
            <div key={section.id}>
              <div className="mb-3 px-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
                      {section.title}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">{section.subtitle}</p>
                  </div>

                  <button onClick={goToOrders} className="text-[12px] font-semibold text-[#1d3f98]">
                    See all
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-hide px-4">
                <div className="flex min-w-max gap-3 pr-4">
                  {section.items.map((item) => {
                    const qty = cart[item.id] || 0

                    return (
                      <div
                        key={item.id}
                        className="w-[184px] rounded-[24px] border border-neutral-200 bg-white p-3 shadow-[0_8px_22px_rgba(0,0,0,0.05)]"
                      >
                        <button onClick={() => openProduct(item.id)} className="block w-full text-left">
                          <div className="relative">
                            <ProductImage
                              src={item.image}
                              alt={item.name}
                              className="h-[126px] rounded-[20px]"
                            />
                            {item.rx && (
                              <span className="absolute left-2 top-2 rounded-full bg-[#10214e] px-2 py-1 text-[9px] font-semibold text-white">
                                Prescription
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <p className="line-clamp-1 text-[13px] font-semibold text-neutral-900">
                              {item.name}
                            </p>
                            <p className="mt-1 text-[11px] text-neutral-500">{item.size}</p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[14px] font-semibold text-neutral-900">
                                {item.price > 0 ? `$${item.price.toFixed(2)}` : "By review"}
                              </span>
                              {item.oldPrice > 0 ? (
                                <span className="text-[11px] text-neutral-400 line-through">
                                  ${item.oldPrice.toFixed(2)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                            {item.category}
                          </span>

                          {!item.rx ? (
                            qty > 0 ? (
                              <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1">
                                <button
                                  onClick={() => decreaseQty(item.id)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-[14px] text-center text-[12px] font-semibold text-neutral-900">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => increaseQty(item.id)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10214e] text-white"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => increaseQty(item.id)}
                                className="rounded-full bg-[#10214e] px-3 py-1.5 text-[11px] font-semibold text-white"
                              >
                                Add
                              </button>
                            )
                          ) : (
                            <button
                              onClick={goToPrescription}
                              className="rounded-full border border-neutral-200 px-3 py-1.5 text-[11px] font-semibold text-neutral-700"
                            >
                              Request
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {sections.every((section) => section.items.length === 0) && (
        <section className="px-4 py-12">
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
              <Search className="h-6 w-6 text-neutral-500" />
            </div>
            <p className="mt-4 text-[16px] font-semibold text-neutral-900">No medicine found</p>
            <p className="mt-1 text-[12px] text-neutral-500">
              Try another search or switch pharmacy
            </p>
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[24px] bg-[#101828] px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[11px] text-white/65">
              {cartCount > 0 ? `${cartCount} item(s) selected` : "Ready to order"}
            </p>
            <p className="text-[14px] font-semibold">
              {cartCount > 0 ? `Subtotal $${cartSubtotal.toFixed(2)}` : "Pickup or delivery available"}
            </p>
          </div>

          <button
            onClick={cartCount > 0 ? goToCart : goToCheckout}
            className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#101828]"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  )
  }

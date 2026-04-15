"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

export default function PharmacyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const storeParam = searchParams.get("store") || "alliance-pharmacy"
  const cityParam = searchParams.get("city") || "Harare"

  const stores = [
    {
      id: "alliance-pharmacy",
      name: "Alliance Pharmacy",
      tagline: "Fast medicine access, trusted local care",
      eta: "18–35 min",
      location: cityParam,
      badge: "Open now"
    },
    {
      id: "rehome-pharmacy",
      name: "Rehome Pharmacy",
      tagline: "Daily health essentials and prescription support",
      eta: "20–40 min",
      location: cityParam,
      badge: "Popular"
    }
  ]

  const activeStore =
    stores.find((s) => s.id === storeParam) || stores[0]

  const storeCatalogs = {
    "alliance-pharmacy": {
      promos: [
        {
          id: 1,
          title: "Wellness Week",
          subtitle: "Selected vitamins and essentials",
          tag: "Up to 20% off"
        },
        {
          id: 2,
          title: "Fast pickup ready",
          subtitle: "Order now and collect from store",
          tag: "Pickup today"
        },
        {
          id: 3,
          title: "Prescription support",
          subtitle: "Upload your script for pharmacist review",
          tag: "Secure process"
        }
      ],
      categories: [
        { id: "pain", name: "Pain Relief", icon: Pill },
        { id: "cold", name: "Cold & Flu", icon: HeartPulse },
        { id: "vitamins", name: "Vitamins", icon: Sparkles },
        { id: "baby", name: "Baby Care", icon: Baby },
        { id: "care", name: "Personal Care", icon: ShieldCheck },
        { id: "clinic", name: "Clinic", icon: Stethoscope }
      ],
      sections: [
        {
          id: "trending",
          title: "Trending near you",
          subtitle: "Popular pharmacy picks",
          items: [
            {
              id: "a1",
              name: "Panado",
              size: "500mg tablets",
              price: "$3.50",
              oldPrice: "$4.00",
              category: "Pain Relief",
              rx: false
            },
            {
              id: "a2",
              name: "Vitamin C",
              size: "1000mg",
              price: "$6.99",
              oldPrice: "",
              category: "Vitamins",
              rx: false
            },
            {
              id: "a3",
              name: "Cough Syrup",
              size: "120ml",
              price: "$5.80",
              oldPrice: "",
              category: "Cold & Flu",
              rx: false
            },
            {
              id: "a4",
              name: "ORS Sachets",
              size: "Pack of 10",
              price: "$4.50",
              oldPrice: "",
              category: "Care",
              rx: false
            }
          ]
        },
        {
          id: "daily",
          title: "Daily essentials",
          subtitle: "Useful every day items",
          items: [
            {
              id: "a5",
              name: "Paracetamol",
              size: "500mg",
              price: "$2.20",
              oldPrice: "",
              category: "Pain Relief",
              rx: false
            },
            {
              id: "a6",
              name: "Multivitamins",
              size: "30 capsules",
              price: "$8.99",
              oldPrice: "$10.50",
              category: "Vitamins",
              rx: false
            },
            {
              id: "a7",
              name: "Nasal Spray",
              size: "15ml",
              price: "$6.20",
              oldPrice: "",
              category: "Cold & Flu",
              rx: false
            },
            {
              id: "a8",
              name: "Hand Sanitizer",
              size: "250ml",
              price: "$3.40",
              oldPrice: "",
              category: "Personal Care",
              rx: false
            }
          ]
        },
        {
          id: "prescription",
          title: "Prescription requests",
          subtitle: "Upload script and request pharmacist review",
          items: [
            {
              id: "a9",
              name: "Amoxicillin",
              size: "Capsules",
              price: "By review",
              oldPrice: "",
              category: "Prescription",
              rx: true
            },
            {
              id: "a10",
              name: "Blood Pressure Tabs",
              size: "Monthly refill",
              price: "By review",
              oldPrice: "",
              category: "Prescription",
              rx: true
            },
            {
              id: "a11",
              name: "Diabetes Refill",
              size: "Repeat request",
              price: "By review",
              oldPrice: "",
              category: "Prescription",
              rx: true
            }
          ]
        }
      ]
    },

    "rehome-pharmacy": {
      promos: [
        {
          id: 1,
          title: "Rehome Care Deals",
          subtitle: "Everyday pharmacy value picks",
          tag: "Fresh offers"
        },
        {
          id: 2,
          title: "Message before you travel",
          subtitle: "Check if your medicine is available",
          tag: "Quick response"
        },
        {
          id: 3,
          title: "Family essentials",
          subtitle: "Baby care, vitamins and more",
          tag: "Popular"
        }
      ],
      categories: [
        { id: "pain", name: "Pain Relief", icon: Pill },
        { id: "cold", name: "Cold & Flu", icon: HeartPulse },
        { id: "vitamins", name: "Vitamins", icon: Sparkles },
        { id: "baby", name: "Baby Care", icon: Baby },
        { id: "care", name: "Personal Care", icon: ShieldCheck },
        { id: "clinic", name: "Clinic", icon: Stethoscope }
      ],
      sections: [
        {
          id: "trending",
          title: "Trending near you",
          subtitle: "Top moving items at Rehome",
          items: [
            {
              id: "r1",
              name: "Ibuprofen",
              size: "400mg",
              price: "$4.20",
              oldPrice: "",
              category: "Pain Relief",
              rx: false
            },
            {
              id: "r2",
              name: "Zinc + C",
              size: "Effervescent tabs",
              price: "$7.50",
              oldPrice: "",
              category: "Vitamins",
              rx: false
            },
            {
              id: "r3",
              name: "Flu Relief",
              size: "Capsules",
              price: "$5.60",
              oldPrice: "$6.20",
              category: "Cold & Flu",
              rx: false
            },
            {
              id: "r4",
              name: "Baby Wipes",
              size: "Soft pack",
              price: "$3.99",
              oldPrice: "",
              category: "Baby Care",
              rx: false
            }
          ]
        },
        {
          id: "daily",
          title: "Daily essentials",
          subtitle: "Fast moving health picks",
          items: [
            {
              id: "r5",
              name: "Antiseptic Cream",
              size: "Tube",
              price: "$4.80",
              oldPrice: "",
              category: "Personal Care",
              rx: false
            },
            {
              id: "r6",
              name: "Immune Boost",
              size: "30 tablets",
              price: "$9.20",
              oldPrice: "",
              category: "Vitamins",
              rx: false
            },
            {
              id: "r7",
              name: "Steam Inhaler Balm",
              size: "Jar",
              price: "$2.90",
              oldPrice: "",
              category: "Cold & Flu",
              rx: false
            },
            {
              id: "r8",
              name: "Thermometer",
              size: "Digital",
              price: "$11.50",
              oldPrice: "",
              category: "Care",
              rx: false
            }
          ]
        },
        {
          id: "prescription",
          title: "Prescription requests",
          subtitle: "Secure pharmacist confirmation flow",
          items: [
            {
              id: "r9",
              name: "Antibiotic Refill",
              size: "Prescription item",
              price: "By review",
              oldPrice: "",
              category: "Prescription",
              rx: true
            },
            {
              id: "r10",
              name: "Asthma Medication",
              size: "Repeat refill",
              price: "By review",
              oldPrice: "",
              category: "Prescription",
              rx: true
            },
            {
              id: "r11",
              name: "Chronic Medication",
              size: "Monthly request",
              price: "By review",
              oldPrice: "",
              category: "Prescription",
              rx: true
            }
          ]
        }
      ]
    }
  }

  const currentCatalog =
    storeCatalogs[activeStore.id] || storeCatalogs["alliance-pharmacy"]

  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [promoIndex, setPromoIndex] = useState(0)
  const [cart, setCart] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) =>
        prev === currentCatalog.promos.length - 1 ? 0 : prev + 1
      )
    }, 3500)

    return () => clearInterval(timer)
  }, [currentCatalog.promos.length])

  const allItems = useMemo(() => {
    return currentCatalog.sections.flatMap((section) => section.items)
  }, [currentCatalog])

  const visibleSections = useMemo(() => {
    return currentCatalog.sections.map((section) => {
      const filteredItems = section.items.filter((item) => {
        const matchesQuery =
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.size.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())

        const matchesCategory =
          activeCategory === "All" ||
          item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
          item.name.toLowerCase().includes(activeCategory.toLowerCase())

        return matchesQuery && matchesCategory
      })

      return {
        ...section,
        items: filteredItems
      }
    })
  }, [currentCatalog.sections, query, activeCategory])

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

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
      return {
        ...prev,
        [id]: nextQty
      }
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
      {/* TOP HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#142347] to-[#1f3c88] px-4 pb-6 pt-4 text-white">
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
              {activeStore.badge}
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              {activeStore.name}
            </h1>

            <p className="mt-1 max-w-[560px] text-[13px] text-white/80">
              {activeStore.tagline}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {activeStore.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {activeStore.eta}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified store
              </span>
            </div>
          </div>

          {/* STORE SWITCH */}
          <div className="mt-5 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max gap-2 pr-4">
              {stores.map((store) => {
                const isActive = store.id === activeStore.id
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

          {/* SEARCH */}
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

      {/* ACTION BUTTONS */}
      <section className="relative z-20 -mt-4 px-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={goToPrescription}
            className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
              <FileText className="h-4.5 w-4.5 text-[#173ea5]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">
              Upload script
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              For prescriptions
            </p>
          </button>

          <button
            onClick={goToCheckout}
            className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
              <Truck className="h-4.5 w-4.5 text-[#0c8f4d]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">
              Pickup / delivery
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Fast local handoff
            </p>
          </button>

          <button
            onClick={goToRequest}
            className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6ee]">
              <Stethoscope className="h-4.5 w-4.5 text-[#c96b16]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">
              Ask pharmacist
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Check availability
            </p>
          </button>
        </div>
      </section>

      {/* PROMO CAROUSEL FEEL */}
      <section className="mt-5 px-4">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="relative min-h-[180px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-5 text-white">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative z-10 max-w-[420px]">
              <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold backdrop-blur-xl">
                {currentCatalog.promos[promoIndex]?.tag}
              </div>

              <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em]">
                {currentCatalog.promos[promoIndex]?.title}
              </h2>

              <p className="mt-2 text-[13px] text-white/80">
                {currentCatalog.promos[promoIndex]?.subtitle}
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

          <div className="flex items-center justify-center gap-2 px-4 py-3">
            {currentCatalog.promos.map((promo, index) => (
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

      {/* CATEGORIES INLINE */}
      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-neutral-900">
              Explore categories
            </p>
            <p className="text-[11px] text-neutral-500">
              Fast way to browse health items
            </p>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-3 pr-4">
            <button
              onClick={() => setActiveCategory("All")}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
                activeCategory === "All"
                  ? "bg-[#10214e] text-white"
                  : "border border-neutral-200 bg-white text-neutral-700"
              }`}
            >
              All
            </button>

            {currentCatalog.categories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.name

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                    isActive
                      ? "bg-[#10214e] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* QUICK INFO BAR */}
      <section className="mt-5 px-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[20px] border border-neutral-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Items
            </p>
            <p className="mt-1 text-[20px] font-semibold text-neutral-900">
              {allItems.length}+
            </p>
          </div>

          <div className="rounded-[20px] border border-neutral-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Pickup
            </p>
            <p className="mt-1 text-[20px] font-semibold text-neutral-900">
              Same day
            </p>
          </div>

          <div className="rounded-[20px] border border-neutral-200 bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Support
            </p>
            <p className="mt-1 text-[20px] font-semibold text-neutral-900">
              Live chat
            </p>
          </div>
        </div>
      </section>

      {/* MEDICINE SECTIONS */}
      <section className="mt-6 space-y-6">
        {visibleSections.map((section) => {
          if (!section.items.length) return null

          return (
            <div key={section.id}>
              <div className="mb-3 px-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
                      {section.title}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {section.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={goToOrders}
                    className="text-[12px] font-semibold text-[#1d3f98]"
                  >
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
                        className="w-[170px] rounded-[24px] border border-neutral-200 bg-white p-3 shadow-[0_8px_22px_rgba(0,0,0,0.05)]"
                      >
                        <button
                          onClick={() => openProduct(item.id)}
                          className="block w-full text-left"
                        >
                          <div className="relative flex h-[118px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4]">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                              <Pill className="h-6 w-6 text-[#173ea5]" />
                            </div>

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
                            <p className="mt-1 text-[11px] text-neutral-500">
                              {item.size}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[14px] font-semibold text-neutral-900">
                                {item.price}
                              </span>
                              {item.oldPrice ? (
                                <span className="text-[11px] text-neutral-400 line-through">
                                  {item.oldPrice}
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

      {/* EMPTY STATE */}
      {visibleSections.every((section) => section.items.length === 0) && (
        <section className="px-4 py-12">
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
              <Search className="h-6 w-6 text-neutral-500" />
            </div>
            <p className="mt-4 text-[16px] font-semibold text-neutral-900">
              No medicine found
            </p>
            <p className="mt-1 text-[12px] text-neutral-500">
              Try another search or switch pharmacy
            </p>
          </div>
        </section>
      )}

      {/* BOTTOM FLOATING CHECKOUT */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[24px] bg-[#101828] px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[11px] text-white/65">
              {cartCount > 0 ? `${cartCount} item(s) selected` : "Ready to order"}
            </p>
            <p className="text-[14px] font-semibold">
              Pickup or delivery available
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

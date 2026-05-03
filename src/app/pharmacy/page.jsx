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
  Stethoscope,
  Star,
  BadgeCheck,
  Phone,
  MessageCircle,
  PackageCheck
} from "lucide-react"

import { db } from "../../lib/firebase"

const STORE_ID = "alliance-pharmacy"

const IMG = {
  paracetamol:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Medication%20Paracetamol.JPG",
  coughSyrup:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vintage%20Turkish%20pediatric%20cough%20syrup%20bottle.png",
  vitamins:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vitamin%20tablets%20%2827522813860%29.jpg",
  pills:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Paracetamol%20acetaminophen%20500%20mg%20pills.jpg"
}

const FALLBACK_STORE_META = {
  id: STORE_ID,
  name: "Alliance Pharmacy",
  tagline: "Trusted pharmacy essentials delivered fast with SendIt.",
  eta: "18–35 min",
  badge: "Open now",
  city: "Harare",
  phone: "",
  whatsapp: "",
  coverImage: IMG.vitamins
}

const FALLBACK_PROMOS = [
  {
    id: "promo1",
    title: "Wellness Week",
    subtitle: "Selected vitamins, pain relief and daily health essentials.",
    tag: "Fresh offers",
    image: IMG.vitamins,
    active: true
  },
  {
    id: "promo2",
    title: "Fast pharmacy pickup",
    subtitle: "Order from Alliance Pharmacy and choose pickup or SendIt delivery.",
    tag: "Pickup today",
    image: IMG.paracetamol,
    active: true
  },
  {
    id: "promo3",
    title: "Prescription support",
    subtitle: "Upload your script and request pharmacist review securely.",
    tag: "Secure process",
    image: IMG.coughSyrup,
    active: true
  }
]

const FALLBACK_PRODUCTS = [
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
]

const BASE_CATEGORIES = [
  { id: "pain", name: "Pain Relief", icon: Pill },
  { id: "cold", name: "Cold & Flu", icon: HeartPulse },
  { id: "vitamins", name: "Vitamins", icon: Sparkles },
  { id: "baby", name: "Baby Care", icon: Baby },
  { id: "care", name: "Personal Care", icon: ShieldCheck },
  { id: "clinic", name: "Clinic", icon: Stethoscope },
  { id: "prescription", name: "Prescription", icon: FileText }
]

function priceNumber(value) {
  if (typeof value === "number") return value
  if (!value) return 0
  const cleaned = String(value).replace(/[^0-9.]/g, "")
  return Number(cleaned || 0)
}

function cartKey() {
  return `sendit_pharmacy_cart_${STORE_ID}`
}

function ProductImage({ src, alt, className = "" }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4] ${className}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Pill className="h-6 w-6 text-[#173ea5]" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="h-full w-full object-cover transition duration-500 hover:scale-105"
      />
    </div>
  )
}

export default function AlliancePharmacyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cityParam = searchParams.get("city") || "Harare"

  const [storeMeta, setStoreMeta] = useState({
    ...FALLBACK_STORE_META,
    location: cityParam
  })
  const [promos, setPromos] = useState(FALLBACK_PROMOS)
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [promoIndex, setPromoIndex] = useState(0)
  const [cart, setCart] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cartKey())
      setCart(saved ? JSON.parse(saved) : {})
    } catch {
      setCart({})
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(cartKey(), JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const storeRef = ref(db, `pharmacies/${STORE_ID}`)

    const unsub = onValue(storeRef, (snap) => {
      const data = snap.val()

      if (!data) {
        setStoreMeta({
          ...FALLBACK_STORE_META,
          location: cityParam
        })
        return
      }

      setStoreMeta({
        id: STORE_ID,
        name: data.name || FALLBACK_STORE_META.name,
        tagline: data.tagline || FALLBACK_STORE_META.tagline,
        eta: data.eta || FALLBACK_STORE_META.eta,
        badge: data.badge || FALLBACK_STORE_META.badge,
        coverImage: data.coverImage || FALLBACK_STORE_META.coverImage,
        location: data.city || cityParam,
        phone: data.phone || "",
        whatsapp: data.whatsapp || ""
      })
    })

    return () => unsub()
  }, [cityParam])

  useEffect(() => {
    const promoRef = ref(db, `pharmacyPromos/${STORE_ID}`)

    const unsub = onValue(promoRef, (snap) => {
      const data = snap.val()

      if (!data) {
        setPromos(FALLBACK_PROMOS)
        return
      }

      const list = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .filter((item) => item.active !== false)

      setPromos(list.length ? list : FALLBACK_PROMOS)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    const productsRef = ref(db, `pharmacyProducts/${STORE_ID}`)

    const unsub = onValue(productsRef, (snap) => {
      const data = snap.val()

      if (!data) {
        setProducts(FALLBACK_PRODUCTS)
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

      setProducts(list.length ? list : FALLBACK_PRODUCTS)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    if (!promos.length) return

    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(timer)
  }, [promos])

  useEffect(() => {
    if (promoIndex > promos.length - 1) setPromoIndex(0)
  }, [promos, promoIndex])

  const categoryNames = useMemo(() => {
    const dynamic = Array.from(
      new Set(products.map((item) => item.category).filter(Boolean))
    )
    return ["All", ...dynamic]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const text = `${item.name || ""} ${item.size || ""} ${item.category || ""}`
        .toLowerCase()

      const matchesQuery = text.includes(query.toLowerCase())
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory

      return matchesQuery && matchesCategory
    })
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
      `/pharmacy/product/${id}?store=${STORE_ID}&city=${encodeURIComponent(
        cityParam
      )}`
    )
  }

  const goToCart = () => {
    router.push(
      `/pharmacy/cart?store=${STORE_ID}&city=${encodeURIComponent(cityParam)}`
    )
  }

  const goToCheckout = () => {
    router.push(
      `/pharmacy/checkout?store=${STORE_ID}&city=${encodeURIComponent(cityParam)}`
    )
  }

  const goToPrescription = () => {
    router.push(
      `/pharmacy/prescription?store=${STORE_ID}&city=${encodeURIComponent(
        cityParam
      )}`
    )
  }

  const goToRequest = () => {
    router.push(
      `/pharmacy/request?store=${STORE_ID}&city=${encodeURIComponent(cityParam)}`
    )
  }

  const goToOrders = () => {
    router.push(
      `/pharmacy/orders?store=${STORE_ID}&city=${encodeURIComponent(cityParam)}`
    )
  }

  const currentPromo = promos[promoIndex] || promos[0] || FALLBACK_PROMOS[0]

  return (
    <main className="min-h-screen bg-[#f5f7fb] pb-32">
      <section className="relative overflow-hidden bg-[#07111f] px-4 pb-7 pt-4 text-white">
        <div className="absolute inset-0">
          <img
            src={storeMeta.coverImage || FALLBACK_STORE_META.coverImage}
            alt={storeMeta.name}
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06101f]/80 via-[#10224b]/92 to-[#f5f7fb]" />
        </div>

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={goToRequest}
                className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white backdrop-blur-xl sm:inline-flex"
              >
                Ask pharmacist
              </button>

              <button
                onClick={goToCart}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#0f172a]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-7 grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-xl">
                <Store className="h-3.5 w-3.5" />
                {storeMeta.badge}
              </div>

              <h1 className="mt-4 max-w-2xl text-[36px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[52px]">
                {storeMeta.name}
              </h1>

              <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/78">
                {storeMeta.tagline}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] text-white/82">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
                  <MapPin className="h-3.5 w-3.5" />
                  {storeMeta.location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
                  <Clock3 className="h-3.5 w-3.5" />
                  {storeMeta.eta}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified SendIt partner
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={goToCheckout}
                  className="rounded-full bg-white px-5 py-3 text-[13px] font-black text-[#101828] shadow-xl"
                >
                  Order now
                </button>
                <button
                  onClick={goToPrescription}
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[13px] font-bold text-white backdrop-blur-xl"
                >
                  Upload prescription
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
              <div className="relative min-h-[260px] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8]">
                <img
                  src={currentPromo?.image}
                  alt={currentPromo?.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                <div className="relative z-10 flex min-h-[260px] items-end p-5">
                  <div>
                    <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-black text-white backdrop-blur-xl">
                      {currentPromo?.tag}
                    </span>

                    <h2 className="mt-3 text-[25px] font-black tracking-[-0.04em]">
                      {currentPromo?.title}
                    </h2>

                    <p className="mt-2 max-w-md text-[13px] leading-5 text-white/80">
                      {currentPromo?.subtitle}
                    </p>

                    <button
                      onClick={goToOrders}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#101828]"
                    >
                      View orders
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
                      promoIndex === index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/35"
                    }`}
                    aria-label={`Show promo ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 text-[#101828]">
              <Search className="h-5 w-5 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicine, vitamins, syrup..."
                className="w-full bg-transparent text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3">
          <button
            onClick={goToPrescription}
            className="rounded-[26px] bg-white p-4 text-left shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
              <FileText className="h-5 w-5 text-[#173ea5]" />
            </div>
            <p className="mt-3 text-[13px] font-black text-neutral-900">
              Upload script
            </p>
            <p className="mt-1 text-[11px] leading-4 text-neutral-500">
              Prescription review
            </p>
          </button>

          <button
            onClick={goToCheckout}
            className="rounded-[26px] bg-white p-4 text-left shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf1]">
              <Truck className="h-5 w-5 text-[#0c8f4d]" />
            </div>
            <p className="mt-3 text-[13px] font-black text-neutral-900">
              Delivery
            </p>
            <p className="mt-1 text-[11px] leading-4 text-neutral-500">
              SendIt handoff
            </p>
          </button>

          <button
            onClick={goToRequest}
            className="rounded-[26px] bg-white p-4 text-left shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff6ee]">
              <Stethoscope className="h-5 w-5 text-[#c96b16]" />
            </div>
            <p className="mt-3 text-[13px] font-black text-neutral-900">
              Ask pharmacist
            </p>
            <p className="mt-1 text-[11px] leading-4 text-neutral-500">
              Check availability
            </p>
          </button>
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm">
            <PackageCheck className="h-5 w-5 text-[#173ea5]" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
              Products
            </p>
            <p className="mt-1 text-[22px] font-black tracking-[-0.04em] text-neutral-900">
              {products.length}+
            </p>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm">
            <ShoppingCart className="h-5 w-5 text-[#0c8f4d]" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
              Cart
            </p>
            <p className="mt-1 text-[22px] font-black tracking-[-0.04em] text-neutral-900">
              {cartCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm">
            <Star className="h-5 w-5 text-[#c96b16]" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
              Subtotal
            </p>
            <p className="mt-1 text-[22px] font-black tracking-[-0.04em] text-neutral-900">
              ${cartSubtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[17px] font-black tracking-[-0.03em] text-neutral-900">
                Explore categories
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Browse Alliance Pharmacy products by category
              </p>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max gap-3 pr-4">
              {categoryNames.map((name) => {
                const fallbackIcon =
                  BASE_CATEGORIES.find((item) => item.name === name)?.icon ||
                  Pill
                const Icon = fallbackIcon
                const isActive = activeCategory === name

                return (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-black transition ${
                      isActive
                        ? "bg-[#101828] text-white shadow-lg"
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
        </div>
      </section>

      <section className="mt-7 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[19px] font-black tracking-[-0.04em] text-neutral-900">
                {activeCategory === "All"
                  ? "Available medicines"
                  : activeCategory}
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Live updates from Alliance Pharmacy admin
              </p>
            </div>

            <button
              onClick={goToOrders}
              className="rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#173ea5] shadow-sm"
            >
              Orders
            </button>
          </div>

          {filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((item) => {
                const qty = cart[item.id] || 0

                return (
                  <article
                    key={item.id}
                    className="rounded-[28px] border border-neutral-200 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                  >
                    <button
                      onClick={() => openProduct(item.id)}
                      className="block w-full text-left"
                    >
                      <div className="relative">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="h-[138px] rounded-[23px] sm:h-[158px]"
                        />

                        {item.rx && (
                          <span className="absolute left-2 top-2 rounded-full bg-[#101828] px-2.5 py-1 text-[9px] font-black text-white">
                            Prescription
                          </span>
                        )}

                        {item.stock && (
                          <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black text-neutral-700 backdrop-blur">
                            {item.stock}
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="line-clamp-1 text-[14px] font-black text-neutral-900">
                          {item.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-neutral-500">
                          {item.size}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[15px] font-black text-neutral-900">
                            {item.price > 0
                              ? `$${item.price.toFixed(2)}`
                              : "By review"}
                          </span>

                          {item.oldPrice > 0 && (
                            <span className="text-[11px] font-semibold text-neutral-400 line-through">
                              ${item.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-neutral-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="max-w-[96px] truncate rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">
                        {item.category}
                      </span>

                      {!item.rx ? (
                        qty > 0 ? (
                          <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="min-w-[14px] text-center text-[12px] font-black text-neutral-900">
                              {qty}
                            </span>

                            <button
                              onClick={() => increaseQty(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#101828] text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="rounded-full bg-[#101828] px-3.5 py-2 text-[11px] font-black text-white"
                          >
                            Add
                          </button>
                        )
                      ) : (
                        <button
                          onClick={goToPrescription}
                          className="rounded-full border border-neutral-200 px-3.5 py-2 text-[11px] font-black text-neutral-700"
                        >
                          Request
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-neutral-300 bg-white p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <Search className="h-6 w-6 text-neutral-500" />
              </div>
              <p className="mt-4 text-[16px] font-black text-neutral-900">
                No medicine found
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Try another search or category.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3">
          <button
            onClick={goToRequest}
            className="flex items-center gap-3 rounded-[24px] border border-neutral-200 bg-white p-4 text-left shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
              <MessageCircle className="h-5 w-5 text-[#173ea5]" />
            </div>
            <div>
              <p className="text-[13px] font-black text-neutral-900">
                Ask availability
              </p>
              <p className="text-[11px] text-neutral-500">
                Message pharmacy
              </p>
            </div>
          </button>

          <button
            onClick={goToPrescription}
            className="flex items-center gap-3 rounded-[24px] border border-neutral-200 bg-white p-4 text-left shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf1]">
              <FileText className="h-5 w-5 text-[#0c8f4d]" />
            </div>
            <div>
              <p className="text-[13px] font-black text-neutral-900">
                Send prescription
              </p>
              <p className="text-[11px] text-neutral-500">
                Upload your script
              </p>
            </div>
          </button>

          <button
            onClick={goToCheckout}
            className="flex items-center gap-3 rounded-[24px] border border-neutral-200 bg-white p-4 text-left shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff6ee]">
              <Phone className="h-5 w-5 text-[#c96b16]" />
            </div>
            <div>
              <p className="text-[13px] font-black text-neutral-900">
                Fast checkout
              </p>
              <p className="text-[11px] text-neutral-500">
                Delivery or pickup
              </p>
            </div>
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[26px] bg-[#101828] px-4 py-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <div>
            <p className="text-[11px] font-medium text-white/65">
              {cartCount > 0
                ? `${cartCount} item(s) selected`
                : "Alliance Pharmacy"}
            </p>
            <p className="text-[14px] font-black">
              {cartCount > 0
                ? `Subtotal $${cartSubtotal.toFixed(2)}`
                : "Pickup or delivery available"}
            </p>
          </div>

          <button
            onClick={cartCount > 0 ? goToCart : goToCheckout}
            className="rounded-full bg-white px-5 py-2.5 text-[12px] font-black text-[#101828]"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  )
}

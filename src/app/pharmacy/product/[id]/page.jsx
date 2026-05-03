"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { onValue, ref } from "firebase/database"
import {
  ArrowLeft,
  Store,
  Pill,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
  FileText,
  Truck,
  Clock3,
  HeartPulse,
  PackageCheck,
  BadgeCheck,
  Sparkles,
  AlertCircle,
  Loader2
} from "lucide-react"

import { db } from "../../../../lib/firebase"

const STORE_ID = "alliance-pharmacy"
const STORE_NAME = "Alliance Pharmacy"
const CART_KEY = `sendit_pharmacy_cart_${STORE_ID}`

const FALLBACK_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Paracetamol%20acetaminophen%20500%20mg%20pills.jpg"

function priceNumber(value) {
  if (typeof value === "number") return value
  if (!value) return 0
  const cleaned = String(value).replace(/[^0-9.]/g, "")
  return Number(cleaned || 0)
}

function ProductImage({ src, alt }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[30px] bg-gradient-to-br from-emerald-50 via-white to-[#edf7f4]">
        <div className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_16px_40px_rgba(4,120,87,0.12)]">
            <Pill className="h-12 w-12 text-emerald-700" />
          </div>
          <p className="mt-5 text-[13px] font-black text-neutral-500">
            Product image
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-50 via-white to-[#edf7f4]">
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="h-[340px] w-full object-cover sm:h-[430px]"
      />
    </div>
  )
}

export default function AllianceProductDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const productId = params?.id
  const cityParam = searchParams.get("city") || "Harare"

  const [product, setProduct] = useState(null)
  const [storeMeta, setStoreMeta] = useState({
    name: STORE_NAME,
    eta: "18–35 min",
    tagline: "Trusted pharmacy essentials delivered fast with SendIt.",
    badge: "Open now",
    city: cityParam,
    coverImage: FALLBACK_IMAGE
  })

  const [allProducts, setAllProducts] = useState([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) return

    const productRef = ref(db, `pharmacyProducts/${STORE_ID}/${productId}`)

    const unsub = onValue(productRef, (snap) => {
      const data = snap.val()

      if (data) {
        setProduct({
          id: productId,
          ...data,
          price: priceNumber(data.price),
          oldPrice: priceNumber(data.oldPrice)
        })
      } else {
        setProduct(null)
      }

      setLoading(false)
    })

    return () => unsub()
  }, [productId])

  useEffect(() => {
    const storeRef = ref(db, `pharmacies/${STORE_ID}`)

    const unsub = onValue(storeRef, (snap) => {
      const data = snap.val()

      if (!data) return

      setStoreMeta({
        name: data.name || STORE_NAME,
        eta: data.eta || "18–35 min",
        tagline:
          data.tagline ||
          "Trusted pharmacy essentials delivered fast with SendIt.",
        badge: data.badge || (data.isOpen === false ? "Closed" : "Open now"),
        city: data.city || cityParam,
        coverImage: data.coverImage || FALLBACK_IMAGE
      })
    })

    return () => unsub()
  }, [cityParam])

  useEffect(() => {
    const productsRef = ref(db, `pharmacyProducts/${STORE_ID}`)

    const unsub = onValue(productsRef, (snap) => {
      const data = snap.val() || {}

      const list = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
          price: priceNumber(value.price),
          oldPrice: priceNumber(value.oldPrice)
        }))
        .filter((item) => item.visible !== false)

      setAllProducts(list)
    })

    return () => unsub()
  }, [])

  const similarProducts = useMemo(() => {
    if (!product) return []

    const sameCategory = allProducts.filter(
      (item) =>
        item.id !== product.id &&
        item.category &&
        item.category === product.category
    )

    const others = allProducts.filter(
      (item) => item.id !== product.id && item.category !== product.category
    )

    return [...sameCategory, ...others].slice(0, 8)
  }, [allProducts, product])

  const total = useMemo(() => {
    if (!product || product.rx || !product.price) return null
    return (product.price * qty).toFixed(2)
  }, [product, qty])

  const increaseQty = () => setQty((prev) => prev + 1)
  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1))

  const addToCart = () => {
    if (!product || product.rx) return

    try {
      const saved = localStorage.getItem(CART_KEY)
      const cart = saved ? JSON.parse(saved) : {}

      cart[product.id] = (cart[product.id] || 0) + qty

      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      router.push(
        `/pharmacy/cart?store=${STORE_ID}&city=${encodeURIComponent(cityParam)}`
      )
    } catch (error) {
      console.error(error)
      alert("Could not add to cart")
    }
  }

  const buyNow = () => {
    if (!product || product.rx) return

    try {
      const cart = {}
      cart[product.id] = qty

      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      router.push(
        `/pharmacy/checkout?store=${STORE_ID}&city=${encodeURIComponent(
          cityParam
        )}`
      )
    } catch (error) {
      console.error(error)
      alert("Could not start checkout")
    }
  }

  const openSimilarProduct = (id) => {
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

  const goToPrescription = () => {
    router.push(
      `/pharmacy/prescription?store=${STORE_ID}&city=${encodeURIComponent(
        cityParam
      )}&product=${encodeURIComponent(product?.name || "")}`
    )
  }

  const goToRequest = () => {
    router.push(
      `/pharmacy/request?store=${STORE_ID}&city=${encodeURIComponent(
        cityParam
      )}&product=${encodeURIComponent(product?.name || "")}`
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-700" />
          <p className="mt-4 text-[13px] font-black text-neutral-600">
            Loading Alliance Pharmacy product...
          </p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-[30px] bg-white p-8 text-center shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mt-5 text-[24px] font-black tracking-[-0.04em] text-neutral-900">
            Product not found
          </h1>
          <p className="mt-2 text-[13px] leading-6 text-neutral-500">
            This medicine is not available in Alliance Pharmacy products yet.
          </p>
          <button
            onClick={() =>
              router.push(
                `/pharmacy/alliance?city=${encodeURIComponent(cityParam)}`
              )
            }
            className="mt-6 rounded-full bg-emerald-700 px-6 py-3 text-[13px] font-black text-white"
          >
            Back to Alliance Pharmacy
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] pb-36">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-white px-4 pb-9 pt-4 text-white">
        <img
          src={storeMeta.coverImage}
          alt="Alliance Pharmacy"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-lg backdrop-blur-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToCart}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-lg backdrop-blur-xl"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-7 grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
                <Store className="h-4 w-4" />
                ALLIANCE PHARMACY
              </div>

              <h1 className="mt-5 max-w-3xl text-[38px] font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-[62px]">
                {product.name}
              </h1>

              <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/85">
                {product.category || "Pharmacy"} • {product.size || "Standard pack"}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-white/90">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                  <Clock3 className="h-3.5 w-3.5" />
                  {storeMeta.eta}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {product.stock || "In stock"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified SendIt partner
                </span>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/25 bg-white/15 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[28px] bg-white p-5 text-neutral-900">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Selected item
                </p>

                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[24px] font-black tracking-[-0.05em]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-neutral-500">
                      {product.size || "Standard pack"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                    <p className="text-[10px] font-black text-emerald-700">
                      Price
                    </p>
                    <p className="text-[18px] font-black">
                      {product.price > 0 ? `$${product.price.toFixed(2)}` : "Review"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <PackageCheck className="h-4 w-4 text-emerald-700" />
                    <p className="mt-2 text-[10px] font-black text-neutral-600">
                      {product.stock || "In stock"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <Sparkles className="h-4 w-4 text-emerald-700" />
                    <p className="mt-2 text-[10px] font-black text-neutral-600">
                      {product.category || "Pharmacy"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <FileText className="h-4 w-4 text-emerald-700" />
                    <p className="mt-2 text-[10px] font-black text-neutral-600">
                      {product.rx ? "Script" : "No script"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="rounded-[34px] border border-emerald-100 bg-white p-4 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <ProductImage src={product.image} alt={product.name} />
            </div>

            <div className="rounded-[30px] border border-emerald-100 bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Product details
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Live details from Alliance Pharmacy admin
                  </p>
                </div>
              </div>

              <p className="text-[13px] leading-6 text-neutral-600">
                {product.description ||
                  "No detailed description has been added yet by Alliance Pharmacy."}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <DetailCard label="Category" value={product.category || "Pharmacy"} />
                <DetailCard label="Size" value={product.size || "Standard"} />
                <DetailCard label="Stock" value={product.stock || "In stock"} />
                <DetailCard
                  label="Type"
                  value={product.rx ? "Prescription item" : "Normal item"}
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-emerald-100 bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <HeartPulse className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Pharmacy note
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Safe ordering reminder
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/40 p-4">
                <p className="text-[12px] leading-6 text-neutral-600">
                  Product information is for ordering and availability only.
                  Always follow packaging instructions or pharmacist guidance.
                  Prescription items require review before release.
                </p>
              </div>
            </div>

            {similarProducts.length > 0 && (
              <div className="space-y-3">
                <div className="px-1">
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    More from Alliance Pharmacy
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Other live products from the same pharmacy
                  </p>
                </div>

                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex min-w-max gap-3 pr-4">
                    {similarProducts.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => openSimilarProduct(item.id)}
                        className="w-[190px] rounded-[26px] border border-emerald-100 bg-white p-3 text-left shadow-[0_10px_28px_rgba(4,120,87,0.06)]"
                      >
                        <div className="h-[118px] overflow-hidden rounded-[22px] bg-emerald-50">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Pill className="h-7 w-7 text-emerald-700" />
                            </div>
                          )}
                        </div>

                        <p className="mt-3 line-clamp-1 text-[13px] font-black text-neutral-900">
                          {item.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[11px] text-neutral-500">
                          {item.size || item.category}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[14px] font-black text-neutral-900">
                            {item.price > 0 ? `$${item.price.toFixed(2)}` : "Review"}
                          </span>
                          <span className="text-[11px] font-black text-emerald-700">
                            Open
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CARD */}
          <div className="space-y-5">
            <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-5 text-white">
                <p className="text-[11px] text-white/75">Selected pharmacy</p>
                <p className="mt-1 text-[24px] font-black tracking-[-0.04em]">
                  Alliance Pharmacy
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {storeMeta.city || cityParam} • {storeMeta.eta}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Product
                </p>

                <p className="mt-2 text-[26px] font-black tracking-[-0.05em] text-neutral-900">
                  {product.name}
                </p>

                <p className="mt-1 text-[12px] font-semibold text-neutral-500">
                  {product.size || "Standard pack"}
                </p>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-[34px] font-black tracking-[-0.06em] text-neutral-900">
                  {product.price > 0 ? `$${product.price.toFixed(2)}` : "By review"}
                </span>

                {product.oldPrice > 0 && (
                  <span className="pb-1 text-[13px] font-semibold text-neutral-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {!product.rx && (
                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-black text-neutral-500">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-2 py-2">
                    <button
                      onClick={decreaseQty}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="min-w-[24px] text-center text-[14px] font-black text-neutral-900">
                      {qty}
                    </span>

                    <button
                      onClick={increaseQty}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {!product.rx ? (
                  <>
                    <button
                      onClick={addToCart}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3.5 text-[13px] font-black text-white shadow-lg"
                    >
                      Add to cart
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={buyNow}
                      className="w-full rounded-full border border-emerald-100 bg-white px-5 py-3.5 text-[13px] font-black text-emerald-800"
                    >
                      Buy now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={goToPrescription}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3.5 text-[13px] font-black text-white shadow-lg"
                    >
                      Submit prescription
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={goToRequest}
                      className="w-full rounded-full border border-emerald-100 bg-white px-5 py-3.5 text-[13px] font-black text-emerald-800"
                    >
                      Ask availability first
                    </button>
                  </>
                )}
              </div>

              {total && (
                <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="text-[11px] font-black text-emerald-700">
                    Estimated total
                  </p>
                  <p className="mt-1 text-[28px] font-black tracking-[-0.05em] text-neutral-900">
                    ${total}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {qty} item(s) selected
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-3">
                <InfoCard
                  icon={Truck}
                  title="Pickup or SendIt delivery"
                  text="Continue through cart or checkout for fast handoff."
                />

                <InfoCard
                  icon={ShieldCheck}
                  title="Verified pharmacy flow"
                  text="Alliance Pharmacy controls stock, promos and products from admin."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
      <p className="text-[11px] font-semibold text-neutral-500">{label}</p>
      <p className="mt-1 text-[13px] font-black text-neutral-900">
        {value || "Not set"}
      </p>
    </div>
  )
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[22px] border border-emerald-100 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
        <Icon className="h-5 w-5 text-emerald-700" />
      </div>
      <p className="mt-3 text-[13px] font-black text-neutral-900">{title}</p>
      <p className="mt-1 text-[11px] leading-5 text-neutral-500">{text}</p>
    </div>
  )
}

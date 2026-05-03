"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onValue, ref } from "firebase/database"
import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  Pill,
  Truck,
  Store,
  ShieldCheck,
  Trash2,
  ShoppingCart,
  Loader2,
  PackageCheck
} from "lucide-react"

import { db } from "../../../lib/firebase"

const STORE_ID = "alliance-pharmacy"
const STORE_NAME = "Alliance Pharmacy"
const CART_KEY = `sendit_pharmacy_cart_${STORE_ID}`

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
      <div className="flex h-[96px] w-[96px] items-center justify-center rounded-[22px] bg-gradient-to-br from-emerald-50 via-white to-[#edf7f4]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Pill className="h-6 w-6 text-emerald-700" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[96px] w-[96px] overflow-hidden rounded-[22px] bg-emerald-50">
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export default function AllianceCartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cityParam = searchParams.get("city") || "Harare"

  const [fulfillment, setFulfillment] = useState("Delivery")
  const [allProducts, setAllProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      const cart = saved ? JSON.parse(saved) : {}

      const items = Object.entries(cart)
        .map(([id, qty]) => {
          const product = allProducts.find((item) => item.id === id)
          if (!product) return null

          return {
            ...product,
            qty: Number(qty) || 1
          }
        })
        .filter(Boolean)

      setCartItems(items)
    } catch {
      setCartItems([])
    }
  }, [allProducts])

  const writeCart = (nextItems) => {
    const nextCart = {}

    nextItems.forEach((item) => {
      if (item.qty > 0) nextCart[item.id] = item.qty
    })

    localStorage.setItem(CART_KEY, JSON.stringify(nextCart))
    setCartItems(nextItems.filter((item) => item.qty > 0))
  }

  const increaseQty = (id) => {
    const next = cartItems.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    )
    writeCart(next)
  }

  const decreaseQty = (id) => {
    const next = cartItems
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
      )
      .filter((item) => item.qty > 0)

    writeCart(next)
  }

  const removeItem = (id) => {
    const next = cartItems.filter((item) => item.id !== id)
    writeCart(next)
  }

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + priceNumber(item.price) * item.qty,
      0
    )

    const serviceFee = subtotal > 10 ? Math.min(subtotal * 0.05, 5) : 0
    const deliveryFee = fulfillment === "Delivery" && subtotal > 0 ? 3.5 : 0
    const total = subtotal + serviceFee + deliveryFee

    return { subtotal, serviceFee, deliveryFee, total }
  }, [cartItems, fulfillment])

  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const goBackToAlliance = () => {
    router.push(`/pharmacy/alliance?city=${encodeURIComponent(cityParam)}`)
  }

  const goCheckout = () => {
    localStorage.setItem(`sendit_pharmacy_fulfillment_${STORE_ID}`, fulfillment)

    router.push(
      `/pharmacy/checkout?store=${STORE_ID}&city=${encodeURIComponent(
        cityParam
      )}&fulfillment=${encodeURIComponent(fulfillment)}`
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-700" />
          <p className="mt-4 text-[13px] font-black text-neutral-600">
            Loading Alliance cart...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] pb-36">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-white px-4 pb-9 pt-4 text-white">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-emerald-800">
                  {itemCount}
                </span>
              )}
            </div>
          </div>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
              <Store className="h-4 w-4" />
              ALLIANCE PHARMACY
            </div>

            <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[66px]">
              Your Cart
            </h1>

            <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/85">
              Review your Alliance Pharmacy items, choose pickup or delivery,
              then continue to checkout.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                <Truck className="h-3.5 w-3.5" />
                Pickup or delivery
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified pharmacy flow
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                <PackageCheck className="h-3.5 w-3.5" />
                {itemCount} item(s)
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Cart items
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Live products loaded from Alliance Pharmacy admin
                  </p>
                </div>

                <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                  {itemCount} item(s)
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                      <ShoppingCart className="h-7 w-7 text-emerald-700" />
                    </div>
                    <p className="mt-4 text-[18px] font-black text-neutral-900">
                      Your cart is empty
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Add medicines from Alliance Pharmacy first.
                    </p>
                    <button
                      onClick={goBackToAlliance}
                      className="mt-5 rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white"
                    >
                      Back to Alliance Pharmacy
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[28px] border border-emerald-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <ProductImage src={item.image} alt={item.name} />

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[15px] font-black text-neutral-900">
                                {item.name}
                              </p>
                              <p className="mt-1 text-[11px] font-semibold text-neutral-500">
                                {item.size || item.category || "Alliance item"}
                              </p>
                              <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                {item.stock || "In stock"}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold text-neutral-500">
                                Price
                              </p>
                              <p className="text-[16px] font-black text-neutral-900">
                                ${priceNumber(item.price).toFixed(2)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-2 py-1">
                              <button
                                onClick={() => decreaseQty(item.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="min-w-[18px] text-center text-[13px] font-black text-neutral-900">
                                {item.qty}
                              </span>

                              <button
                                onClick={() => increaseQty(item.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                How do you want to receive it?
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Choose your fulfillment option.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Delivery", "Pickup"].map((option) => {
                  const active = fulfillment === option

                  return (
                    <button
                      key={option}
                      onClick={() => setFulfillment(option)}
                      className={`rounded-[26px] border px-4 py-5 text-left transition ${
                        active
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      <p className="text-[14px] font-black text-neutral-900">
                        {option}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                        {option === "Delivery"
                          ? "Get it brought to your address through SendIt. Delivery fee is $3.50."
                          : "Collect directly from Alliance Pharmacy. Pickup is free."}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-5 text-white">
                <p className="text-[11px] text-white/75">Selected pharmacy</p>
                <p className="mt-1 text-[24px] font-black tracking-[-0.04em]">
                  {STORE_NAME}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {fulfillment} • {itemCount} item(s)
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <SummaryRow label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
                <SummaryRow label="Service fee" value={`$${totals.serviceFee.toFixed(2)}`} />
                <SummaryRow
                  label={`${fulfillment} fee`}
                  value={`$${totals.deliveryFee.toFixed(2)}`}
                />
              </div>

              <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="text-[11px] font-black text-emerald-700">
                  Fee rule
                </p>
                <p className="mt-1 text-[11px] leading-5 text-neutral-600">
                  Service fee is $0.00 below $10. Above $10 it becomes 5% of subtotal,
                  capped at $5.00. Delivery adds $3.50.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-emerald-100 pt-5">
                <span className="text-[15px] font-black text-neutral-900">
                  Total
                </span>
                <span className="text-[30px] font-black tracking-[-0.06em] text-emerald-800">
                  ${totals.total.toFixed(2)}
                </span>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={goCheckout}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-black ${
                  cartItems.length > 0
                    ? "bg-emerald-700 text-white shadow-lg"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                Continue to checkout
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={goBackToAlliance}
                className="mt-3 w-full rounded-full border border-emerald-100 bg-white px-5 py-3.5 text-[13px] font-black text-emerald-800"
              >
                Back to Alliance Pharmacy
              </button>

              <div className="mt-5 grid gap-3">
                <InfoCard
                  icon={Truck}
                  title="Delivery or pickup"
                  text="Delivery fee is $3.50. Pickup is free."
                />
                <InfoCard
                  icon={ShieldCheck}
                  title="Verified Alliance flow"
                  text="Cart items are pulled from live Firebase products."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[12px] text-neutral-600">
      <span>{label}</span>
      <span className="font-black text-neutral-900">{value}</span>
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

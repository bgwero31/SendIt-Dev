"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onValue, push, ref, set } from "firebase/database"
import {
  ArrowLeft,
  ChevronRight,
  User,
  Truck,
  Store,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Pill,
  ShoppingBag
} from "lucide-react"

import { db } from "../../../lib/firebase"

const STORE_ID = "alliance-pharmacy"
const STORE_NAME = "Alliance Pharmacy"
const CART_KEY = `sendit_pharmacy_cart_${STORE_ID}`
const FULFILLMENT_KEY = `sendit_pharmacy_fulfillment_${STORE_ID}`

function priceNumber(value) {
  if (typeof value === "number") return value
  if (!value) return 0
  const cleaned = String(value).replace(/[^0-9.]/g, "")
  return Number(cleaned || 0)
}

export default function PharmacyCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cityParam = searchParams.get("city") || "Harare"
  const fulfillmentParam = searchParams.get("fulfillment")

  const [allProducts, setAllProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: cityParam,
    address: "",
    orderNote: "",
    fulfillment: fulfillmentParam || "Delivery",
    paymentMethod: "Cash on delivery",
    pharmacy: STORE_NAME
  })

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    const savedFulfillment = localStorage.getItem(FULFILLMENT_KEY)
    if (savedFulfillment && !fulfillmentParam) {
      updateField("fulfillment", savedFulfillment)
    }
  }, [fulfillmentParam])

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
      setLoadingProducts(false)
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
            id,
            name: product.name || "Medicine item",
            size: product.size || "",
            category: product.category || "",
            price: priceNumber(product.price),
            image: product.image || "",
            stock: product.stock || "",
            rx: product.rx || false,
            qty: Number(qty) || 1
          }
        })
        .filter(Boolean)

      setCartItems(items)
    } catch {
      setCartItems([])
    }
  }, [allProducts])

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + priceNumber(item.price) * item.qty,
      0
    )

    const serviceFee = subtotal > 10 ? Math.min(subtotal * 0.05, 5) : 0
    const deliveryFee =
      form.fulfillment === "Delivery" && subtotal > 0 ? 3.5 : 0

    return {
      subtotal,
      serviceFee,
      deliveryFee,
      total: subtotal + serviceFee + deliveryFee
    }
  }, [cartItems, form.fulfillment])

  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const isReady =
    cartItems.length > 0 &&
    form.fullName.trim() &&
    form.phone.trim() &&
    (form.fulfillment === "Pickup" || form.address.trim())

  const placeOrder = async () => {
    if (!isReady) {
      alert("Fill your details and make sure cart has items")
      return
    }

    try {
      setPlacingOrder(true)

      const orderRef = push(ref(db, `pharmacyOrders/${STORE_ID}`))

      await set(orderRef, {
        storeId: STORE_ID,
        pharmacy: STORE_NAME,
        customerName: form.fullName,
        phone: form.phone,
        city: form.city,
        address: form.fulfillment === "Delivery" ? form.address : "",
        orderNote: form.orderNote || "",
        fulfillment: form.fulfillment,
        paymentMethod: form.paymentMethod,
        items: cartItems,
        itemCount,
        subtotal: Number(totals.subtotal.toFixed(2)),
        serviceFee: Number(totals.serviceFee.toFixed(2)),
        deliveryFee: Number(totals.deliveryFee.toFixed(2)),
        total: Number(totals.total.toFixed(2)),
        status: "received",
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      localStorage.removeItem(CART_KEY)

      alert("Order placed successfully")
      router.push(`/pharmacy/orders?store=${STORE_ID}&city=${encodeURIComponent(form.city)}`)
    } catch (error) {
      console.error(error)
      alert("Failed to place order")
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loadingProducts) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-700" />
          <p className="mt-4 text-[13px] font-black text-neutral-600">
            Loading checkout...
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

            <div className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[11px] font-black backdrop-blur-xl">
              Checkout
            </div>
          </div>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
              <Store className="h-4 w-4" />
              ALLIANCE PHARMACY
            </div>

            <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[66px]">
              Complete Order
            </h1>

            <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/85">
              Add customer details, choose pickup or delivery, then submit the order directly to Alliance Pharmacy.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <User className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Customer details
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Who is placing this order?
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputBox
                  label="Full name"
                  value={form.fullName}
                  onChange={(value) => updateField("fullName", value)}
                  placeholder="Enter your full name"
                />

                <InputBox
                  label="Phone number"
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <Truck className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Fulfillment
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Delivery adds $3.50. Pickup is free.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {["Delivery", "Pickup"].map((option) => {
                  const active = form.fulfillment === option

                  return (
                    <button
                      key={option}
                      onClick={() => updateField("fulfillment", option)}
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
                          ? "Deliver to customer address through SendIt."
                          : "Customer collects directly from Alliance Pharmacy."}
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-black text-neutral-500">
                    City
                  </p>
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                  >
                    <option>Harare</option>
                    <option>Bulawayo</option>
                    <option>Gweru</option>
                    <option>Zvishavane</option>
                    <option>Mutare</option>
                  </select>
                </div>

                <InputBox
                  label="Address"
                  value={form.address}
                  onChange={(value) => updateField("address", value)}
                  placeholder={
                    form.fulfillment === "Delivery"
                      ? "Enter delivery address"
                      : "Optional for pickup"
                  }
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <Wallet className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Payment and note
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Choose payment method and add instructions.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-black text-neutral-500">
                    Payment method
                  </p>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => updateField("paymentMethod", e.target.value)}
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                  >
                    <option>Cash on delivery</option>
                    <option>Cash on pickup</option>
                    <option>Mobile money</option>
                    <option>Card payment</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-black text-neutral-500">
                  Order note
                </p>
                <textarea
                  rows={5}
                  value={form.orderNote}
                  onChange={(e) => updateField("orderNote", e.target.value)}
                  placeholder="Add landmark, medicine handling note, or extra instructions..."
                  className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Order items
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Pulled from Alliance cart.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                  {itemCount} item(s)
                </span>
              </div>

              <div className="space-y-3">
                {cartItems.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
                    <ShoppingBag className="mx-auto h-8 w-8 text-emerald-700" />
                    <p className="mt-3 text-[15px] font-black text-neutral-900">
                      No items in cart
                    </p>
                    <button
                      onClick={() =>
                        router.push(`/pharmacy/alliance?city=${encodeURIComponent(form.city)}`)
                      }
                      className="mt-4 rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white"
                    >
                      Back to Alliance Pharmacy
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-[24px] border border-emerald-100 p-3"
                    >
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Pill className="h-6 w-6 text-emerald-700" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-[13px] font-black text-neutral-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-500">
                          {item.qty} × ${priceNumber(item.price).toFixed(2)}
                        </p>
                      </div>

                      <p className="text-[13px] font-black text-neutral-900">
                        ${(priceNumber(item.price) * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-5 text-white">
                <p className="text-[11px] text-white/75">Order summary</p>
                <p className="mt-1 text-[24px] font-black tracking-[-0.04em]">
                  {form.pharmacy}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {form.fulfillment} • {form.paymentMethod}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <SummaryRow label="Items subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
                <SummaryRow
                  label="Service fee"
                  value={`$${totals.serviceFee.toFixed(2)}`}
                />
                <SummaryRow
                  label={`${form.fulfillment} fee`}
                  value={`$${totals.deliveryFee.toFixed(2)}`}
                />
              </div>

              <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="text-[11px] font-black text-emerald-700">
                  Service fee rule
                </p>
                <p className="mt-1 text-[11px] leading-5 text-neutral-600">
                  Below $10 = $0.00. Above $10 = 5% of subtotal, capped at $5.00.
                  Delivery adds $3.50.
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
                disabled={!isReady || placingOrder}
                onClick={placeOrder}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-black ${
                  isReady && !placingOrder
                    ? "bg-emerald-700 text-white shadow-lg"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {placingOrder ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {placingOrder ? "Placing order..." : "Place order"}
              </button>

              {!isReady && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Fill your details and make sure cart has items.
                </p>
              )}

              <div className="mt-5 rounded-[22px] border border-dashed border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-neutral-900">
                      Saves to Alliance admin
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      This order goes to pharmacyOrders/alliance-pharmacy for the owner dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-emerald-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                  <ShieldCheck className="h-5 w-5 text-emerald-700" />
                </div>
                <p className="mt-3 text-[13px] font-black text-neutral-900">
                  Verified checkout flow
                </p>
                <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                  Products, prices and images come from Firebase. Final order is stored live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function InputBox({ label, value, onChange, placeholder }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-black text-neutral-500">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
      />
    </div>
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

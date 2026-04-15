"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
  ShoppingCart
} from "lucide-react"

export default function PharmacyCartPage() {
  const router = useRouter()

  const [selectedStore] = useState("Alliance Pharmacy")
  const [fulfillment, setFulfillment] = useState("Delivery")

  const [cartItems, setCartItems] = useState([
    {
      id: "a1",
      name: "Panado",
      size: "500mg tablets",
      price: 3.5,
      qty: 2,
      rx: false
    },
    {
      id: "a2",
      name: "Vitamin C",
      size: "1000mg",
      price: 6.99,
      qty: 1,
      rx: false
    },
    {
      id: "a3",
      name: "Cough Syrup",
      size: "120ml",
      price: 5.8,
      qty: 1,
      rx: false
    }
  ])

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const serviceFee = subtotal > 0 ? 1.5 : 0
    const deliveryFee = fulfillment === "Delivery" ? 2.5 : 0
    const total = subtotal + serviceFee + deliveryFee

    return { subtotal, serviceFee, deliveryFee, total }
  }, [cartItems, fulfillment])

  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-36">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#142347] to-[#1f3c88] px-4 pb-8 pt-4 text-white">
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

            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#0f172a]">
                  {itemCount}
                </span>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Store className="h-3.5 w-3.5" />
              {selectedStore}
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              Your cart
            </h1>

            <p className="mt-1 text-[13px] text-white/80">
              Review your medicines, choose pickup or delivery, then continue to checkout.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Pickup or delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Trusted pharmacy flow
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-4 px-4">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Cart items
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Adjust quantity or remove items
                  </p>
                </div>

                <div className="rounded-full bg-[#f4f7ff] px-3 py-1 text-[11px] font-semibold text-[#173ea5]">
                  {itemCount} item(s)
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-neutral-300 bg-[#fafcff] p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                      <ShoppingCart className="h-6 w-6 text-neutral-500" />
                    </div>
                    <p className="mt-4 text-[16px] font-semibold text-neutral-900">
                      Your cart is empty
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Add medicines from the pharmacy page first
                    </p>
                    <button
                      onClick={() => router.push("/pharmacy")}
                      className="mt-5 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                    >
                      Back to pharmacy
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[24px] border border-neutral-200 bg-white p-4"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-[96px] w-[96px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4]">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                            <Pill className="h-6 w-6 text-[#173ea5]" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[14px] font-semibold text-neutral-900">
                                {item.name}
                              </p>
                              <p className="mt-1 text-[11px] text-neutral-500">
                                {item.size}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-[11px] text-neutral-500">Price</p>
                              <p className="text-[15px] font-semibold text-neutral-900">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1">
                              <button
                                onClick={() => decreaseQty(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="min-w-[16px] text-center text-[12px] font-semibold text-neutral-900">
                                {item.qty}
                              </span>

                              <button
                                onClick={() => increaseQty(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10214e] text-white"
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

            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <p className="text-[16px] font-semibold text-neutral-900">
                How do you want to receive it?
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Choose your fulfillment option
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Delivery", "Pickup"].map((option) => {
                  const active = fulfillment === option
                  return (
                    <button
                      key={option}
                      onClick={() => setFulfillment(option)}
                      className={`rounded-[22px] border px-4 py-4 text-left transition ${
                        active
                          ? "border-[#173ea5] bg-[#f4f7ff]"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      <p className="text-[13px] font-semibold text-neutral-900">
                        {option}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {option === "Delivery"
                          ? "Get it brought to your address"
                          : "Collect directly from the pharmacy"}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Selected pharmacy</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                  {selectedStore}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {fulfillment} • {itemCount} item(s)
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Service fee</span>
                  <span>${totals.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>{fulfillment} fee</span>
                  <span>${totals.deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                <span className="text-[14px] font-semibold text-neutral-900">
                  Total
                </span>
                <span className="text-[24px] font-semibold tracking-[-0.03em] text-[#10214e]">
                  ${totals.total.toFixed(2)}
                </span>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={() => router.push("/pharmacy/checkout")}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold ${
                  cartItems.length > 0
                    ? "bg-[#10214e] text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                Continue to checkout
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => router.push("/pharmacy")}
                className="mt-3 w-full rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-semibold text-neutral-700"
              >
                Back to pharmacy
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
    }

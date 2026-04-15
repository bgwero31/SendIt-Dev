"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Truck,
  Store,
  Wallet,
  FileText,
  ShieldCheck,
  CheckCircle2
} from "lucide-react"

export default function PharmacyCheckoutPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "Harare",
    address: "",
    orderNote: "",
    fulfillment: "Delivery",
    paymentMethod: "Cash on delivery",
    pharmacy: "Alliance Pharmacy"
  })

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const totals = useMemo(() => {
    const subtotal = 19.79
    const serviceFee = 1.5
    const deliveryFee = form.fulfillment === "Delivery" ? 2.5 : 0
    return {
      subtotal,
      serviceFee,
      deliveryFee,
      total: subtotal + serviceFee + deliveryFee
    }
  }, [form.fulfillment])

  const isReady =
    form.fullName.trim() &&
    form.phone.trim() &&
    (form.fulfillment === "Pickup" || form.address.trim())

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

            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold backdrop-blur-xl">
              Checkout
            </div>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Store className="h-3.5 w-3.5" />
              {form.pharmacy}
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              Complete your pharmacy order
            </h1>

            <p className="mt-1 text-[13px] text-white/80">
              Add your customer details, delivery choice, payment method and order note.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-4 px-4">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <User className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Customer details
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Who is placing this order
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Full name
                  </p>
                  <input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Phone number
                  </p>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Truck className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Fulfillment
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Delivery or pickup
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
                          ? "Deliver to my address"
                          : "I will collect from the pharmacy"}
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
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
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Address
                  </p>
                  <input
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Enter delivery address"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Wallet className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Payment and note
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Choose payment and add any instructions
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
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
                <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                  Order note
                </p>
                <textarea
                  rows={5}
                  value={form.orderNote}
                  onChange={(e) => updateField("orderNote", e.target.value)}
                  placeholder="Add any order note, landmark, or handling message..."
                  className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Order summary</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                  {form.pharmacy}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {form.fulfillment} • {form.paymentMethod}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Items subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Service fee</span>
                  <span>${totals.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>{form.fulfillment} fee</span>
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
                disabled={!isReady}
                onClick={() => router.push("/pharmacy/orders")}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold ${
                  isReady
                    ? "bg-[#10214e] text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                Place order
                <ChevronRight className="h-4 w-4" />
              </button>

              {!isReady && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Fill your details first
                </p>
              )}

              <div className="mt-4 rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                    <CheckCircle2 className="h-5 w-5 text-[#0c8f4d]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">
                      Next step later
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      After pages are done, this button will save the order and route it to pharmacy staff.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
  }

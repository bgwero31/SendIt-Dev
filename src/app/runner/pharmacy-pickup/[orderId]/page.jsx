"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { onValue, ref, update } from "firebase/database"
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  KeyRound,
  Loader2,
  MapPin,
  Phone,
  Store,
  Truck,
  User
} from "lucide-react"

import { db } from "../../../../lib/firebase"

const STORE_ID = "alliance-pharmacy"

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

export default function PharmacyRunnerPickupPage() {
  const router = useRouter()
  const params = useParams()

  const orderId = params?.orderId

  const [order, setOrder] = useState(null)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const orderRef = ref(db, `pharmacyOrders/${STORE_ID}/${orderId}`)

    const unsub = onValue(orderRef, (snap) => {
      setOrder(snap.exists() ? { id: orderId, ...snap.val() } : null)
      setLoading(false)
    })

    return () => unsub()
  }, [orderId])

  const confirmPickup = async () => {
    if (!order) return

    const entered = code.trim().toUpperCase()
    const correct = String(order.pickupCode || "").trim().toUpperCase()

    if (!entered) {
      alert("Enter pickup code")
      return
    }

    if (entered !== correct) {
      alert("Wrong pickup code")
      return
    }

    try {
      setSubmitting(true)

      const now = Date.now()

      await update(ref(db, `pharmacyOrders/${STORE_ID}/${order.id}`), {
        status: "picked_up_by_runner",
        pickupCodeUsed: true,
        "timeline/pickedUpAt": now,
        updatedAt: now
      })

      if (order.runnerTaskId) {
        await update(ref(db, `tasks/${order.city || "Harare"}/${order.runnerTaskId}`), {
          status: "picked_up_by_runner",
          pickupCodeUsed: true,
          pickedUpAt: now,
          updatedAt: now
        })
      }

      alert("Pickup confirmed. Delivery started.")

      router.push("/runner")
    } catch (error) {
      console.error(error)
      alert("Failed to confirm pickup")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-700" />
          <p className="mt-4 text-[13px] font-black text-neutral-600">
            Loading pickup order...
          </p>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-[30px] bg-white p-8 text-center shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
          <KeyRound className="mx-auto h-10 w-10 text-red-500" />
          <p className="mt-4 text-[22px] font-black text-neutral-900">
            Order not found
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 rounded-full bg-emerald-700 px-6 py-3 text-[13px] font-black text-white"
          >
            Go back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] pb-28">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-white px-4 pb-9 pt-4 text-white">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <button
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
              <Bike className="h-4 w-4" />
              RUNNER PICKUP
            </div>

            <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[64px]">
              Confirm Pickup
            </h1>

            <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/85">
              Enter the pickup code from Alliance Pharmacy to start delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
            <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-5 text-white">
              <p className="text-[11px] text-white/75">Pickup from</p>
              <p className="mt-1 text-[24px] font-black tracking-[-0.04em]">
                Alliance Pharmacy
              </p>
              <p className="mt-2 text-[12px] text-white/80">
                Order #{order.id.slice(-6).toUpperCase()}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <InfoLine icon={User} label="Customer" value={order.customerName || "Customer"} />
              <InfoLine icon={Phone} label="Phone" value={order.phone || order.customerPhone || "Not set"} />
              <InfoLine icon={MapPin} label="Drop-off" value={order.address || order.customerAddress || "Not set"} />
              <InfoLine icon={Truck} label="Runner fee" value={money(order.runnerFee || order.deliveryFee || 3)} />
            </div>

            <div className="mt-5 rounded-[24px] border border-emerald-100 p-4">
              <p className="text-[14px] font-black text-neutral-900">
                Items to collect
              </p>

              <div className="mt-3 space-y-2">
                {(order.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-[12px]"
                  >
                    <span className="text-neutral-600">
                      {item.qty} × {item.name}
                    </span>
                    <span className="font-black text-neutral-900">
                      {item.size || item.category || ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <KeyRound className="h-7 w-7 text-emerald-700" />
            </div>

            <p className="mt-5 text-[24px] font-black tracking-[-0.04em] text-neutral-900">
              Enter pickup code
            </p>

            <p className="mt-2 text-[12px] leading-5 text-neutral-500">
              Ask Alliance Pharmacy for the code after they hand over the order.
            </p>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="AP123456"
              className="mt-5 w-full rounded-[22px] border border-emerald-100 bg-emerald-50/40 px-5 py-4 text-center text-[24px] font-black tracking-[0.15em] text-emerald-900 outline-none"
            />

            <button
              onClick={confirmPickup}
              disabled={submitting || order.pickupCodeUsed}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-black ${
                !submitting && !order.pickupCodeUsed
                  ? "bg-emerald-700 text-white shadow-lg"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {order.pickupCodeUsed ? "Pickup already confirmed" : "Start delivery"}
            </button>

            <div className="mt-5 rounded-[22px] border border-emerald-100 p-4">
              <div className="flex items-start gap-3">
                <Store className="mt-1 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="text-[13px] font-black text-neutral-900">
                    Important
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                    Only start delivery after collecting the correct package from the pharmacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-[#f8fafc] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
        <Icon className="h-4 w-4 text-emerald-700" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
          {label}
        </p>
        <p className="mt-1 text-[12px] font-black text-neutral-900">{value}</p>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onValue, ref, update } from "firebase/database"
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  Truck,
  Store,
  FileText,
  Search,
  Package,
  ChevronRight,
  Wallet,
  ReceiptText,
  ShieldCheck,
  Copy,
  Loader2,
  MapPin,
  Phone,
  User,
  KeyRound
} from "lucide-react"

import { db } from "../../../lib/firebase"

const STORE_ID = "alliance-pharmacy"
const STORE_NAME = "Alliance Pharmacy"

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function shortId(id = "") {
  return id ? `AP-${id.slice(-6).toUpperCase()}` : "AP-ORDER"
}

function statusLabel(status) {
  const map = {
    awaiting_payment: "Awaiting payment",
    payment_submitted: "Payment submitted",
    paid_ready_for_pickup: "Paid & ready",
    runner_assigned: "Runner assigned",
    picked_up_by_runner: "Picked up",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    collected_by_customer: "Collected",
    completed: "Completed",
    cancelled: "Cancelled"
  }

  return map[status] || status || "Pending"
}

function statusClasses(status) {
  switch (status) {
    case "awaiting_payment":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "payment_submitted":
      return "bg-blue-50 text-blue-700 border-blue-100"
    case "paid_ready_for_pickup":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "runner_assigned":
    case "picked_up_by_runner":
    case "out_for_delivery":
      return "bg-indigo-50 text-indigo-700 border-indigo-100"
    case "delivered":
    case "collected_by_customer":
    case "completed":
      return "bg-green-50 text-green-700 border-green-100"
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-100"
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200"
  }
}

export default function PharmacyOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const highlightedOrderId = searchParams.get("order") || ""
  const cityParam = searchParams.get("city") || "Harare"

  const [activeFilter, setActiveFilter] = useState("All")
  const [query, setQuery] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentRefs, setPaymentRefs] = useState({})
  const [savingPaymentId, setSavingPaymentId] = useState("")

  useEffect(() => {
    const ordersRef = ref(db, `pharmacyOrders/${STORE_ID}`)

    const unsub = onValue(ordersRef, (snap) => {
      const data = snap.val() || {}

      const list = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      setOrders(list)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const filters = [
    "All",
    "Awaiting payment",
    "Payment submitted",
    "Paid & ready",
    "Out for delivery",
    "Completed"
  ]

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const label = statusLabel(order.status)

      const matchFilter =
        activeFilter === "All" ||
        label === activeFilter ||
        (activeFilter === "Out for delivery" &&
          ["runner_assigned", "picked_up_by_runner", "out_for_delivery"].includes(order.status)) ||
        (activeFilter === "Completed" &&
          ["delivered", "collected_by_customer", "completed"].includes(order.status))

      const q = query.toLowerCase()
      const itemNames = (order.items || []).map((item) => item.name).join(" ")

      const matchQuery =
        order.id?.toLowerCase().includes(q) ||
        shortId(order.id).toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.phone?.toLowerCase().includes(q) ||
        itemNames.toLowerCase().includes(q) ||
        order.fulfillment?.toLowerCase().includes(q)

      return matchFilter && matchQuery
    })
  }, [orders, activeFilter, query])

  const selectedOrder = useMemo(() => {
    if (highlightedOrderId) {
      return orders.find((order) => order.id === highlightedOrderId) || filteredOrders[0]
    }
    return filteredOrders[0]
  }, [orders, filteredOrders, highlightedOrderId])

  const submitPaymentReference = async (order) => {
    const reference = (paymentRefs[order.id] || "").trim()

    if (!reference) {
      alert("Enter payment reference first")
      return
    }

    try {
      setSavingPaymentId(order.id)

      await update(ref(db, `pharmacyOrders/${STORE_ID}/${order.id}`), {
        paymentReference: reference,
        paymentStatus: "payment_submitted",
        status: "payment_submitted",
        "timeline/paymentSubmittedAt": Date.now(),
        updatedAt: Date.now()
      })

      alert("Payment reference submitted")
    } catch (error) {
      console.error(error)
      alert("Failed to submit payment reference")
    } finally {
      setSavingPaymentId("")
    }
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Copied")
    } catch {
      alert(text)
    }
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
              Orders
            </div>
          </div>

          <div className="mt-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
              <Store className="h-4 w-4" />
              ALLIANCE PHARMACY
            </div>

            <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[66px]">
              Your Orders
            </h1>

            <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/85">
              Track your payment, receipt, pickup code, and delivery or collection status.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="rounded-[30px] border border-emerald-100 bg-white p-4 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1 rounded-[22px] border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-emerald-700" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search order, name, phone, or item..."
                    className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => router.push(`/pharmacy/alliance?city=${encodeURIComponent(cityParam)}`)}
                className="rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white"
              >
                Back to Alliance
              </button>
            </div>

            <div className="mt-4 overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max gap-2 pr-4">
                {filters.map((filter) => {
                  const active = activeFilter === filter

                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full px-4 py-2 text-[12px] font-black ${
                        active
                          ? "bg-emerald-700 text-white shadow-lg"
                          : "border border-emerald-100 bg-white text-neutral-700"
                      }`}
                    >
                      {filter}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[32px] bg-white p-10 text-center shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
              <p className="mt-4 text-[13px] font-black text-neutral-600">
                Loading your orders...
              </p>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="rounded-[32px] bg-white p-8 text-center shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                      <Package className="h-7 w-7 text-emerald-700" />
                    </div>
                    <p className="mt-4 text-[18px] font-black text-neutral-900">
                      No orders found
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Your Alliance Pharmacy orders will appear here.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() =>
                        router.push(
                          `/pharmacy/orders?store=${STORE_ID}&city=${encodeURIComponent(
                            order.city || cityParam
                          )}&order=${order.id}`
                        )
                      }
                      className={`w-full rounded-[30px] border bg-white p-5 text-left shadow-[0_12px_34px_rgba(4,120,87,0.06)] transition ${
                        selectedOrder?.id === order.id
                          ? "border-emerald-500"
                          : "border-emerald-100"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                            {shortId(order.id)}
                          </div>

                          <p className="mt-3 text-[16px] font-black text-neutral-900">
                            {(order.items || []).map((item) => item.name).slice(0, 3).join(", ") ||
                              "Alliance Pharmacy order"}
                          </p>

                          <p className="mt-1 text-[12px] text-neutral-500">
                            {order.fulfillment || "Order"} • {STORE_NAME}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="h-3.5 w-3.5" />
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : "Just now"}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Store className="h-3.5 w-3.5" />
                              {order.city || cityParam}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <div
                            className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusClasses(
                              order.status
                            )}`}
                          >
                            {statusLabel(order.status)}
                          </div>

                          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 px-4 py-2 text-[12px] font-black text-neutral-800">
                            View details
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="space-y-5">
                {selectedOrder ? (
                  <OrderDetails
                    order={selectedOrder}
                    paymentRefs={paymentRefs}
                    setPaymentRefs={setPaymentRefs}
                    savingPaymentId={savingPaymentId}
                    submitPaymentReference={submitPaymentReference}
                    copyText={copyText}
                  />
                ) : (
                  <div className="rounded-[32px] bg-white p-8 text-center shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
                    <Package className="mx-auto h-9 w-9 text-emerald-700" />
                    <p className="mt-4 text-[18px] font-black text-neutral-900">
                      Select an order
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function OrderDetails({
  order,
  paymentRefs,
  setPaymentRefs,
  savingPaymentId,
  submitPaymentReference,
  copyText
}) {
  const canSubmitPayment =
    order.status === "awaiting_payment" || order.paymentStatus === "awaiting_payment"

  const canShowPickupCode =
    order.paymentStatus === "paid" ||
    order.paidConfirmedByPharmacy ||
    [
      "paid_ready_for_pickup",
      "runner_assigned",
      "picked_up_by_runner",
      "out_for_delivery",
      "delivered",
      "collected_by_customer",
      "completed"
    ].includes(order.status)

  return (
    <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)] xl:sticky xl:top-5">
      <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-5 text-white">
        <p className="text-[11px] text-white/75">Order details</p>
        <p className="mt-1 text-[24px] font-black tracking-[-0.04em]">
          {shortId(order.id)}
        </p>
        <p className="mt-2 text-[12px] text-white/80">
          {order.fulfillment} • {statusLabel(order.status)}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        <InfoLine icon={User} label="Customer" value={order.customerName || "Customer"} />
        <InfoLine icon={Phone} label="Phone" value={order.phone || order.customerPhone || "Not set"} />
        <InfoLine icon={MapPin} label="City" value={order.city || order.customerCity || "Not set"} />
        {order.fulfillment === "Delivery" && (
          <InfoLine icon={Truck} label="Address" value={order.address || order.customerAddress || "Not set"} />
        )}
      </div>

      <div className="mt-5 rounded-[24px] border border-emerald-100 p-4">
        <p className="text-[14px] font-black text-neutral-900">Items</p>

        <div className="mt-3 space-y-3">
          {(order.items || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-black text-neutral-900">{item.name}</p>
                <p className="text-[11px] text-neutral-500">
                  {item.qty} × {money(item.price)}
                </p>
              </div>
              <p className="text-[12px] font-black text-neutral-900">
                {money(Number(item.price || 0) * Number(item.qty || 1))}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-emerald-100 p-4">
        <p className="text-[14px] font-black text-neutral-900">Payment summary</p>

        <div className="mt-3 space-y-2">
          <SummaryRow label="Items subtotal" value={money(order.subtotal)} />
          <SummaryRow label="Service fee" value={money(order.serviceFee)} />
          <SummaryRow
            label={order.fulfillment === "Delivery" ? "Delivery fee" : "Pickup fee"}
            value={money(order.deliveryFee)}
          />
          <div className="border-t border-emerald-100 pt-3">
            <SummaryRow label="Total paid" value={money(order.total)} strong />
          </div>
        </div>
      </div>

      {canSubmitPayment && (
        <div className="mt-5 rounded-[24px] border border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-start gap-3">
            <Wallet className="mt-1 h-5 w-5 text-amber-700" />
            <div className="flex-1">
              <p className="text-[14px] font-black text-neutral-900">
                Submit payment reference
              </p>
              <p className="mt-1 text-[11px] leading-5 text-neutral-600">
                Pay using your selected method, then enter the confirmation/reference number below.
              </p>

              <input
                value={paymentRefs[order.id] || ""}
                onChange={(e) =>
                  setPaymentRefs((prev) => ({
                    ...prev,
                    [order.id]: e.target.value
                  }))
                }
                placeholder="EcoCash / OneMoney reference"
                className="mt-3 w-full rounded-[16px] border border-amber-100 bg-white px-4 py-3 text-[13px] outline-none"
              />

              <button
                onClick={() => submitPaymentReference(order)}
                disabled={savingPaymentId === order.id}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white"
              >
                {savingPaymentId === order.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Submit reference
              </button>
            </div>
          </div>
        </div>
      )}

      {order.paymentReference && (
        <StatusBox
          icon={CheckCircle2}
          title="Payment reference submitted"
          text={order.paymentReference}
        />
      )}

      {order.receiptNumber && (
        <StatusBox
          icon={ReceiptText}
          title="Receipt number"
          text={order.receiptNumber}
        />
      )}

      {canShowPickupCode && order.pickupCode && (
        <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-emerald-700" />
                <p className="text-[14px] font-black text-neutral-900">
                  Pickup code
                </p>
              </div>
              <p className="mt-2 text-[26px] font-black tracking-[0.08em] text-emerald-800">
                {order.pickupCode}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-neutral-600">
                Use this code for pickup or runner collection.
              </p>
            </div>

            <button
              onClick={() => copyText(order.pickupCode)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-[24px] border border-emerald-100 p-4">
        <p className="text-[14px] font-black text-neutral-900">Order progress</p>
        <div className="mt-4 space-y-3">
          <ProgressItem active label="Order created" />
          <ProgressItem active={!!order.paymentReference} label="Payment submitted" />
          <ProgressItem active={canShowPickupCode} label="Payment confirmed" />
          <ProgressItem
            active={[
              "runner_assigned",
              "picked_up_by_runner",
              "out_for_delivery",
              "delivered",
              "completed"
            ].includes(order.status)}
            label={order.fulfillment === "Delivery" ? "Delivery in progress" : "Ready for collection"}
          />
          <ProgressItem
            active={[
              "delivered",
              "collected_by_customer",
              "completed"
            ].includes(order.status)}
            label="Completed"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          onClick={() => copyText(shortId(order.id))}
          className="rounded-full border border-emerald-100 px-5 py-3 text-[13px] font-black text-emerald-800"
        >
          Copy order number
        </button>
      </div>
    </div>
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

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between text-[12px] text-neutral-600">
      <span>{label}</span>
      <span className={strong ? "text-[17px] font-black text-emerald-800" : "font-black text-neutral-900"}>
        {value}
      </span>
    </div>
  )
}

function StatusBox({ icon: Icon, title, text }) {
  return (
    <div className="mt-5 rounded-[24px] border border-emerald-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <p className="text-[13px] font-black text-neutral-900">{title}</p>
          <p className="mt-1 text-[12px] font-semibold text-neutral-600">{text}</p>
        </div>
      </div>
    </div>
  )
}

function ProgressItem({ active, label }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full ${
          active ? "bg-emerald-700 text-white" : "bg-neutral-100 text-neutral-400"
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <p className={`text-[12px] font-black ${active ? "text-neutral-900" : "text-neutral-400"}`}>
        {label}
      </p>
    </div>
  )
}

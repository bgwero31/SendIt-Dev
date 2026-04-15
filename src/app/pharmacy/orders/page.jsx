"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  Truck,
  Store,
  FileText,
  Search,
  Package,
  CircleDot,
  ChevronRight
} from "lucide-react"

export default function PharmacyOrdersPage() {
  const router = useRouter()

  const [activeFilter, setActiveFilter] = useState("All")
  const [query, setQuery] = useState("")

  const orders = [
    {
      id: "ORD-2048",
      type: "Cart order",
      pharmacy: "Alliance Pharmacy",
      title: "Panado, Vitamin C, Cough Syrup",
      status: "Preparing",
      route: "Delivery • Harare",
      date: "Today, 10:12"
    },
    {
      id: "ORD-1831",
      type: "Prescription request",
      pharmacy: "Rehome Pharmacy",
      title: "Prescription review pending",
      status: "Pending review",
      route: "Pickup • Harare",
      date: "Today, 09:02"
    },
    {
      id: "ORD-2207",
      type: "Availability request",
      pharmacy: "Alliance Pharmacy",
      title: "Asked for Amoxicillin availability",
      status: "Responded",
      route: "Harare",
      date: "Yesterday, 17:45"
    },
    {
      id: "ORD-2124",
      type: "Cart order",
      pharmacy: "Alliance Pharmacy",
      title: "Multivitamins, Nasal Spray",
      status: "Out for delivery",
      route: "Delivery • Harare",
      date: "Today, 12:18"
    },
    {
      id: "ORD-1800",
      type: "Cart order",
      pharmacy: "Rehome Pharmacy",
      title: "Ibuprofen, Baby Wipes",
      status: "Delivered",
      route: "Delivery • Gweru",
      date: "Yesterday, 13:22"
    }
  ]

  const filters = ["All", "Pending review", "Preparing", "Out for delivery", "Delivered", "Responded"]

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchFilter = activeFilter === "All" || order.status === activeFilter
      const q = query.toLowerCase()
      const matchQuery =
        order.id.toLowerCase().includes(q) ||
        order.title.toLowerCase().includes(q) ||
        order.pharmacy.toLowerCase().includes(q) ||
        order.type.toLowerCase().includes(q)

      return matchFilter && matchQuery
    })
  }, [orders, activeFilter, query])

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending review":
        return "bg-[#fff6e8] text-[#b56a00]"
      case "Preparing":
        return "bg-[#eef4ff] text-[#173ea5]"
      case "Out for delivery":
        return "bg-[#eefaf1] text-[#0c8f4d]"
      case "Delivered":
        return "bg-[#edfdf3] text-[#0c8f4d]"
      case "Responded":
        return "bg-[#f3f4f6] text-neutral-700"
      default:
        return "bg-neutral-100 text-neutral-700"
    }
  }

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
              Orders
            </div>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Store className="h-3.5 w-3.5" />
              Pharmacy orders and requests
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              Track your pharmacy activity
            </h1>

            <p className="mt-1 text-[13px] text-white/80">
              See cart orders, prescription reviews, and medicine availability requests.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-4 px-4">
        <div className="space-y-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1 rounded-[20px] border border-neutral-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Search className="h-4.5 w-4.5 text-neutral-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by order ID, pharmacy, or title..."
                    className="w-full bg-transparent text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => router.push("/pharmacy")}
                className="rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
              >
                Back to pharmacy
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
                      className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
                        active
                          ? "bg-[#10214e] text-white"
                          : "border border-neutral-200 bg-white text-neutral-700"
                      }`}
                    >
                      {filter}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-[28px] bg-white p-8 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                    <Package className="h-6 w-6 text-neutral-500" />
                  </div>
                  <p className="mt-4 text-[16px] font-semibold text-neutral-900">
                    No matching orders
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Try another search or change the filter
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="inline-flex rounded-full bg-[#f4f7ff] px-3 py-1 text-[10px] font-semibold text-[#173ea5]">
                          {order.id}
                        </div>

                        <p className="mt-3 text-[16px] font-semibold text-neutral-900">
                          {order.title}
                        </p>

                        <p className="mt-1 text-[12px] text-neutral-500">
                          {order.type} • {order.pharmacy}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {order.date}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Store className="h-3.5 w-3.5" />
                            {order.route}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusClasses(order.status)}`}>
                          {order.status}
                        </div>

                        <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[12px] font-semibold text-neutral-800">
                          View details
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
                <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                  <p className="text-[11px] text-white/70">Activity summary</p>
                  <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                    Pharmacy flow
                  </p>
                  <p className="mt-2 text-[12px] text-white/80">
                    Orders, reviews, requests
                  </p>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-[20px] border border-neutral-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6e8]">
                      <FileText className="h-4.5 w-4.5 text-[#b56a00]" />
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                      Pending review
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Prescription and request review items
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-neutral-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                      <CircleDot className="h-4.5 w-4.5 text-[#173ea5]" />
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                      Preparing
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Pharmacy accepted and is packing the order
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-neutral-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                      <Truck className="h-4.5 w-4.5 text-[#0c8f4d]" />
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                      Out for delivery
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Moving to customer location
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-neutral-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edfdf3]">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#0c8f4d]" />
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                      Delivered
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Completed customer handoff
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/pharmacy/request")}
                  className="mt-5 w-full rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                >
                  New availability request
                </button>

                <button
                  onClick={() => router.push("/pharmacy/prescription")}
                  className="mt-3 w-full rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-semibold text-neutral-700"
                >
                  Upload prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
      }

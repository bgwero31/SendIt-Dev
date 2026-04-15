"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Search,
  Package,
  Truck,
  ShieldCheck,
  Clock3,
  ChevronRight,
  FileText,
  Smartphone,
  Shirt,
  Pill,
  Gift,
  Briefcase,
  Scale,
  Navigation,
  CircleDot,
  Archive,
  CheckCircle2,
  Wallet,
  Building2
} from "lucide-react"

export default function ParcelsPage() {
  const router = useRouter()

  const cities = [
    "Harare",
    "Bulawayo",
    "Gweru",
    "Zvishavane",
    "Kwekwe",
    "Mutare",
    "Masvingo"
  ]

  const parcelTypes = [
    { id: "documents", name: "Documents", icon: FileText },
    { id: "electronics", name: "Electronics", icon: Smartphone },
    { id: "clothing", name: "Clothing", icon: Shirt },
    { id: "medicine", name: "Medicine", icon: Pill },
    { id: "gifts", name: "Gifts", icon: Gift },
    { id: "business", name: "Business Stock", icon: Briefcase }
  ]

  const promos = [
    {
      id: 1,
      tag: "Fast route",
      title: "Harare to Gweru",
      subtitle: "Smooth intercity movement with pickup and delivery updates"
    },
    {
      id: 2,
      tag: "Popular route",
      title: "Bulawayo to Harare",
      subtitle: "Send parcels across cities with clean status tracking"
    },
    {
      id: 3,
      tag: "Reliable handoff",
      title: "Zvishavane to Harare",
      subtitle: "Perfect for business stock, documents and urgent items"
    }
  ]

  const popularRoutes = [
    { id: 1, from: "Harare", to: "Gweru", eta: "Same day / Next day", price: "$6+" },
    { id: 2, from: "Harare", to: "Bulawayo", eta: "Next day", price: "$10+" },
    { id: 3, from: "Zvishavane", to: "Harare", eta: "Next day", price: "$8+" },
    { id: 4, from: "Bulawayo", to: "Zvishavane", eta: "Same day / Next day", price: "$7+" }
  ]

  const sampleShipments = [
    {
      id: "PKG-2048",
      title: "Documents parcel",
      route: "Harare → Gweru",
      status: "In transit"
    },
    {
      id: "PKG-1831",
      title: "Medicine package",
      route: "Bulawayo → Harare",
      status: "Picked up"
    },
    {
      id: "PKG-2207",
      title: "Clothing bag",
      route: "Zvishavane → Harare",
      status: "Out for delivery"
    }
  ]

  const statusFlow = [
    { id: 1, name: "Request received", icon: Archive },
    { id: 2, name: "Pickup assigned", icon: Navigation },
    { id: 3, name: "Picked up", icon: Package },
    { id: 4, name: "In transit", icon: Truck },
    { id: 5, name: "Out for delivery", icon: CircleDot },
    { id: 6, name: "Delivered", icon: CheckCircle2 }
  ]

  const [promoIndex, setPromoIndex] = useState(0)
  const [fromCity, setFromCity] = useState("Harare")
  const [toCity, setToCity] = useState("Gweru")
  const [parcelType, setParcelType] = useState("Documents")
  const [weight, setWeight] = useState("Small")
  const [deliveryType, setDeliveryType] = useState("Standard")
  const [trackingCode, setTrackingCode] = useState("")
  const [activeParcelCategory, setActiveParcelCategory] = useState("All")

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1))
    }, 3600)

    return () => clearInterval(timer)
  }, [promos.length])

  const estimatedPrice = useMemo(() => {
    let base = 6

    if (fromCity === toCity) base = 3
    if (
      (fromCity === "Harare" && toCity === "Bulawayo") ||
      (fromCity === "Bulawayo" && toCity === "Harare")
    ) {
      base = 10
    }
    if (
      (fromCity === "Zvishavane" && toCity === "Harare") ||
      (fromCity === "Harare" && toCity === "Zvishavane")
    ) {
      base = 8
    }

    if (weight === "Medium") base += 2
    if (weight === "Large") base += 4
    if (deliveryType === "Express") base += 3

    return `$${base}`
  }, [fromCity, toCity, weight, deliveryType])

  const filteredTypes =
    activeParcelCategory === "All"
      ? parcelTypes
      : parcelTypes.filter((item) => item.name === activeParcelCategory)

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-32">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1224] via-[#10214e] to-[#1d3f98] px-4 pb-8 pt-4 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-0 top-24 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold backdrop-blur-xl">
              Intercity parcels
            </div>
          </div>

          <div className="mt-6 max-w-[620px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Truck className="h-3.5 w-3.5" />
              City to city delivery
            </div>

            <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.04em]">
              Send parcels across cities with pickup and tracking
            </h1>

            <p className="mt-2 text-[13px] text-white/80">
              Move documents, medicine, clothing, electronics and business stock
              between towns with clear status updates from pickup to delivery.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-white/78">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Zimbabwe routes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                Standard & express
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Tracked handoff
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="relative z-20 -mt-4 px-4">
        <div className="grid grid-cols-3 gap-3">
          <button className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
              <Package className="h-4.5 w-4.5 text-[#173ea5]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">
              Book parcel
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Start new delivery
            </p>
          </button>

          <button className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
              <Search className="h-4.5 w-4.5 text-[#0c8f4d]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">
              Track parcel
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Use parcel code
            </p>
          </button>

          <button className="rounded-[22px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6ee]">
              <Wallet className="h-4.5 w-4.5 text-[#c96b16]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-neutral-900">
              Get quote
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Estimate before send
            </p>
          </button>
        </div>
      </section>

      {/* ROUTE QUOTE */}
      <section className="mt-5 px-4">
        <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[17px] font-semibold tracking-[-0.02em] text-neutral-900">
                Get quick route estimate
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Select route, parcel type and size
              </p>
            </div>

            <div className="rounded-full bg-[#f4f7ff] px-3 py-1 text-[11px] font-semibold text-[#173ea5]">
              From {estimatedPrice}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] border border-neutral-200 p-3">
              <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                From city
              </p>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-medium text-neutral-900 outline-none"
              >
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="rounded-[20px] border border-neutral-200 p-3">
              <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                To city
              </p>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-medium text-neutral-900 outline-none"
              >
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="rounded-[20px] border border-neutral-200 p-3">
              <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                Parcel type
              </p>
              <select
                value={parcelType}
                onChange={(e) => setParcelType(e.target.value)}
                className="w-full rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-medium text-neutral-900 outline-none"
              >
                {parcelTypes.map((item) => (
                  <option key={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="rounded-[20px] border border-neutral-200 p-3">
              <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                Size / weight
              </p>
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] font-medium text-neutral-900 outline-none"
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {["Standard", "Express"].map((option) => {
              const active = deliveryType === option
              return (
                <button
                  key={option}
                  onClick={() => setDeliveryType(option)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
                    active
                      ? "bg-[#10214e] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white">
            Continue booking
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* PROMO CAROUSEL */}
      <section className="mt-5 px-4">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="relative min-h-[190px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-5 text-white">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative z-10 max-w-[430px]">
              <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold backdrop-blur-xl">
                {promos[promoIndex].tag}
              </div>

              <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em]">
                {promos[promoIndex].title}
              </h2>

              <p className="mt-2 text-[13px] text-white/80">
                {promos[promoIndex].subtitle}
              </p>

              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#101828]">
                Explore route
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-3">
            {promos.map((promo, index) => (
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

      {/* PARCEL TYPES */}
      <section className="mt-5 px-4">
        <div className="mb-3">
          <p className="text-[15px] font-semibold text-neutral-900">
            Parcel categories
          </p>
          <p className="text-[11px] text-neutral-500">
            Pick the type you want to send
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-3 pr-4">
            <button
              onClick={() => setActiveParcelCategory("All")}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
                activeParcelCategory === "All"
                  ? "bg-[#10214e] text-white"
                  : "border border-neutral-200 bg-white text-neutral-700"
              }`}
            >
              All
            </button>

            {parcelTypes.map((item) => {
              const Icon = item.icon
              const active = activeParcelCategory === item.name

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveParcelCategory(item.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold ${
                    active
                      ? "bg-[#10214e] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-3 pr-4">
            {filteredTypes.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className="w-[158px] rounded-[24px] border border-neutral-200 bg-white p-4 shadow-[0_8px_22px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex h-[90px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                      <Icon className="h-6 w-6 text-[#173ea5]" />
                    </div>
                  </div>

                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Intercity delivery supported
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section className="mt-5 px-4">
        <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[16px] font-semibold text-neutral-900">
                Track your parcel
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Enter parcel code to see current movement
              </p>
            </div>

            <div className="rounded-full bg-[#f4f7ff] px-3 py-1 text-[10px] font-semibold text-[#173ea5]">
              Live statuses
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <div className="flex-1 rounded-[20px] border border-neutral-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <Search className="h-4.5 w-4.5 text-neutral-400" />
                <input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Enter parcel code e.g PKG-2048"
                  className="w-full bg-transparent text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                />
              </div>
            </div>

            <button className="rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white">
              Track now
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {sampleShipments.map((item) => (
              <div
                key={item.id}
                className="rounded-[22px] border border-neutral-200 bg-[#fafcff] p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  {item.id}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-neutral-900">
                  {item.title}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">{item.route}</p>
                <div className="mt-3 inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold text-[#173ea5]">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="mt-6">
        <div className="mb-3 px-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
                Popular routes
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Frequently used city-to-city lanes
              </p>
            </div>

            <button className="text-[12px] font-semibold text-[#1d3f98]">
              See all
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="flex min-w-max gap-3 pr-4">
            {popularRoutes.map((route) => (
              <div
                key={route.id}
                className="w-[220px] rounded-[24px] border border-neutral-200 bg-white p-4 shadow-[0_8px_22px_rgba(0,0,0,0.05)]"
              >
                <div className="flex h-[100px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4]">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <Truck className="h-5 w-5 text-[#173ea5]" />
                    </div>
                    <p className="mt-2 text-[12px] font-semibold text-neutral-800">
                      {route.from} → {route.to}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-[13px] font-semibold text-neutral-900">
                    {route.from} to {route.to}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">{route.eta}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-neutral-900">
                      {route.price}
                    </span>
                    <button className="rounded-full bg-[#10214e] px-3 py-1.5 text-[11px] font-semibold text-white">
                      Send now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT MOVES */}
      <section className="mt-6 px-4">
        <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="mb-4">
            <p className="text-[16px] font-semibold text-neutral-900">
              How your parcel moves
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Clear handoff from request to delivery
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-neutral-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                <Navigation className="h-4.5 w-4.5 text-[#173ea5]" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                Pickup runner
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Parcel is collected from sender point
              </p>
            </div>

            <div className="rounded-[22px] border border-neutral-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                <Truck className="h-4.5 w-4.5 text-[#0c8f4d]" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                Intercity transit
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Parcel travels to destination city
              </p>
            </div>

            <div className="rounded-[22px] border border-neutral-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6ee]">
                <Building2 className="h-4.5 w-4.5 text-[#c96b16]" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                Final handoff
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                Receiver gets parcel at depot or doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATUS FLOW */}
      <section className="mt-6 px-4">
        <div className="mb-3">
          <p className="text-[16px] font-semibold text-neutral-900">
            Delivery status flow
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            What customers will see on every parcel
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-3 pr-4">
            {statusFlow.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className="w-[170px] rounded-[22px] border border-neutral-200 bg-white p-4 shadow-[0_8px_22px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <Icon className="h-5 w-5 text-[#173ea5]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    {step.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[24px] bg-[#101828] px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[11px] text-white/65">
              Route estimate: {fromCity} → {toCity}
            </p>
            <p className="text-[14px] font-semibold">
              Start from {estimatedPrice}
            </p>
          </div>

          <button className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#101828]">
            Book parcel
          </button>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Copy,
  FileText,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  User,
  Wallet,
  Clock3,
  Archive,
  Navigation,
  CircleDot
} from "lucide-react"

export default function ParcelConfirmPage() {
  const router = useRouter()

  const booking = {
    senderName: "B.JAY",
    senderPhone: "+263 77 430 9795",
    senderArea: "Harare CBD",
    receiverName: "Customer Name",
    receiverPhone: "+263 77 000 0000",
    receiverArea: "Mkoba 6",
    fromCity: "Harare",
    toCity: "Gweru",
    parcelType: "Documents",
    weight: "Small",
    deliveryType: "Standard",
    paymentBy: "Sender",
    handoffType: "Door delivery",
    fragile: false,
    declaredValue: "$30",
    notes: "Call receiver before arrival"
  }

  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  const parcelCode = useMemo(() => {
    return `PKG-${booking.fromCity.slice(0, 2).toUpperCase()}${booking.toCity
      .slice(0, 2)
      .toUpperCase()}-2048`
  }, [booking.fromCity, booking.toCity])

  const priceBreakdown = useMemo(() => {
    let base = 6

    if (booking.fromCity === booking.toCity) base = 3

    if (
      (booking.fromCity === "Harare" && booking.toCity === "Bulawayo") ||
      (booking.fromCity === "Bulawayo" && booking.toCity === "Harare")
    ) {
      base = 10
    }

    if (
      (booking.fromCity === "Harare" && booking.toCity === "Gweru") ||
      (booking.fromCity === "Gweru" && booking.toCity === "Harare")
    ) {
      base = 6
    }

    if (
      (booking.fromCity === "Zvishavane" && booking.toCity === "Harare") ||
      (booking.fromCity === "Harare" && booking.toCity === "Zvishavane")
    ) {
      base = 8
    }

    let weightExtra = 0
    if (booking.weight === "Medium") weightExtra = 2
    if (booking.weight === "Large") weightExtra = 4

    let speedExtra = booking.deliveryType === "Express" ? 3 : 0
    let handoffExtra = booking.handoffType === "Door delivery" ? 1 : 0
    let fragileExtra = booking.fragile ? 2 : 0

    const total = base + weightExtra + speedExtra + handoffExtra + fragileExtra

    return {
      base,
      weightExtra,
      speedExtra,
      handoffExtra,
      fragileExtra,
      total
    }
  }, [booking])

  const eta = useMemo(() => {
    if (booking.fromCity === booking.toCity) {
      return booking.deliveryType === "Express" ? "1–3 hours" : "Same day"
    }
    return booking.deliveryType === "Express" ? "Same day / Next day" : "Next day"
  }, [booking])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(parcelCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const StatusChip = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-[11px] font-semibold text-neutral-700">
      <Icon className="h-3.5 w-3.5 text-[#173ea5]" />
      {text}
    </div>
  )

  const InfoCard = ({ icon: Icon, title, subtitle, children }) => (
    <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
          <Icon className="h-5 w-5 text-[#173ea5]" />
        </div>
        <div>
          <p className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
            {title}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-36">
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
              Confirm parcel
            </div>
          </div>

          <div className="mt-6 max-w-[660px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Truck className="h-3.5 w-3.5" />
              Final parcel review
            </div>

            <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.04em]">
              Review your booking before sending the request
            </h1>

            <p className="mt-2 text-[13px] text-white/80">
              Check the route, sender, receiver, parcel details and estimate,
              then confirm to create the parcel request and tracking code.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-white/78">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {booking.fromCity} → {booking.toCity}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                ETA {eta}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Tracked request
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative z-20 -mt-4 px-4">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <InfoCard
              icon={User}
              title="Sender and receiver"
              subtitle="Review both sides before you continue"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-neutral-200 bg-[#fafcff] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    Sender
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-neutral-900">
                    {booking.senderName}
                  </p>
                  <div className="mt-3 space-y-2 text-[12px] text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      {booking.senderPhone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      {booking.senderArea}, {booking.fromCity}
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-neutral-200 bg-[#fafcff] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    Receiver
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-neutral-900">
                    {booking.receiverName}
                  </p>
                  <div className="mt-3 space-y-2 text-[12px] text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      {booking.receiverPhone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      {booking.receiverArea}, {booking.toCity}
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              icon={Package}
              title="Parcel details"
              subtitle="What is being moved on this route"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Parcel type</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {booking.parcelType}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Weight</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {booking.weight}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Delivery type</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {booking.deliveryType}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Handoff</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {booking.handoffType}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Who pays</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {booking.paymentBy}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Fragile</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {booking.fragile ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[11px] text-neutral-500">Declared value</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {booking.declaredValue || "Not provided"}
                  </p>
                </div>

                <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[11px] text-neutral-500">Notes</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {booking.notes || "No notes added"}
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              icon={Truck}
              title="What happens after confirm"
              subtitle="The request flow your customer will see"
            >
              <div className="flex flex-wrap gap-2">
                <StatusChip icon={Archive} text="Request received" />
                <StatusChip icon={Navigation} text="Pickup assigned" />
                <StatusChip icon={Package} text="Picked up" />
                <StatusChip icon={Truck} text="In transit" />
                <StatusChip icon={CircleDot} text="Out for delivery" />
                <StatusChip icon={CheckCircle2} text="Delivered" />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <p className="text-[13px] font-semibold text-neutral-900">
                    Pickup phase
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    A runner collects from the sender location
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <p className="text-[13px] font-semibold text-neutral-900">
                    Intercity phase
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Parcel moves between cities with tracking updates
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <p className="text-[13px] font-semibold text-neutral-900">
                    Final handoff
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Receiver gets it by doorstep or pickup point
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Wallet className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Final summary
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Booking route, code and estimate
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Route</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                  {booking.fromCity} → {booking.toCity}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {booking.deliveryType} • ETA {eta}
                </p>

                <div className="mt-4 rounded-[18px] bg-white/10 p-3 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/65">
                    Parcel code
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-[15px] font-semibold">{parcelCode}</p>
                    <button
                      onClick={copyCode}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#101828]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Base route</span>
                  <span>${priceBreakdown.base}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Weight adjustment</span>
                  <span>${priceBreakdown.weightExtra}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Speed adjustment</span>
                  <span>${priceBreakdown.speedExtra}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Doorstep / pickup</span>
                  <span>${priceBreakdown.handoffExtra}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-neutral-600">
                  <span>Fragile handling</span>
                  <span>${priceBreakdown.fragileExtra}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                <span className="text-[14px] font-semibold text-neutral-900">
                  Estimated total
                </span>
                <span className="text-[24px] font-semibold tracking-[-0.03em] text-[#10214e]">
                  ${priceBreakdown.total}
                </span>
              </div>

              {!confirmed ? (
                <button
                  onClick={() => setConfirmed(true)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white transition hover:opacity-95"
                >
                  Confirm and create parcel
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="mt-5 rounded-[22px] border border-[#d7f0e1] bg-[#f3fcf7] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e7f8ef]">
                      <CheckCircle2 className="h-5 w-5 text-[#0c8f4d]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">
                        Parcel request created
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-600">
                        Your request is ready. Next step is saving this to Firebase
                        and opening the tracking page.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/parcels")}
                    className="mt-4 w-full rounded-full bg-[#10214e] px-4 py-3 text-[12px] font-semibold text-white"
                  >
                    Back to parcels
                  </button>
                </div>
              )}

              <div className="mt-4 rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <FileText className="h-5 w-5 text-[#173ea5]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">
                      Ready for backend
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Connect this button to save parcel data, generate the real
                      parcel code, and push status as{" "}
                      <span className="font-semibold text-neutral-700">
                        request_received
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING BAR */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[24px] bg-[#101828] px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[11px] text-white/65">
              {booking.fromCity} → {booking.toCity} • {booking.deliveryType}
            </p>
            <p className="text-[14px] font-semibold">
              Total estimate ${priceBreakdown.total}
            </p>
          </div>

          <button
            onClick={() => setConfirmed(true)}
            className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#101828]"
          >
            Confirm
          </button>
        </div>
      </div>
    </main>
  )
    }

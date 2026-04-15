"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock3,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  CircleDot,
  Navigation,
  Phone,
  User,
  FileText,
  Copy,
  LocateFixed,
  Building2,
  ChevronRight
} from "lucide-react"

export default function ParcelTrackPage() {
  const router = useRouter()

  const [trackingCodeInput, setTrackingCodeInput] = useState("PKG-HAGW-2048")
  const [copied, setCopied] = useState(false)

  // DEMO DATA FOR NOW
  const [parcel, setParcel] = useState({
    code: "PKG-HAGW-2048",
    title: "Documents parcel",
    senderName: "B.JAY",
    senderPhone: "+263 77 430 9795",
    receiverName: "Customer Name",
    receiverPhone: "+263 77 000 0000",
    fromCity: "Harare",
    toCity: "Gweru",
    pickupArea: "Harare CBD",
    destinationArea: "Mkoba 6",
    status: "out_for_delivery",
    paymentBy: "Sender",
    handoffType: "Door delivery",
    createdAtText: "Today, 09:12",
    estimatedArrival: "Today, 15:45",
    etaText: "About 28 min left",
    liveLat: -19.456,
    liveLng: 29.812,
    runnerName: "Tawanda",
    runnerPhone: "+263 77 222 3333",
    transporterName: "Fastlane Intercity",
    transporterPhone: "+263 77 111 2222",
    destinationRunnerName: "Moses",
    destinationRunnerPhone: "+263 77 555 6666",
    receiverConfirmed: false,
    senderCompleted: false,
    lastSeenText: "Updated 1 min ago"
  })

  const [timeline, setTimeline] = useState([
    {
      id: 1,
      key: "request_received",
      title: "Request received",
      time: "09:12",
      done: true,
      note: "Parcel booking created"
    },
    {
      id: 2,
      key: "pickup_assigned",
      title: "Pickup assigned",
      time: "09:20",
      done: true,
      note: "Runner assigned for collection"
    },
    {
      id: 3,
      key: "picked_up",
      title: "Picked up",
      time: "10:02",
      done: true,
      note: "Parcel collected from sender"
    },
    {
      id: 4,
      key: "in_transit",
      title: "In transit",
      time: "12:10",
      done: true,
      note: "Parcel moving between cities"
    },
    {
      id: 5,
      key: "arrived_destination_city",
      title: "Arrived in destination city",
      time: "14:45",
      done: true,
      note: "Parcel reached Gweru"
    },
    {
      id: 6,
      key: "out_for_delivery",
      title: "Out for delivery",
      time: "15:05",
      done: true,
      note: "Destination runner is moving to receiver"
    },
    {
      id: 7,
      key: "receiver_confirmed",
      title: "Receiver confirmed delivery",
      time: "--:--",
      done: false,
      note: "Receiver must confirm first"
    },
    {
      id: 8,
      key: "completed",
      title: "Sender marked complete",
      time: "--:--",
      done: false,
      note: "Final completion happens after sender review"
    }
  ])

  const statusMeta = useMemo(() => {
    const map = {
      request_received: {
        label: "Request received",
        subtitle: "Waiting for pickup flow",
        progress: 10
      },
      pickup_assigned: {
        label: "Pickup assigned",
        subtitle: "Runner is preparing to collect parcel",
        progress: 22
      },
      picked_up: {
        label: "Picked up",
        subtitle: "Parcel collected from sender",
        progress: 35
      },
      in_transit: {
        label: "In transit",
        subtitle: "Parcel is moving between cities",
        progress: 55
      },
      arrived_destination_city: {
        label: "Arrived in destination city",
        subtitle: "Ready for local handoff",
        progress: 72
      },
      out_for_delivery: {
        label: "Out for delivery",
        subtitle: "Destination runner is heading to receiver",
        progress: 86
      },
      receiver_confirmed: {
        label: "Receiver confirmed",
        subtitle: "Waiting for sender final completion",
        progress: 94
      },
      completed: {
        label: "Completed",
        subtitle: "Parcel fully closed",
        progress: 100
      }
    }

    return map[parcel.status] || map.request_received
  }, [parcel.status])

  const currentLocationText = useMemo(() => {
    if (parcel.status === "in_transit") {
      return "Between Harare and Gweru"
    }
    if (parcel.status === "arrived_destination_city") {
      return `Arrived in ${parcel.toCity}`
    }
    if (parcel.status === "out_for_delivery") {
      return `Near ${parcel.destinationArea}, ${parcel.toCity}`
    }
    if (parcel.status === "completed") {
      return `Delivered to ${parcel.destinationArea}, ${parcel.toCity}`
    }
    return `${parcel.pickupArea}, ${parcel.fromCity}`
  }, [parcel])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(parcel.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const handleTrackNow = () => {
    // later: search Firebase by tracking code
    setParcel((prev) => ({
      ...prev,
      code: trackingCodeInput.trim() || prev.code
    }))
  }

  const handleReceiverConfirm = () => {
    if (parcel.receiverConfirmed) return

    setParcel((prev) => ({
      ...prev,
      receiverConfirmed: true,
      status: "receiver_confirmed",
      etaText: "Delivered to receiver",
      estimatedArrival: "Delivered"
    }))

    setTimeline((prev) =>
      prev.map((item) =>
        item.key === "receiver_confirmed"
          ? {
              ...item,
              done: true,
              time: "15:31",
              note: "Receiver confirmed parcel received"
            }
          : item
      )
    )
  }

  const handleSenderComplete = () => {
    if (!parcel.receiverConfirmed || parcel.senderCompleted) return

    setParcel((prev) => ({
      ...prev,
      senderCompleted: true,
      status: "completed",
      etaText: "Closed successfully",
      estimatedArrival: "Completed"
    }))

    setTimeline((prev) =>
      prev.map((item) =>
        item.key === "completed"
          ? {
              ...item,
              done: true,
              time: "15:40",
              note: "Sender marked parcel complete"
            }
          : item
      )
    )
  }

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
      <span className="text-[12px] text-neutral-500">{label}</span>
      <span className="text-[12px] font-semibold text-neutral-900 text-right">
        {value}
      </span>
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
              Live tracking
            </div>
          </div>

          <div className="mt-6 max-w-[700px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Truck className="h-3.5 w-3.5" />
              Parcel movement and confirmation flow
            </div>

            <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.04em]">
              Track parcel movement, ETA and delivery confirmation
            </h1>

            <p className="mt-2 text-[13px] text-white/80">
              Follow the parcel across cities, see current movement, confirm when
              receiver has it, and only then let sender close the parcel.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-white/78">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {parcel.fromCity} → {parcel.toCity}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {parcel.estimatedArrival}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {parcel.lastSeenText}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-20 -mt-4 px-4">
        <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1 rounded-[20px] border border-neutral-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <Search className="h-4.5 w-4.5 text-neutral-400" />
                <input
                  value={trackingCodeInput}
                  onChange={(e) => setTrackingCodeInput(e.target.value)}
                  placeholder="Enter parcel code"
                  className="w-full bg-transparent text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleTrackNow}
              className="rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
            >
              Track parcel
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* STATUS HERO CARD */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-[10px] font-semibold text-[#173ea5]">
                    {statusMeta.label}
                  </div>

                  <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-neutral-900">
                    {parcel.title}
                  </h2>

                  <p className="mt-1 text-[12px] text-neutral-500">
                    {statusMeta.subtitle}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-[11px] font-semibold text-neutral-700">
                      <FileText className="h-3.5 w-3.5 text-[#173ea5]" />
                      {parcel.code}
                    </div>

                    <button
                      onClick={copyCode}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-[11px] font-semibold text-neutral-700"
                    >
                      <Copy className="h-3.5 w-3.5 text-[#173ea5]" />
                      {copied ? "Copied" : "Copy code"}
                    </button>
                  </div>
                </div>

                <div className="min-w-[210px] rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                  <p className="text-[11px] text-white/70">ETA</p>
                  <p className="mt-1 text-[22px] font-semibold">{parcel.etaText}</p>
                  <p className="mt-2 text-[12px] text-white/80">
                    Estimated arrival: {parcel.estimatedArrival}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                  <span>Progress</span>
                  <span>{statusMeta.progress}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#173ea5] to-[#4f7cff]"
                    style={{ width: `${statusMeta.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* LIVE LOCATION STYLE CARD */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <LocateFixed className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Current movement
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Best way: live GPS from runner app, not phone network
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4] p-4">
                <div className="flex min-h-[220px] items-center justify-center rounded-[20px] border border-white/50 bg-white/40">
                  <div className="w-full max-w-[420px]">
                    <div className="flex items-center justify-between text-[12px] font-semibold text-neutral-700">
                      <span>{parcel.fromCity}</span>
                      <span>{parcel.toCity}</span>
                    </div>

                    <div className="relative mt-6">
                      <div className="h-2 rounded-full bg-white" />
                      <div
                        className="absolute left-0 top-0 h-2 rounded-full bg-[#173ea5]"
                        style={{ width: `${statusMeta.progress}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#173ea5] shadow-lg"
                        style={{ left: `calc(${statusMeta.progress}% - 10px)`, width: 20, height: 20 }}
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-[18px] bg-white/70 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                          Current area
                        </p>
                        <p className="mt-1 text-[12px] font-semibold text-neutral-900">
                          {currentLocationText}
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-white/70 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                          Live coords
                        </p>
                        <p className="mt-1 text-[12px] font-semibold text-neutral-900">
                          {parcel.liveLat}, {parcel.liveLng}
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-white/70 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                          Last update
                        </p>
                        <p className="mt-1 text-[12px] font-semibold text-neutral-900">
                          {parcel.lastSeenText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-5 text-neutral-500">
                For real live tracking, the pickup runner / transporter / destination runner
                should send GPS from their phone to Firebase. That is the reliable method.
              </p>
            </div>

            {/* TIMELINE */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Navigation className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Delivery timeline
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Status flow from request to final completion
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          item.done
                            ? "bg-[#10214e] text-white"
                            : "border border-neutral-200 bg-white text-neutral-400"
                        }`}
                      >
                        {item.done ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : (
                          <CircleDot className="h-4.5 w-4.5" />
                        )}
                      </div>
                      {index !== timeline.length - 1 && (
                        <div
                          className={`mt-1 w-[2px] flex-1 ${
                            item.done ? "bg-[#d7e4ff]" : "bg-neutral-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 rounded-[20px] border border-neutral-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[13px] font-semibold text-neutral-900">
                          {item.title}
                        </p>
                        <span className="text-[11px] font-semibold text-neutral-400">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* SUMMARY */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Tracking summary</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                  {parcel.fromCity} → {parcel.toCity}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {statusMeta.label} • {parcel.etaText}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <InfoRow label="Sender" value={parcel.senderName} />
                <InfoRow label="Receiver" value={parcel.receiverName} />
                <InfoRow label="Payment by" value={parcel.paymentBy} />
                <InfoRow label="Handoff" value={parcel.handoffType} />
                <InfoRow label="Pickup area" value={`${parcel.pickupArea}, ${parcel.fromCity}`} />
                <InfoRow
                  label="Destination"
                  value={`${parcel.destinationArea}, ${parcel.toCity}`}
                />
              </div>

              <div className="mt-5 rounded-[22px] border border-neutral-200 p-4">
                <p className="text-[13px] font-semibold text-neutral-900">
                  Assigned people
                </p>

                <div className="mt-3 space-y-3">
                  <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                    <p className="text-[11px] text-neutral-500">Intercity transporter</p>
                    <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                      {parcel.transporterName}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {parcel.transporterPhone}
                    </p>
                  </div>

                  <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                    <p className="text-[11px] text-neutral-500">Destination runner</p>
                    <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                      {parcel.destinationRunnerName}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {parcel.destinationRunnerPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* CONFIRM FLOW */}
              <div className="mt-5 rounded-[22px] border border-neutral-200 p-4">
                <p className="text-[13px] font-semibold text-neutral-900">
                  Delivery confirmation flow
                </p>
                <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                  Best rule: receiver confirms first, then sender marks final complete.
                </p>

                <div className="mt-4 space-y-3">
                  <button
                    onClick={handleReceiverConfirm}
                    disabled={parcel.receiverConfirmed}
                    className={`w-full rounded-full px-4 py-3 text-[12px] font-semibold ${
                      parcel.receiverConfirmed
                        ? "bg-[#e8f8ef] text-[#0c8f4d]"
                        : "bg-[#10214e] text-white"
                    }`}
                  >
                    {parcel.receiverConfirmed
                      ? "Receiver confirmed delivery"
                      : "Receiver confirms received"}
                  </button>

                  <button
                    onClick={handleSenderComplete}
                    disabled={!parcel.receiverConfirmed || parcel.senderCompleted}
                    className={`w-full rounded-full px-4 py-3 text-[12px] font-semibold ${
                      !parcel.receiverConfirmed
                        ? "bg-neutral-200 text-neutral-500"
                        : parcel.senderCompleted
                        ? "bg-[#e8f8ef] text-[#0c8f4d]"
                        : "bg-white border border-neutral-200 text-neutral-900"
                    }`}
                  >
                    {parcel.senderCompleted
                      ? "Sender marked complete"
                      : "Sender marks final complete"}
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <ShieldCheck className="h-5 w-5 text-[#173ea5]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">
                      Real backend logic
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Save live location from the active runner, compute ETA from the
                      route stage, let receiver confirm, then unlock sender completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[24px] bg-[#101828] px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[11px] text-white/65">{parcel.code}</p>
            <p className="text-[14px] font-semibold">{statusMeta.label}</p>
          </div>

          <button
            onClick={() => router.push("/parcels")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#101828]"
          >
            Back to parcels
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  )
    }

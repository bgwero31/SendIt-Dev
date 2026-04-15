"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Package,
  Truck,
  Wallet,
  ShieldCheck,
  FileText,
  Building2,
  Clock3,
  CheckCircle2
} from "lucide-react"

export default function ParcelBookingPage() {
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
    "Documents",
    "Electronics",
    "Clothing",
    "Medicine",
    "Gifts",
    "Business Stock",
    "Food Pack",
    "Fragile Items"
  ]

  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    senderArea: "",
    receiverName: "",
    receiverPhone: "",
    receiverArea: "",
    fromCity: "Harare",
    toCity: "Gweru",
    parcelType: "Documents",
    weight: "Small",
    deliveryType: "Standard",
    paymentBy: "Sender",
    handoffType: "Door delivery",
    fragile: false,
    declaredValue: "",
    notes: ""
  })

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const pricing = useMemo(() => {
    let base = 6

    if (form.fromCity === form.toCity) {
      base = 3
    }

    if (
      (form.fromCity === "Harare" && form.toCity === "Bulawayo") ||
      (form.fromCity === "Bulawayo" && form.toCity === "Harare")
    ) {
      base = 10
    }

    if (
      (form.fromCity === "Harare" && form.toCity === "Gweru") ||
      (form.fromCity === "Gweru" && form.toCity === "Harare")
    ) {
      base = 6
    }

    if (
      (form.fromCity === "Zvishavane" && form.toCity === "Harare") ||
      (form.fromCity === "Harare" && form.toCity === "Zvishavane")
    ) {
      base = 8
    }

    let weightExtra = 0
    if (form.weight === "Medium") weightExtra = 2
    if (form.weight === "Large") weightExtra = 4

    let deliveryExtra = 0
    if (form.deliveryType === "Express") deliveryExtra = 3

    let handoffExtra = 0
    if (form.handoffType === "Door delivery") handoffExtra = 1

    let fragileExtra = form.fragile ? 2 : 0

    const total = base + weightExtra + deliveryExtra + handoffExtra + fragileExtra

    return {
      base,
      weightExtra,
      deliveryExtra,
      handoffExtra,
      fragileExtra,
      total
    }
  }, [form])

  const estimatedEta = useMemo(() => {
    if (form.fromCity === form.toCity) {
      return form.deliveryType === "Express" ? "1–3 hours" : "Same day"
    }

    if (form.deliveryType === "Express") {
      return "Same day / Next day"
    }

    return "Next day"
  }, [form.fromCity, form.toCity, form.deliveryType])

  const isReady =
    form.senderName.trim() &&
    form.senderPhone.trim() &&
    form.senderArea.trim() &&
    form.receiverName.trim() &&
    form.receiverPhone.trim() &&
    form.receiverArea.trim()

  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
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
  )

  const Input = ({ label, placeholder, value, onChange, type = "text" }) => (
    <div>
      <p className="mb-2 text-[11px] font-semibold text-neutral-500">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none transition focus:border-[#173ea5]"
      />
    </div>
  )

  const Select = ({ label, value, onChange, options }) => (
    <div>
      <p className="mb-2 text-[11px] font-semibold text-neutral-500">{label}</p>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] font-medium text-neutral-900 outline-none transition focus:border-[#173ea5]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
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
              Parcel booking
            </div>
          </div>

          <div className="mt-6 max-w-[640px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Truck className="h-3.5 w-3.5" />
              City to city booking form
            </div>

            <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.04em]">
              Book your parcel with sender, receiver and route details
            </h1>

            <p className="mt-2 text-[13px] text-white/80">
              Fill in both sides, choose delivery speed, select parcel type,
              and see the estimate before continuing.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-white/78">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                ETA {estimatedEta}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Tracked handoff
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {form.fromCity} → {form.toCity}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="relative z-20 -mt-4 px-4">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            {/* SENDER */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <SectionTitle
                icon={User}
                title="Sender details"
                subtitle="Who is sending the parcel"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Sender full name"
                  placeholder="Enter sender name"
                  value={form.senderName}
                  onChange={(e) => updateField("senderName", e.target.value)}
                />
                <Input
                  label="Sender phone"
                  placeholder="Enter sender phone"
                  value={form.senderPhone}
                  onChange={(e) => updateField("senderPhone", e.target.value)}
                  type="tel"
                />
                <Select
                  label="Pickup city"
                  value={form.fromCity}
                  onChange={(e) => updateField("fromCity", e.target.value)}
                  options={cities}
                />
                <Input
                  label="Pickup area"
                  placeholder="CBD, Mkoba, Southlea Park..."
                  value={form.senderArea}
                  onChange={(e) => updateField("senderArea", e.target.value)}
                />
              </div>
            </div>

            {/* RECEIVER */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <SectionTitle
                icon={Phone}
                title="Receiver details"
                subtitle="Who should receive the parcel"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Receiver full name"
                  placeholder="Enter receiver name"
                  value={form.receiverName}
                  onChange={(e) => updateField("receiverName", e.target.value)}
                />
                <Input
                  label="Receiver phone"
                  placeholder="Enter receiver phone"
                  value={form.receiverPhone}
                  onChange={(e) => updateField("receiverPhone", e.target.value)}
                  type="tel"
                />
                <Select
                  label="Destination city"
                  value={form.toCity}
                  onChange={(e) => updateField("toCity", e.target.value)}
                  options={cities}
                />
                <Input
                  label="Destination area"
                  placeholder="Suburb, town, depot area..."
                  value={form.receiverArea}
                  onChange={(e) => updateField("receiverArea", e.target.value)}
                />
              </div>
            </div>

            {/* PARCEL */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <SectionTitle
                icon={Package}
                title="Parcel details"
                subtitle="Tell us what is being moved"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Parcel type"
                  value={form.parcelType}
                  onChange={(e) => updateField("parcelType", e.target.value)}
                  options={parcelTypes}
                />
                <Select
                  label="Size / weight"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  options={["Small", "Medium", "Large"]}
                />
                <Input
                  label="Declared value"
                  placeholder="e.g $50"
                  value={form.declaredValue}
                  onChange={(e) => updateField("declaredValue", e.target.value)}
                />
                <Select
                  label="Delivery speed"
                  value={form.deliveryType}
                  onChange={(e) => updateField("deliveryType", e.target.value)}
                  options={["Standard", "Express"]}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateField("fragile", false)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
                    !form.fragile
                      ? "bg-[#10214e] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  Not fragile
                </button>
                <button
                  type="button"
                  onClick={() => updateField("fragile", true)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
                    form.fragile
                      ? "bg-[#10214e] text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  Fragile item
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                  Parcel notes
                </p>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Add any handling note, item info, landmarks, or instructions..."
                  rows={5}
                  className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-900 outline-none transition focus:border-[#173ea5]"
                />
              </div>
            </div>

            {/* PAYMENT + HANDOFF */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <SectionTitle
                icon={Wallet}
                title="Payment and handoff"
                subtitle="Choose who pays and how it should be delivered"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Who pays"
                  value={form.paymentBy}
                  onChange={(e) => updateField("paymentBy", e.target.value)}
                  options={["Sender", "Receiver"]}
                />
                <Select
                  label="Handoff type"
                  value={form.handoffType}
                  onChange={(e) => updateField("handoffType", e.target.value)}
                  options={["Door delivery", "Depot pickup"]}
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <Truck className="h-4.5 w-4.5 text-[#173ea5]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    Route movement
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Pickup, transit, destination handoff
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#0c8f4d]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    Status updates
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Visible from request to delivery
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6ee]">
                    <Building2 className="h-4.5 w-4.5 text-[#c96b16]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    Final handoff
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Door delivery or pickup point
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <FileText className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Booking summary
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Review before continuing
                  </p>
                </div>
              </div>

              <div className="rounded-[22px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Route</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">
                  {form.fromCity} → {form.toCity}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {form.deliveryType} delivery • ETA {estimatedEta}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Parcel type</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {form.parcelType}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Weight</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {form.weight}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Fragile</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {form.fragile ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Who pays</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {form.paymentBy}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <span className="text-[12px] text-neutral-500">Handoff</span>
                  <span className="text-[12px] font-semibold text-neutral-900">
                    {form.handoffType}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-neutral-200 p-4">
                <p className="text-[13px] font-semibold text-neutral-900">
                  Estimate breakdown
                </p>

                <div className="mt-3 space-y-2 text-[12px]">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Base route</span>
                    <span>${pricing.base}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Weight adjustment</span>
                    <span>${pricing.weightExtra}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Delivery speed</span>
                    <span>${pricing.deliveryExtra}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Doorstep / pickup</span>
                    <span>${pricing.handoffExtra}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Fragile handling</span>
                    <span>${pricing.fragileExtra}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                  <span className="text-[14px] font-semibold text-neutral-900">
                    Estimated total
                  </span>
                  <span className="text-[22px] font-semibold tracking-[-0.02em] text-[#10214e]">
                    ${pricing.total}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                    <CheckCircle2 className="h-5 w-5 text-[#0c8f4d]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">
                      What happens next
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      After continuing, you can save the parcel request, assign a
                      pickup runner, and start tracking statuses from request to
                      delivery.
                    </p>
                  </div>
                </div>
              </div>

              <button
                disabled={!isReady}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold transition ${
                  isReady
                    ? "bg-[#10214e] text-white"
                    : "cursor-not-allowed bg-neutral-200 text-neutral-500"
                }`}
              >
                Continue to confirm
                <ChevronRight className="h-4 w-4" />
              </button>

              {!isReady && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Fill sender and receiver details first
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4">
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-[24px] bg-[#101828] px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[11px] text-white/65">
              {form.fromCity} → {form.toCity} • {form.deliveryType}
            </p>
            <p className="text-[14px] font-semibold">
              Estimated total ${pricing.total}
            </p>
          </div>

          <button
            disabled={!isReady}
            className={`rounded-full px-4 py-2 text-[12px] font-semibold ${
              isReady
                ? "bg-white text-[#101828]"
                : "bg-white/20 text-white/60"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  )
    }

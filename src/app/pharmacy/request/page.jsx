"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Store,
  User,
  Phone,
  Camera,
  Pill,
  MessageSquare,
  CheckCircle2
} from "lucide-react"

export default function PharmacyRequestPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    pharmacy: "Alliance Pharmacy",
    fullName: "",
    phone: "",
    city: "Harare",
    medicineName: "",
    note: "",
    imageName: ""
  })

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const isReady = useMemo(() => {
    return (
      form.pharmacy.trim() &&
      form.fullName.trim() &&
      form.phone.trim() &&
      form.medicineName.trim()
    )
  }, [form])

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
              Availability request
            </div>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Search className="h-3.5 w-3.5" />
              Ask if the pharmacy has your medicine
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              Request medicine availability
            </h1>

            <p className="mt-1 text-[13px] text-white/80">
              Send a medicine name or photo and let the pharmacy confirm if it is in stock.
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
                  <Store className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Pharmacy and customer
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Choose the store and add your details
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Pharmacy
                  </p>
                  <select
                    value={form.pharmacy}
                    onChange={(e) => updateField("pharmacy", e.target.value)}
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  >
                    <option>Alliance Pharmacy</option>
                    <option>Rehome Pharmacy</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    City
                  </p>
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  >
                    <option>Harare</option>
                    <option>Bulawayo</option>
                    <option>Gweru</option>
                    <option>Zvishavane</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Full name
                  </p>
                  <input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
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
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Pill className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Medicine request
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Tell the pharmacy what you are looking for
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Medicine name
                  </p>
                  <input
                    value={form.medicineName}
                    onChange={(e) => updateField("medicineName", e.target.value)}
                    placeholder="e.g Panado, Amoxicillin, Vitamin C..."
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Extra note
                  </p>
                  <textarea
                    rows={5}
                    value={form.note}
                    onChange={(e) => updateField("note", e.target.value)}
                    placeholder="Add dosage, brand preference, quantity, or any message..."
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Camera className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Optional photo
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Add a medicine photo later if needed
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-neutral-300 bg-[#fafcff] px-6 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                  <Camera className="h-6 w-6 text-neutral-500" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-neutral-900">
                  Upload medicine photo
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Tap to choose image
                </p>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) updateField("imageName", file.name)
                  }}
                />
              </label>

              {form.imageName ? (
                <div className="mt-4 rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[11px] text-neutral-500">Selected image</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {form.imageName}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Requesting from</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                  {form.pharmacy}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  Stock check request
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[11px] text-neutral-500">Medicine</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {form.medicineName || "Not entered yet"}
                  </p>
                </div>

                <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[11px] text-neutral-500">Customer</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {form.fullName || "Not entered yet"}
                  </p>
                </div>

                <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[11px] text-neutral-500">Phone</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {form.phone || "Not entered yet"}
                  </p>
                </div>
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
                Send request
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="mt-4 rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                    <CheckCircle2 className="h-5 w-5 text-[#0c8f4d]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">
                      Good use case
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      This is perfect when a user wants to ask “Do you have this medicine?”
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-neutral-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <MessageSquare className="h-5 w-5 text-[#173ea5]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">
                      Later flow
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Later the pharmacy dashboard can respond with available, out of stock, or substitute.
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

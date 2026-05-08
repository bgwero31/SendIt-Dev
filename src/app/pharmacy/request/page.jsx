"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { push, ref, set } from "firebase/database"
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Store,
  Camera,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ImageIcon
} from "lucide-react"

import { db, auth } from "../../../lib/firebase"
import { uploadToImgbb } from "../../../lib/uploadToImgbb"

const STORE_ID = "alliance-pharmacy"
const STORE_NAME = "Alliance Pharmacy"
const ALLIANCE_LOGO = "/pharmacy/alliance-logo.png"

export default function PharmacyRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cityParam = searchParams.get("city") || "Harare"
  const medicineParam =
    searchParams.get("medicine") ||
    searchParams.get("product") ||
    ""

  const [form, setForm] = useState({
    pharmacy: STORE_NAME,
    pharmacyId: STORE_ID,
    fullName: "",
    phone: "",
    city: cityParam,
    medicineName: medicineParam,
    note: "",
    imageName: "",
    imageUrl: "",
    imageThumb: ""
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const isReady = useMemo(() => {
    return (
      form.fullName.trim() &&
      form.phone.trim() &&
      form.medicineName.trim()
    )
  }, [form])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      const uploaded = await uploadToImgbb(file)

      setForm((prev) => ({
        ...prev,
        imageName: file.name,
        imageUrl: uploaded.url,
        imageThumb: uploaded.thumbUrl || uploaded.url
      }))
    } catch (error) {
      alert(error.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const submitRequest = async () => {
    if (!isReady) {
      alert("Add your name, phone number and medicine name")
      return
    }

    try {
      setSaving(true)

      const uid = auth.currentUser?.uid || null
      const now = Date.now()

      // ✅ IMPORTANT:
      // Admin reads this path: pharmacyRequests/alliance-pharmacy
      const requestRef = push(ref(db, `pharmacyRequests/${STORE_ID}`))

      await set(requestRef, {
        customerId: uid,
        pharmacyId: STORE_ID,
        pharmacy: STORE_NAME,

        fullName: form.fullName,
        customerName: form.fullName,
        phone: form.phone,
        city: form.city,

        medicineName: form.medicineName,
        title: form.medicineName,
        message: form.note || "",
        note: form.note || "",

        imageName: form.imageName,
        imageUrl: form.imageUrl,
        imageThumb: form.imageThumb,

        status: "new",
        response: "",
        createdAt: now,
        updatedAt: now
      })

      alert("Request sent successfully")

      router.push(
        `/pharmacy/orders?store=${STORE_ID}&city=${encodeURIComponent(
          form.city
        )}`
      )
    } catch (error) {
      alert(error.message || "Failed to send request")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] pb-36">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-white px-4 pb-10 pt-4 text-white">
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
              Medicine request
            </div>
          </div>

          <div className="mt-8 grid items-end gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
                <Search className="h-4 w-4" />
                ALLIANCE PHARMACY STOCK CHECK
              </div>

              <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[66px]">
                Request Medicine <br />
                Availability
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-6 text-white/85">
                Ask Alliance Pharmacy to check if your medicine is available.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/25 bg-white/15 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[28px] bg-white p-5 text-neutral-900">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] bg-emerald-50">
                    {!logoError ? (
                      <img
                        src={ALLIANCE_LOGO}
                        alt="Alliance Pharmacy"
                        onError={() => setLogoError(true)}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Store className="h-9 w-9 text-emerald-700" />
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                      Requesting from
                    </p>
                    <p className="mt-1 text-[22px] font-black tracking-[-0.04em]">
                      Alliance Pharmacy
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      {form.city} • Stock check request
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] bg-emerald-50 px-4 py-3">
                  <p className="text-[11px] font-black text-emerald-700">
                    Status
                  </p>
                  <p className="mt-1 text-[13px] font-black text-neutral-900">
                    Waiting for your medicine name
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <Store className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Your details
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Add your contact details so the pharmacy can respond.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputBox label="Pharmacy" value={form.pharmacy} readOnly />
                <InputBox label="City" value={form.city} readOnly />

                <InputBox
                  label="Full name"
                  value={form.fullName}
                  onChange={(value) => updateField("fullName", value)}
                  placeholder="Enter your full name"
                />

                <InputBox
                  label="Phone number"
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <Search className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Medicine request
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Tell the pharmacy what you are looking for.
                  </p>
                </div>
              </div>

              <InputBox
                label="Medicine name"
                value={form.medicineName}
                onChange={(value) => updateField("medicineName", value)}
                placeholder="e.g Panado, Amoxicillin, Vitamin C..."
              />

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-black text-neutral-500">
                  Extra note
                </p>
                <textarea
                  rows={5}
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  placeholder="Add dosage, brand preference, quantity, or message..."
                  className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <Camera className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
                    Optional medicine photo
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    Add a photo if it helps identify the exact medicine.
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  {uploading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
                  ) : (
                    <ImageIcon className="h-7 w-7 text-emerald-700" />
                  )}
                </div>

                <p className="mt-4 text-[16px] font-black text-neutral-900">
                  {uploading ? "Uploading..." : "Upload medicine photo"}
                </p>

                <p className="mt-1 text-[12px] text-neutral-500">
                  Optional photo
                </p>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              {form.imageUrl ? (
                <div className="mt-4 rounded-[24px] border border-emerald-100 bg-white p-3">
                  <img
                    src={form.imageThumb || form.imageUrl}
                    alt="Medicine"
                    className="h-[220px] w-full rounded-[20px] object-cover"
                  />
                  <p className="mt-3 text-[12px] font-black text-neutral-900">
                    {form.imageName}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[34px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[28px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white">
                    {!logoError ? (
                      <img
                        src={ALLIANCE_LOGO}
                        alt="Alliance Pharmacy"
                        onError={() => setLogoError(true)}
                        className="h-full w-full object-contain p-1.5"
                      />
                    ) : (
                      <Store className="h-7 w-7 text-emerald-700" />
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] text-white/75">
                      Requesting from
                    </p>
                    <p className="mt-1 text-[22px] font-black tracking-[-0.04em]">
                      Alliance Pharmacy
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[12px] text-white/80">
                  Stock check request
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <PreviewRow label="Medicine" value={form.medicineName || "Not entered yet"} />
                <PreviewRow label="Customer" value={form.fullName || "Not entered yet"} />
                <PreviewRow label="Phone" value={form.phone || "Not entered yet"} />
                <PreviewRow label="City" value={form.city} />
              </div>

              <button
                disabled={!isReady || saving}
                onClick={submitRequest}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[13px] font-black ${
                  isReady && !saving
                    ? "bg-emerald-700 text-white shadow-lg"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {saving ? "Sending..." : "Send request"}
              </button>

              {!isReady && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Add name, phone and medicine name.
                </p>
              )}

              <div className="mt-5 rounded-[22px] border border-dashed border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-neutral-900">
                      Quick stock check
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Alliance Pharmacy will review your request and respond when possible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-emerald-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                    <MessageSquare className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-neutral-900">
                      Pharmacy response
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      You can check your order activity page for updates.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/pharmacy?store=${STORE_ID}&city=${encodeURIComponent(form.city)}`
                  )
                }
                className="mt-4 w-full rounded-full border border-emerald-100 bg-white px-5 py-3 text-[13px] font-black text-emerald-800"
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

function InputBox({ label, value, onChange, placeholder, readOnly = false }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-black text-neutral-500">{label}</p>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-[18px] border px-4 py-3 text-[13px] outline-none ${
          readOnly
            ? "border-emerald-100 bg-emerald-50 text-emerald-900 font-black"
            : "border-neutral-200 bg-[#f8fafc] text-neutral-900"
        }`}
      />
    </div>
  )
}

function PreviewRow({ label, value }) {
  return (
    <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p className="mt-1 text-[13px] font-black text-neutral-900">{value}</p>
    </div>
  )
}

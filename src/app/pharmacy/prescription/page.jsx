"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { push, ref, set } from "firebase/database"
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Upload,
  Store,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ImageIcon
} from "lucide-react"

import { db, auth } from "../../../lib/firebase"
import { uploadToImgbb } from "../../../lib/uploadToImgbb"

const STORE_ID = "alliance-pharmacy"
const STORE_NAME = "Alliance Pharmacy"
const ALLIANCE_LOGO = "/pharmacy/alliance-logo.png"

export default function PharmacyPrescriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cityParam = searchParams.get("city") || "Harare"
  const productId = searchParams.get("productId") || ""
  const productName = searchParams.get("product") || ""

  const [form, setForm] = useState({
    pharmacy: STORE_NAME,
    pharmacyId: STORE_ID,
    fullName: "",
    phone: "",
    city: cityParam,
    medicineRequest: productName || "",
    note: "",
    prescriptionImage: "",
    prescriptionThumb: "",
    fileName: "",
    productId
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
      form.prescriptionImage.trim()
    )
  }, [form])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const uploaded = await uploadToImgbb(file)

      setForm((prev) => ({
        ...prev,
        fileName: file.name,
        prescriptionImage: uploaded.url,
        prescriptionThumb: uploaded.thumbUrl || uploaded.url
      }))
    } catch (error) {
      alert(error.message || "Failed to upload prescription")
    } finally {
      setUploading(false)
    }
  }

  const submitPrescription = async () => {
    if (!isReady) {
      alert("Add your name, phone number and prescription image")
      return
    }

    try {
      setSaving(true)

      const uid = auth.currentUser?.uid || null
      const now = Date.now()

      const newRef = push(ref(db, `pharmacyPrescriptions/${STORE_ID}`))

      await set(newRef, {
        customerId: uid,

        pharmacyId: STORE_ID,
        pharmacy: STORE_NAME,

        fullName: form.fullName,
        customerName: form.fullName,
        phone: form.phone,
        city: form.city,

        medicineRequest: form.medicineRequest,
        message: form.medicineRequest || form.note || "",
        note: form.note || "",

        prescriptionImage: form.prescriptionImage,
        prescriptionThumb: form.prescriptionThumb,
        fileName: form.fileName,

        productId: form.productId || "",

        status: "reviewing",
        response: "",

        createdAt: now,
        updatedAt: now
      })

      alert("Prescription submitted successfully")

      router.push(
        `/pharmacy/orders?store=${STORE_ID}&city=${encodeURIComponent(
          form.city
        )}`
      )
    } catch (error) {
      alert(error.message || "Failed to submit prescription")
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
              Prescription
            </div>
          </div>

          <div className="mt-8 grid items-end gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
                <FileText className="h-4 w-4" />
                ALLIANCE PHARMACY REVIEW
              </div>

              <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[66px]">
                Upload Your <br />
                Prescription
              </h1>

              <p className="mt-5 max-w-2xl text-[14px] leading-6 text-white/85">
                Send your prescription to Alliance Pharmacy for review before medicine confirmation.
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
                      Selected pharmacy
                    </p>
                    <p className="mt-1 text-[22px] font-black tracking-[-0.04em]">
                      Alliance Pharmacy
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      {form.city} • Prescription review
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] bg-emerald-50 px-4 py-3">
                  <p className="text-[11px] font-black text-emerald-700">
                    Status
                  </p>
                  <p className="mt-1 text-[13px] font-black text-neutral-900">
                    Waiting for your upload
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
            <Card
              icon={Store}
              title="Request details"
              subtitle="Confirm your pharmacy and contact information."
            >
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
            </Card>

            <Card
              icon={Upload}
              title="Prescription image"
              subtitle="Upload a clear photo of the prescription."
            >
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  {uploading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
                  ) : (
                    <ImageIcon className="h-7 w-7 text-emerald-700" />
                  )}
                </div>

                <p className="mt-4 text-[16px] font-black text-neutral-900">
                  {uploading ? "Uploading..." : "Upload prescription"}
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Tap to choose image
                </p>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {form.prescriptionImage ? (
                <div className="mt-4 rounded-[24px] border border-emerald-100 bg-white p-3">
                  <img
                    src={form.prescriptionThumb || form.prescriptionImage}
                    alt="Prescription"
                    className="h-[220px] w-full rounded-[20px] object-cover"
                  />
                  <p className="mt-3 text-[12px] font-black text-neutral-900">
                    {form.fileName}
                  </p>
                </div>
              ) : null}
            </Card>

            <Card
              icon={FileText}
              title="Medicine notes"
              subtitle="Add medicine names or extra message for the pharmacist."
            >
              <div>
                <p className="mb-2 text-[11px] font-black text-neutral-500">
                  Medicine names
                </p>
                <textarea
                  rows={4}
                  value={form.medicineRequest}
                  onChange={(e) =>
                    updateField("medicineRequest", e.target.value)
                  }
                  placeholder="List the medicines written on your prescription..."
                  className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-black text-neutral-500">
                  Extra note
                </p>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  placeholder="Add delivery note, pharmacist message, or preferred contact time..."
                  className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                />
              </div>
            </Card>
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
                      Selected pharmacy
                    </p>
                    <p className="mt-1 text-[22px] font-black tracking-[-0.04em]">
                      Alliance Pharmacy
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[12px] text-white/80">
                  Prescription review request
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <PreviewRow label="Customer" value={form.fullName || "Not entered yet"} />
                <PreviewRow label="Phone" value={form.phone || "Not entered yet"} />
                <PreviewRow label="City" value={form.city} />
                <PreviewRow label="Uploaded file" value={form.fileName || "No file selected"} />
              </div>

              <button
                disabled={!isReady || saving}
                onClick={submitPrescription}
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
                {saving ? "Submitting..." : "Submit prescription"}
              </button>

              {!isReady && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Add name, phone and prescription image.
                </p>
              )}

              <InfoPanel
                icon={CheckCircle2}
                title="Review first"
                text="The pharmacy will review your prescription before confirming availability."
              />

              <InfoPanel
                icon={ShieldCheck}
                title="Privacy reminder"
                text="Make sure the image is clear and only contains the prescription details you want reviewed."
              />

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

function Card({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-[32px] border border-emerald-100 bg-white p-5 shadow-[0_16px_40px_rgba(4,120,87,0.08)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <p className="text-[18px] font-black tracking-[-0.03em] text-neutral-900">
            {title}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
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

function InfoPanel({ icon: Icon, title, text }) {
  return (
    <div className="mt-4 rounded-[22px] border border-emerald-100 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <p className="text-[13px] font-black text-neutral-900">{title}</p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

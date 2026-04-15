"use client"


mport { useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Store,
  Pill,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
  FileText,
  Truck,
  Clock3,
  HeartPulse
} from "lucide-react"

export default function PharmacyProductDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const productId = params?.id
  const storeParam = searchParams.get("store") || "alliance-pharmacy"
  const cityParam = searchParams.get("city") || "Harare"

  const stores = {
    "alliance-pharmacy": {
      name: "Alliance Pharmacy",
      eta: "18–35 min",
      subtitle: "Trusted local pharmacy"
    },
    "rehome-pharmacy": {
      name: "Rehome Pharmacy",
      eta: "20–40 min",
      subtitle: "Daily health essentials"
    }
  }

  const currentStore = stores[storeParam] || stores["alliance-pharmacy"]

  const allProducts = {
    "a1": {
      id: "a1",
      name: "Panado",
      size: "500mg tablets",
      price: 3.5,
      oldPrice: 4.0,
      rx: false,
      category: "Pain Relief",
      description:
        "Popular everyday pain relief tablets for headaches, body pains, fever support and general discomfort.",
      usage:
        "Use as directed on pack or by healthcare guidance. Do not exceed recommended dose.",
      stock: "In stock",
      brand: "Panado",
      form: "Tablets",
      strength: "500mg"
    },
    "a2": {
      id: "a2",
      name: "Vitamin C",
      size: "1000mg",
      price: 6.99,
      oldPrice: 0,
      rx: false,
      category: "Vitamins",
      description:
        "Daily vitamin support for immunity and general wellness.",
      usage:
        "Take according to pack directions. Best used consistently for routine support.",
      stock: "In stock",
      brand: "Wellness+",
      form: "Tablets",
      strength: "1000mg"
    },
    "a3": {
      id: "a3",
      name: "Cough Syrup",
      size: "120ml",
      price: 5.8,
      oldPrice: 0,
      rx: false,
      category: "Cold & Flu",
      description:
        "Soothing syrup for cough and throat discomfort support.",
      usage:
        "Follow dosage instructions based on age and packaging guidance.",
      stock: "Low stock",
      brand: "CoughEase",
      form: "Syrup",
      strength: "120ml"
    },
    "a9": {
      id: "a9",
      name: "Amoxicillin",
      size: "Capsules",
      price: 0,
      oldPrice: 0,
      rx: true,
      category: "Prescription",
      description:
        "Prescription-only item that requires pharmacist review before release.",
      usage:
        "Only supplied after prescription verification and pharmacist approval.",
      stock: "By review",
      brand: "Generic",
      form: "Capsules",
      strength: "By prescription"
    },
    "r1": {
      id: "r1",
      name: "Ibuprofen",
      size: "400mg",
      price: 4.2,
      oldPrice: 0,
      rx: false,
      category: "Pain Relief",
      description:
        "Fast support for pain, inflammation and general discomfort.",
      usage:
        "Use according to label directions and avoid exceeding recommended dose.",
      stock: "In stock",
      brand: "IbuCare",
      form: "Tablets",
      strength: "400mg"
    },
    "r9": {
      id: "r9",
      name: "Antibiotic Refill",
      size: "Prescription item",
      price: 0,
      oldPrice: 0,
      rx: true,
      category: "Prescription",
      description:
        "Prescription refill request item reviewed by pharmacy staff before approval.",
      usage:
        "Submit your script and wait for pharmacy confirmation.",
      stock: "By review",
      brand: "Prescription",
      form: "Refill",
      strength: "By prescription"
    }
  }

  const fallbackProduct = {
    id: "fallback",
    name: "Medicine item",
    size: "Standard pack",
    price: 4.99,
    oldPrice: 0,
    rx: false,
    category: "Pharmacy",
    description:
      "Health product details will appear here once the real medicine catalog is connected.",
    usage:
      "Follow pack guidance or pharmacist instructions.",
    stock: "In stock",
    brand: "Pharmacy",
    form: "Pack",
    strength: "Standard"
  }

  const product = allProducts[productId] || fallbackProduct

  const similarProducts = [
    {
      id: "a1",
      name: "Panado",
      size: "500mg",
      price: "$3.50"
    },
    {
      id: "a2",
      name: "Vitamin C",
      size: "1000mg",
      price: "$6.99"
    },
    {
      id: "a3",
      name: "Cough Syrup",
      size: "120ml",
      price: "$5.80"
    },
    {
      id: "r1",
      name: "Ibuprofen",
      size: "400mg",
      price: "$4.20"
    }
  ].filter((item) => item.id !== product.id)

  const [qty, setQty] = useState(1)

  const total = useMemo(() => {
    return product.price > 0 ? (product.price * qty).toFixed(2) : null
  }, [product.price, qty])

  const increaseQty = () => setQty((prev) => prev + 1)
  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1))

  const openSimilarProduct = (id) => {
    router.push(`/pharmacy/product/${id}?store=${storeParam}&city=${encodeURIComponent(cityParam)}`)
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-36">
      {/* HERO */}
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

            <button
              onClick={() => router.push("/pharmacy/cart")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Store className="h-3.5 w-3.5" />
              {currentStore.name}
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">
              {product.name}
            </h1>

            <p className="mt-1 text-[13px] text-white/80">
              {product.category} • {product.size}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {currentStore.eta}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {product.stock}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-4 px-4">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* PRODUCT VISUAL */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="flex min-h-[320px] items-center justify-center rounded-[28px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4]">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                    <Pill className="h-12 w-12 text-[#173ea5]" />
                  </div>

                  <p className="mt-5 text-[18px] font-semibold text-neutral-900">
                    {product.name}
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    {product.size}
                  </p>

                  {product.rx ? (
                    <div className="mt-4 inline-flex rounded-full bg-[#10214e] px-3 py-1 text-[10px] font-semibold text-white">
                      Prescription required
                    </div>
                  ) : (
                    <div className="mt-4 inline-flex rounded-full bg-[#eefaf1] px-3 py-1 text-[10px] font-semibold text-[#0c8f4d]">
                      Ready for cart
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <FileText className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Product details
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    What this item is for
                  </p>
                </div>
              </div>

              <p className="text-[13px] leading-6 text-neutral-600">
                {product.description}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] bg-[#f8fafc] px-4 py-4">
                  <p className="text-[11px] text-neutral-500">Brand</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {product.brand}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#f8fafc] px-4 py-4">
                  <p className="text-[11px] text-neutral-500">Form</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {product.form}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#f8fafc] px-4 py-4">
                  <p className="text-[11px] text-neutral-500">Strength</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {product.strength}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#f8fafc] px-4 py-4">
                  <p className="text-[11px] text-neutral-500">Availability</p>
                  <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                    {product.stock}
                  </p>
                </div>
              </div>
            </div>

            {/* USAGE */}
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <HeartPulse className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-neutral-900">
                    Usage guidance
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    General product note
                  </p>
                </div>
              </div>

              <p className="text-[13px] leading-6 text-neutral-600">
                {product.usage}
              </p>

              <div className="mt-4 rounded-[20px] border border-dashed border-neutral-300 bg-[#fafcff] p-4">
                <p className="text-[12px] leading-6 text-neutral-500">
                  This page is for browsing and ordering flow. Final medical use guidance should always follow pack instructions or pharmacist advice.
                </p>
              </div>
            </div>

            {/* SIMILAR PRODUCTS */}
            <div className="space-y-3">
              <div className="px-1">
                <p className="text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
                  Similar products
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Browse more items from the pharmacy
                </p>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max gap-3 pr-4">
                  {similarProducts.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openSimilarProduct(item.id)}
                      className="w-[180px] rounded-[24px] border border-neutral-200 bg-white p-3 text-left shadow-[0_8px_22px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex h-[110px] items-center justify-center rounded-[20px] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#edf7f4]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                          <Pill className="h-6 w-6 text-[#173ea5]" />
                        </div>
                      </div>

                      <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {item.size}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[14px] font-semibold text-neutral-900">
                          {item.price}
                        </span>
                        <span className="text-[11px] font-semibold text-[#173ea5]">
                          Open
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] xl:sticky xl:top-5">
              <div className="rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] p-4 text-white">
                <p className="text-[11px] text-white/70">Selected pharmacy</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
                  {currentStore.name}
                </p>
                <p className="mt-2 text-[12px] text-white/80">
                  {cityParam} • {currentStore.eta}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-[11px] text-neutral-500">Product</p>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-neutral-900">
                  {product.name}
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  {product.size}
                </p>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-[28px] font-semibold tracking-[-0.03em] text-neutral-900">
                  {product.price > 0 ? `$${product.price.toFixed(2)}` : "By review"}
                </span>
                {product.oldPrice > 0 ? (
                  <span className="pb-1 text-[13px] text-neutral-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                ) : null}
              </div>

              {!product.rx && (
                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">
                    Quantity
                  </p>

                  <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-2 w-fit">
                    <button
                      onClick={decreaseQty}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="min-w-[20px] text-center text-[13px] font-semibold text-neutral-900">
                      {qty}
                    </span>

                    <button
                      onClick={increaseQty}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10214e] text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-3">
                {!product.rx ? (
                  <>
                    <button
                      onClick={() => router.push("/pharmacy/cart")}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                    >
                      Add to cart
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => router.push("/pharmacy/checkout")}
                      className="w-full rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-semibold text-neutral-700"
                    >
                      Buy now
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => router.push("/pharmacy/prescription")}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                    >
                      Submit prescription
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => router.push("/pharmacy/request")}
                      className="w-full rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-semibold text-neutral-700"
                    >
                      Ask availability first
                    </button>
                  </>
                )}
              </div>

              {!product.rx && total ? (
                <div className="mt-5 rounded-[22px] border border-neutral-200 p-4">
                  <p className="text-[11px] text-neutral-500">Estimated total</p>
                  <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#10214e]">
                    ${total}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {qty} item(s) selected
                  </p>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3">
                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                    <Truck className="h-4.5 w-4.5 text-[#0c8f4d]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    Pickup or delivery
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Continue through cart or checkout flow
                  </p>
                </div>

                <div className="rounded-[20px] border border-neutral-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#173ea5]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                    Pharmacy verified flow
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Prescription items stay under review
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

"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Store,
  ShieldCheck,
  Pill,
  ImageIcon,
  FileText,
  MessageSquare,
  ShoppingBag,
  LayoutDashboard,
  Plus,
  Search,
  Bell,
  Settings,
  MapPin,
  Clock3,
  User,
  CheckCircle2,
  Stethoscope,
  Loader2,
  Save,
  Upload,
  Trash2,
  PackageCheck,
  Sparkles
} from "lucide-react"

import { ref, set, push, onValue, remove, update } from "firebase/database"
import { db, auth } from "../../../lib/firebase"
import { uploadToImgbb } from "../../../lib/uploadToImgbb"

const ALLIANCE_ID = "alliance-pharmacy"

export default function AlliancePharmacyAdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [search, setSearch] = useState("")

  const [profile, setProfile] = useState({
    pharmacyName: "Alliance Pharmacy",
    pharmacyId: ALLIANCE_ID,
    ownerName: "",
    phone: "",
    city: "Harare",
    category: "Pharmacy",
    tagline: "Trusted pharmacy essentials delivered fast with SendIt.",
    logo: "",
    coverImage: "",
    eta: "18–35 min",
    badge: "Open now",
    isOpen: true
  })

  const [productForm, setProductForm] = useState({
    name: "",
    size: "",
    category: "Pain Relief",
    price: "",
    oldPrice: "",
    description: "",
    stock: "In stock",
    rx: false,
    image: ""
  })

  const [promoForm, setPromoForm] = useState({
    title: "",
    subtitle: "",
    tag: "",
    image: ""
  })

  const [products, setProducts] = useState([])
  const [promos, setPromos] = useState([])
  const [orders, setOrders] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [requests, setRequests] = useState([])

  const [loadingType, setLoadingType] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [savingPromo, setSavingPromo] = useState(false)

  const uid = auth.currentUser?.uid || null

  useEffect(() => {
    const unsubProfile = onValue(ref(db, `pharmacies/${ALLIANCE_ID}`), (snap) => {
      const data = snap.val()
      if (!data) return

      setProfile((prev) => ({
        ...prev,
        ...data,
        pharmacyName: data.name || "Alliance Pharmacy",
        pharmacyId: ALLIANCE_ID,
        badge: data.badge || "Open now"
      }))
    })

    const unsubProducts = onValue(ref(db, `pharmacyProducts/${ALLIANCE_ID}`), (snap) => {
      const data = snap.val() || {}
      setProducts(Object.entries(data).map(([id, value]) => ({ id, ...value })))
    })

    const unsubPromos = onValue(ref(db, `pharmacyPromos/${ALLIANCE_ID}`), (snap) => {
      const data = snap.val() || {}
      setPromos(Object.entries(data).map(([id, value]) => ({ id, ...value })))
    })

    const unsubOrders = onValue(ref(db, `pharmacyOrders/${ALLIANCE_ID}`), (snap) => {
      const data = snap.val() || {}
      setOrders(Object.entries(data).map(([id, value]) => ({ id, ...value })).reverse())
    })

    const unsubPrescriptions = onValue(ref(db, `pharmacyPrescriptions/${ALLIANCE_ID}`), (snap) => {
      const data = snap.val() || {}
      setPrescriptions(Object.entries(data).map(([id, value]) => ({ id, ...value })).reverse())
    })

    const unsubRequests = onValue(ref(db, `pharmacyRequests/${ALLIANCE_ID}`), (snap) => {
      const data = snap.val() || {}
      setRequests(Object.entries(data).map(([id, value]) => ({ id, ...value })).reverse())
    })

    return () => {
      unsubProfile()
      unsubProducts()
      unsubPromos()
      unsubOrders()
      unsubPrescriptions()
      unsubRequests()
    }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      `${item.name || ""} ${item.category || ""} ${item.stock || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [products, search])

  const handleImageUpload = async (file, type) => {
    if (!file) return null

    try {
      setLoadingType(type)
      const uploaded = await uploadToImgbb(file)
      return uploaded.url
    } catch (error) {
      console.error(error)
      alert("Image upload failed")
      return null
    } finally {
      setLoadingType("")
    }
  }

  const savePharmacyProfile = async () => {
    try {
      setSavingProfile(true)

      await set(ref(db, `pharmacies/${ALLIANCE_ID}`), {
        id: ALLIANCE_ID,
        name: "Alliance Pharmacy",
        pharmacyId: ALLIANCE_ID,
        ownerName: profile.ownerName || "",
        phone: profile.phone || "",
        city: profile.city || "Harare",
        category: profile.category || "Pharmacy",
        tagline: profile.tagline || "",
        logo: profile.logo || "",
        coverImage: profile.coverImage || "",
        eta: profile.eta || "18–35 min",
        badge: profile.isOpen ? "Open now" : "Closed",
        isOpen: profile.isOpen,
        ownerId: uid || "",
        updatedAt: Date.now()
      })

      if (uid) {
        await set(ref(db, `pharmacyOwners/${uid}`), {
          pharmacyId: ALLIANCE_ID,
          pharmacyName: "Alliance Pharmacy",
          ownerName: profile.ownerName || "",
          phone: profile.phone || "",
          role: "alliance_pharmacy_owner",
          city: profile.city || "Harare",
          updatedAt: Date.now()
        })
      }

      alert("Alliance Pharmacy profile saved")
    } catch (error) {
      console.error(error)
      alert("Failed to save profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const saveProduct = async () => {
    if (!productForm.name.trim() || !productForm.price.trim()) {
      alert("Add product name and price")
      return
    }

    try {
      setSavingProduct(true)

      const productRef = push(ref(db, `pharmacyProducts/${ALLIANCE_ID}`))

      await set(productRef, {
        name: productForm.name,
        size: productForm.size,
        category: productForm.category,
        price: productForm.price,
        oldPrice: productForm.oldPrice || "",
        description: productForm.description || "",
        stock: productForm.stock || "In stock",
        rx: productForm.rx,
        image: productForm.image || "",
        visible: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      setProductForm({
        name: "",
        size: "",
        category: "Pain Relief",
        price: "",
        oldPrice: "",
        description: "",
        stock: "In stock",
        rx: false,
        image: ""
      })

      alert("Product saved")
    } catch (error) {
      console.error(error)
      alert("Failed to save product")
    } finally {
      setSavingProduct(false)
    }
  }

  const savePromo = async () => {
    if (!promoForm.title.trim()) {
      alert("Add promo title")
      return
    }

    try {
      setSavingPromo(true)

      const promoRef = push(ref(db, `pharmacyPromos/${ALLIANCE_ID}`))

      await set(promoRef, {
        title: promoForm.title,
        subtitle: promoForm.subtitle || "",
        tag: promoForm.tag || "",
        image: promoForm.image || "",
        active: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })

      setPromoForm({
        title: "",
        subtitle: "",
        tag: "",
        image: ""
      })

      alert("Promo saved")
    } catch (error) {
      console.error(error)
      alert("Failed to save promo")
    } finally {
      setSavingPromo(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return
    await remove(ref(db, `pharmacyProducts/${ALLIANCE_ID}/${id}`))
  }

  const deletePromo = async (id) => {
    if (!confirm("Delete this promo?")) return
    await remove(ref(db, `pharmacyPromos/${ALLIANCE_ID}/${id}`))
  }

  const updateOrderStatus = async (id, status) => {
    await update(ref(db, `pharmacyOrders/${ALLIANCE_ID}/${id}`), {
      status,
      updatedAt: Date.now()
    })
  }

  const updatePrescriptionStatus = async (id, status) => {
    await update(ref(db, `pharmacyPrescriptions/${ALLIANCE_ID}/${id}`), {
      status,
      updatedAt: Date.now()
    })
  }

  const updateRequestStatus = async (id, status) => {
    await update(ref(db, `pharmacyRequests/${ALLIANCE_ID}/${id}`), {
      status,
      updatedAt: Date.now()
    })
  }

  const TabButton = ({ id, label, icon: Icon }) => {
    const active = activeTab === id

    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-black transition ${
          active
            ? "bg-[#047857] text-white shadow-lg"
            : "border border-emerald-100 bg-white text-neutral-700"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    )
  }

  const UploadInput = ({ label, loadingKey, onFile }) => (
    <div>
      <p className="mb-2 text-[11px] font-black text-neutral-500">{label}</p>
      <label className="flex cursor-pointer items-center justify-between rounded-[18px] border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-[13px] font-bold text-neutral-700">
        <span>{loadingType === loadingKey ? "Uploading..." : "Choose image"}</span>
        {loadingType === loadingKey ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
        ) : (
          <Upload className="h-4 w-4 text-emerald-700" />
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            await onFile(file)
          }}
        />
      </label>
    </div>
  )

  const StatCard = ({ title, value, note, icon: Icon }) => (
    <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
        <Icon className="h-5 w-5 text-emerald-700" />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
        {title}
      </p>
      <p className="mt-1 text-[28px] font-black tracking-[-0.05em] text-neutral-900">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-neutral-500">{note}</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-[#f6f7fb] pb-32">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#047857] to-white px-4 pb-10 pt-5 text-white">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Alliance Pharmacy cover"
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
        ) : null}

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[11px] font-black backdrop-blur-xl">
              <LayoutDashboard className="h-4 w-4" />
              OWNER ADMIN DASHBOARD
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-emerald-800 shadow-xl">
                <Sparkles className="h-4 w-4" />
                Verified SendIt Pharmacy Partner
              </div>

              <h1 className="mt-5 text-[42px] font-black uppercase leading-[0.92] tracking-[-0.07em] sm:text-[66px] lg:text-[82px]">
                ALLIANCE <br />
                PHARMACY
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-6 text-white/85">
                Manage your products, prices, promo banners, customer requests,
                prescriptions and orders from one premium green dashboard.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-white/90">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                  <Clock3 className="h-3.5 w-3.5" />
                  {profile.eta}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Locked to alliance-pharmacy
                </span>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/25 bg-white/15 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[28px] bg-white p-5 text-neutral-900">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] bg-emerald-50">
                    {profile.logo ? (
                      <img
                        src={profile.logo}
                        alt="Alliance Pharmacy logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-9 w-9 text-emerald-700" />
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                      Current profile
                    </p>
                    <p className="mt-1 text-[22px] font-black tracking-[-0.04em]">
                      Alliance Pharmacy
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      {profile.ownerName || "Owner not set"} • {profile.phone || "Phone not set"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <p className="text-[10px] font-black text-emerald-700">Products</p>
                    <p className="text-[22px] font-black">{products.length}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <p className="text-[10px] font-black text-emerald-700">Promos</p>
                    <p className="text-[22px] font-black">{promos.length}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <p className="text-[10px] font-black text-emerald-700">Orders</p>
                    <p className="text-[22px] font-black">{orders.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* rest of dashboard is based on your current admin file, but locked to Alliance Pharmacy only */}
      <section className="relative z-20 -mt-5 px-4">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="rounded-[30px] border border-emerald-100 bg-white p-4 shadow-[0_16px_38px_rgba(4,120,87,0.08)]">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/50 px-4 py-3 xl:w-[360px]">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-emerald-700" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search saved products..."
                    className="w-full bg-transparent text-[13px] font-bold text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max gap-2">
                  <TabButton id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                  <TabButton id="profile" label="Profile" icon={Store} />
                  <TabButton id="products" label="Products" icon={Pill} />
                  <TabButton id="promos" label="Promos" icon={ImageIcon} />
                  <TabButton id="orders" label="Orders" icon={ShoppingBag} />
                  <TabButton id="prescriptions" label="Prescriptions" icon={FileText} />
                  <TabButton id="requests" label="Requests" icon={Stethoscope} />
                  <TabButton id="chats" label="Chats" icon={MessageSquare} />
                </div>
              </div>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard title="Products" value={products.length} note="Saved medicines" icon={Pill} />
                <StatCard title="Promos" value={promos.length} note="Hero banners" icon={ImageIcon} />
                <StatCard title="Orders" value={orders.length} note="Customer orders" icon={ShoppingBag} />
                <StatCard title="Scripts" value={prescriptions.length} note="Prescriptions" icon={FileText} />
                <StatCard title="Requests" value={requests.length} note="Availability checks" icon={Stethoscope} />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  ["products", "Add medicines", "Upload products, prices, stock and images.", Pill],
                  ["promos", "Promos & banners", "Update the public Alliance hero carousel.", ImageIcon],
                  ["orders", "Manage orders", "Mark orders as preparing, ready or completed.", ShoppingBag]
                ].map(([id, title, text, Icon]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="rounded-[28px] border border-emerald-100 bg-white p-5 text-left shadow-[0_14px_35px_rgba(4,120,87,0.07)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                      <Icon className="h-5 w-5 text-emerald-700" />
                    </div>
                    <p className="mt-4 text-[17px] font-black text-neutral-900">{title}</p>
                    <p className="mt-1 text-[12px] leading-5 text-neutral-500">{text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
                <p className="text-[22px] font-black tracking-[-0.04em] text-neutral-900">
                  Alliance Pharmacy profile
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  This saves to Firebase path: pharmacies/alliance-pharmacy
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input
                    value="Alliance Pharmacy"
                    disabled
                    className="w-full rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] font-black text-emerald-900"
                  />

                  <input
                    value={ALLIANCE_ID}
                    disabled
                    className="w-full rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] font-black text-emerald-900"
                  />

                  <input
                    value={profile.ownerName}
                    onChange={(e) => setProfile((p) => ({ ...p, ownerName: e.target.value }))}
                    placeholder="Owner full name"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />

                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+263..."
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />

                  <input
                    value={profile.city}
                    onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Harare"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />

                  <input
                    value={profile.eta}
                    onChange={(e) => setProfile((p) => ({ ...p, eta: e.target.value }))}
                    placeholder="18–35 min"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>

                <textarea
                  rows={3}
                  value={profile.tagline}
                  onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                  placeholder="Tagline"
                  className="mt-4 w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                />

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <UploadInput
                    label="Alliance logo"
                    loadingKey="logo"
                    onFile={async (file) => {
                      const url = await handleImageUpload(file, "logo")
                      if (url) setProfile((p) => ({ ...p, logo: url }))
                    }}
                  />

                  <UploadInput
                    label="Alliance cover image"
                    loadingKey="cover"
                    onFile={async (file) => {
                      const url = await handleImageUpload(file, "cover")
                      if (url) setProfile((p) => ({ ...p, coverImage: url }))
                    }}
                  />
                </div>

                <label className="mt-5 flex items-center gap-3 text-[13px] font-black text-neutral-800">
                  <input
                    type="checkbox"
                    checked={profile.isOpen}
                    onChange={(e) => setProfile((p) => ({ ...p, isOpen: e.target.checked }))}
                  />
                  Pharmacy is open
                </label>

                <button
                  onClick={savePharmacyProfile}
                  disabled={savingProfile}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-[13px] font-black text-white shadow-lg"
                >
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Alliance profile
                </button>
              </div>

              <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
                <div className="relative h-[280px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-white">
                  {profile.coverImage ? (
                    <img src={profile.coverImage} alt="Cover" className="h-full w-full object-cover opacity-30" />
                  ) : null}
                  <div className="absolute inset-0 p-6 text-white">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] bg-white/20 backdrop-blur-xl">
                      {profile.logo ? (
                        <img src={profile.logo} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        <Store className="h-9 w-9" />
                      )}
                    </div>
                    <p className="mt-5 text-[32px] font-black tracking-[-0.05em]">
                      ALLIANCE PHARMACY
                    </p>
                    <p className="mt-2 text-[13px] text-white/85">{profile.tagline}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[32px] bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
                <p className="text-[20px] font-black text-neutral-900">Alliance products</p>

                <div className="mt-4 space-y-3">
                  {filteredProducts.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
                      <p className="font-black text-neutral-900">No products yet</p>
                    </div>
                  ) : (
                    filteredProducts.map((item) => (
                      <div key={item.id} className="rounded-[24px] border border-neutral-200 p-4">
                        <div className="flex gap-4">
                          <div className="h-20 w-20 overflow-hidden rounded-[18px] bg-emerald-50">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Pill className="h-6 w-6 text-emerald-700" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between gap-3">
                              <div>
                                <p className="text-[14px] font-black text-neutral-900">{item.name}</p>
                                <p className="mt-1 text-[11px] text-neutral-500">{item.category} • {item.size}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[13px] font-black text-neutral-900">${item.price}</p>
                                <p className="mt-1 text-[11px] text-neutral-500">{item.stock}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteProduct(item.id)}
                              className="mt-3 inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
                <p className="text-[20px] font-black text-neutral-900">Add product</p>

                <div className="mt-4 grid gap-4">
                  <input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />
                  <input value={productForm.size} onChange={(e) => setProductForm((p) => ({ ...p, size: e.target.value }))} placeholder="Size e.g. 500mg" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />

                  <div className="grid gap-4 md:grid-cols-2">
                    <select value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none">
                      <option>Pain Relief</option>
                      <option>Cold & Flu</option>
                      <option>Vitamins</option>
                      <option>Baby Care</option>
                      <option>Personal Care</option>
                      <option>Prescription</option>
                    </select>
                    <select value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none">
                      <option>In stock</option>
                      <option>Low stock</option>
                      <option>Out of stock</option>
                      <option>Review only</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />
                    <input value={productForm.oldPrice} onChange={(e) => setProductForm((p) => ({ ...p, oldPrice: e.target.value }))} placeholder="Old price" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />
                  </div>

                  <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />

                  <UploadInput
                    label="Product image"
                    loadingKey="product"
                    onFile={async (file) => {
                      const url = await handleImageUpload(file, "product")
                      if (url) setProductForm((p) => ({ ...p, image: url }))
                    }}
                  />

                  <label className="flex items-center gap-3 text-[13px] font-black">
                    <input type="checkbox" checked={productForm.rx} onChange={(e) => setProductForm((p) => ({ ...p, rx: e.target.checked }))} />
                    Prescription item
                  </label>

                  <button onClick={saveProduct} disabled={savingProduct} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white">
                    {savingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Save product
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "promos" && (
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-[32px] bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
                <p className="text-[20px] font-black text-neutral-900">Alliance promos</p>
                <div className="mt-4 space-y-3">
                  {promos.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
                      <p className="font-black text-neutral-900">No promos yet</p>
                    </div>
                  ) : (
                    promos.map((item) => (
                      <div key={item.id} className="overflow-hidden rounded-[24px] border border-neutral-200">
                        <div className="relative h-[170px] bg-gradient-to-br from-emerald-900 via-emerald-700 to-white">
                          {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-35" /> : null}
                          <div className="absolute inset-0 p-4 text-white">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black">{item.tag || "Promo"}</span>
                            <p className="mt-3 text-[18px] font-black">{item.title}</p>
                            <p className="mt-1 text-[12px] text-white/80">{item.subtitle}</p>
                            <button onClick={() => deletePromo(item.id)} className="mt-3 rounded-full bg-red-500 px-3 py-1 text-[10px] font-black text-white">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
                <p className="text-[20px] font-black text-neutral-900">Add promo</p>
                <div className="mt-4 grid gap-4">
                  <input value={promoForm.title} onChange={(e) => setPromoForm((p) => ({ ...p, title: e.target.value }))} placeholder="Promo title" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />
                  <input value={promoForm.subtitle} onChange={(e) => setPromoForm((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Subtitle" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />
                  <input value={promoForm.tag} onChange={(e) => setPromoForm((p) => ({ ...p, tag: e.target.value }))} placeholder="Tag e.g. Fresh offers" className="rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none" />

                  <UploadInput
                    label="Promo image"
                    loadingKey="promo"
                    onFile={async (file) => {
                      const url = await handleImageUpload(file, "promo")
                      if (url) setPromoForm((p) => ({ ...p, image: url }))
                    }}
                  />

                  <button onClick={savePromo} disabled={savingPromo} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-[13px] font-black text-white">
                    {savingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save promo
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <ListPanel
              title="Alliance orders"
              empty="No orders yet"
              items={orders}
              action={(item) => (
                <div className="flex flex-wrap gap-2">
                  {["received", "preparing", "ready", "completed"].map((status) => (
                    <button key={status} onClick={() => updateOrderStatus(item.id, status)} className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                      {status}
                    </button>
                  ))}
                </div>
              )}
            />
          )}

          {activeTab === "prescriptions" && (
            <ListPanel
              title="Alliance prescriptions"
              empty="No prescriptions yet"
              items={prescriptions}
              action={(item) => (
                <div className="flex flex-wrap gap-2">
                  {["reviewing", "approved", "rejected", "completed"].map((status) => (
                    <button key={status} onClick={() => updatePrescriptionStatus(item.id, status)} className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                      {status}
                    </button>
                  ))}
                </div>
              )}
            />
          )}

          {activeTab === "requests" && (
            <ListPanel
              title="Alliance requests"
              empty="No requests yet"
              items={requests}
              action={(item) => (
                <div className="flex flex-wrap gap-2">
                  {["new", "checking", "available", "not_available", "closed"].map((status) => (
                    <button key={status} onClick={() => updateRequestStatus(item.id, status)} className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                      {status}
                    </button>
                  ))}
                </div>
              )}
            />
          )}

          {activeTab === "chats" && (
            <div className="rounded-[32px] bg-white p-8 text-center shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
              <MessageSquare className="mx-auto h-10 w-10 text-emerald-700" />
              <p className="mt-4 text-[20px] font-black text-neutral-900">Chats ready</p>
              <p className="mt-2 text-[12px] text-neutral-500">
                Next we connect live chat messages for Alliance customers.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function ListPanel({ title, empty, items, action }) {
  return (
    <div className="rounded-[32px] bg-white p-5 shadow-[0_14px_35px_rgba(4,120,87,0.08)]">
      <p className="text-[20px] font-black text-neutral-900">{title}</p>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
            <p className="font-black text-neutral-900">{empty}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-neutral-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[14px] font-black text-neutral-900">
                    {item.name || item.customerName || item.title || item.phone || "Customer request"}
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    {item.message || item.note || item.status || "No details"}
                  </p>
                </div>
                {action(item)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

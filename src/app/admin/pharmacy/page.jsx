"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Store,
  ShieldCheck,
  Pill,
  ImageIcon,
  Package,
  FileText,
  MessageSquare,
  ShoppingBag,
  LayoutDashboard,
  Plus,
  Search,
  Bell,
  Settings,
  ChevronRight,
  MapPin,
  Clock3,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  Loader2,
  Save,
  Upload,
  Trash2
} from "lucide-react"

import { ref, set, push, onValue } from "firebase/database"
import { db, auth } from "../../../lib/firebase"
import { uploadToImgbb } from "../../../lib/uploadToImgbb"

export default function PharmacyAdminPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [search, setSearch] = useState("")

  const [profile, setProfile] = useState({
    pharmacyName: "",
    pharmacyId: "",
    ownerName: "",
    phone: "",
    city: "Harare",
    category: "Pharmacy",
    tagline: "",
    logo: "",
    coverImage: "",
    eta: "18–35 min",
    isOpen: true,
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
    image: "",
  })

  const [promoForm, setPromoForm] = useState({
    title: "",
    subtitle: "",
    tag: "",
    image: "",
  })

  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingProductImage, setUploadingProductImage] = useState(false)
  const [uploadingPromoImage, setUploadingPromoImage] = useState(false)

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [savingPromo, setSavingPromo] = useState(false)

  const [products, setProducts] = useState([])
  const [promos, setPromos] = useState([])

  const uid = auth.currentUser?.uid || null

  useEffect(() => {
    if (!profile.pharmacyId) return

    const productsRef = ref(db, `pharmacyProducts/${profile.pharmacyId}`)
    const promosRef = ref(db, `pharmacyPromos/${profile.pharmacyId}`)

    const unsubProducts = onValue(productsRef, (snap) => {
      const data = snap.val() || {}
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }))
      setProducts(list)
    })

    const unsubPromos = onValue(promosRef, (snap) => {
      const data = snap.val() || {}
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }))
      setPromos(list)
    })

    return () => {
      unsubProducts()
      unsubPromos()
    }
  }, [profile.pharmacyId])

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      `${item.name} ${item.category} ${item.stock}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [products, search])

  const handleRegister = () => {
    if (!profile.pharmacyName.trim() || !profile.pharmacyId.trim()) {
      alert("Add pharmacy name and pharmacy ID first")
      return
    }
    setIsRegistered(true)
  }

  const handleImageUpload = async (file, type) => {
    if (!file) return null

    try {
      if (type === "logo") setUploadingLogo(true)
      if (type === "cover") setUploadingCover(true)
      if (type === "product") setUploadingProductImage(true)
      if (type === "promo") setUploadingPromoImage(true)

      const uploaded = await uploadToImgbb(file)
      return uploaded.url
    } catch (error) {
      console.error(error)
      alert("Image upload failed")
      return null
    } finally {
      if (type === "logo") setUploadingLogo(false)
      if (type === "cover") setUploadingCover(false)
      if (type === "product") setUploadingProductImage(false)
      if (type === "promo") setUploadingPromoImage(false)
    }
  }

  const savePharmacyProfile = async () => {
    if (!uid) {
      alert("Login first")
      return
    }

    if (!profile.pharmacyName.trim() || !profile.pharmacyId.trim()) {
      alert("Pharmacy name and pharmacy ID are required")
      return
    }

    try {
      setSavingProfile(true)

      await set(ref(db, `pharmacies/${profile.pharmacyId}`), {
        name: profile.pharmacyName,
        pharmacyId: profile.pharmacyId,
        ownerName: profile.ownerName,
        phone: profile.phone,
        city: profile.city,
        category: profile.category,
        tagline: profile.tagline,
        logo: profile.logo || "",
        coverImage: profile.coverImage || "",
        eta: profile.eta || "18–35 min",
        isOpen: profile.isOpen,
        ownerId: uid,
        updatedAt: Date.now(),
      })

      await set(ref(db, `pharmacyOwners/${uid}`), {
        pharmacyId: profile.pharmacyId,
        pharmacyName: profile.pharmacyName,
        ownerName: profile.ownerName,
        phone: profile.phone,
        role: "pharmacy_owner",
        city: profile.city,
        updatedAt: Date.now(),
      })

      alert("Pharmacy profile saved")
      setIsRegistered(true)
    } catch (error) {
      console.error(error)
      alert("Failed to save pharmacy profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const saveProduct = async () => {
    if (!profile.pharmacyId) {
      alert("Save pharmacy profile first")
      return
    }

    if (!productForm.name.trim() || !productForm.price.trim()) {
      alert("Add product name and price")
      return
    }

    try {
      setSavingProduct(true)

      const productRef = push(ref(db, `pharmacyProducts/${profile.pharmacyId}`))

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
        image: "",
      })

      alert("Product saved")
      setActiveTab("products")
    } catch (error) {
      console.error(error)
      alert("Failed to save product")
    } finally {
      setSavingProduct(false)
    }
  }

  const savePromo = async () => {
    if (!profile.pharmacyId) {
      alert("Save pharmacy profile first")
      return
    }

    if (!promoForm.title.trim()) {
      alert("Add promo title")
      return
    }

    try {
      setSavingPromo(true)

      const promoRef = push(ref(db, `pharmacyPromos/${profile.pharmacyId}`))

      await set(promoRef, {
        title: promoForm.title,
        subtitle: promoForm.subtitle || "",
        tag: promoForm.tag || "",
        image: promoForm.image || "",
        active: true,
        createdAt: Date.now(),
      })

      setPromoForm({
        title: "",
        subtitle: "",
        tag: "",
        image: "",
      })

      alert("Promo saved")
      setActiveTab("promos")
    } catch (error) {
      console.error(error)
      alert("Failed to save promo")
    } finally {
      setSavingPromo(false)
    }
  }

  const quickSections = [
    {
      id: "products",
      title: "Products",
      subtitle: "Add medicines, price, stock, image and category",
      icon: Pill
    },
    {
      id: "promos",
      title: "Promos & hero",
      subtitle: "Update carousel banners, hero images and offer cards",
      icon: ImageIcon
    },
    {
      id: "orders",
      title: "Orders",
      subtitle: "See cart orders, mark preparing, delivery or completed",
      icon: ShoppingBag
    },
    {
      id: "prescriptions",
      title: "Prescriptions",
      subtitle: "Review uploaded scripts and approve or reject",
      icon: FileText
    },
    {
      id: "requests",
      title: "Requests",
      subtitle: "Reply to medicine availability questions",
      icon: Stethoscope
    },
    {
      id: "chats",
      title: "Chats",
      subtitle: "Talk to customers about orders and medicine requests",
      icon: MessageSquare
    }
  ]

  const stats = [
    {
      title: "Products",
      value: String(products.length),
      note: "Saved items",
      icon: Pill
    },
    {
      title: "Promos",
      value: String(promos.length),
      note: "Saved banners",
      icon: ImageIcon
    },
    {
      title: "Profile",
      value: profile.pharmacyName ? "1" : "0",
      note: "Pharmacy profile",
      icon: Store
    },
    {
      title: "Owner",
      value: uid ? "1" : "0",
      note: "Logged account",
      icon: User
    }
  ]

  const TabButton = ({ id, label, icon: Icon }) => {
    const active = activeTab === id
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition ${
          active
            ? "bg-[#10214e] text-white"
            : "border border-neutral-200 bg-white text-neutral-700"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    )
  }

  const UploadInput = ({ label, loading, onFile }) => (
    <div>
      <p className="mb-2 text-[11px] font-semibold text-neutral-500">{label}</p>
      <label className="flex cursor-pointer items-center justify-between rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] text-neutral-700">
        <span>{loading ? "Uploading..." : "Choose image"}</span>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
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

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-32">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1224] via-[#10214e] to-[#1d3f98] px-4 pb-8 pt-5 text-white">
        <div className="absolute inset-0 opacity-20">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt={profile.pharmacyName || "Pharmacy cover"}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-0 top-20 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Owner pharmacy admin
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
                <Bell className="h-5 w-5" />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="text-[34px] font-semibold tracking-[-0.04em]">
                {profile.pharmacyName || "Create your pharmacy admin"}
              </h1>
              <p className="mt-2 max-w-[700px] text-[14px] text-white/80">
                Upload images to ImgBB, save URLs into Firebase Realtime Database,
                then manage products and promos from one pharmacy owner page.
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {profile.eta}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  One pharmacy only
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <p className="text-[11px] text-white/65">Current owner profile</p>
              <p className="mt-1 text-[18px] font-semibold">
                {profile.ownerName || "Owner not set"}
              </p>
              <p className="mt-1 text-[12px] text-white/80">
                {profile.phone || "Phone not set"}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold">
                <Store className="h-3.5 w-3.5" />
                {profile.pharmacyId || "No pharmacy ID yet"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-4 px-4">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="rounded-[20px] border border-neutral-200 px-4 py-3 lg:w-[340px]">
                <div className="flex items-center gap-3">
                  <Search className="h-4.5 w-4.5 text-neutral-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search saved products..."
                    className="w-full bg-transparent text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
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
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {stats.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.title}
                        className="rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                          <Icon className="h-5 w-5 text-[#173ea5]" />
                        </div>
                        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-neutral-900">
                          {item.value}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-500">{item.note}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[18px] font-semibold text-neutral-900">
                        Fast sections
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        Everything this pharmacy owner controls
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {quickSections.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className="rounded-[22px] border border-neutral-200 p-4 text-left transition hover:bg-neutral-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff]">
                              <Icon className="h-4.5 w-4.5 text-[#173ea5]" />
                            </div>
                            <div>
                              <p className="text-[14px] font-semibold text-neutral-900">
                                {item.title}
                              </p>
                              <p className="mt-1 text-[11px] text-neutral-500">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                  <div className="relative h-[220px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8]">
                    {profile.coverImage ? (
                      <img
                        src={profile.coverImage}
                        alt={profile.pharmacyName || "Pharmacy"}
                        className="h-full w-full object-cover opacity-30"
                      />
                    ) : null}
                    <div className="absolute inset-0 p-5 text-white">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl">
                        {profile.logo ? (
                          <img
                            src={profile.logo}
                            alt={profile.pharmacyName || "Logo"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Store className="h-8 w-8" />
                        )}
                      </div>

                      <p className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">
                        {profile.pharmacyName || "Your pharmacy"}
                      </p>
                      <p className="mt-1 text-[12px] text-white/80">
                        {profile.tagline || "Fast medicine access, trusted local care"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid gap-3">
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] text-neutral-500">Owner</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {profile.ownerName || "Not set"}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] text-neutral-500">Phone</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {profile.phone || "Not set"}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] text-neutral-500">Pharmacy ID</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {profile.pharmacyId || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf1]">
                      <CheckCircle2 className="h-5 w-5 text-[#0c8f4d]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">
                        Connected flow
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                        Upload image to ImgBB, save returned URL into Firebase, then
                        display that URL on pharmacy pages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <Store className="h-5 w-5 text-[#173ea5]" />
                  </div>
                  <div>
                    <p className="text-[18px] font-semibold text-neutral-900">
                      Pharmacy profile
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Save owner and pharmacy info to Firebase
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Pharmacy name</p>
                    <input
                      value={profile.pharmacyName}
                      onChange={(e) => setProfile((p) => ({ ...p, pharmacyName: e.target.value }))}
                      placeholder="Alliance Pharmacy"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Pharmacy ID / slug</p>
                    <input
                      value={profile.pharmacyId}
                      onChange={(e) => setProfile((p) => ({ ...p, pharmacyId: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                      placeholder="alliance-pharmacy"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Owner full name</p>
                    <input
                      value={profile.ownerName}
                      onChange={(e) => setProfile((p) => ({ ...p, ownerName: e.target.value }))}
                      placeholder="Owner name"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Phone</p>
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+263..."
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">City</p>
                    <select
                      value={profile.city}
                      onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    >
                      <option>Harare</option>
                      <option>Bulawayo</option>
                      <option>Gweru</option>
                      <option>Zvishavane</option>
                      <option>Mutare</option>
                    </select>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Category</p>
                    <select
                      value={profile.category}
                      onChange={(e) => setProfile((p) => ({ ...p, category: e.target.value }))}
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    >
                      <option>Pharmacy</option>
                      <option>Clinic Pharmacy</option>
                      <option>Health Centre Pharmacy</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Tagline</p>
                    <input
                      value={profile.tagline}
                      onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
                      placeholder="Fast medicine access, trusted local care"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <UploadInput
                      label="Pharmacy logo"
                      loading={uploadingLogo}
                      onFile={async (file) => {
                        const url = await handleImageUpload(file, "logo")
                        if (url) setProfile((p) => ({ ...p, logo: url }))
                      }}
                    />

                    <UploadInput
                      label="Cover image"
                      loading={uploadingCover}
                      onFile={async (file) => {
                        const url = await handleImageUpload(file, "cover")
                        if (url) setProfile((p) => ({ ...p, coverImage: url }))
                      }}
                    />
                  </div>

                  {profile.logo ? (
                    <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[12px] text-neutral-700">
                      Logo URL saved
                    </div>
                  ) : null}

                  {profile.coverImage ? (
                    <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[12px] text-neutral-700">
                      Cover image URL saved
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={savePharmacyProfile}
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                  >
                    {savingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save pharmacy profile
                  </button>

                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-semibold text-neutral-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark setup ready
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="relative h-[260px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8]">
                  {profile.coverImage ? (
                    <img
                      src={profile.coverImage}
                      alt={profile.pharmacyName || "Cover"}
                      className="h-full w-full object-cover opacity-30"
                    />
                  ) : null}

                  <div className="absolute inset-0 p-5 text-white">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl">
                      {profile.logo ? (
                        <img
                          src={profile.logo}
                          alt={profile.pharmacyName || "Logo"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="h-8 w-8" />
                      )}
                    </div>

                    <p className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">
                      {profile.pharmacyName || "Pharmacy preview"}
                    </p>
                    <p className="mt-1 text-[12px] text-white/80">
                      {profile.tagline || "Your tagline preview"}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid gap-3">
                    <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                      <p className="text-[11px] text-neutral-500">Owner</p>
                      <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                        {profile.ownerName || "Not set"}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                      <p className="text-[11px] text-neutral-500">Phone</p>
                      <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                        {profile.phone || "Not set"}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                      <p className="text-[11px] text-neutral-500">Pharmacy ID</p>
                      <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                        {profile.pharmacyId || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[18px] font-semibold text-neutral-900">Saved products</p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Products stored in Firebase for this pharmacy
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredProducts.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-8 text-center">
                      <p className="text-[15px] font-semibold text-neutral-900">No products yet</p>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        Add your first medicine on the form
                      </p>
                    </div>
                  ) : (
                    filteredProducts.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[22px] border border-neutral-200 p-4"
                      >
                        <div className="flex gap-4">
                          <div className="h-20 w-20 overflow-hidden rounded-[18px] bg-[#f4f7ff]">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Pill className="h-6 w-6 text-[#173ea5]" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[14px] font-semibold text-neutral-900">{item.name}</p>
                                <p className="mt-1 text-[11px] text-neutral-500">
                                  {item.category} • {item.size || "No size"}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-[13px] font-semibold text-neutral-900">
                                  ${item.price}
                                </p>
                                <p className="mt-1 text-[11px] text-neutral-500">{item.stock}</p>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-semibold text-neutral-700">
                                {item.rx ? "Prescription" : "Normal"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">Add product</p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Upload image to ImgBB and save product to Firebase
                </p>

                <div className="mt-4 grid gap-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Product name</p>
                    <input
                      value={productForm.name}
                      onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Panado"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Size</p>
                    <input
                      value={productForm.size}
                      onChange={(e) => setProductForm((p) => ({ ...p, size: e.target.value }))}
                      placeholder="500mg tablets"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold text-neutral-500">Category</p>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                      >
                        <option>Pain Relief</option>
                        <option>Cold & Flu</option>
                        <option>Vitamins</option>
                        <option>Baby Care</option>
                        <option>Personal Care</option>
                        <option>Prescription</option>
                      </select>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold text-neutral-500">Stock</p>
                      <select
                        value={productForm.stock}
                        onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                      >
                        <option>In stock</option>
                        <option>Low stock</option>
                        <option>Out of stock</option>
                        <option>Review only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold text-neutral-500">Price</p>
                      <input
                        value={productForm.price}
                        onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                        placeholder="3.50"
                        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold text-neutral-500">Old price</p>
                      <input
                        value={productForm.oldPrice}
                        onChange={(e) => setProductForm((p) => ({ ...p, oldPrice: e.target.value }))}
                        placeholder="4.00"
                        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Description</p>
                    <textarea
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Product description..."
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <UploadInput
                    label="Product image"
                    loading={uploadingProductImage}
                    onFile={async (file) => {
                      const url = await handleImageUpload(file, "product")
                      if (url) setProductForm((p) => ({ ...p, image: url }))
                    }}
                  />

                  <div className="flex items-center gap-3">
                    <input
                      id="rx"
                      type="checkbox"
                      checked={productForm.rx}
                      onChange={(e) => setProductForm((p) => ({ ...p, rx: e.target.checked }))}
                    />
                    <label htmlFor="rx" className="text-[13px] font-semibold text-neutral-800">
                      Prescription item
                    </label>
                  </div>

                  <button
                    onClick={saveProduct}
                    disabled={savingProduct}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                  >
                    {savingProduct ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Save product
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "promos" && (
            <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[18px] font-semibold text-neutral-900">Saved promos</p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Hero carousel data saved in Firebase
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {promos.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-neutral-300 bg-[#fafcff] p-8 text-center">
                      <p className="text-[15px] font-semibold text-neutral-900">No promos yet</p>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        Add your first hero promo
                      </p>
                    </div>
                  ) : (
                    promos.map((item) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-[22px] border border-neutral-200"
                      >
                        <div className="relative h-[170px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover opacity-35"
                            />
                          ) : null}
                          <div className="absolute inset-0 p-4 text-white">
                            <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold">
                              {item.tag || "Promo"}
                            </div>
                            <p className="mt-3 text-[18px] font-semibold">{item.title}</p>
                            <p className="mt-1 text-[12px] text-white/80">{item.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">Add promo</p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Upload hero image to ImgBB and save promo to Firebase
                </p>

                <div className="mt-4 grid gap-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Title</p>
                    <input
                      value={promoForm.title}
                      onChange={(e) => setPromoForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Wellness Week"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Subtitle</p>
                    <input
                      value={promoForm.subtitle}
                      onChange={(e) => setPromoForm((p) => ({ ...p, subtitle: e.target.value }))}
                      placeholder="Selected vitamins and essentials"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold text-neutral-500">Tag</p>
                    <input
                      value={promoForm.tag}
                      onChange={(e) => setPromoForm((p) => ({ ...p, tag: e.target.value }))}
                      placeholder="Up to 20% off"
                      className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                    />
                  </div>

                  <UploadInput
                    label="Promo image"
                    loading={uploadingPromoImage}
                    onFile={async (file) => {
                      const url = await handleImageUpload(file, "promo")
                      if (url) setPromoForm((p) => ({ ...p, image: url }))
                    }}
                  />

                  <button
                    onClick={savePromo}
                    disabled={savingPromo}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
                  >
                    {savingPromo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save promo
                  </button>
                </div>
              </div>
            </div>
          )}

          {["orders", "prescriptions", "requests", "chats"].includes(activeTab) && (
            <div className="rounded-[30px] bg-white p-8 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <p className="text-[18px] font-semibold text-neutral-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab ready
              </p>
              <p className="mt-2 text-[12px] text-neutral-500">
                We’ve finished the image + Firebase start first. Next we connect this section
                to the real pharmacy orders, prescription requests, medicine requests and chats.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

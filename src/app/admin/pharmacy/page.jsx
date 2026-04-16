"use client"

import { useMemo, useState } from "react"
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
  Sparkles
} from "lucide-react"

export default function PharmacyAdminPage() {
  const [isRegistered, setIsRegistered] = useState(false)

  const [profile, setProfile] = useState({
    pharmacyName: "",
    pharmacyId: "",
    ownerName: "",
    phone: "",
    city: "Harare",
    category: "Pharmacy",
    tagline: "",
    logo: "",
    coverImage: ""
  })

  const [activeTab, setActiveTab] = useState("dashboard")
  const [search, setSearch] = useState("")

  const samplePharmacy = {
    pharmacyName: profile.pharmacyName || "Alliance Pharmacy",
    pharmacyId: profile.pharmacyId || "alliance-pharmacy",
    ownerName: profile.ownerName || "B.JAY",
    phone: profile.phone || "+263 77 430 9795",
    city: profile.city || "Harare",
    category: profile.category || "Pharmacy",
    tagline: profile.tagline || "Fast medicine access, trusted local care",
    logo:
      profile.logo ||
      "https://commons.wikimedia.org/wiki/Special:FilePath/Paracetamol%20acetaminophen%20500%20mg%20pills.jpg",
    coverImage:
      profile.coverImage ||
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vitamin%20tablets%20%2827522813860%29.jpg"
  }

  const stats = [
    {
      title: "Products",
      value: "124",
      note: "Items listed",
      icon: Pill
    },
    {
      title: "Orders",
      value: "18",
      note: "Today",
      icon: ShoppingBag
    },
    {
      title: "Prescriptions",
      value: "9",
      note: "Pending review",
      icon: FileText
    },
    {
      title: "Requests",
      value: "14",
      note: "Availability checks",
      icon: MessageSquare
    }
  ]

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
      subtitle: "Reply to “Do you have this medicine?” questions",
      icon: Stethoscope
    },
    {
      id: "chats",
      title: "Chats",
      subtitle: "Talk to customers about orders and medicine requests",
      icon: MessageSquare
    }
  ]

  const products = [
    {
      id: "a1",
      name: "Panado",
      category: "Pain Relief",
      price: "$3.50",
      stock: "In stock",
      type: "Normal"
    },
    {
      id: "a2",
      name: "Vitamin C",
      category: "Vitamins",
      price: "$6.99",
      stock: "In stock",
      type: "Normal"
    },
    {
      id: "a9",
      name: "Amoxicillin",
      category: "Prescription",
      price: "By review",
      stock: "Review only",
      type: "Prescription"
    }
  ]

  const prescriptions = [
    {
      id: "RX-2048",
      customer: "Tariro M.",
      medicine: "Amoxicillin + pain tablets",
      status: "Pending review",
      time: "Today, 10:15"
    },
    {
      id: "RX-1831",
      customer: "Kundai B.",
      medicine: "Blood pressure refill",
      status: "Approved",
      time: "Today, 09:05"
    }
  ]

  const requests = [
    {
      id: "RQ-1441",
      customer: "Ashley T.",
      medicine: "Do you have Ibuprofen 400mg?",
      status: "Waiting reply",
      time: "Today, 11:08"
    },
    {
      id: "RQ-1202",
      customer: "Brian K.",
      medicine: "Need cough syrup for child",
      status: "Responded",
      time: "Yesterday, 17:44"
    }
  ]

  const orders = [
    {
      id: "ORD-2048",
      customer: "Tariro M.",
      items: "Panado, Vitamin C",
      status: "Preparing",
      time: "Today, 10:45"
    },
    {
      id: "ORD-1800",
      customer: "Martha G.",
      items: "Ibuprofen, Thermometer",
      status: "Out for delivery",
      time: "Today, 12:22"
    }
  ]

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      `${item.name} ${item.category} ${item.type}`.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleRegister = () => {
    if (!profile.pharmacyName.trim()) return
    setIsRegistered(true)
  }

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

  const StatusPill = ({ text }) => {
    const styles =
      text === "Pending review" || text === "Waiting reply"
        ? "bg-[#fff6e8] text-[#b56a00]"
        : text === "Approved" || text === "Responded"
        ? "bg-[#eefaf1] text-[#0c8f4d]"
        : text === "Preparing"
        ? "bg-[#eef4ff] text-[#173ea5]"
        : text === "Out for delivery"
        ? "bg-[#edfdf3] text-[#0c8f4d]"
        : "bg-neutral-100 text-neutral-700"

    return (
      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${styles}`}>
        {text}
      </span>
    )
  }

  if (!isRegistered) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] pb-20">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1224] via-[#10214e] to-[#1d3f98] px-4 pb-10 pt-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-0 top-20 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pharmacy owner setup
            </div>

            <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.04em]">
              Create your pharmacy admin profile
            </h1>

            <p className="mt-2 max-w-[760px] text-[14px] text-white/80">
              Each pharmacy owner creates their own pharmacy profile. Later, when we connect backend,
              each owner will only see their own pharmacy dashboard and not other pharmacies.
            </p>
          </div>
        </section>

        <section className="relative z-20 -mt-4 px-4">
          <div className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff]">
                  <Store className="h-5 w-5 text-[#173ea5]" />
                </div>
                <div>
                  <p className="text-[18px] font-semibold text-neutral-900">
                    Pharmacy profile setup
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    This creates the owner-side identity for one pharmacy only
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">Pharmacy name</p>
                  <input
                    value={profile.pharmacyName}
                    onChange={(e) => setProfile((p) => ({ ...p, pharmacyName: e.target.value }))}
                    placeholder="e.g Alliance Pharmacy"
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">Pharmacy ID / slug</p>
                  <input
                    value={profile.pharmacyId}
                    onChange={(e) => setProfile((p) => ({ ...p, pharmacyId: e.target.value }))}
                    placeholder="e.g alliance-pharmacy"
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

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">Logo image URL</p>
                  <input
                    value={profile.logo}
                    onChange={(e) => setProfile((p) => ({ ...p, logo: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold text-neutral-500">Cover image URL</p>
                  <input
                    value={profile.coverImage}
                    onChange={(e) => setProfile((p) => ({ ...p, coverImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white"
              >
                Create pharmacy admin
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="relative h-[220px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8]">
                  <img
                    src={samplePharmacy.coverImage}
                    alt={samplePharmacy.pharmacyName}
                    className="h-full w-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 p-5 text-white">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl">
                      <img
                        src={samplePharmacy.logo}
                        alt={samplePharmacy.pharmacyName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <p className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">
                      {samplePharmacy.pharmacyName}
                    </p>
                    <p className="mt-1 text-[12px] text-white/80">
                      {samplePharmacy.tagline}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/80">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {samplePharmacy.city}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5" />
                        {samplePharmacy.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-[15px] font-semibold text-neutral-900">
                    What this owner page will control
                  </p>

                  <div className="mt-4 grid gap-3">
                    {quickSections.map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.id}
                          className="rounded-[20px] border border-neutral-200 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                              <Icon className="h-4.5 w-4.5 text-[#173ea5]" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-neutral-900">
                                {item.title}
                              </p>
                              <p className="mt-1 text-[11px] text-neutral-500">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf1]">
                    <ShieldCheck className="h-5 w-5 text-[#0c8f4d]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-neutral-900">
                      Owner isolation logic later
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      When Firebase is connected, each pharmacy owner will only load data
                      for their own `pharmacyId` and never see other pharmacies.
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

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-32">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1224] via-[#10214e] to-[#1d3f98] px-4 pb-8 pt-5 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src={samplePharmacy.coverImage}
            alt={samplePharmacy.pharmacyName}
            className="h-full w-full object-cover"
          />
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
                {samplePharmacy.pharmacyName}
              </h1>
              <p className="mt-2 max-w-[700px] text-[14px] text-white/80">
                This admin belongs to one pharmacy only. Later, each owner account
                will open only this pharmacy profile and nothing from another store.
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {samplePharmacy.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  Owner-controlled dashboard
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Store-isolated access
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <p className="text-[11px] text-white/65">Current owner profile</p>
              <p className="mt-1 text-[18px] font-semibold">{samplePharmacy.ownerName}</p>
              <p className="mt-1 text-[12px] text-white/80">{samplePharmacy.phone}</p>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold">
                <Store className="h-3.5 w-3.5" />
                {samplePharmacy.pharmacyId}
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
                    placeholder="Search product, request, order..."
                    className="w-full bg-transparent text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max gap-2">
                  <TabButton id="dashboard" label="Dashboard" icon={LayoutDashboard} />
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

                    <button className="inline-flex items-center gap-2 rounded-full bg-[#10214e] px-4 py-2 text-[12px] font-semibold text-white">
                      <Plus className="h-4 w-4" />
                      Add new
                    </button>
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
                    <img
                      src={samplePharmacy.coverImage}
                      alt={samplePharmacy.pharmacyName}
                      className="h-full w-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 p-5 text-white">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl">
                        <img
                          src={samplePharmacy.logo}
                          alt={samplePharmacy.pharmacyName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <p className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">
                        {samplePharmacy.pharmacyName}
                      </p>
                      <p className="mt-1 text-[12px] text-white/80">
                        {samplePharmacy.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid gap-3">
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] text-neutral-500">Owner</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {samplePharmacy.ownerName}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] text-neutral-500">Phone</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {samplePharmacy.phone}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] text-neutral-500">Pharmacy ID</p>
                        <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                          {samplePharmacy.pharmacyId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff6e8]">
                      <AlertCircle className="h-5 w-5 text-[#b56a00]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">
                        Backend rule later
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                        Once Firebase is connected, login + owner role + pharmacyId will decide
                        which admin loads. One owner = one pharmacy dashboard.
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
                    <p className="text-[18px] font-semibold text-neutral-900">Products manager</p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Add products, images, stock, type and price
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#10214e] px-4 py-2 text-[12px] font-semibold text-white">
                    <Plus className="h-4 w-4" />
                    Add product
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredProducts.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-neutral-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[14px] font-semibold text-neutral-900">{item.name}</p>
                          <p className="mt-1 text-[11px] text-neutral-500">
                            {item.category} • {item.type}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[13px] font-semibold text-neutral-900">{item.price}</p>
                          <p className="mt-1 text-[11px] text-neutral-500">{item.stock}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">Product form preview</p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  This is where owner later adds name, image, category, price and rx type
                </p>

                <div className="mt-4 grid gap-4">
                  {["Product name", "Category", "Price", "Image URL", "Stock", "Type: Normal / Prescription"].map((label) => (
                    <div key={label}>
                      <p className="mb-2 text-[11px] font-semibold text-neutral-500">{label}</p>
                      <input
                        placeholder={label}
                        className="w-full rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "promos" && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex h-[180px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0e1730] via-[#18326e] to-[#3258c8] text-white">
                    <div className="text-center">
                      <Sparkles className="mx-auto h-8 w-8" />
                      <p className="mt-3 text-[15px] font-semibold">Hero slide {n}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] font-semibold text-neutral-900">Promo content block</p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Title, subtitle, tag and image URL live here
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <p className="text-[18px] font-semibold text-neutral-900">Orders</p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Incoming pharmacy orders for this store only
              </p>

              <div className="mt-4 space-y-3">
                {orders.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-neutral-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-neutral-900">{item.id}</p>
                        <p className="mt-1 text-[12px] text-neutral-500">
                          {item.customer} • {item.items}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">{item.time}</p>
                      </div>
                      <StatusPill text={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <p className="text-[18px] font-semibold text-neutral-900">Prescription requests</p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Prescription uploads sent to this pharmacy only
              </p>

              <div className="mt-4 space-y-3">
                {prescriptions.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-neutral-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-neutral-900">{item.id}</p>
                        <p className="mt-1 text-[12px] text-neutral-500">
                          {item.customer} • {item.medicine}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">{item.time}</p>
                      </div>
                      <StatusPill text={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
              <p className="text-[18px] font-semibold text-neutral-900">Availability requests</p>
              <p className="mt-1 text-[12px] text-neutral-500">
                “Do you have this medicine?” requests for this pharmacy only
              </p>

              <div className="mt-4 space-y-3">
                {requests.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-neutral-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-neutral-900">{item.id}</p>
                        <p className="mt-1 text-[12px] text-neutral-500">
                          {item.customer} • {item.medicine}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">{item.time}</p>
                      </div>
                      <StatusPill text={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "chats" && (
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">Customer chats</p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Message threads connected to this pharmacy
                </p>

                <div className="mt-4 space-y-3">
                  {["Tariro M.", "Brian K.", "Ashley T."].map((name) => (
                    <button
                      key={name}
                      className="w-full rounded-[22px] border border-neutral-200 p-4 text-left"
                    >
                      <p className="text-[13px] font-semibold text-neutral-900">{name}</p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Last message about medicine request
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">Chat preview</p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Later this becomes a live conversation panel
                </p>

                <div className="mt-4 space-y-3">
                  <div className="max-w-[80%] rounded-[20px] bg-[#f3f4f6] px-4 py-3 text-[13px] text-neutral-700">
                    Hi, do you have Ibuprofen 400mg?
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-[20px] bg-[#10214e] px-4 py-3 text-[13px] text-white">
                    Yes, it is available. Would you like pickup or delivery?
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <input
                    placeholder="Type a reply..."
                    className="flex-1 rounded-[18px] border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-[13px] outline-none"
                  />
                  <button className="rounded-full bg-[#10214e] px-5 py-3 text-[13px] font-semibold text-white">
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

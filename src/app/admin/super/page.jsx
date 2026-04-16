"use client"

import { useMemo, useState } from "react"
import {
  Shield,
  Store,
  UserCheck,
  Users,
  Pill,
  FileText,
  MessageSquare,
  ShoppingBag,
  Search,
  Bell,
  Settings,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock3,
  MapPin,
  Sparkles,
  LayoutDashboard,
  Building2,
  Plus,
  Stethoscope,
  BadgeCheck
} from "lucide-react"

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [search, setSearch] = useState("")

  const platformStats = [
    {
      title: "Pharmacies",
      value: "12",
      note: "Registered stores",
      icon: Store
    },
    {
      title: "Owners",
      value: "12",
      note: "Approved accounts",
      icon: Users
    },
    {
      title: "Orders",
      value: "84",
      note: "Active today",
      icon: ShoppingBag
    },
    {
      title: "Prescriptions",
      value: "23",
      note: "Pending review",
      icon: FileText
    }
  ]

  const pharmacies = [
    {
      id: "alliance-pharmacy",
      name: "Alliance Pharmacy",
      owner: "B.JAY",
      city: "Harare",
      status: "Approved",
      category: "Pharmacy",
      phone: "+263 77 430 9795"
    },
    {
      id: "rehome-pharmacy",
      name: "Rehome Pharmacy",
      owner: "Admin Owner",
      city: "Gweru",
      status: "Approved",
      category: "Pharmacy",
      phone: "+263 77 000 2000"
    },
    {
      id: "live-pharmacy",
      name: "Live Pharmacy",
      owner: "Martha N.",
      city: "Bulawayo",
      status: "Pending approval",
      category: "Clinic Pharmacy",
      phone: "+263 77 500 6000"
    }
  ]

  const ownerRequests = [
    {
      id: "OWN-1001",
      ownerName: "Martha N.",
      pharmacyName: "Live Pharmacy",
      city: "Bulawayo",
      submittedAt: "Today, 11:14",
      status: "Pending approval"
    },
    {
      id: "OWN-1002",
      ownerName: "Tatenda K.",
      pharmacyName: "City Care Drugs",
      city: "Mutare",
      submittedAt: "Today, 09:42",
      status: "Pending approval"
    }
  ]

  const categories = [
    "Pain Relief",
    "Cold & Flu",
    "Vitamins",
    "Baby Care",
    "Personal Care",
    "Prescription",
    "Clinic"
  ]

  const platformAlerts = [
    {
      id: "ALT-1",
      title: "2 new pharmacy owner applications waiting",
      status: "Needs attention"
    },
    {
      id: "ALT-2",
      title: "Prescription queues rising in Harare",
      status: "Watch"
    },
    {
      id: "ALT-3",
      title: "One pharmacy missing hero image setup",
      status: "Info"
    }
  ]

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((item) =>
      `${item.name} ${item.owner} ${item.city} ${item.category} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [pharmacies, search])

  const filteredOwnerRequests = useMemo(() => {
    return ownerRequests.filter((item) =>
      `${item.ownerName} ${item.pharmacyName} ${item.city} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [ownerRequests, search])

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
      text === "Approved"
        ? "bg-[#eefaf1] text-[#0c8f4d]"
        : text === "Pending approval"
        ? "bg-[#fff6e8] text-[#b56a00]"
        : text === "Rejected"
        ? "bg-[#fdecec] text-[#b42318]"
        : text === "Needs attention"
        ? "bg-[#fff6e8] text-[#b56a00]"
        : text === "Watch"
        ? "bg-[#eef4ff] text-[#173ea5]"
        : "bg-neutral-100 text-neutral-700"

    return (
      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${styles}`}>
        {text}
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-32">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1224] via-[#10214e] to-[#1d3f98] px-4 pb-8 pt-5 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-0 top-20 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-xl">
              <Shield className="h-3.5 w-3.5" />
              Platform super admin
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

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-[34px] font-semibold tracking-[-0.04em]">
                Super admin control for all pharmacies
              </h1>
              <p className="mt-2 max-w-[760px] text-[14px] text-white/80">
                Manage the whole pharmacy platform from one place. Review owner
                signups, approve pharmacies, monitor prescription load, and keep
                store categories organized.
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Platform-wide control
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5" />
                  Multi-pharmacy visibility
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Owner approval flow
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
              <p className="text-[11px] text-white/65">Super admin access</p>
              <p className="mt-1 text-[18px] font-semibold">Platform Owner</p>
              <p className="mt-1 text-[12px] text-white/80">
                Full view of pharmacies, requests, categories and approvals
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Restricted super admin route
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + TABS */}
      <section className="relative z-20 -mt-4 px-4">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="rounded-[20px] border border-neutral-200 px-4 py-3 lg:w-[360px]">
                <div className="flex items-center gap-3">
                  <Search className="h-4.5 w-4.5 text-neutral-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pharmacy, owner, city, request..."
                    className="w-full bg-transparent text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex min-w-max gap-2">
                  <TabButton id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                  <TabButton id="pharmacies" label="Pharmacies" icon={Store} />
                  <TabButton id="owners" label="Owner approvals" icon={UserCheck} />
                  <TabButton id="categories" label="Categories" icon={Pill} />
                  <TabButton id="monitoring" label="Monitoring" icon={Stethoscope} />
                </div>
              </div>
            </div>
          </div>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {platformStats.map((item) => {
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
                        Platform alerts
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        Important activity across the pharmacy network
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {platformAlerts.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[22px] border border-neutral-200 p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="text-[13px] font-semibold text-neutral-900">
                            {item.title}
                          </p>
                          <StatusPill text={item.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[18px] font-semibold text-neutral-900">
                        Quick actions
                      </p>
                      <p className="mt-1 text-[12px] text-neutral-500">
                        Fast super admin controls
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      {
                        icon: Store,
                        title: "Approve new pharmacies",
                        subtitle: "Review pharmacy owner registrations"
                      },
                      {
                        icon: Pill,
                        title: "Manage categories",
                        subtitle: "Control medicine category labels"
                      },
                      {
                        icon: Sparkles,
                        title: "Platform promos",
                        subtitle: "Set common banner strategy later"
                      },
                      {
                        icon: FileText,
                        title: "Prescription load view",
                        subtitle: "See queues by city and pharmacy"
                      }
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.title}
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
                <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                  <p className="text-[18px] font-semibold text-neutral-900">
                    Platform summary
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-500">
                    High-level overview of pharmacy network
                  </p>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-[20px] border border-neutral-200 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff]">
                        <Building2 className="h-4.5 w-4.5 text-[#173ea5]" />
                      </div>
                      <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                        Store coverage
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Harare, Gweru, Bulawayo, Mutare and more later
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-neutral-200 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff6e8]">
                        <Clock3 className="h-4.5 w-4.5 text-[#b56a00]" />
                      </div>
                      <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                        Pending owner approvals
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {ownerRequests.length} owner applications waiting
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-neutral-200 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eefaf1]">
                        <CheckCircle2 className="h-4.5 w-4.5 text-[#0c8f4d]" />
                      </div>
                      <p className="mt-3 text-[13px] font-semibold text-neutral-900">
                        Approved pharmacies
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Network visibility under one control center
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf1]">
                      <Shield className="h-5 w-5 text-[#0c8f4d]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">
                        Role rule later
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                        This route should later be locked to your super admin role only,
                        while pharmacy owners stay inside their own pharmacy admin page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHARMACIES */}
          {activeTab === "pharmacies" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[18px] font-semibold text-neutral-900">
                      All pharmacies
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Platform-level view of registered pharmacies
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 rounded-full bg-[#10214e] px-4 py-2 text-[12px] font-semibold text-white">
                    <Plus className="h-4 w-4" />
                    Add pharmacy
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredPharmacies.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-neutral-200 p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-neutral-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-[12px] text-neutral-500">
                            {item.owner} • {item.category}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-neutral-500">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {item.city}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Store className="h-3.5 w-3.5" />
                              {item.id}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <StatusPill text={item.status} />
                          <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[12px] font-semibold text-neutral-800">
                            Open pharmacy
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">
                  Pharmacy record preview
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Later this side can show selected pharmacy details
                </p>

                <div className="mt-4 grid gap-3">
                  {[
                    "Pharmacy name",
                    "Owner name",
                    "City",
                    "Category",
                    "Phone",
                    "Approval status",
                    "Created at"
                  ].map((label) => (
                    <div key={label} className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                      <p className="text-[11px] text-neutral-500">{label}</p>
                      <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                        Sample value
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OWNER APPROVALS */}
          {activeTab === "owners" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">
                  Owner approval requests
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  New pharmacy owner applications waiting for approval
                </p>

                <div className="mt-4 space-y-3">
                  {filteredOwnerRequests.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-neutral-200 p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-neutral-900">
                            {item.ownerName}
                          </p>
                          <p className="mt-1 text-[12px] text-neutral-500">
                            {item.pharmacyName} • {item.city}
                          </p>
                          <p className="mt-2 text-[11px] text-neutral-400">
                            Submitted {item.submittedAt}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <StatusPill text={item.status} />
                          <div className="flex gap-2">
                            <button className="rounded-full bg-[#10214e] px-4 py-2 text-[12px] font-semibold text-white">
                              Approve
                            </button>
                            <button className="rounded-full border border-neutral-200 px-4 py-2 text-[12px] font-semibold text-neutral-700">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">
                  Approval logic
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  What super admin should control later
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    "Approve pharmacy owner account",
                    "Assign pharmacyId to owner",
                    "Set owner role to pharmacy_owner",
                    "Activate admin page access",
                    "Block cross-pharmacy visibility"
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-neutral-200 p-4"
                    >
                      <p className="text-[13px] font-semibold text-neutral-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === "categories" && (
            <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[18px] font-semibold text-neutral-900">
                      Platform categories
                    </p>
                    <p className="mt-1 text-[12px] text-neutral-500">
                      Core categories all pharmacies can use
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 rounded-full bg-[#10214e] px-4 py-2 text-[12px] font-semibold text-white">
                    <Plus className="h-4 w-4" />
                    Add category
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {categories.map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-neutral-200 p-4"
                    >
                      <p className="text-[13px] font-semibold text-neutral-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">
                  Category use
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  These categories later feed pharmacy product forms
                </p>

                <div className="mt-4 grid gap-3">
                  {[
                    "Used in pharmacy product forms",
                    "Used in catalogue filtering",
                    "Used in dashboard analytics",
                    "Can be extended later by super admin only"
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-neutral-200 p-4"
                    >
                      <p className="text-[13px] font-semibold text-neutral-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MONITORING */}
          {activeTab === "monitoring" && (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">
                  Monitoring view
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Watch queues and important movements across pharmacies
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    {
                      title: "Prescription queue in Harare",
                      value: "9 pending",
                      tone: "Watch"
                    },
                    {
                      title: "Availability requests in Gweru",
                      value: "4 waiting reply",
                      tone: "Needs attention"
                    },
                    {
                      title: "Orders out for delivery",
                      value: "18 active",
                      tone: "Approved"
                    }
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-neutral-200 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-neutral-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[12px] text-neutral-500">
                            {item.value}
                          </p>
                        </div>
                        <StatusPill text={item.tone} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
                <p className="text-[18px] font-semibold text-neutral-900">
                  Why this page matters
                </p>
                <p className="mt-1 text-[12px] text-neutral-500">
                  Platform-level eyes before backend connection
                </p>

                <div className="mt-4 grid gap-3">
                  {[
                    "See where requests are piling up",
                    "Spot pharmacies needing setup help",
                    "Review owner onboarding status",
                    "Control system-wide pharmacy quality"
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-neutral-200 p-4"
                    >
                      <p className="text-[13px] font-semibold text-neutral-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

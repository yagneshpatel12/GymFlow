import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Dumbbell,
  Images,
  LayoutDashboard,
  LogOut,
  Play,
  Plus,
  QrCode,
  Sparkles,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background flourishes */}
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,white,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/80 px-3.5 py-1.5 text-sm font-medium text-brand-700">
          <Sparkles className="h-4 w-4" />
          Run your entire gym from one dashboard
        </div>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Gym management software that{" "}
          <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
            runs itself
          </span>
        </h1>

        <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Members, class scheduling, attendance, trainers and billing - replace
          your spreadsheets and three disconnected tools with one beautiful
          platform built for modern gyms.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-700"
          >
            Start free trial <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[15px] font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <Play className="h-4 w-4 fill-current" /> View live demo
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          No credit card required · Instant demo, no signup
        </p>

        {/* Dashboard mockup */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-brand-100/60 to-transparent blur-2xl" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-300" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
        <div className="ml-3 hidden rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200 sm:block">
          getgymflow.vercel.app/dashboard
        </div>
      </div>

      <div className="flex">
        {/* Mini sidebar - dark, matching the real dashboard */}
        <aside className="hidden w-48 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-left sm:flex">
          {/* Logo header */}
          <div className="flex h-11 items-center gap-2 border-b border-slate-800 px-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Dumbbell className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white">
              GymFlow
            </span>
          </div>

          {/* Nav */}
          <div className="flex-1 p-3">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Manage
            </p>
            <div className="flex flex-col gap-1">
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: Users, label: "Members" },
                { icon: CalendarDays, label: "Class Schedule" },
                { icon: QrCode, label: "Attendance" },
                { icon: Images, label: "Before & After" },
                { icon: UserCog, label: "Trainers" },
                { icon: CreditCard, label: "Membership Plans" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium ${
                    item.active
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-300"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 ${item.active ? "text-white" : "text-slate-400"}`}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Log out */}
          <div className="border-t border-slate-800 p-3">
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300">
              <LogOut className="h-4 w-4 text-slate-400" />
              Log out
            </div>
          </div>
        </aside>

        {/* Right column: topbar + content */}
        <div className="flex flex-1 flex-col">
          {/* Topbar */}
          <div className="flex h-11 items-center gap-3 border-b border-slate-100 bg-white px-4 text-left">
            <span className="text-xs font-semibold text-slate-900 sm:text-sm">
              Dashboard
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[9px] font-semibold text-brand-700">
                  AM
                </span>
                <div className="hidden leading-tight md:block">
                  <div className="text-[10px] font-semibold text-slate-900">
                    Alex Morgan
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Ironworks Fitness
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-canvas p-4 text-left sm:p-5">
            {/* Welcome + Add member */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold tracking-tight text-slate-900">
                  Welcome back, Alex
                </div>
                <div className="text-[11px] text-slate-500">
                  Friday, July 31 · Here&apos;s how Ironworks Fitness is doing.
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-brand">
                <Plus className="h-3 w-3" /> Add member
              </span>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total members", value: "140", icon: Users, delta: "+60.0%", up: true, deltaLabel: "new vs last month" },
                { label: "Monthly revenue", value: "$6,750", icon: TrendingUp, delta: "+5.3%", up: true, deltaLabel: "vs last month" },
                { label: "Avg check-ins / day", value: "41", icon: CalendarDays, delta: "+7.0%", up: false, deltaLabel: "vs previous week" },
                { label: "Active rate", value: "82%", icon: CreditCard, delta: "", up: true, deltaLabel: "" },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-lg border border-slate-200/80 bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      {k.label}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                      <k.icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-slate-900">
                    {k.value}
                  </div>
                  {k.delta && (
                    <div className="mt-1 flex items-center gap-1 text-[10px]">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 font-semibold ${
                          k.up
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {k.up ? (
                          <ArrowUpRight className="h-2.5 w-2.5" />
                        ) : (
                          <ArrowDownRight className="h-2.5 w-2.5" />
                        )}
                        {k.delta}
                      </span>
                      <span className="hidden text-slate-400 lg:inline">
                        {k.deltaLabel}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chart + status */}
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200/80 bg-white p-3 lg:col-span-2">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      Attendance trends
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Daily check-ins over the last 30 days
                    </div>
                  </div>
                  <div className="text-right leading-tight">
                    <div className="text-sm font-bold text-slate-900">43</div>
                    <div className="text-[9px] text-slate-400">today</div>
                  </div>
                </div>
                <svg viewBox="0 0 320 90" className="h-24 w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mockFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,70 C30,60 45,40 70,45 C95,50 110,25 140,30 C170,35 185,15 215,22 C245,28 260,10 290,18 L320,14 L320,90 L0,90 Z"
                    fill="url(#mockFill)"
                  />
                  <path
                    d="M0,70 C30,60 45,40 70,45 C95,50 110,25 140,30 C170,35 185,15 215,22 C245,28 260,10 290,18 L320,14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-white p-3">
                <div className="mb-2 text-xs font-semibold text-slate-700">
                  Members by status
                </div>
                <div className="flex items-center gap-3">
                  {/* Donut */}
                  <div
                    className="relative h-16 w-16 shrink-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(#10b981 0% 74%, #3b82f6 74% 82%, #f59e0b 82% 87%, #ef4444 87% 97%, #94a3b8 97% 100%)",
                    }}
                  >
                    <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white leading-none text-slate-900">
                      <span className="text-[11px] font-bold">140</span>
                      <span className="text-[6px] text-slate-400">members</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 space-y-1">
                    {[
                      { label: "Active", count: "104", pct: "74%", color: "#10b981" },
                      { label: "Trial", count: "11", pct: "8%", color: "#3b82f6" },
                      { label: "Frozen", count: "7", pct: "5%", color: "#f59e0b" },
                      { label: "Expired", count: "14", pct: "10%", color: "#ef4444" },
                      { label: "Cancelled", count: "4", pct: "3%", color: "#94a3b8" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5 text-[10px]">
                        <span
                          className="h-2 w-2 shrink-0 rounded-sm"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-slate-600">{s.label}</span>
                        <span className="ml-auto font-semibold text-slate-700">
                          {s.count}
                        </span>
                        <span className="w-6 text-right text-slate-400">
                          {s.pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

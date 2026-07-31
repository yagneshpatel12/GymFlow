import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Play,
  Sparkles,
  TrendingUp,
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
          app.gymflow.com/dashboard
        </div>
      </div>

      <div className="flex">
        {/* Mini sidebar */}
        <aside className="hidden w-48 shrink-0 flex-col gap-1 border-r border-slate-100 p-3 sm:flex">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Users, label: "Members" },
            { icon: CalendarDays, label: "Class Schedule" },
            { icon: TrendingUp, label: "Attendance" },
            { icon: CreditCard, label: "Plans" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium ${
                item.active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 bg-canvas p-4 text-left sm:p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-slate-900">
              Welcome back, Alex
            </div>
            <div className="text-xs text-slate-500">
              Here&apos;s how Ironworks Fitness is doing.
            </div>
          </div>

          {/* KPI tiles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Members", value: "1,284", delta: "+12%" },
              { label: "Revenue", value: "$41.2k", delta: "+8%" },
              { label: "Check-ins", value: "312", delta: "+5%" },
              { label: "Active rate", value: "74%", delta: "" },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-lg border border-slate-200/80 bg-white p-3"
              >
                <div className="text-[11px] text-slate-400">{k.label}</div>
                <div className="mt-0.5 text-lg font-bold text-slate-900">
                  {k.value}
                </div>
                {k.delta && (
                  <div className="text-[11px] font-semibold text-emerald-600">
                    {k.delta}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chart + list */}
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200/80 bg-white p-3 lg:col-span-2">
              <div className="mb-2 text-xs font-semibold text-slate-700">
                Attendance trends
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
                New members
              </div>
              <div className="space-y-2">
                {["Maya H.", "Diego R.", "Nina K."].map((n, i) => (
                  <div key={n} className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                        ["bg-brand-100 text-brand-700", "bg-amber-100 text-amber-700", "bg-sky-100 text-sky-700"][i]
                      }`}
                    >
                      {n[0]}
                    </span>
                    <span className="text-xs text-slate-600">{n}</span>
                    <span className="ml-auto text-[10px] text-slate-400">
                      just now
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

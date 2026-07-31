import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CreditCard,
  QrCode,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";

const FEATURES = [
  {
    icon: Users,
    title: "Member management",
    desc: "A searchable, filterable roster with full profiles, membership status, payment method and history.",
  },
  {
    icon: CalendarDays,
    title: "Class scheduling",
    desc: "A polished weekly calendar. Drag-free scheduling, capacity tracking and trainer assignment at a glance.",
  },
  {
    icon: QrCode,
    title: "Attendance & check-in",
    desc: "Fast front-desk check-ins by QR, app or kiosk - with live foot-traffic trends and peak-hour insights.",
  },
  {
    icon: UserCog,
    title: "Trainer management",
    desc: "Manage your coaching team, specialties and ratings, and see who's assigned to which members and classes.",
  },
  {
    icon: CreditCard,
    title: "Membership plans",
    desc: "Define your tiers, pricing and perks. Track revenue per plan and how members pay - cash, UPI, card or bank.",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    desc: "Revenue, attendance trends, active vs churned members - the numbers that actually run your business.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Add your gym & members",
    desc: "Import or add members in seconds. Every new account starts with sample data so it's never a blank screen.",
  },
  {
    icon: CalendarDays,
    title: "Build your schedule",
    desc: "Set up your weekly classes, assign trainers, and define the membership plans you offer.",
  },
  {
    icon: BarChart3,
    title: "Run on autopilot",
    desc: "Check members in, track attendance and revenue, and watch your gym's health on one live dashboard.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Social proof */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-slate-400">
            Trusted by forward-thinking gyms & studios
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-400">
            {["Ironworks", "PulseFit", "Apex Athletic", "CoreLab", "Summit Strength", "RepublicGym"].map(
              (name) => (
                <span key={name} className="text-lg font-bold tracking-tight opacity-70">
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-brand-600">Features</p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to run your gym
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Six powerful modules that replace the spreadsheets, sticky notes
              and disconnected tools you use today.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-slate-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-brand-600">How it works</p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Up and running in minutes
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mx-auto mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <Pricing />

      {/* CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-6 py-16 text-center shadow-xl sm:px-12">
            <div className="bg-dots absolute inset-0 opacity-10" />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to run your gym on autopilot?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Jump straight into a fully populated live demo - no signup, no
                credit card. See exactly how it works in 30 seconds.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-brand-700 shadow-sm transition-transform hover:scale-[1.02]"
                >
                  View live demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Start free trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

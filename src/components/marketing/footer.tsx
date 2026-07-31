import Link from "next/link";
import { Dumbbell, ExternalLink, Play } from "lucide-react";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
      { label: "Live demo", href: "/login" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "https://yagneshpateldev.com", external: true },
      { label: "Privacy", href: "#" },
    ],
  },
];

const STACK = ["Next.js", "TypeScript", "MongoDB", "Tailwind"];

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-slate-200 bg-gradient-to-b from-white to-slate-50/70">
      {/* Thin brand accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-brand">
                <Dumbbell className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                GymFlow
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              The all-in-one platform for modern gyms and fitness studios.
            </p>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/login"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-semibold text-white shadow-brand transition-colors hover:bg-brand-700"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Live demo
              </Link>
              <a
                href="https://yagneshpateldev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Developer portfolio <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Tech stack */}
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Built with
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {STACK.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-brand-600"
                      >
                        {l.label}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-slate-500 transition-colors hover:text-brand-600"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} GymFlow. A portfolio project.</p>
          <p>
            Designed &amp; built by{" "}
            <a
              href="https://yagneshpateldev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              Yagnesh Patel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

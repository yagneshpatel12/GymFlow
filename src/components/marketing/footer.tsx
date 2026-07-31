import Link from "next/link";
import { Dumbbell } from "lucide-react";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Dumbbell className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                GymFlow
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              The all-in-one platform for modern gyms and fitness studios.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-800">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} GymFlow. A portfolio project.</p>
          <p>
            Designed &amp; built by{" "}
            <a href="https://yagneshpateldev.com" className="font-medium text-slate-600 hover:text-brand-600">
              Yagnesh Patel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

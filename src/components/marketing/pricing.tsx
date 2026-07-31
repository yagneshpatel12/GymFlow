"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    monthly: 29,
    tagline: "For new gyms & studios finding their feet.",
    features: [
      "Up to 150 members",
      "Class scheduling & attendance",
      "1 staff account",
      "Email support",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Growth",
    monthly: 79,
    tagline: "For growing gyms that want the full toolkit.",
    features: [
      "Up to 750 members",
      "Everything in Starter",
      "Advanced analytics & reports",
      "5 staff accounts",
      "Priority support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Pro",
    monthly: 199,
    tagline: "For multi-location gyms & franchises.",
    features: [
      "Unlimited members",
      "Everything in Growth",
      "Multi-location support",
      "API access & integrations",
      "Dedicated account manager",
    ],
    cta: "Talk to sales",
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-brand-600">Pricing</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple pricing that scales with your gym
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !annual ? "bg-slate-900 text-white" : "text-slate-500",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                annual ? "bg-slate-900 text-white" : "text-slate-500",
              )}
            >
              Annual
              <span className="ml-1.5 text-xs text-emerald-500">−17%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const price = annual ? Math.round(tier.monthly * 10) / 12 : tier.monthly;
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm",
                  tier.popular
                    ? "border-brand-300 shadow-lg ring-1 ring-brand-200"
                    : "border-slate-200",
                )}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-brand">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{tier.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">
                    ${annual ? Math.round(price) : price}
                  </span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {annual ? "billed annually" : "billed monthly"}
                </p>

                <Link
                  href="/signup"
                  className={cn(
                    "mt-6 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all",
                    tier.popular
                      ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-brand"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {tier.cta}
                </Link>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

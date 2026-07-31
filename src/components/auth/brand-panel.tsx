"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = 2;
const DURATION = 5200; // ms per slide

/**
 * Auth left panel. Loops two "clips" behind the branding:
 *  0 - the gym battle-rope video
 *  1 - a desktop monitor showing a real screenshot of the GymFlow dashboard
 * The caption crossfades to match the active clip.
 */
export function AuthBrandPanel() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES), DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Clip 1: gym video */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          slide === 1 ? "opacity-100" : "opacity-0",
        )}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/auth/gym-c.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/auth/gym-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Clip 0: dashboard on a desktop monitor (shown first) */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          slide === 0 ? "opacity-100" : "opacity-0",
        )}
      >
        <DashboardShot />
      </div>

      {/* Readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/45" />

      {/* Logo + (dashboard-clip caption, sits at top so it never covers the monitor) */}
      <div className="relative">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-brand-400">
            GymFlow
          </span>
        </Link>
      </div>

      {/* Testimonial - only during the gym clip (fades out so the monitor is clear) */}
      <div
        className={cn(
          "relative max-w-md transition-opacity duration-700",
          slide === 1 ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mb-6 flex gap-1 text-accent-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>
        <blockquote className="text-balance text-2xl font-medium leading-snug text-white">
          “GymFlow replaced three tools and a spreadsheet. Check-ins, classes and
          billing finally live in one place - our front desk runs itself.”
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-semibold text-white">
            JD
          </span>
          <div>
            <div className="font-semibold text-white">Jordan Diaz</div>
            <div className="text-sm text-brand-200">Owner, Ironworks Fitness</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative flex items-center gap-8 text-sm text-brand-200">
        <div>
          <div className="text-2xl font-bold text-brand-400">2,400+</div>
          gyms onboarded
        </div>
        <div>
          <div className="text-2xl font-bold text-brand-400">99.9%</div>
          uptime
        </div>
        <div>
          <div className="text-2xl font-bold text-brand-400">4.9/5</div>
          avg. rating
        </div>
      </div>
    </aside>
  );
}

/* ── The "dashboard on a desk" clip: a desktop monitor with a real screenshot ── */
function DashboardShot() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gym-floor backdrop, heavily darkened so the monitor pops */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/auth/gym-a.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/88 via-slate-950/82 to-slate-950/92" />
      <div className="absolute left-1/2 top-[34%] h-80 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      {/* subtle desk surface */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white/[0.04] to-transparent" />

      <div className="animate-slow-zoom absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          {/* Monitor screen */}
          <div className="rounded-xl border border-slate-700/80 bg-slate-900 p-2 shadow-2xl ring-1 ring-black/40">
            <div className="overflow-hidden rounded-lg ring-1 ring-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/auth/dashboard.png"
                alt="The GymFlow dashboard"
                className="block w-full"
              />
            </div>
          </div>
          {/* Stand */}
          <div className="mx-auto h-5 w-24 bg-gradient-to-b from-slate-600 to-slate-800" />
          <div className="mx-auto h-2.5 w-48 rounded-full bg-gradient-to-b from-slate-500 to-slate-700 shadow-[0_12px_24px_rgba(0,0,0,0.55)]" />
        </div>
      </div>
    </div>
  );
}

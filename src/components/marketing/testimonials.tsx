import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
  quote: string;
  name: string;
  initials: string;
  role: string;
  accent: keyof typeof ACCENT;
};

const ACCENT = {
  brand: "bg-brand-100 text-brand-700",
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
} as const;

const REVIEWS: Review[] = [
  {
    quote:
      "GymFlow replaced three tools and a spreadsheet. Check-ins, classes and billing finally live in one place, our front desk runs itself.",
    name: "Jordan Diaz",
    initials: "JD",
    role: "Owner, Ironworks Fitness",
    accent: "brand",
  },
  {
    quote:
      "Onboarding a new member takes under a minute now. Their profile, plan and first check-in are all one smooth flow.",
    name: "Mara Voss",
    initials: "MV",
    role: "Studio Manager, PulseFit",
    accent: "sky",
  },
  {
    quote:
      "The class calendar is the cleanest I have used. Capacity and trainer assignments are obvious at a single glance.",
    name: "Devon Clarke",
    initials: "DC",
    role: "Head Coach, Apex Athletic",
    accent: "violet",
  },
  {
    quote:
      "Revenue by plan finally makes sense. I can see exactly which tiers are growing without exporting a thing.",
    name: "Priya Nair",
    initials: "PN",
    role: "Owner, CoreLab",
    accent: "amber",
  },
  {
    quote:
      "Front desk check-ins are instant. The peak-hour trends told us exactly when to put a second coach on the floor.",
    name: "Marcus Bell",
    initials: "MB",
    role: "Founder, Summit Strength",
    accent: "rose",
  },
  {
    quote:
      "Switching off spreadsheets felt scary. It took one afternoon and the team never looked back.",
    name: "Elena Rossi",
    initials: "ER",
    role: "Operations, RepublicGym",
    accent: "brand",
  },
  {
    quote:
      "The before and after gallery is a quiet retention weapon. Members love watching their own progress add up.",
    name: "Tomas Herrera",
    initials: "TH",
    role: "Owner, Iron & Oak",
    accent: "sky",
  },
  {
    quote:
      "Trainer profiles, ratings and assignments in one place. Scheduling stopped being a chaotic group chat.",
    name: "Aisha Khan",
    initials: "AK",
    role: "Manager, MoveWell Studio",
    accent: "violet",
  },
  {
    quote:
      "Beautiful, fast, and it just works. It looks like software that costs five times as much.",
    name: "Ryan Cole",
    initials: "RC",
    role: "Owner, Grit House",
    accent: "amber",
  },
];

export function Testimonials() {
  const rowA = REVIEWS.slice(0, 5);
  const rowB = REVIEWS.slice(5);

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold text-brand-600">
          Loved by gym owners
        </p>
        <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Built for gyms, loved by the people who run them
        </h2>
        <p className="text-pretty mt-4 text-lg text-slate-600">
          Owners, managers and coaches use GymFlow to run the front desk, fill
          classes and keep members coming back.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
          <Stars n={5} />
          <span className="text-sm font-semibold text-slate-900">4.9/5</span>
          <span className="text-sm text-slate-400">from 200+ gyms</span>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="mt-14 flex flex-col gap-5">
        <MarqueeRow items={rowA} direction="left" />
        <MarqueeRow items={rowB} direction="right" />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Review[];
  direction: "left" | "right";
}) {
  return (
    <div className="marquee-row group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className={cn(
          "marquee-track flex w-max",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
        )}
      >
        {/* Rendered twice for a seamless loop */}
        {[...items, ...items].map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="mr-5 flex w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md sm:w-[360px]">
      <div>
        <Stars n={5} />
        <blockquote className="mt-4 text-[15px] leading-relaxed text-slate-700">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            ACCENT[review.accent],
          )}
        >
          {review.initials}
        </span>
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {review.name}
          </div>
          <div className="text-xs text-slate-500">{review.role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

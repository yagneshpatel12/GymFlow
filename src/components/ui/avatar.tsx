import { cn, hashIndex, initials } from "@/lib/utils";

const palette = [
  "bg-brand-100 text-brand-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
];

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export function Avatar({
  name,
  size = "md",
  className,
  src,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  /** Optional photo id - served from /api/photos/[id]. Falls back to initials. */
  src?: string | null;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/photos/${src}`}
        alt={name}
        className={cn(
          "inline-block shrink-0 rounded-full object-cover ring-2 ring-white",
          sizes[size],
          className,
        )}
      />
    );
  }

  const tone = palette[hashIndex(name, palette.length)];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white",
        sizes[size],
        tone,
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

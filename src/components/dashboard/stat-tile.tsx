import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn, formatDelta } from "@/lib/utils";

export function StatTile({
  label,
  value,
  delta,
  deltaLabel = "vs last month",
  icon: Icon,
  invertDelta = false,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  invertDelta?: boolean;
}) {
  const hasDelta = typeof delta === "number";
  const positive = (delta ?? 0) >= 0;
  const good = invertDelta ? !positive : positive;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </span>
      </div>
      {hasDelta && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              good
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {formatDelta(Math.abs(delta!))}
          </span>
          <span className="text-slate-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

"use client";

import type { MemberStatus } from "@/lib/types";

// Validated categorical/status palette (see dataviz validation).
export const STATUS_COLORS: Record<MemberStatus, string> = {
  active: "#059669",
  trial: "#0284c7",
  frozen: "#d97706",
  expired: "#e11d48",
  cancelled: "#64748b",
};

export const BRAND = "#10b981";

type TooltipRow = { label: string; value: string; color?: string };

export function ChartTooltip({
  active,
  title,
  rows,
}: {
  active?: boolean;
  title?: string;
  rows?: TooltipRow[];
}) {
  if (!active || !rows?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      {title && (
        <div className="mb-1 text-xs font-medium text-slate-500">{title}</div>
      )}
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          {r.color && (
            <span
              className="h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: r.color }}
            />
          )}
          <span className="font-semibold text-slate-900">{r.value}</span>
          <span className="text-slate-500">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

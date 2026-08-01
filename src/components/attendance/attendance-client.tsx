"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Loader2,
  Search,
  Smartphone,
  QrCode,
  Hand,
  MonitorSmartphone,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/members/status-badge";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { ATTENDANCE_METHODS, type AttendanceMethod } from "@/lib/types";
import type { CheckinMember, RecentCheckin } from "@/lib/data/attendance";

const METHOD_META: Record<
  AttendanceMethod,
  { label: string; icon: typeof QrCode }
> = {
  qr: { label: "QR scan", icon: QrCode },
  manual: { label: "Manual", icon: Hand },
  app: { label: "Mobile app", icon: Smartphone },
  kiosk: { label: "Kiosk", icon: MonitorSmartphone },
};

export function AttendanceClient({
  members,
  recent: initialRecent,
}: {
  members: CheckinMember[];
  recent: RecentCheckin[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState<AttendanceMethod>("manual");
  const [recent, setRecent] = useState(initialRecent);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [justChecked, setJustChecked] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [members, query]);

  async function checkIn(m: CheckinMember) {
    setPendingId(m.id);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: m.id, method }),
      });
      const data = await res.json();
      if (res.ok && data.checkin) {
        setRecent((r) => [data.checkin, ...r].slice(0, 40));
        setJustChecked(m.id);
        setQuery("");
        setTimeout(() => setJustChecked(null), 2200);
        toast.success("Checked in", `${m.name} was checked in.`);
        router.refresh();
      } else {
        toast.error("Check-in failed", data.error ?? "Please try again.");
      }
    } finally {
      setPendingId(null);
    }
  }

  async function undo(id: string) {
    const entry = recent.find((c) => c.id === id);
    setRecent((r) => r.filter((c) => c.id !== id));
    await fetch(`/api/attendance/${id}`, { method: "DELETE" });
    toast.success(
      "Check-in removed",
      entry ? `${entry.memberName}'s check-in was undone.` : undefined,
    );
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Check-in panel */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-slate-900">
            Check in a member
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Search by name or email, then tap to check in.
          </p>

          {/* Method selector */}
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {ATTENDANCE_METHODS.map((m) => {
              const Meta = METHOD_META[m];
              return (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors",
                    method === m
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50",
                  )}
                >
                  <Meta.icon className="h-4 w-4" />
                  {Meta.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member…"
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus-visible:outline-none"
            />
          </div>

          {/* Results */}
          <div className="mt-3 space-y-1.5">
            {results.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-2 pr-2.5"
              >
                <Avatar name={m.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {m.name}
                  </div>
                  <div className="truncate text-xs text-slate-500">{m.email}</div>
                </div>
                <button
                  onClick={() => checkIn(m)}
                  disabled={pendingId === m.id}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-[13px] font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                >
                  {pendingId === m.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" /> Check in
                    </>
                  )}
                </button>
              </div>
            ))}
            {query && results.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                No members match “{query}”.
              </p>
            )}
            {!query && (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                  <QrCode className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-400">
                  Start typing to find a member.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Recent check-ins
            </h2>
            <Badge tone="neutral">{recent.length} shown</Badge>
          </div>
          <ul className="divide-y divide-slate-50">
            {recent.map((c) => {
              const Meta = METHOD_META[c.method];
              return (
                <li
                  key={c.id}
                  className={cn(
                    "group flex items-center gap-3 px-5 py-3 transition-colors",
                    justChecked === c.memberId && "bg-emerald-50/50",
                  )}
                >
                  <Avatar name={c.memberName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-900">
                        {c.memberName}
                      </span>
                      <StatusBadge status={c.memberStatus} />
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(c.at), { addSuffix: true })}
                    </div>
                  </div>
                  <Badge tone="neutral" className="hidden sm:inline-flex">
                    <Meta.icon className="h-3 w-3" /> {Meta.label}
                  </Badge>
                  <button
                    onClick={() => undo(c.id)}
                    className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                    title="Undo check-in"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
            {recent.length === 0 && (
              <li className="py-12 text-center text-sm text-slate-400">
                No check-ins yet today.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

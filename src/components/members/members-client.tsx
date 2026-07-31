"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Dropdown } from "@/components/ui/dropdown";
import { StatusBadge } from "@/components/members/status-badge";
import { MemberFormModal } from "@/components/members/member-form-modal";
import { cn } from "@/lib/utils";
import { MEMBER_STATUSES, MEMBER_STATUS_META, type MemberStatus } from "@/lib/types";
import type { MemberRow, PlanOption, TrainerOption } from "@/lib/data/members";

const PAGE_SIZE = 10;

export function MembersClient({
  members,
  plans,
  trainers,
  stats,
}: {
  members: MemberRow[];
  plans: PlanOption[];
  trainers: TrainerOption[];
  stats: Record<string, number>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<MemberStatus | "all">("all");
  const [planId, setPlanId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<MemberRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (planId !== "all" && m.planId !== planId) return false;
      if (
        q &&
        !m.name.toLowerCase().includes(q) &&
        !m.email.toLowerCase().includes(q) &&
        !m.phone.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [members, query, status, planId]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/members/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const statusTabs: Array<{ key: MemberStatus | "all"; label: string; count: number }> = [
    { key: "all", label: "All", count: stats.total ?? members.length },
    ...MEMBER_STATUSES.map((s) => ({
      key: s,
      label: MEMBER_STATUS_META[s].label,
      count: stats[s] ?? 0,
    })),
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => resetPage(setQuery)(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus-visible:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            value={planId}
            onChange={resetPage(setPlanId)}
            className="w-40"
            options={[
              { value: "all", label: "All plans" },
              ...plans.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add member
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 py-2">
        {statusTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => resetPage(setStatus)(t.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              status === t.key
                ? "bg-brand-50 text-brand-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                status === t.key
                  ? "bg-brand-100 text-brand-700"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="whitespace-nowrap px-5 py-3 font-medium">Member</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Plan</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Status</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Joined</th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">Last visit</th>
              <th className="w-12 px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pageRows.map((m) => (
              <tr
                key={m.id}
                onClick={() => router.push(`/members/${m.id}`)}
                className="group cursor-pointer transition-colors hover:bg-slate-50/70"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" src={m.profilePhotoId || undefined} />
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900">{m.name}</div>
                      <div className="truncate text-xs text-slate-500">
                        {m.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <Badge tone="neutral">{m.planName}</Badge>
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                  {format(new Date(m.joinDate), "MMM d, yyyy")}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                  {m.lastVisit
                    ? formatDistanceToNow(new Date(m.lastVisit), { addSuffix: true })
                    : "-"}
                </td>
                <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 data-[open=true]:opacity-100"
                      data-open={menuId === m.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuId === m.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuId(null)}
                        />
                        <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                          <MenuItem
                            icon={UserRound}
                            label="View profile"
                            onClick={() => router.push(`/members/${m.id}`)}
                          />
                          <MenuItem
                            icon={Pencil}
                            label="Edit"
                            onClick={() => {
                              setEditMember(m);
                              setMenuId(null);
                            }}
                          />
                          <MenuItem
                            icon={Trash2}
                            label="Delete"
                            danger
                            onClick={() => {
                              setDeleteTarget(m);
                              setMenuId(null);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageRows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <p className="font-medium text-slate-900">No members found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          <span>
            Showing{" "}
            <span className="font-medium text-slate-700">
              {(current - 1) * PAGE_SIZE + 1}-
              {Math.min(current * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium text-slate-700">{filtered.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={current === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-slate-600">
              {current} / {pageCount}
            </span>
            <button
              disabled={current === pageCount}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <MemberFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => router.refresh()}
        plans={plans}
        trainers={trainers}
      />
      <MemberFormModal
        open={Boolean(editMember)}
        onClose={() => setEditMember(null)}
        onSaved={() => router.refresh()}
        plans={plans}
        trainers={trainers}
        member={editMember}
      />
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete member"
        description={`Remove ${deleteTarget?.name} and their records? This can't be undone.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This will permanently remove the member from {""}
          your roster.
        </p>
      </Modal>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
        danger
          ? "text-rose-600 hover:bg-rose-50"
          : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

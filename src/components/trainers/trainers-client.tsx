"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TrainerFormModal } from "@/components/trainers/trainer-form-modal";
import { cn } from "@/lib/utils";
import type { TrainerRow } from "@/lib/data/trainers";

const STATUS_TONE = {
  active: "success",
  off: "neutral",
  away: "warning",
} as const;
const STATUS_LABEL = { active: "Active", off: "Off today", away: "Away" } as const;

export function TrainersClient({ trainers }: { trainers: TrainerRow[] }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editTrainer, setEditTrainer] = useState<TrainerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrainerRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/trainers/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add trainer
        </Button>
      </div>

      {trainers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Plus className="h-6 w-6" />
          </div>
          <p className="font-medium text-slate-900">No trainers yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Add your first coach to start assigning classes and members.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {trainers.map((t) => (
          <div
            key={t.id}
            className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={t.name} size="lg" />
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.title}</div>
                </div>
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setMenuId(menuId === t.id ? null : t.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuId === t.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                    <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => {
                          setEditTrainer(t);
                          setMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(t);
                          setMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Badge tone={STATUS_TONE[t.status]} dot>
                {STATUS_LABEL[t.status]}
              </Badge>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {t.rating.toFixed(1)}
              </span>
            </div>

            {t.specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {t.bio && (
              <p className="mt-3 line-clamp-2 text-sm text-slate-500">{t.bio}</p>
            )}

            <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {t.email}
              </span>
              {t.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {t.phone}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <Stat icon={Users} value={t.assignedMembers} label="members" />
              <Stat icon={CalendarDays} value={t.weeklyClasses} label="classes/wk" />
            </div>
          </div>
        ))}
      </div>

      <TrainerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => router.refresh()}
      />
      <TrainerFormModal
        open={Boolean(editTrainer)}
        onClose={() => setEditTrainer(null)}
        onSaved={() => router.refresh()}
        trainer={editTrainer}
      />
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Remove trainer"
        description={`Remove ${deleteTarget?.name}? They'll be unassigned from members and classes.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This can&apos;t be undone. Members and classes assigned to{" "}
          {deleteTarget?.name} will become unassigned.
        </p>
      </Modal>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <div className={cn("text-sm font-semibold text-slate-900")}>{value}</div>
        <div className="text-[11px] text-slate-400">{label}</div>
      </div>
    </div>
  );
}

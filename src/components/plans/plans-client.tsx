"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Star, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlanFormModal } from "@/components/plans/plan-form-modal";
import { useToast } from "@/components/ui/toast";
import { RowMenu } from "@/components/ui/row-menu";
import { cn, formatCurrency } from "@/lib/utils";
import type { PlanRow } from "@/lib/data/plans";

const ACCENT: Record<string, { text: string; bar: string; ring: string }> = {
  brand: { text: "text-brand-600", bar: "bg-brand-500", ring: "ring-brand-200" },
  sky: { text: "text-sky-600", bar: "bg-sky-500", ring: "ring-sky-200" },
  violet: { text: "text-violet-600", bar: "bg-violet-500", ring: "ring-violet-200" },
  amber: { text: "text-amber-600", bar: "bg-amber-500", ring: "ring-amber-200" },
  rose: { text: "text-rose-600", bar: "bg-rose-500", ring: "ring-rose-200" },
  neutral: { text: "text-slate-700", bar: "bg-slate-400", ring: "ring-slate-200" },
};

const intervalLabel = (i: string) =>
  i === "annual" ? "/year" : i === "quarterly" ? "/quarter" : "/month";

export function PlansClient({ plans }: { plans: PlanRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<PlanRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PlanRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/plans/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        const message = data.error ?? "Could not delete plan";
        setDeleteError(message);
        toast.error("Could not delete plan", message);
        return;
      }
      toast.success("Plan deleted", `The ${deleteTarget.name} plan was removed.`);
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
          <Plus className="h-4 w-4" /> Add plan
        </Button>
      </div>

      {plans.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Plus className="h-6 w-6" />
          </div>
          <p className="font-medium text-slate-900">No plans yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first membership tier for members to sign up to.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => {
          const accent = ACCENT[p.color] ?? ACCENT.brand;
          return (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md",
                p.isPopular ? "border-brand-300 ring-1 ring-brand-200" : "border-slate-200/80",
                !p.isActive && "opacity-70",
              )}
            >
              <div className={cn("h-1 w-full", accent.bar)} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    {p.isPopular && (
                      <Badge tone="brand">
                        <Star className="h-3 w-3 fill-current" /> Popular
                      </Badge>
                    )}
                    {!p.isActive && <Badge tone="neutral">Inactive</Badge>}
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <RowMenu
                      width={144}
                      items={[
                        {
                          icon: Pencil,
                          label: "Edit",
                          onClick: () => setEditPlan(p),
                        },
                        {
                          icon: Trash2,
                          label: "Delete",
                          danger: true,
                          onClick: () => {
                            setDeleteError(null);
                            setDeleteTarget(p);
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className={cn("text-3xl font-bold tracking-tight", accent.text)}>
                    {formatCurrency(p.price)}
                  </span>
                  <span className="text-sm text-slate-400">{intervalLabel(p.interval)}</span>
                </div>
                {p.description && (
                  <p className="mt-2 text-sm text-slate-500">{p.description}</p>
                )}

                {p.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <Check className="h-3 w-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Users className="h-4 w-4" /> {p.totalMembers} members
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(p.mrr)}/mo
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PlanFormModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={() => router.refresh()} />
      <PlanFormModal
        open={Boolean(editPlan)}
        onClose={() => setEditPlan(null)}
        onSaved={() => router.refresh()}
        plan={editPlan}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete plan"
        description={`Delete the ${deleteTarget?.name} plan?`}
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
          Plans with active members can&apos;t be deleted until those members are
          moved to another plan.
        </p>
        {deleteError && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {deleteError}
          </p>
        )}
      </Modal>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { useToast } from "@/components/ui/toast";
import { planInput } from "@/lib/validation";
import { validateForm } from "@/lib/form";
import { PLAN_INTERVALS } from "@/lib/types";
import type { PlanRow } from "@/lib/data/plans";

const COLORS = ["brand", "sky", "violet", "amber", "rose", "neutral"];

function initial(plan?: PlanRow | null) {
  return {
    name: plan?.name ?? "",
    price: String(plan?.price ?? 49),
    interval: plan?.interval ?? "monthly",
    description: plan?.description ?? "",
    features: plan?.features?.join("\n") ?? "",
    color: plan?.color ?? "brand",
    isPopular: plan?.isPopular ?? false,
    isActive: plan?.isActive ?? true,
  };
}

export function PlanFormModal({
  open,
  onClose,
  onSaved,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  plan?: PlanRow | null;
}) {
  const editing = Boolean(plan);
  const toast = useToast();
  const [form, setForm] = useState(() => initial(plan));
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [lastKey, setLastKey] = useState<string | null>(null);
  const key = `${open}-${plan?.id ?? "new"}`;
  if (open && key !== lastKey) {
    setForm(initial(plan));
    setError(null);
    setErrors({});
    setLastKey(key);
  }

  const clearError = (k: string) =>
    setErrors((e) => {
      if (!e[k]) return e;
      const next = { ...e };
      delete next[k];
      return next;
    });

  const set =
    (k: keyof ReturnType<typeof initial>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      clearError(k);
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const pick =
    (k: keyof ReturnType<typeof initial>) => (v: string) => {
      clearError(k);
      setForm((f) => ({ ...f, [k]: v }));
    };

  async function submit() {
    const check = validateForm(planInput, form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setError(null);
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/plans/${plan!.id}` : "/api/plans", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save plan");
      toast.success(
        editing ? "Plan updated" : "Plan created",
        `The ${form.name} plan was saved.`,
      );
      onSaved();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save plan";
      setError(message);
      toast.error(editing ? "Could not update plan" : "Could not create plan", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit plan" : "Add plan"}
      description="Define a membership tier your members can sign up for."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editing ? (
              "Save changes"
            ) : (
              "Add plan"
            )}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name" required>Plan name</Label>
          <Input id="p-name" value={form.name} onChange={set("name")} placeholder="Standard" aria-invalid={!!errors.name} />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label>Accent color</Label>
          <Dropdown
            value={form.color}
            onChange={pick("color")}
            options={COLORS.map((c) => ({
              value: c,
              label: c.charAt(0).toUpperCase() + c.slice(1),
            }))}
          />
        </div>
        <div>
          <Label htmlFor="p-price" required>Price (USD)</Label>
          <Input id="p-price" type="number" min={0} value={form.price} onChange={set("price")} aria-invalid={!!errors.price} />
          <FieldError>{errors.price}</FieldError>
        </div>
        <div>
          <Label>Billing interval</Label>
          <Dropdown
            value={form.interval}
            onChange={pick("interval")}
            options={PLAN_INTERVALS.map((i) => ({
              value: i,
              label: i.charAt(0).toUpperCase() + i.slice(1),
            }))}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-desc" required>Description</Label>
          <Input id="p-desc" value={form.description} onChange={set("description")} placeholder="Our most popular plan for consistent members." aria-invalid={!!errors.description} />
          <FieldError>{errors.description}</FieldError>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-features">Features</Label>
          <Textarea id="p-features" value={form.features} onChange={set("features")} placeholder={"Unlimited gym access\nUnlimited group classes\n1 PT session / month"} />
          <p className="mt-1 text-xs text-slate-400">One feature per line.</p>
        </div>
        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Mark as most popular
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Active (available to new members)
          </label>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { useToast } from "@/components/ui/toast";
import { trainerInput } from "@/lib/validation";
import { validateForm } from "@/lib/form";
import { TRAINER_STATUSES } from "@/lib/types";
import type { TrainerRow } from "@/lib/data/trainers";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  off: "Off today",
  away: "Away",
};

function initial(trainer?: TrainerRow | null) {
  return {
    name: trainer?.name ?? "",
    email: trainer?.email ?? "",
    phone: trainer?.phone ?? "",
    title: trainer?.title ?? "Personal Trainer",
    specialties: trainer?.specialties?.join(", ") ?? "",
    bio: trainer?.bio ?? "",
    rating: String(trainer?.rating ?? 5),
    status: trainer?.status ?? "active",
  };
}

export function TrainerFormModal({
  open,
  onClose,
  onSaved,
  trainer,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  trainer?: TrainerRow | null;
}) {
  const editing = Boolean(trainer);
  const toast = useToast();
  const [form, setForm] = useState(() => initial(trainer));
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [lastKey, setLastKey] = useState<string | null>(null);
  const key = `${open}-${trainer?.id ?? "new"}`;
  if (open && key !== lastKey) {
    setForm(initial(trainer));
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
    const check = validateForm(trainerInput, form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setError(null);
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/trainers/${trainer!.id}` : "/api/trainers",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            specialties: form.specialties,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save trainer");
      toast.success(
        editing ? "Trainer updated" : "Trainer added",
        editing
          ? `${form.name}'s profile was saved.`
          : `${form.name} was added to your team.`,
      );
      onSaved();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save trainer";
      setError(message);
      toast.error(editing ? "Could not update trainer" : "Could not add trainer", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit trainer" : "Add trainer"}
      description="Coaches who run classes and train your members."
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
              "Add trainer"
            )}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="t-name" required>Full name</Label>
          <Input id="t-name" value={form.name} onChange={set("name")} placeholder="Marcus Reyes" aria-invalid={!!errors.name} />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="t-title" required>Title</Label>
          <Input id="t-title" value={form.title} onChange={set("title")} placeholder="Head Strength Coach" aria-invalid={!!errors.title} />
          <FieldError>{errors.title}</FieldError>
        </div>
        <div>
          <Label htmlFor="t-email" required>Email</Label>
          <Input id="t-email" type="email" value={form.email} onChange={set("email")} placeholder="coach@gym.com" aria-invalid={!!errors.email} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="t-phone">Phone</Label>
          <Input id="t-phone" value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" />
        </div>
        <div>
          <Label>Rating</Label>
          <Dropdown
            value={form.rating}
            onChange={pick("rating")}
            options={["5", "4.5", "4", "3.5", "3"].map((r) => ({
              value: r,
              label: `${r} ★`,
            }))}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Dropdown
            value={form.status}
            onChange={pick("status")}
            options={TRAINER_STATUSES.map((s) => ({
              value: s,
              label: STATUS_LABEL[s],
            }))}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="t-spec">Specialties</Label>
          <Input id="t-spec" value={form.specialties} onChange={set("specialties")} placeholder="Strength, HIIT, Mobility" />
          <p className="mt-1 text-xs text-slate-400">Separate with commas.</p>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="t-bio">Bio</Label>
          <Textarea id="t-bio" value={form.bio} onChange={set("bio")} placeholder="A short intro shown on the trainer card." />
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

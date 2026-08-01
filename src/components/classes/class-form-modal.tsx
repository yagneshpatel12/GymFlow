"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { useToast } from "@/components/ui/toast";
import { classInput } from "@/lib/validation";
import { validateForm } from "@/lib/form";
import {
  CLASS_TYPES,
  CLASS_TYPE_META,
  DAYS,
  type ClassType,
} from "@/lib/types";
import type { ClassRow } from "@/lib/data/classes";
import type { TrainerOption } from "@/lib/data/members";

const to12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
};

// 15-minute time slots from 5:00 AM to 10:00 PM for the custom time picker.
const TIME_SLOTS: { value: string; label: string }[] = (() => {
  const out: { value: string; label: string }[] = [];
  for (let h = 5; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      out.push({ value, label: to12(value) });
    }
  }
  return out;
})();

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  trainers: TrainerOption[];
  gymClass?: ClassRow | null;
  defaultDay?: number;
};

function initial(gymClass?: ClassRow | null, defaultDay = 1) {
  return {
    title: gymClass?.title ?? "",
    type: (gymClass?.type ?? "strength") as ClassType,
    trainerId: gymClass?.trainerId ?? "",
    dayOfWeek: String(gymClass?.dayOfWeek ?? defaultDay),
    startTime: gymClass?.startTime ?? "18:00",
    durationMin: String(gymClass?.durationMin ?? 60),
    capacity: String(gymClass?.capacity ?? 20),
    enrolled: String(gymClass?.enrolled ?? 0),
    room: gymClass?.room ?? "Studio A",
    intensity: gymClass?.intensity ?? "medium",
  };
}

export function ClassFormModal({
  open,
  onClose,
  onSaved,
  trainers,
  gymClass,
  defaultDay,
}: Props) {
  const editing = Boolean(gymClass);
  const toast = useToast();
  const [form, setForm] = useState(() => initial(gymClass, defaultDay));
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [lastKey, setLastKey] = useState<string | null>(null);
  const key = `${open}-${gymClass?.id ?? "new"}-${defaultDay}`;
  if (open && key !== lastKey) {
    setForm(initial(gymClass, defaultDay));
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearError(k);
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const pick =
    (k: keyof ReturnType<typeof initial>) => (v: string) => {
      clearError(k);
      setForm((f) => ({ ...f, [k]: v }));
    };

  async function submit() {
    const check = validateForm(classInput, form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setError(null);
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/classes/${gymClass!.id}` : "/api/classes",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save class");
      toast.success(
        editing ? "Class updated" : "Class added",
        `${form.title} was saved to the schedule.`,
      );
      onSaved();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save class";
      setError(message);
      toast.error(editing ? "Could not update class" : "Could not add class", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit class" : "Add class"}
      description="Schedule a recurring weekly class on the calendar."
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
              "Add class"
            )}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="c-title" required>Class name</Label>
          <Input id="c-title" value={form.title} onChange={set("title")} placeholder="Sunrise Yoga" aria-invalid={!!errors.title} />
          <FieldError>{errors.title}</FieldError>
        </div>
        <div>
          <Label>Type</Label>
          <Dropdown
            value={form.type}
            onChange={pick("type")}
            options={CLASS_TYPES.map((t) => ({
              value: t,
              label: CLASS_TYPE_META[t].label,
            }))}
          />
        </div>
        <div>
          <Label>Trainer</Label>
          <Dropdown
            value={form.trainerId}
            onChange={pick("trainerId")}
            placeholder="Unassigned"
            options={[
              { value: "", label: "Unassigned" },
              ...trainers.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
        </div>
        <div>
          <Label>Day</Label>
          <Dropdown
            value={form.dayOfWeek}
            onChange={pick("dayOfWeek")}
            options={DAYS.map((d, i) => ({ value: String(i), label: d }))}
          />
        </div>
        <div>
          <Label required>Start time</Label>
          <Dropdown
            value={form.startTime}
            onChange={pick("startTime")}
            options={
              TIME_SLOTS.some((t) => t.value === form.startTime)
                ? TIME_SLOTS
                : [
                    { value: form.startTime, label: to12(form.startTime) },
                    ...TIME_SLOTS,
                  ]
            }
          />
          <FieldError>{errors.startTime}</FieldError>
        </div>
        <div>
          <Label>Duration</Label>
          <Dropdown
            value={form.durationMin}
            onChange={pick("durationMin")}
            options={[30, 45, 60, 75, 90].map((d) => ({
              value: String(d),
              label: `${d} min`,
            }))}
          />
        </div>
        <div>
          <Label htmlFor="c-room">Room</Label>
          <Input id="c-room" value={form.room} onChange={set("room")} placeholder="Studio A" />
        </div>
        <div>
          <Label htmlFor="c-capacity" required>Capacity</Label>
          <Input id="c-capacity" type="number" min={1} value={form.capacity} onChange={set("capacity")} aria-invalid={!!errors.capacity} />
          <FieldError>{errors.capacity}</FieldError>
        </div>
        <div>
          <Label htmlFor="c-enrolled">Enrolled</Label>
          <Input id="c-enrolled" type="number" min={0} value={form.enrolled} onChange={set("enrolled")} />
        </div>
        <div className="sm:col-span-2">
          <Label>Intensity</Label>
          <Dropdown
            value={form.intensity}
            onChange={pick("intensity")}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
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

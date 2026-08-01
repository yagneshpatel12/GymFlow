"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { useToast } from "@/components/ui/toast";
import { memberInput } from "@/lib/validation";
import { validateForm } from "@/lib/form";
import { fileToResizedDataUrl } from "@/lib/image";
import {
  MEMBER_STATUSES,
  MEMBER_STATUS_META,
  PAYMENT_METHODS,
  PAYMENT_METHOD_META,
} from "@/lib/types";
import type { MemberRow, PlanOption, TrainerOption } from "@/lib/data/members";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  plans: PlanOption[];
  trainers: TrainerOption[];
  member?: MemberRow | null;
};

function initialForm(member?: MemberRow | null, plans?: PlanOption[]) {
  return {
    name: member?.name ?? "",
    email: member?.email ?? "",
    phone: member?.phone ?? "",
    gender: member?.gender ?? "",
    status: member?.status ?? "active",
    planId: member?.planId ?? plans?.[0]?.id ?? "",
    paymentMethod: member?.paymentMethod ?? "cash",
    trainerId: member?.trainerId ?? "",
    joinDate: member?.joinDate
      ? member.joinDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    address: "",
    notes: "",
    emergencyName: "",
    emergencyPhone: "",
  };
}

export function MemberFormModal({
  open,
  onClose,
  onSaved,
  plans,
  trainers,
  member,
}: Props) {
  const editing = Boolean(member);
  const toast = useToast();
  const [form, setForm] = useState(() => initialForm(member, plans));
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Reset the form whenever the modal opens for a different member.
  const [lastKey, setLastKey] = useState<string | null>(null);
  const key = `${open}-${member?.id ?? "new"}`;
  if (open && key !== lastKey) {
    setForm(initialForm(member, plans));
    setError(null);
    setErrors({});
    setPhotoData(null);
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
    (k: keyof ReturnType<typeof initialForm>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearError(k);
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const pick =
    (k: keyof ReturnType<typeof initialForm>) => (v: string) => {
      clearError(k);
      setForm((f) => ({ ...f, [k]: v }));
    };

  const planLabel = (p: PlanOption) =>
    `${p.name} · $${p.price}/${p.interval === "annual" ? "yr" : p.interval === "quarterly" ? "qtr" : "mo"}`;

  async function submit() {
    const check = validateForm(memberInput, form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setError(null);
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/members/${member!.id}` : "/api/members",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save member");

      // New member with a photo: upload it and set as their profile photo.
      if (!editing && photoData && data.id) {
        try {
          const up = await fetch(`/api/members/${data.id}/photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: photoData }),
          });
          const upData = await up.json();
          if (up.ok && upData.id) {
            // The registration photo becomes both the profile avatar and the
            // default "Before" photo (their starting point for transformations).
            for (const role of ["profile", "before"] as const) {
              await fetch(`/api/members/${data.id}/photos`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, photoId: upData.id }),
              });
            }
          }
        } catch {
          // non-fatal: member is created; photo can be added from their profile
        }
      }

      toast.success(
        editing ? "Member updated" : "Member added",
        editing
          ? `${form.name}'s details were saved.`
          : `${form.name} is now on your roster.`,
      );
      onSaved();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save member";
      setError(message);
      toast.error(editing ? "Could not update member" : "Could not add member", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit member" : "Add member"}
      description={
        editing
          ? "Update this member's details and membership."
          : "Create a new gym member and assign their plan."
      }
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
              "Add member"
            )}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!editing && (
          <div className="flex items-center gap-4 sm:col-span-2">
            {photoData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoData}
                alt="New member"
                className="h-16 w-16 shrink-0 rounded-full object-cover shadow ring-2 ring-white"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ImagePlus className="h-6 w-6" />
              </span>
            )}
            <div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {photoData ? "Change photo" : "Add member photo"}
              </button>
              <p className="mt-1 text-xs text-slate-400">
                Optional - becomes their profile &amp; “Before” photo. Add more
                progress photos later.
              </p>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setPhotoData(await fileToResizedDataUrl(f));
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        )}
        <div className="sm:col-span-2">
          <Label htmlFor="m-name" required>Full name</Label>
          <Input id="m-name" value={form.name} onChange={set("name")} placeholder="Jordan Diaz" aria-invalid={!!errors.name} />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="m-email" required>Email</Label>
          <Input id="m-email" type="email" value={form.email} onChange={set("email")} placeholder="jordan@email.com" aria-invalid={!!errors.email} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="m-phone">Phone</Label>
          <Input id="m-phone" value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" />
        </div>
        <div>
          <Label required>Membership plan</Label>
          <Dropdown
            value={form.planId}
            onChange={pick("planId")}
            placeholder="Select a plan"
            options={plans.map((p) => ({ value: p.id, label: planLabel(p) }))}
          />
          <FieldError>{errors.planId}</FieldError>
        </div>
        <div>
          <Label>Payment method</Label>
          <Dropdown
            value={form.paymentMethod}
            onChange={pick("paymentMethod")}
            options={PAYMENT_METHODS.map((p) => ({
              value: p,
              label: PAYMENT_METHOD_META[p].label,
            }))}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Dropdown
            value={form.status}
            onChange={pick("status")}
            options={MEMBER_STATUSES.map((s) => ({
              value: s,
              label: MEMBER_STATUS_META[s].label,
            }))}
          />
        </div>
        <div>
          <Label>Assigned trainer</Label>
          <Dropdown
            value={form.trainerId}
            onChange={pick("trainerId")}
            placeholder="No trainer"
            options={[
              { value: "", label: "No trainer" },
              ...trainers.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
        </div>
        <div>
          <Label htmlFor="m-join">Join date</Label>
          <Input id="m-join" type="date" value={form.joinDate} onChange={set("joinDate")} />
        </div>
        <div>
          <Label>Gender</Label>
          <Dropdown
            value={form.gender}
            onChange={pick("gender")}
            placeholder="Prefer not to say"
            options={[
              { value: "", label: "Prefer not to say" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="m-address">Address</Label>
          <Input id="m-address" value={form.address} onChange={set("address")} placeholder="Optional" />
        </div>
        <div>
          <Label htmlFor="m-ename">Emergency contact</Label>
          <Input id="m-ename" value={form.emergencyName} onChange={set("emergencyName")} placeholder="Name" />
        </div>
        <div>
          <Label htmlFor="m-ephone">Emergency phone</Label>
          <Input id="m-ephone" value={form.emergencyPhone} onChange={set("emergencyPhone")} placeholder="(555) 000-0000" />
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

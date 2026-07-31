"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MemberFormModal } from "@/components/members/member-form-modal";
import type { MemberProfile, MemberRow, PlanOption, TrainerOption } from "@/lib/data/members";

export function MemberProfileActions({
  member,
  plans,
  trainers,
}: {
  member: MemberProfile;
  plans: PlanOption[];
  trainers: TrainerOption[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const row: MemberRow = {
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    gender: member.gender,
    status: member.status,
    planId: member.plan?.id ?? "",
    planName: member.plan?.name ?? "",
    planPrice: member.plan?.price ?? 0,
    planInterval: member.plan?.interval ?? "monthly",
    paymentMethod: member.paymentMethod,
    trainerId: member.trainer?.id ?? "",
    trainerName: member.trainer?.name ?? "",
    profilePhotoId: member.profilePhotoId ?? "",
    joinDate: member.joinDate ?? new Date().toISOString(),
    renewalDate: member.renewalDate,
    lastVisit: member.lastVisit,
    visitsThisMonth: member.visitsThisMonth,
  };

  async function confirmDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/members/${member.id}`, { method: "DELETE" });
      router.push("/members");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setEditOpen(true)}>
        <Pencil className="h-4 w-4" /> Edit
      </Button>
      <Button variant="outline" onClick={() => setDeleteOpen(true)} className="text-rose-600 hover:bg-rose-50">
        <Trash2 className="h-4 w-4" /> Delete
      </Button>

      <MemberFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => router.refresh()}
        plans={plans}
        trainers={trainers}
        member={row}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete member"
        description={`Remove ${member.name}? This can't be undone.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This permanently removes {member.name} from your roster.
        </p>
      </Modal>
    </>
  );
}

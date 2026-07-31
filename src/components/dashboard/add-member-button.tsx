"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberFormModal } from "@/components/members/member-form-modal";
import type { PlanOption, TrainerOption } from "@/lib/data/members";

export function DashboardAddMember({
  plans,
  trainers,
}: {
  plans: PlanOption[];
  trainers: TrainerOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add member
      </Button>
      <MemberFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          // On successful save, take the owner to the full members table.
          router.push("/members");
          router.refresh();
        }}
        plans={plans}
        trainers={trainers}
      />
    </>
  );
}

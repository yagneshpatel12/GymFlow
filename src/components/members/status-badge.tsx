import { Badge } from "@/components/ui/badge";
import { MEMBER_STATUS_META, type MemberStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: MemberStatus }) {
  const meta = MEMBER_STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}

import { Activity, UserCheck, UserMinus, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getMembersPageData } from "@/lib/data/members";
import { formatNumber } from "@/lib/utils";
import { StatTile } from "@/components/dashboard/stat-tile";
import { MembersClient } from "@/components/members/members-client";

export const metadata = { title: "Members" };

export default async function MembersPage() {
  const user = await requireUser();
  const { members, plans, trainers, stats } = await getMembersPageData(user.id);

  const active = stats.active + stats.trial;
  const churned = stats.expired + stats.cancelled;
  const retention = stats.total ? Math.round((active / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Total members" value={formatNumber(stats.total)} icon={Users} />
        <StatTile label="Active" value={formatNumber(active)} icon={UserCheck} />
        <StatTile label="Retention" value={`${retention}%`} icon={Activity} />
        <StatTile label="Churned" value={formatNumber(churned)} icon={UserMinus} />
      </div>

      <MembersClient
        members={members}
        plans={plans}
        trainers={trainers}
        stats={stats}
      />
    </div>
  );
}

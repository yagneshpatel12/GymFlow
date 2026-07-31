import { CalendarDays, Star, UserCheck, UserCog } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getTrainersPageData } from "@/lib/data/trainers";
import { formatNumber } from "@/lib/utils";
import { StatTile } from "@/components/dashboard/stat-tile";
import { TrainersClient } from "@/components/trainers/trainers-client";

export const metadata = { title: "Trainers" };

export default async function TrainersPage() {
  const user = await requireUser();
  const { trainers, stats } = await getTrainersPageData(user.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Trainers" value={formatNumber(stats.total)} icon={UserCog} />
        <StatTile label="Active today" value={formatNumber(stats.active)} icon={UserCheck} />
        <StatTile label="Avg. rating" value={stats.avgRating.toFixed(1)} icon={Star} />
        <StatTile label="Classes / week" value={formatNumber(stats.totalClasses)} icon={CalendarDays} />
      </div>

      <TrainersClient trainers={trainers} />
    </div>
  );
}

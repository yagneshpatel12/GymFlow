import { CalendarDays, Flame, Gauge, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getClassesPageData } from "@/lib/data/classes";
import { formatNumber } from "@/lib/utils";
import { CLASS_TYPES, CLASS_TYPE_META } from "@/lib/types";
import { StatTile } from "@/components/dashboard/stat-tile";
import { SchedulerClient } from "@/components/classes/scheduler-client";

export const metadata = { title: "Class Schedule" };

export default async function ClassesPage() {
  const user = await requireUser();
  const { classes, trainers, stats } = await getClassesPageData(user.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Weekly classes" value={formatNumber(stats.total)} icon={CalendarDays} />
        <StatTile label="Weekly spots" value={formatNumber(stats.weeklySpots)} icon={Users} />
        <StatTile label="Avg. fill rate" value={`${stats.fill}%`} icon={Gauge} />
        <StatTile label="Busiest day" value={stats.busiestDay} icon={Flame} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {CLASS_TYPES.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CLASS_TYPE_META[t].hex }}
            />
            {CLASS_TYPE_META[t].label}
          </span>
        ))}
      </div>

      <SchedulerClient classes={classes} trainers={trainers} />
    </div>
  );
}

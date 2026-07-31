import { CalendarCheck, Clock, TrendingUp, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getAttendancePageData } from "@/lib/data/attendance";
import { formatNumber } from "@/lib/utils";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceClient } from "@/components/attendance/attendance-client";

export const metadata = { title: "Attendance" };

export default async function AttendancePage() {
  const user = await requireUser();
  const { recent, members, weekTrend, stats } = await getAttendancePageData(
    user.id,
  );
  const maxDay = Math.max(1, ...weekTrend.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Check-ins today" value={formatNumber(stats.todayCount)} icon={CalendarCheck} />
        <StatTile label="This week" value={formatNumber(stats.weekCount)} icon={Users} />
        <StatTile label="Daily average" value={formatNumber(stats.avg7)} icon={TrendingUp} />
        <StatTile label="Peak hour" value={stats.peakLabel} icon={Clock} />
      </div>

      {/* Week trend */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Last 7 days</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3" style={{ height: 120 }}>
            {weekTrend.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-brand-500/90 transition-all hover:bg-brand-600"
                    style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: 4 }}
                    title={`${d.count} check-ins`}
                  />
                </div>
                <span className="text-xs font-medium text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AttendanceClient members={members} recent={recent} />
    </div>
  );
}

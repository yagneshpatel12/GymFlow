import { format } from "date-fns";
import {
  CalendarDays,
  CreditCard,
  TrendingUp,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data/dashboard";
import { getFormOptions } from "@/lib/data/members";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { DashboardAddMember } from "@/components/dashboard/add-member-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatTile } from "@/components/dashboard/stat-tile";
import { AttendanceAreaChart } from "@/components/dashboard/charts/attendance-area";
import { RevenueBarChart } from "@/components/dashboard/charts/revenue-bar";
import { StatusDonut } from "@/components/dashboard/charts/status-donut";

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, options] = await Promise.all([
    getDashboardStats(user.id),
    getFormOptions(user.id),
  ]);
  const { kpis, deltas } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {format(new Date(), "EEEE, MMMM d")} · Here&apos;s how{" "}
            {user.gymName} is doing.
          </p>
        </div>
        <div className="flex gap-2">
          <DashboardAddMember plans={options.plans} trainers={options.trainers} />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total members"
          value={formatNumber(kpis.totalMembers)}
          delta={deltas.memberDelta}
          deltaLabel="new vs last month"
          icon={Users}
        />
        <StatTile
          label="Monthly revenue"
          value={formatCurrency(kpis.mrr)}
          delta={deltas.revenueDelta}
          icon={TrendingUp}
        />
        <StatTile
          label="Avg check-ins / day"
          value={formatNumber(kpis.avgDaily)}
          delta={deltas.attendanceDelta}
          deltaLabel="vs previous week"
          icon={CalendarDays}
        />
        <StatTile
          label="Active rate"
          value={`${kpis.retentionRate}%`}
          icon={CreditCard}
        />
      </div>

      {/* Attendance + status */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Attendance trends</CardTitle>
              <CardDescription>Daily check-ins over the last 30 days</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">
                {formatNumber(kpis.checkinsToday)}
              </div>
              <div className="text-xs text-slate-500">today</div>
            </div>
          </CardHeader>
          <CardContent>
            <AttendanceAreaChart data={stats.attendanceTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Members by status</CardTitle>
              <CardDescription>Active vs churned breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <StatusDonut data={stats.statusBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Revenue + this month */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>
                Monthly recurring revenue, last 6 months
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueBarChart data={stats.revenueTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>At a glance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow
              icon={UserPlus}
              tone="text-emerald-600 bg-emerald-50"
              label="New this month"
              value={`+${kpis.newThisMonth}`}
            />
            <SummaryRow
              icon={UserMinus}
              tone="text-rose-600 bg-rose-50"
              label="Churned members"
              value={formatNumber(kpis.churnedMembers)}
            />
            <SummaryRow
              icon={UserCog}
              tone="text-brand-600 bg-brand-50"
              label="Active trainers"
              value={formatNumber(kpis.trainerCount)}
            />
            <SummaryRow
              icon={CalendarDays}
              tone="text-amber-600 bg-amber-50"
              label="Weekly classes"
              value={formatNumber(kpis.classCount)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof UserPlus;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-sm text-slate-600">{label}</span>
      <span className="ml-auto text-sm font-semibold text-slate-900 tabular-nums">
        {value}
      </span>
    </div>
  );
}

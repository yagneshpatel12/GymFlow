import { Types } from "mongoose";
import {
  eachDayOfInterval,
  format,
  startOfMonth,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns";
import { connectDB } from "@/lib/db";
import { Member } from "@/models/Member";
import { Plan } from "@/models/Plan";
import { Attendance } from "@/models/Attendance";
import { GymClass } from "@/models/GymClass";
import { Trainer } from "@/models/Trainer";
import { MEMBER_STATUSES, type MemberStatus } from "@/lib/types";

/** Normalize a plan's price to a monthly figure. */
function monthly(price: number, interval: string) {
  if (interval === "annual") return price / 12;
  if (interval === "quarterly") return price / 3;
  return price;
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;

export async function getDashboardStats(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);
  const now = new Date();
  const monthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));

  const [members, plans, trainerCount, classCount] = await Promise.all([
    Member.find({ ownerId: oid })
      .select("status planId joinDate")
      .lean(),
    Plan.find({ ownerId: oid }).select("price interval name").lean(),
    Trainer.countDocuments({ ownerId: oid }),
    GymClass.countDocuments({ ownerId: oid }),
  ]);

  const planMap = new Map(
    plans.map((p) => [String(p._id), monthly(p.price, p.interval)]),
  );

  // ── Status breakdown ────────────────────────────────────────────────
  const statusCounts = Object.fromEntries(
    MEMBER_STATUSES.map((s) => [s, 0]),
  ) as Record<MemberStatus, number>;
  for (const m of members) statusCounts[m.status as MemberStatus]++;

  const totalMembers = members.length;
  const activeMembers = statusCounts.active + statusCounts.trial;
  const churnedMembers = statusCounts.expired + statusCounts.cancelled;

  const newThisMonth = members.filter(
    (m) => m.joinDate && new Date(m.joinDate) >= monthStart,
  ).length;
  const newPrevMonth = members.filter(
    (m) =>
      m.joinDate &&
      new Date(m.joinDate) >= prevMonthStart &&
      new Date(m.joinDate) < monthStart,
  ).length;
  const memberDelta = pctChange(newThisMonth, newPrevMonth);

  // ── Monthly recurring revenue (current) ─────────────────────────────
  const mrr = members
    .filter((m) => m.status === "active" || m.status === "trial")
    .reduce((sum, m) => sum + (planMap.get(String(m.planId)) ?? 0), 0);

  // ── Revenue trend (last 6 months, derived from join dates) ──────────
  const revenueTrend = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(now, 5 - i);
    const end = startOfMonth(subMonths(now, 5 - i - 1)); // start of next month
    const active = members.filter(
      (m) => m.joinDate && new Date(m.joinDate) < end,
    );
    const value = active.reduce(
      (sum, m) => sum + (planMap.get(String(m.planId)) ?? 0),
      0,
    );
    return { label: format(d, "MMM"), value: Math.round(value) };
  });
  const revenueDelta = pctChange(
    revenueTrend.at(-1)?.value ?? 0,
    revenueTrend.at(-2)?.value ?? 0,
  );

  // ── Attendance trend (last 30 days, daily) ──────────────────────────
  const start30 = startOfDay(subDays(now, 29));
  const rows = await Attendance.aggregate<{ _id: string; count: number }>([
    { $match: { ownerId: oid, checkInAt: { $gte: start30 } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkInAt" } },
        count: { $sum: 1 },
      },
    },
  ]);
  const countByDay = new Map(rows.map((r) => [r._id, r.count]));
  const attendanceTrend = eachDayOfInterval({ start: start30, end: now }).map(
    (day) => {
      const key = format(day, "yyyy-MM-dd");
      return {
        date: key,
        label: format(day, "MMM d"),
        count: countByDay.get(key) ?? 0,
      };
    },
  );

  const last7 = attendanceTrend.slice(-7).reduce((s, d) => s + d.count, 0);
  const prev7 = attendanceTrend.slice(-14, -7).reduce((s, d) => s + d.count, 0);
  const attendanceDelta = pctChange(last7, prev7);
  const checkinsToday =
    attendanceTrend.at(-1)?.count ?? 0;
  const avgDaily = Math.round(
    attendanceTrend.reduce((s, d) => s + d.count, 0) / attendanceTrend.length,
  );

  const statusBreakdown = MEMBER_STATUSES.map((s) => ({
    status: s,
    count: statusCounts[s],
  }));

  return {
    kpis: {
      totalMembers,
      activeMembers,
      churnedMembers,
      newThisMonth,
      mrr: Math.round(mrr),
      checkinsToday,
      avgDaily,
      trainerCount,
      classCount,
      retentionRate:
        totalMembers > 0
          ? Math.round((activeMembers / totalMembers) * 100)
          : 0,
    },
    deltas: { memberDelta, revenueDelta, attendanceDelta },
    revenueTrend,
    attendanceTrend,
    statusBreakdown,
  };
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

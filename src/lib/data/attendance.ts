import { Types } from "mongoose";
import {
  eachDayOfInterval,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/Attendance";
import { Member } from "@/models/Member";
import type { AttendanceMethod, MemberStatus } from "@/lib/types";

export type RecentCheckin = {
  id: string;
  memberId: string;
  memberName: string;
  memberStatus: MemberStatus;
  at: string;
  method: AttendanceMethod;
};

export type CheckinMember = {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
};

export async function getAttendancePageData(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const start7 = startOfDay(subDays(now, 6));

  const [recentRaw, todayCount, weekCount, dayRows, hourRows, members] =
    await Promise.all([
      Attendance.find({ ownerId: oid })
        .populate("memberId", "name status")
        .sort({ checkInAt: -1 })
        .limit(40)
        .lean(),
      Attendance.countDocuments({ ownerId: oid, checkInAt: { $gte: todayStart } }),
      Attendance.countDocuments({ ownerId: oid, checkInAt: { $gte: weekStart } }),
      Attendance.aggregate<{ _id: string; count: number }>([
        { $match: { ownerId: oid, checkInAt: { $gte: start7 } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkInAt" } },
            count: { $sum: 1 },
          },
        },
      ]),
      Attendance.aggregate<{ _id: number; count: number }>([
        { $match: { ownerId: oid, checkInAt: { $gte: todayStart } } },
        { $group: { _id: { $hour: "$checkInAt" }, count: { $sum: 1 } } },
      ]),
      Member.find({ ownerId: oid })
        .select("name email status")
        .sort({ name: 1 })
        .lean(),
    ]);

  const recent: RecentCheckin[] = recentRaw.map((a) => {
    const m = a.memberId as unknown as {
      _id: Types.ObjectId;
      name?: string;
      status?: string;
    } | null;
    return {
      id: String(a._id),
      memberId: m ? String(m._id) : "",
      memberName: m?.name ?? "Unknown member",
      memberStatus: (m?.status ?? "active") as MemberStatus,
      at: new Date(a.checkInAt).toISOString(),
      method: a.method as AttendanceMethod,
    };
  });

  const countByDay = new Map(dayRows.map((r) => [r._id, r.count]));
  const weekTrend = eachDayOfInterval({ start: start7, end: now }).map((d) => ({
    label: format(d, "EEE"),
    date: format(d, "yyyy-MM-dd"),
    count: countByDay.get(format(d, "yyyy-MM-dd")) ?? 0,
  }));

  // Peak hour today
  let peakHour = -1;
  let peakCount = 0;
  for (const r of hourRows) {
    if (r.count > peakCount) {
      peakCount = r.count;
      peakHour = r._id;
    }
  }
  const peakLabel =
    peakHour >= 0
      ? `${peakHour % 12 === 0 ? 12 : peakHour % 12}${peakHour >= 12 ? "pm" : "am"}`
      : "-";

  const avg7 = Math.round(
    weekTrend.reduce((s, d) => s + d.count, 0) / weekTrend.length,
  );

  const checkinMembers: CheckinMember[] = members.map((m) => ({
    id: String(m._id),
    name: m.name,
    email: m.email,
    status: m.status as MemberStatus,
  }));

  return {
    recent,
    members: checkinMembers,
    weekTrend,
    stats: { todayCount, weekCount, avg7, peakLabel },
  };
}

import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Attendance } from "@/models/Attendance";
import { Member } from "@/models/Member";
import type { AttendanceMethod } from "@/lib/types";

export async function createCheckin(
  ownerId: string,
  memberId: string,
  method: AttendanceMethod = "manual",
) {
  await connectDB();
  if (!Types.ObjectId.isValid(memberId)) return null;
  const oid = new Types.ObjectId(ownerId);

  const member = await Member.findOne({ _id: memberId, ownerId: oid })
    .select("name status")
    .lean();
  if (!member) return null;

  const now = new Date();
  const checkin = await Attendance.create({
    ownerId: oid,
    memberId: new Types.ObjectId(memberId),
    checkInAt: now,
    method,
  });

  await Member.updateOne(
    { _id: memberId, ownerId: oid },
    { $set: { lastVisit: now }, $inc: { visitsThisMonth: 1 } },
  );

  return {
    id: String(checkin._id),
    memberId,
    memberName: member.name,
    memberStatus: member.status,
    at: now.toISOString(),
    method,
  };
}

export async function deleteCheckin(ownerId: string, id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const res = await Attendance.deleteOne({
    _id: id,
    ownerId: new Types.ObjectId(ownerId),
  });
  return res.deletedCount > 0;
}

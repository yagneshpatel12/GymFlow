import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Trainer } from "@/models/Trainer";
import { Member } from "@/models/Member";
import { GymClass } from "@/models/GymClass";
import type { TrainerStatus } from "@/lib/types";

export type TrainerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  specialties: string[];
  bio: string;
  rating: number;
  status: TrainerStatus;
  hireDate: string | null;
  assignedMembers: number;
  weeklyClasses: number;
};

export async function getTrainersPageData(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);

  const [trainers, memberCounts, classCounts] = await Promise.all([
    Trainer.find({ ownerId: oid }).sort({ createdAt: 1 }).lean(),
    Member.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { ownerId: oid, trainerId: { $ne: null } } },
      { $group: { _id: "$trainerId", count: { $sum: 1 } } },
    ]),
    GymClass.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { ownerId: oid, trainerId: { $ne: null } } },
      { $group: { _id: "$trainerId", count: { $sum: 1 } } },
    ]),
  ]);

  const memberMap = new Map(memberCounts.map((r) => [String(r._id), r.count]));
  const classMap = new Map(classCounts.map((r) => [String(r._id), r.count]));

  const rows: TrainerRow[] = trainers.map((t) => ({
    id: String(t._id),
    name: t.name,
    email: t.email,
    phone: t.phone ?? "",
    title: t.title ?? "Personal Trainer",
    specialties: t.specialties ?? [],
    bio: t.bio ?? "",
    rating: t.rating ?? 5,
    status: t.status as TrainerStatus,
    hireDate: t.hireDate ? new Date(t.hireDate).toISOString() : null,
    assignedMembers: memberMap.get(String(t._id)) ?? 0,
    weeklyClasses: classMap.get(String(t._id)) ?? 0,
  }));

  const active = rows.filter((t) => t.status === "active").length;
  const avgRating =
    rows.length > 0
      ? Math.round((rows.reduce((s, t) => s + t.rating, 0) / rows.length) * 10) / 10
      : 0;
  const totalClasses = rows.reduce((s, t) => s + t.weeklyClasses, 0);

  return {
    trainers: rows,
    stats: { total: rows.length, active, avgRating, totalClasses },
  };
}

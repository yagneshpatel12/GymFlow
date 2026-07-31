import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { GymClass } from "@/models/GymClass";
import { Trainer } from "@/models/Trainer";
import { DAYS_SHORT, type ClassType } from "@/lib/types";
import type { TrainerOption } from "@/lib/data/members";

export type ClassRow = {
  id: string;
  title: string;
  type: ClassType;
  trainerId: string;
  trainerName: string;
  dayOfWeek: number;
  startTime: string;
  durationMin: number;
  capacity: number;
  enrolled: number;
  room: string;
  intensity: "low" | "medium" | "high";
};

export async function getClassesPageData(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);

  const [classes, trainers] = await Promise.all([
    GymClass.find({ ownerId: oid })
      .populate("trainerId", "name")
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean(),
    Trainer.find({ ownerId: oid }).select("name").sort({ name: 1 }).lean(),
  ]);

  const rows: ClassRow[] = classes.map((c) => {
    const trainer = c.trainerId as unknown as {
      _id: Types.ObjectId;
      name?: string;
    } | null;
    return {
      id: String(c._id),
      title: c.title,
      type: c.type as ClassType,
      trainerId: trainer ? String(trainer._id) : "",
      trainerName: trainer?.name ?? "Unassigned",
      dayOfWeek: c.dayOfWeek,
      startTime: c.startTime,
      durationMin: c.durationMin,
      capacity: c.capacity,
      enrolled: c.enrolled,
      room: c.room,
      intensity: (c.intensity as "low" | "medium" | "high") ?? "medium",
    };
  });

  // Stats
  const totalCapacity = rows.reduce((s, c) => s + c.capacity, 0);
  const totalEnrolled = rows.reduce((s, c) => s + c.enrolled, 0);
  const fill = totalCapacity ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const perDay = new Array(7).fill(0);
  for (const c of rows) perDay[c.dayOfWeek]++;
  const busiestIdx = perDay.indexOf(Math.max(...perDay));

  const trainerOptions: TrainerOption[] = trainers.map((t) => ({
    id: String(t._id),
    name: t.name,
  }));

  return {
    classes: rows,
    trainers: trainerOptions,
    stats: {
      total: rows.length,
      weeklySpots: totalCapacity,
      fill,
      busiestDay: DAYS_SHORT[busiestIdx] ?? "-",
    },
  };
}

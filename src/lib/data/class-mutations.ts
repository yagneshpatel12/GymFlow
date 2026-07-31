import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { GymClass } from "@/models/GymClass";
import type { ClassInput } from "@/lib/validation";

function toDoc(input: ClassInput, ownerId: string) {
  return {
    ownerId: new Types.ObjectId(ownerId),
    title: input.title,
    type: input.type,
    trainerId: input.trainerId ? new Types.ObjectId(input.trainerId) : undefined,
    dayOfWeek: input.dayOfWeek,
    startTime: input.startTime,
    durationMin: input.durationMin,
    capacity: input.capacity,
    enrolled: Math.min(input.enrolled, input.capacity),
    room: input.room,
    intensity: input.intensity,
  };
}

export async function createClass(ownerId: string, input: ClassInput) {
  await connectDB();
  const created = await GymClass.create(toDoc(input, ownerId));
  return String(created._id);
}

export async function updateClass(ownerId: string, id: string, input: ClassInput) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const res = await GymClass.updateOne(
    { _id: id, ownerId: new Types.ObjectId(ownerId) },
    { $set: toDoc(input, ownerId) },
  );
  return res.matchedCount > 0;
}

export async function deleteClass(ownerId: string, id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const res = await GymClass.deleteOne({
    _id: id,
    ownerId: new Types.ObjectId(ownerId),
  });
  return res.deletedCount > 0;
}

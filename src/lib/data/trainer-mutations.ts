import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Trainer } from "@/models/Trainer";
import { Member } from "@/models/Member";
import { GymClass } from "@/models/GymClass";
import type { TrainerInput } from "@/lib/validation";

function toDoc(input: TrainerInput, ownerId: string) {
  return {
    ownerId: new Types.ObjectId(ownerId),
    name: input.name,
    email: input.email,
    phone: input.phone,
    title: input.title,
    specialties: input.specialties,
    bio: input.bio,
    rating: input.rating,
    status: input.status,
  };
}

export async function createTrainer(ownerId: string, input: TrainerInput) {
  await connectDB();
  const created = await Trainer.create({
    ...toDoc(input, ownerId),
    hireDate: new Date(),
  });
  return String(created._id);
}

export async function updateTrainer(
  ownerId: string,
  id: string,
  input: TrainerInput,
) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const res = await Trainer.updateOne(
    { _id: id, ownerId: new Types.ObjectId(ownerId) },
    { $set: toDoc(input, ownerId) },
  );
  return res.matchedCount > 0;
}

export async function deleteTrainer(ownerId: string, id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const oid = new Types.ObjectId(ownerId);
  const res = await Trainer.deleteOne({ _id: id, ownerId: oid });
  if (res.deletedCount > 0) {
    // Unassign this trainer from members and classes.
    await Promise.all([
      Member.updateMany(
        { ownerId: oid, trainerId: id },
        { $unset: { trainerId: "" } },
      ),
      GymClass.updateMany(
        { ownerId: oid, trainerId: id },
        { $unset: { trainerId: "" } },
      ),
    ]);
  }
  return res.deletedCount > 0;
}

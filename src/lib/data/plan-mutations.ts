import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Plan } from "@/models/Plan";
import { Member } from "@/models/Member";
import type { PlanInput } from "@/lib/validation";

function toDoc(input: PlanInput, ownerId: string) {
  return {
    ownerId: new Types.ObjectId(ownerId),
    name: input.name,
    description: input.description,
    price: input.price,
    interval: input.interval,
    features: input.features,
    color: input.color,
    isPopular: input.isPopular,
    isActive: input.isActive,
  };
}

export async function createPlan(ownerId: string, input: PlanInput) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);
  const last = await Plan.findOne({ ownerId: oid })
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();
  const created = await Plan.create({
    ...toDoc(input, ownerId),
    sortOrder: (last?.sortOrder ?? 0) + 1,
  });
  return String(created._id);
}

export async function updatePlan(ownerId: string, id: string, input: PlanInput) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const res = await Plan.updateOne(
    { _id: id, ownerId: new Types.ObjectId(ownerId) },
    { $set: toDoc(input, ownerId) },
  );
  return res.matchedCount > 0;
}

export type DeletePlanResult =
  | { ok: true }
  | { ok: false; reason: "in_use"; count: number }
  | { ok: false; reason: "not_found" };

export async function deletePlan(
  ownerId: string,
  id: string,
): Promise<DeletePlanResult> {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return { ok: false, reason: "not_found" };
  const oid = new Types.ObjectId(ownerId);

  const count = await Member.countDocuments({ ownerId: oid, planId: id });
  if (count > 0) return { ok: false, reason: "in_use", count };

  const res = await Plan.deleteOne({ _id: id, ownerId: oid });
  if (res.deletedCount === 0) return { ok: false, reason: "not_found" };
  return { ok: true };
}

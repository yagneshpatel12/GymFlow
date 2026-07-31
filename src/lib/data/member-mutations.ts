import { addMonths } from "date-fns";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Member } from "@/models/Member";
import { Plan } from "@/models/Plan";
import type { MemberInput } from "@/lib/validation";

function renewalFrom(joinDate: Date, interval: string) {
  const months = interval === "annual" ? 12 : interval === "quarterly" ? 3 : 1;
  return addMonths(joinDate, months);
}

async function planInterval(ownerId: string, planId: string) {
  const plan = await Plan.findOne({ _id: planId, ownerId }).select("interval").lean();
  return plan?.interval ?? "monthly";
}

function toDoc(input: MemberInput, ownerId: string, interval: string) {
  const joinDate = input.joinDate ? new Date(input.joinDate) : new Date();
  return {
    ownerId: new Types.ObjectId(ownerId),
    name: input.name,
    email: input.email,
    phone: input.phone,
    gender: input.gender,
    status: input.status,
    planId: new Types.ObjectId(input.planId),
    paymentMethod: input.paymentMethod,
    lastPaymentAt: new Date(),
    trainerId: input.trainerId ? new Types.ObjectId(input.trainerId) : undefined,
    joinDate,
    renewalDate: renewalFrom(joinDate, interval),
    address: input.address,
    notes: input.notes,
    emergencyContact: { name: input.emergencyName, phone: input.emergencyPhone },
  };
}

export async function createMember(ownerId: string, input: MemberInput) {
  await connectDB();
  const interval = await planInterval(ownerId, input.planId);
  const doc = toDoc(input, ownerId, interval);
  // A new member hasn't visited yet - leave lastVisit unset (shows "-")
  // until they're actually checked in via the attendance module.
  const created = await Member.create(doc);
  return String(created._id);
}

export async function updateMember(
  ownerId: string,
  id: string,
  input: MemberInput,
) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const interval = await planInterval(ownerId, input.planId);
  const doc = toDoc(input, ownerId, interval);
  const res = await Member.updateOne(
    { _id: id, ownerId: new Types.ObjectId(ownerId) },
    { $set: doc },
  );
  return res.matchedCount > 0;
}

export async function deleteMember(ownerId: string, id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return false;
  const res = await Member.deleteOne({
    _id: id,
    ownerId: new Types.ObjectId(ownerId),
  });
  return res.deletedCount > 0;
}

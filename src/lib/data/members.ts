import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Member } from "@/models/Member";
import { Plan } from "@/models/Plan";
import { Trainer } from "@/models/Trainer";
import { Attendance } from "@/models/Attendance";
import { getMemberPhotos } from "@/lib/data/photos";
import {
  MEMBER_STATUSES,
  type MemberStatus,
  type PaymentMethod,
} from "@/lib/types";

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: MemberStatus;
  planId: string;
  planName: string;
  planPrice: number;
  planInterval: string;
  paymentMethod: PaymentMethod;
  trainerId: string;
  trainerName: string;
  joinDate: string;
  renewalDate: string | null;
  lastVisit: string | null;
  visitsThisMonth: number;
  profilePhotoId: string;
};

export type PlanOption = {
  id: string;
  name: string;
  price: number;
  interval: string;
  color: string;
};
export type TrainerOption = { id: string; name: string };

function iso(d: unknown): string | null {
  return d ? new Date(d as string).toISOString() : null;
}

export async function getMembersPageData(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);

  const [members, plans, trainers] = await Promise.all([
    Member.find({ ownerId: oid })
      .populate("planId", "name price interval color")
      .populate("trainerId", "name")
      .sort({ createdAt: -1 })
      .lean(),
    Plan.find({ ownerId: oid }).sort({ sortOrder: 1 }).lean(),
    Trainer.find({ ownerId: oid }).select("name").sort({ name: 1 }).lean(),
  ]);

  const rows: MemberRow[] = members.map((m) => {
    const plan = m.planId as unknown as {
      _id: Types.ObjectId;
      name?: string;
      price?: number;
      interval?: string;
    } | null;
    const trainer = m.trainerId as unknown as {
      _id: Types.ObjectId;
      name?: string;
    } | null;
    return {
      id: String(m._id),
      name: m.name,
      email: m.email,
      phone: m.phone ?? "",
      gender: m.gender ?? "",
      status: m.status as MemberStatus,
      planId: plan ? String(plan._id) : "",
      planName: plan?.name ?? "-",
      planPrice: plan?.price ?? 0,
      planInterval: plan?.interval ?? "monthly",
      paymentMethod: (m.paymentMethod ?? "cash") as PaymentMethod,
      trainerId: trainer ? String(trainer._id) : "",
      trainerName: trainer?.name ?? "",
      joinDate: iso(m.joinDate) ?? new Date().toISOString(),
      renewalDate: iso(m.renewalDate),
      lastVisit: iso(m.lastVisit),
      visitsThisMonth: m.visitsThisMonth ?? 0,
      profilePhotoId: m.profilePhotoId ? String(m.profilePhotoId) : "",
    };
  });

  const stats = Object.fromEntries(
    MEMBER_STATUSES.map((s) => [s, 0]),
  ) as Record<MemberStatus, number>;
  for (const r of rows) stats[r.status]++;

  const planOptions: PlanOption[] = plans.map((p) => ({
    id: String(p._id),
    name: p.name,
    price: p.price,
    interval: p.interval,
    color: p.color,
  }));
  const trainerOptions: TrainerOption[] = trainers.map((t) => ({
    id: String(t._id),
    name: t.name,
  }));

  return {
    members: rows,
    plans: planOptions,
    trainers: trainerOptions,
    stats: { total: rows.length, ...stats },
  };
}

export async function getMemberProfile(ownerId: string, id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;
  const oid = new Types.ObjectId(ownerId);

  const m = await Member.findOne({ _id: id, ownerId: oid })
    .populate("planId", "name price interval color features")
    .populate("trainerId", "name title")
    .lean();
  if (!m) return null;

  const [recent, photos] = await Promise.all([
    Attendance.find({ ownerId: oid, memberId: id })
      .sort({ checkInAt: -1 })
      .limit(12)
      .lean(),
    getMemberPhotos(ownerId, id),
  ]);

  const plan = m.planId as unknown as {
    _id: Types.ObjectId;
    name?: string;
    price?: number;
    interval?: string;
    color?: string;
    features?: string[];
  } | null;
  const trainer = m.trainerId as unknown as {
    _id: Types.ObjectId;
    name?: string;
    title?: string;
  } | null;

  return {
    id: String(m._id),
    name: m.name,
    email: m.email,
    phone: m.phone ?? "",
    gender: m.gender ?? "",
    address: m.address ?? "",
    notes: m.notes ?? "",
    status: m.status as MemberStatus,
    paymentMethod: (m.paymentMethod ?? "cash") as PaymentMethod,
    lastPaymentAt: iso(m.lastPaymentAt),
    joinDate: iso(m.joinDate),
    renewalDate: iso(m.renewalDate),
    lastVisit: iso(m.lastVisit),
    visitsThisMonth: m.visitsThisMonth ?? 0,
    emergencyContact: {
      name: m.emergencyContact?.name ?? "",
      phone: m.emergencyContact?.phone ?? "",
    },
    plan: plan
      ? {
          id: String(plan._id),
          name: plan.name ?? "",
          price: plan.price ?? 0,
          interval: plan.interval ?? "monthly",
          color: plan.color ?? "brand",
          features: plan.features ?? [],
        }
      : null,
    trainer: trainer
      ? { id: String(trainer._id), name: trainer.name ?? "", title: trainer.title ?? "" }
      : null,
    recentCheckins: recent.map((a) => ({
      id: String(a._id),
      at: iso(a.checkInAt)!,
      method: a.method,
    })),
    photos,
    profilePhotoId: m.profilePhotoId ? String(m.profilePhotoId) : null,
    beforePhotoId: m.beforePhotoId ? String(m.beforePhotoId) : null,
    afterPhotoId: m.afterPhotoId ? String(m.afterPhotoId) : null,
  };
}

export async function getFormOptions(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);
  const [plans, trainers] = await Promise.all([
    Plan.find({ ownerId: oid }).sort({ sortOrder: 1 }).lean(),
    Trainer.find({ ownerId: oid }).select("name").sort({ name: 1 }).lean(),
  ]);
  return {
    plans: plans.map((p) => ({
      id: String(p._id),
      name: p.name,
      price: p.price,
      interval: p.interval,
      color: p.color,
    })) as PlanOption[],
    trainers: trainers.map((t) => ({
      id: String(t._id),
      name: t.name,
    })) as TrainerOption[],
  };
}

export type MemberProfile = NonNullable<
  Awaited<ReturnType<typeof getMemberProfile>>
>;

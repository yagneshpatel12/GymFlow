import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Plan } from "@/models/Plan";
import { Member } from "@/models/Member";
import type { PlanInterval } from "@/lib/types";

function monthly(price: number, interval: string) {
  if (interval === "annual") return price / 12;
  if (interval === "quarterly") return price / 3;
  return price;
}

export type PlanRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: PlanInterval;
  features: string[];
  color: string;
  isPopular: boolean;
  isActive: boolean;
  totalMembers: number;
  activeMembers: number;
  mrr: number;
};

export async function getPlansPageData(ownerId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);

  const [plans, counts] = await Promise.all([
    Plan.find({ ownerId: oid }).sort({ sortOrder: 1 }).lean(),
    Member.aggregate<{ _id: Types.ObjectId; total: number; active: number }>([
      { $match: { ownerId: oid } },
      {
        $group: {
          _id: "$planId",
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $in: ["$status", ["active", "trial"]] }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  const map = new Map(counts.map((c) => [String(c._id), c]));

  const rows: PlanRow[] = plans.map((p) => {
    const c = map.get(String(p._id));
    const active = c?.active ?? 0;
    return {
      id: String(p._id),
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      interval: p.interval as PlanInterval,
      features: p.features ?? [],
      color: p.color ?? "brand",
      isPopular: p.isPopular ?? false,
      isActive: p.isActive ?? true,
      totalMembers: c?.total ?? 0,
      activeMembers: active,
      mrr: Math.round(active * monthly(p.price, p.interval)),
    };
  });

  const totalActive = rows.reduce((s, p) => s + p.activeMembers, 0);
  const totalMrr = rows.reduce((s, p) => s + p.mrr, 0);
  const popular = [...rows].sort((a, b) => b.totalMembers - a.totalMembers)[0];

  return {
    plans: rows,
    stats: {
      total: rows.length,
      totalActive,
      totalMrr,
      popularName: popular?.name ?? "-",
    },
  };
}

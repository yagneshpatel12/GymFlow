import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { PLAN_INTERVALS } from "@/lib/types";

const PlanSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true }, // price per interval, in USD
    interval: { type: String, enum: PLAN_INTERVALS, default: "monthly" },
    features: { type: [String], default: [] },
    color: { type: String, default: "brand" },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type PlanDoc = InferSchemaType<typeof PlanSchema> & { _id: string };

export const Plan: Model<PlanDoc> =
  (models.Plan as Model<PlanDoc>) || model<PlanDoc>("Plan", PlanSchema);

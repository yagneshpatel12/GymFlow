import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { TRAINER_STATUSES } from "@/lib/types";

const TrainerSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    title: { type: String, default: "Personal Trainer" },
    specialties: { type: [String], default: [] },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    status: { type: String, enum: TRAINER_STATUSES, default: "active" },
    hireDate: { type: Date, default: Date.now },
    monthlyClasses: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type TrainerDoc = InferSchemaType<typeof TrainerSchema> & { _id: string };

export const Trainer: Model<TrainerDoc> =
  (models.Trainer as Model<TrainerDoc>) ||
  model<TrainerDoc>("Trainer", TrainerSchema);

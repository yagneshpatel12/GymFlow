import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CLASS_TYPES } from "@/lib/types";

/**
 * A recurring weekly class slot. `dayOfWeek` (0=Sun..6=Sat) + `startTime`
 * ("HH:mm") define the slot rendered on the weekly calendar.
 */
const GymClassSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: CLASS_TYPES, default: "strength" },
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer" },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true }, // "06:00"
    durationMin: { type: Number, default: 60 },
    capacity: { type: Number, default: 20 },
    enrolled: { type: Number, default: 0 },
    room: { type: String, default: "Studio A" },
    intensity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  },
  { timestamps: true },
);

export type GymClassDoc = InferSchemaType<typeof GymClassSchema> & { _id: string };

export const GymClass: Model<GymClassDoc> =
  (models.GymClass as Model<GymClassDoc>) ||
  model<GymClassDoc>("GymClass", GymClassSchema);

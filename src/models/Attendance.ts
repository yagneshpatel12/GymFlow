import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ATTENDANCE_METHODS } from "@/lib/types";

const AttendanceSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    classId: { type: Schema.Types.ObjectId, ref: "GymClass" },
    checkInAt: { type: Date, required: true, default: Date.now, index: true },
    method: { type: String, enum: ATTENDANCE_METHODS, default: "qr" },
  },
  { timestamps: true },
);

AttendanceSchema.index({ ownerId: 1, checkInAt: -1 });

export type AttendanceDoc = InferSchemaType<typeof AttendanceSchema> & {
  _id: string;
};

export const Attendance: Model<AttendanceDoc> =
  (models.Attendance as Model<AttendanceDoc>) ||
  model<AttendanceDoc>("Attendance", AttendanceSchema);

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { MEMBER_STATUSES, PAYMENT_METHODS } from "@/lib/types";

const MemberSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    dob: { type: Date },
    address: { type: String, default: "" },
    status: { type: String, enum: MEMBER_STATUSES, default: "active", index: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, default: "cash" },
    lastPaymentAt: { type: Date },
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer" },
    profilePhotoId: { type: Schema.Types.ObjectId, ref: "MemberPhoto" },
    beforePhotoId: { type: Schema.Types.ObjectId, ref: "MemberPhoto" },
    afterPhotoId: { type: Schema.Types.ObjectId, ref: "MemberPhoto" },
    joinDate: { type: Date, default: Date.now },
    renewalDate: { type: Date },
    lastVisit: { type: Date },
    visitsThisMonth: { type: Number, default: 0 },
    emergencyContact: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

MemberSchema.index({ ownerId: 1, name: 1 });

export type MemberDoc = InferSchemaType<typeof MemberSchema> & { _id: string };

export const Member: Model<MemberDoc> =
  (models.Member as Model<MemberDoc>) || model<MemberDoc>("Member", MemberSchema);

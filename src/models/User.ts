import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    gymName: { type: String, required: true, default: "My Gym" },
    role: { type: String, enum: ["owner", "demo"], default: "owner" },
    isDemo: { type: Boolean, default: false },
    avatarColor: { type: String, default: "brand" },
    seeded: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };

export const User: Model<UserDoc> =
  (models.User as Model<UserDoc>) || model<UserDoc>("User", UserSchema);

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A member progress photo. The (client-compressed) image bytes are stored
 * directly in MongoDB and served through an auth-protected route. Self-contained
 * - no external object storage needed. For very large scale you'd swap the
 * `data` buffer for an S3/Cloudinary URL.
 */
const MemberPhotoSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, default: "image/jpeg" },
    takenAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

MemberPhotoSchema.index({ ownerId: 1, memberId: 1, takenAt: -1 });

export type MemberPhotoDoc = InferSchemaType<typeof MemberPhotoSchema> & {
  _id: string;
};

export const MemberPhoto: Model<MemberPhotoDoc> =
  (models.MemberPhoto as Model<MemberPhotoDoc>) ||
  model<MemberPhotoDoc>("MemberPhoto", MemberPhotoSchema);

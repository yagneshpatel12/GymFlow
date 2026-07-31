import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { MemberPhoto } from "@/models/MemberPhoto";
import { Member } from "@/models/Member";

const MAX_BYTES = 4_000_000; // safety cap (~4MB) after client compression

export type PhotoRole = "profile" | "before" | "after";
const ROLE_FIELD: Record<PhotoRole, string> = {
  profile: "profilePhotoId",
  before: "beforePhotoId",
  after: "afterPhotoId",
};

export async function memberBelongsToOwner(ownerId: string, memberId: string) {
  if (!Types.ObjectId.isValid(memberId)) return false;
  const m = await Member.exists({ _id: memberId, ownerId: new Types.ObjectId(ownerId) });
  return Boolean(m);
}

export async function createPhoto(
  ownerId: string,
  memberId: string,
  dataUrl: string,
  takenAt?: string,
) {
  await connectDB();
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid image data");
  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_BYTES) throw new Error("Image is too large");

  const photo = await MemberPhoto.create({
    ownerId: new Types.ObjectId(ownerId),
    memberId: new Types.ObjectId(memberId),
    data: buffer,
    contentType,
    takenAt: takenAt ? new Date(takenAt) : new Date(),
  });
  return String(photo._id);
}

export async function getPhotoBytes(ownerId: string, photoId: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(photoId)) return null;
  // NOTE: no .lean() - lean returns a BSON Binary, not a Node Buffer, which
  // would serialize to 0 bytes. The hydrated doc gives a real Buffer.
  const photo = await MemberPhoto.findOne({
    _id: photoId,
    ownerId: new Types.ObjectId(ownerId),
  }).select("data contentType");
  if (!photo) return null;
  return { data: photo.data as Buffer, contentType: photo.contentType };
}

export async function deletePhoto(ownerId: string, photoId: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(photoId)) return false;
  const oid = new Types.ObjectId(ownerId);
  const photo = await MemberPhoto.findOne({ _id: photoId, ownerId: oid })
    .select("memberId")
    .lean();
  if (!photo) return false;
  const memberId = String(photo.memberId);

  await MemberPhoto.deleteOne({ _id: photoId, ownerId: oid });

  // Clear any member reference pointing at this photo.
  const member = await Member.findOne({ _id: memberId, ownerId: oid })
    .select("profilePhotoId beforePhotoId afterPhotoId")
    .lean();
  if (member) {
    const unset: Record<string, null> = {};
    if (String(member.profilePhotoId) === photoId) unset.profilePhotoId = null;
    if (String(member.beforePhotoId) === photoId) unset.beforePhotoId = null;
    if (String(member.afterPhotoId) === photoId) unset.afterPhotoId = null;
    if (Object.keys(unset).length) {
      await Member.updateOne({ _id: memberId, ownerId: oid }, { $set: unset });
    }
  }
  return true;
}

export async function setPhotoRole(
  ownerId: string,
  memberId: string,
  role: PhotoRole,
  photoId: string | null,
) {
  await connectDB();
  if (!Types.ObjectId.isValid(memberId)) return false;
  const oid = new Types.ObjectId(ownerId);
  const field = ROLE_FIELD[role];
  const res = await Member.updateOne(
    { _id: memberId, ownerId: oid },
    { $set: { [field]: photoId ? new Types.ObjectId(photoId) : null } },
  );
  return res.matchedCount > 0;
}

export async function getMemberPhotos(ownerId: string, memberId: string) {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);
  const photos = await MemberPhoto.find({ ownerId: oid, memberId })
    .select("takenAt")
    .sort({ takenAt: -1, createdAt: -1 })
    .lean();
  return photos.map((p) => ({
    id: String(p._id),
    takenAt: p.takenAt ? new Date(p.takenAt).toISOString() : null,
  }));
}

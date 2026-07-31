import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Member } from "@/models/Member";
import { MemberPhoto } from "@/models/MemberPhoto";
import type { MemberStatus } from "@/lib/types";

export type Transformation = {
  id: string;
  name: string;
  status: MemberStatus;
  beforePhotoId: string;
  afterPhotoId: string;
  beforeAt: string | null;
  afterAt: string | null;
};

/** Members who have both a before and an after photo set. */
export async function getTransformations(
  ownerId: string,
): Promise<Transformation[]> {
  await connectDB();
  const oid = new Types.ObjectId(ownerId);

  const members = await Member.find({
    ownerId: oid,
    beforePhotoId: { $ne: null },
    afterPhotoId: { $ne: null },
  })
    .select("name status beforePhotoId afterPhotoId")
    .sort({ updatedAt: -1 })
    .lean();

  const photoIds = members
    .flatMap((m) => [m.beforePhotoId, m.afterPhotoId])
    .filter(Boolean)
    .map(String);
  const photos = await MemberPhoto.find({ _id: { $in: photoIds }, ownerId: oid })
    .select("takenAt")
    .lean();
  const dateMap = new Map(
    photos.map((p) => [
      String(p._id),
      p.takenAt ? new Date(p.takenAt).toISOString() : null,
    ]),
  );

  return members.map((m) => ({
    id: String(m._id),
    name: m.name,
    status: m.status as MemberStatus,
    beforePhotoId: String(m.beforePhotoId),
    afterPhotoId: String(m.afterPhotoId),
    beforeAt: dateMap.get(String(m.beforePhotoId)) ?? null,
    afterAt: dateMap.get(String(m.afterPhotoId)) ?? null,
  }));
}

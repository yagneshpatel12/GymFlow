import { z } from "zod";
import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import {
  createPhoto,
  setPhotoRole,
  memberBelongsToOwner,
} from "@/lib/data/photos";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Ctx = { params: Promise<{ id: string }> };

const uploadSchema = z.object({
  data: z.string().startsWith("data:image/", "Invalid image"),
  takenAt: z.string().optional(),
});

const roleSchema = z.object({
  role: z.enum(["profile", "before", "after"]),
  photoId: z.string().nullable(),
});

// Upload a new photo for this member
export async function POST(req: Request, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);
    const { id } = await params;
    if (!(await memberBelongsToOwner(session.id, id)))
      return fail("Member not found", 404);
    const body = uploadSchema.parse(await req.json());
    const photoId = await createPhoto(session.id, id, body.data, body.takenAt);
    return ok({ ok: true, id: photoId }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError)
      return fail(err.issues[0]?.message ?? "Invalid input", 422);
    console.error("[photos POST]", err);
    return fail(err instanceof Error ? err.message : "Upload failed", 500);
  }
}

// Set a photo as profile / before / after (photoId null clears it)
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);
    const { id } = await params;
    const body = roleSchema.parse(await req.json());
    const done = await setPhotoRole(session.id, id, body.role, body.photoId);
    if (!done) return fail("Member not found", 404);
    return ok({ ok: true });
  } catch (err) {
    if (err instanceof ZodError)
      return fail(err.issues[0]?.message ?? "Invalid input", 422);
    console.error("[photos PATCH]", err);
    return fail("Could not update photo", 500);
  }
}

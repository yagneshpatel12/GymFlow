import { getSession } from "@/lib/auth";
import { getPhotoBytes, deletePhoto } from "@/lib/data/photos";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// Serve the raw image (cookie auth - <img> sends it automatically, same-origin)
export async function GET(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const photo = await getPhotoBytes(session.id, id);
  if (!photo) return fail("Not found", 404);

  const body = new Uint8Array(photo.data);
  return new Response(body, {
    headers: {
      "Content-Type": photo.contentType || "image/jpeg",
      "Cache-Control": "private, max-age=86400",
    },
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const done = await deletePhoto(session.id, id);
  if (!done) return fail("Not found", 404);
  return ok({ ok: true });
}

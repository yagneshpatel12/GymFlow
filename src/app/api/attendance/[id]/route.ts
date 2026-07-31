import { getSession } from "@/lib/auth";
import { deleteCheckin } from "@/lib/data/attendance-mutations";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const removed = await deleteCheckin(session.id, id);
  if (!removed) return fail("Check-in not found", 404);
  return ok({ ok: true });
}

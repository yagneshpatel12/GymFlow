import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import { updateClass, deleteClass } from "@/lib/data/class-mutations";
import { classInput } from "@/lib/validation";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);
    const { id } = await params;
    const input = classInput.parse(await req.json());
    const updated = await updateClass(session.id, id, input);
    if (!updated) return fail("Class not found", 404);
    return ok({ ok: true });
  } catch (err) {
    if (err instanceof ZodError)
      return fail(err.issues[0]?.message ?? "Invalid input", 422);
    console.error("[classes PATCH]", err);
    return fail("Could not update class", 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const removed = await deleteClass(session.id, id);
  if (!removed) return fail("Class not found", 404);
  return ok({ ok: true });
}

import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import { updateTrainer, deleteTrainer } from "@/lib/data/trainer-mutations";
import { trainerInput } from "@/lib/validation";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);
    const { id } = await params;
    const input = trainerInput.parse(await req.json());
    const updated = await updateTrainer(session.id, id, input);
    if (!updated) return fail("Trainer not found", 404);
    return ok({ ok: true });
  } catch (err) {
    if (err instanceof ZodError)
      return fail(err.issues[0]?.message ?? "Invalid input", 422);
    console.error("[trainers PATCH]", err);
    return fail("Could not update trainer", 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const removed = await deleteTrainer(session.id, id);
  if (!removed) return fail("Trainer not found", 404);
  return ok({ ok: true });
}

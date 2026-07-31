import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import { updatePlan, deletePlan } from "@/lib/data/plan-mutations";
import { planInput } from "@/lib/validation";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);
    const { id } = await params;
    const input = planInput.parse(await req.json());
    const updated = await updatePlan(session.id, id, input);
    if (!updated) return fail("Plan not found", 404);
    return ok({ ok: true });
  } catch (err) {
    if (err instanceof ZodError)
      return fail(err.issues[0]?.message ?? "Invalid input", 422);
    console.error("[plans PATCH]", err);
    return fail("Could not update plan", 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const result = await deletePlan(session.id, id);
  if (result.ok) return ok({ ok: true });
  if (result.reason === "in_use")
    return fail(
      `This plan has ${result.count} member${result.count === 1 ? "" : "s"}. Reassign them before deleting.`,
      409,
    );
  return fail("Plan not found", 404);
}

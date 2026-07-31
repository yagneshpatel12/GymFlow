import { getSession } from "@/lib/auth";
import { getPlansPageData } from "@/lib/data/plans";
import { createPlan } from "@/lib/data/plan-mutations";
import { planInput } from "@/lib/validation";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  return ok(await getPlansPageData(session.id));
});

export const POST = handle(async (req) => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const input = planInput.parse(await req.json());
  const id = await createPlan(session.id, input);
  return ok({ ok: true, id }, { status: 201 });
});

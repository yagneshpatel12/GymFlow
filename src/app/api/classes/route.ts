import { getSession } from "@/lib/auth";
import { getClassesPageData } from "@/lib/data/classes";
import { createClass } from "@/lib/data/class-mutations";
import { classInput } from "@/lib/validation";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  return ok(await getClassesPageData(session.id));
});

export const POST = handle(async (req) => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const input = classInput.parse(await req.json());
  const id = await createClass(session.id, input);
  return ok({ ok: true, id }, { status: 201 });
});

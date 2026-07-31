import { getSession } from "@/lib/auth";
import { getMembersPageData } from "@/lib/data/members";
import { createMember } from "@/lib/data/member-mutations";
import { memberInput } from "@/lib/validation";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const data = await getMembersPageData(session.id);
  return ok(data);
});

export const POST = handle(async (req) => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const input = memberInput.parse(await req.json());
  const id = await createMember(session.id, input);
  return ok({ ok: true, id }, { status: 201 });
});

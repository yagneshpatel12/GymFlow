import { ZodError } from "zod";
import { getSession } from "@/lib/auth";
import { getMemberProfile } from "@/lib/data/members";
import { updateMember, deleteMember } from "@/lib/data/member-mutations";
import { memberInput } from "@/lib/validation";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const member = await getMemberProfile(session.id, id);
  if (!member) return fail("Member not found", 404);
  return ok(member);
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return fail("Unauthorized", 401);
    const { id } = await params;
    const input = memberInput.parse(await req.json());
    const updated = await updateMember(session.id, id, input);
    if (!updated) return fail("Member not found", 404);
    return ok({ ok: true });
  } catch (err) {
    if (err instanceof ZodError)
      return fail(err.issues[0]?.message ?? "Invalid input", 422);
    console.error("[members PATCH]", err);
    return fail("Could not update member", 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { id } = await params;
  const removed = await deleteMember(session.id, id);
  if (!removed) return fail("Member not found", 404);
  return ok({ ok: true });
}

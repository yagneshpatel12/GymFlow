import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createCheckin } from "@/lib/data/attendance-mutations";
import { ATTENDANCE_METHODS } from "@/lib/types";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

const schema = z.object({
  memberId: z.string().min(1, "Select a member"),
  method: z.enum(ATTENDANCE_METHODS).default("manual"),
});

export const POST = handle(async (req) => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const { memberId, method } = schema.parse(await req.json());
  const checkin = await createCheckin(session.id, memberId, method);
  if (!checkin) return fail("Member not found", 404);
  return ok({ ok: true, checkin }, { status: 201 });
});

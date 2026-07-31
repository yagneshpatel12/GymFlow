import { getSession } from "@/lib/auth";
import { getTrainersPageData } from "@/lib/data/trainers";
import { createTrainer } from "@/lib/data/trainer-mutations";
import { trainerInput } from "@/lib/validation";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  return ok(await getTrainersPageData(session.id));
});

export const POST = handle(async (req) => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  const input = trainerInput.parse(await req.json());
  const id = await createTrainer(session.id, input);
  return ok({ ok: true, id }, { status: 201 });
});

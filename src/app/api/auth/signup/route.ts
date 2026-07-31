import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { createSession, hashPassword } from "@/lib/auth";
import { handle, ok, fail } from "@/lib/http";
import { signupInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const body = signupInput.parse(await req.json());
  await connectDB();

  const exists = await User.findOne({ email: body.email }).lean();
  if (exists) return fail("An account with that email already exists", 409);

  const passwordHash = await hashPassword(body.password);
  const user = await User.create({
    name: body.name,
    email: body.email,
    passwordHash,
    gymName: body.gymName,
    role: "owner",
    isDemo: false,
  });

  // New gyms start empty - owners populate their own members, classes, and plans.
  await createSession({
    id: String(user._id),
    email: user.email,
    name: user.name,
    gymName: user.gymName,
    role: "owner",
  });

  return ok({ ok: true });
});

import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { createSession, verifyPassword } from "@/lib/auth";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const POST = handle(async (req) => {
  const body = schema.parse(await req.json());
  await connectDB();

  const user = await User.findOne({ email: body.email });
  if (!user) return fail("Invalid email or password", 401);

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) return fail("Invalid email or password", 401);

  await createSession({
    id: String(user._id),
    email: user.email,
    name: user.name,
    gymName: user.gymName,
    role: user.role === "demo" ? "demo" : "owner",
  });

  return ok({ ok: true });
});

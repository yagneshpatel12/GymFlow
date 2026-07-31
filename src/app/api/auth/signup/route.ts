import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { seedOwner } from "@/lib/seed";
import { createSession, hashPassword } from "@/lib/auth";
import { handle, ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gymName: z.string().trim().min(2, "Enter your gym's name"),
});

export const POST = handle(async (req) => {
  const body = schema.parse(await req.json());
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

  // Give new gyms a populated starter dataset so nothing looks empty.
  await seedOwner(String(user._id), { members: 45, attendanceDays: 45 });

  await createSession({
    id: String(user._id),
    email: user.email,
    name: user.name,
    gymName: user.gymName,
    role: "owner",
  });

  return ok({ ok: true });
});

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { seedDemo } from "@/lib/seed";
import { createSession } from "@/lib/auth";
import { handle, ok } from "@/lib/http";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// One-click demo entry. Ensures the demo gym exists (seeds on first use),
// then logs the visitor into it - no signup required.
export const POST = handle(async () => {
  await connectDB();
  const email = (process.env.DEMO_EMAIL || "demo@gymflow.app").toLowerCase();

  let demo = await User.findOne({ email });
  if (!demo || !demo.seeded) {
    await seedDemo();
    demo = await User.findOne({ email });
  }
  if (!demo) throw new Error("Could not initialize demo account");

  await createSession({
    id: String(demo._id),
    email: demo.email,
    name: demo.name,
    gymName: demo.gymName,
    role: "demo",
  });

  return ok({ ok: true });
});

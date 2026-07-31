import { NextResponse } from "next/server";
import { seedDemo } from "@/lib/seed";

// Guarded seed endpoint. Trigger with:
//   curl -X POST "http://localhost:3000/api/seed?secret=YOUR_SEED_SECRET"
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret =
    url.searchParams.get("secret") || req.headers.get("x-seed-secret");

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await seedDemo();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[seed] failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Seed failed" },
      { status: 500 },
    );
  }
}

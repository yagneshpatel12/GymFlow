import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Wrap a route handler with uniform error handling. */
export function handle(
  fn: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req) => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof ZodError) {
        return fail(err.issues[0]?.message ?? "Invalid input", 422);
      }
      console.error("[api] error:", err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      return fail(message, 500);
    }
  };
}

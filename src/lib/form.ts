import type { ZodType } from "zod";

/**
 * Run a Zod schema against form data and return field-keyed error messages,
 * so client forms can show inline validation using the same rules as the API.
 */
export function validateForm<T>(schema: ZodType<T>, data: unknown) {
  const res = schema.safeParse(data);
  if (res.success) {
    return { ok: true as const, data: res.data, errors: {} as Record<string, string> };
  }
  const errors: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false as const, data: null, errors };
}

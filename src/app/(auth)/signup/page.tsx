"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { validateForm } from "@/lib/form";
import { signupInput } from "@/lib/validation";

const PERKS = [
  "Fully populated starter data - never a blank screen",
  "Unlimited members & classes on the free trial",
  "No credit card required",
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gymName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    // Clear a field's error as soon as the user edits it.
    setFieldErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const check = validateForm(signupInput, form);
    if (!check.ok) {
      setFieldErrors(check.errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sign up failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Start running your gym on GymFlow
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Create your account - we&apos;ll set up a sample gym so you can explore
        right away.
      </p>

      <ul className="mt-5 space-y-2">
        {PERKS.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-3 w-3" />
            </span>
            {p}
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={form.name} onChange={set("name")} placeholder="Alex Morgan" aria-invalid={!!fieldErrors.name} />
            <FieldError>{fieldErrors.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="gymName">Gym name</Label>
            <Input id="gymName" value={form.gymName} onChange={set("gymName")} placeholder="Ironworks Fitness" aria-invalid={!!fieldErrors.gymName} />
            <FieldError>{fieldErrors.gymName}</FieldError>
          </div>
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@gym.com" aria-invalid={!!fieldErrors.email} />
          <FieldError>{fieldErrors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" aria-invalid={!!fieldErrors.password} />
          <FieldError>{fieldErrors.password}</FieldError>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Log in
        </Link>
      </p>
    </div>
  );
}

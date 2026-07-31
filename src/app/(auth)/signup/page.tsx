"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { validateForm } from "@/lib/form";
import { signupInput } from "@/lib/validation";

const PERKS = [
  "Your own gym, ready in seconds - add members and go",
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
  const [loading, setLoading] = useState<null | "signup" | "demo">(null);

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

    setLoading("signup");
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
      setLoading(null);
    }
  }

  async function demoLogin() {
    setError(null);
    setLoading("demo");
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start demo");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start demo");
      setLoading(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Start running your gym on GymFlow
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Create your account and start adding members, classes, and plans right
        away.
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
          <PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" aria-invalid={!!fieldErrors.password} />
          <FieldError>{fieldErrors.password}</FieldError>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading !== null}>
          {loading === "signup" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Log in
        </Link>
      </p>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={demoLogin}
        disabled={loading !== null}
        className="group flex w-full items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-2.5 text-left transition-all hover:border-brand-300 hover:bg-brand-100 hover:shadow-sm disabled:opacity-70"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-brand">
          {loading === "demo" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">
            {loading === "demo" ? "Loading demo…" : "View demo dashboard"}
          </span>
          <span className="block text-xs text-slate-500">
            No signup - explore a live, fully-loaded gym
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5" />
      </button>
      <p className="mt-2 text-center text-xs font-medium text-brand-600">
        👆 Reviewing this project? Start here
      </p>
    </div>
  );
}

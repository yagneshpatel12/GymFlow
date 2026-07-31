"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { validateForm } from "@/lib/form";
import { loginInput } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<null | "login" | "demo">(null);

  const clearFieldError = (k: string) =>
    setFieldErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const check = validateForm(loginInput, { email, password });
    if (!check.ok) {
      setFieldErrors(check.errors);
      return;
    }
    setFieldErrors({});

    setLoading("login");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Log in to manage your gym.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@gym.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            aria-invalid={!!fieldErrors.email}
          />
          <FieldError>{fieldErrors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            aria-invalid={!!fieldErrors.password}
          />
          <FieldError>{fieldErrors.password}</FieldError>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading !== null}>
          {loading === "login" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        New to GymFlow?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Create an account
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

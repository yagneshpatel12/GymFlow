import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-xs transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-rose-500/20";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-10", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(fieldBase, "min-h-24 py-2.5", className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldBase,
        "h-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({
  className,
  required,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-medium text-slate-700",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-medium text-rose-600">{children}</p>;
}

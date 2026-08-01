"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   Toast notifications
   A single app-wide stack (portal-rendered, above modals) that surfaces the
   result of every add / edit / delete. Call it via the useToast() hook:

     const toast = useToast();
     toast.success("Member added", "Jordan Diaz is now on your roster.");
     toast.error("Could not save member", err.message);

   Toasts auto-dismiss (pause on hover) and can be closed manually.
---------------------------------------------------------------------------- */

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
};

type ToastInput = string | { title: string; description?: string; duration?: number };

type ToastApi = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  show: (variant: ToastVariant, input: ToastInput) => void;
};

const ToastContext = React.createContext<ToastApi | null>(null);

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  info: 4000,
  error: 6000,
};

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const api = React.useMemo<ToastApi>(() => {
    const show = (variant: ToastVariant, input: ToastInput) => {
      const item: ToastItem =
        typeof input === "string"
          ? { id: ++idCounter, variant, title: input, duration: DEFAULT_DURATION[variant] }
          : {
              id: ++idCounter,
              variant,
              title: input.title,
              description: input.description,
              duration: input.duration ?? DEFAULT_DURATION[variant],
            };
      // Cap the stack so it never overwhelms the screen.
      setToasts((list) => [...list.slice(-2), item]);
    };
    return {
      show,
      success: (title, description) => show("success", { title, description }),
      error: (title, description) => show("error", { title, description }),
      info: (title, description) => show("info", { title, description }),
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            aria-live="polite"
            aria-relevant="additions"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2.5 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
          >
            {toasts.map((t) => (
              <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

const VARIANT_META: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; chip: string; accent: string; ring: string; role: "status" | "alert" }
> = {
  success: {
    icon: CheckCircle2,
    chip: "bg-brand-50 text-brand-600",
    accent: "bg-brand-500",
    ring: "ring-brand-100",
    role: "status",
  },
  error: {
    icon: AlertCircle,
    chip: "bg-rose-50 text-rose-600",
    accent: "bg-rose-500",
    ring: "ring-rose-100",
    role: "alert",
  },
  info: {
    icon: Info,
    chip: "bg-slate-100 text-slate-600",
    accent: "bg-slate-400",
    ring: "ring-slate-100",
    role: "status",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const meta = VARIANT_META[toast.variant];
  const Icon = meta.icon;
  const [leaving, setLeaving] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  // Auto-dismiss timer that respects hover-to-pause. Recomputed whenever the
  // toast is (un)paused so the remaining time is honored.
  const remaining = React.useRef(toast.duration);
  const startedAt = React.useRef(0);

  const close = React.useCallback(() => {
    setLeaving(true);
    // Let the exit animation play before removing from the stack.
    window.setTimeout(() => onDismiss(toast.id), 200);
  }, [onDismiss, toast.id]);

  React.useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(close, remaining.current);
    return () => {
      remaining.current -= Date.now() - startedAt.current;
      window.clearTimeout(timer);
    };
  }, [paused, close]);

  return (
    <div
      role={meta.role}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg ring-1 sm:w-80",
        meta.ring,
        leaving ? "animate-toast-out" : "animate-toast-in",
      )}
    >
      <div className="flex items-start gap-3 p-3.5 pr-9">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            meta.chip,
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-[13px] leading-snug text-slate-500">
              {toast.description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={close}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Countdown bar - visually ties the toast to its auto-dismiss */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-100">
        <div
          className={cn("h-full origin-left", meta.accent)}
          style={{
            animation: `toast-progress ${toast.duration}ms linear forwards`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
}

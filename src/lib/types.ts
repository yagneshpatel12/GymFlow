// Shared domain enums + literal unions used across models, API and UI.

export const MEMBER_STATUSES = [
  "active",
  "trial",
  "frozen",
  "expired",
  "cancelled",
] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export const PLAN_INTERVALS = ["monthly", "quarterly", "annual"] as const;
export type PlanInterval = (typeof PLAN_INTERVALS)[number];

export const CLASS_TYPES = [
  "strength",
  "hiit",
  "yoga",
  "spin",
  "crossfit",
  "boxing",
  "pilates",
  "zumba",
  "mobility",
] as const;
export type ClassType = (typeof CLASS_TYPES)[number];

export const ATTENDANCE_METHODS = ["qr", "manual", "app", "kiosk"] as const;
export type AttendanceMethod = (typeof ATTENDANCE_METHODS)[number];

export const TRAINER_STATUSES = ["active", "off", "away"] as const;
export type TrainerStatus = (typeof TRAINER_STATUSES)[number];

export const PAYMENT_METHODS = ["cash", "upi", "card", "bank"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_META: Record<
  PaymentMethod,
  { label: string; tone: "success" | "info" | "brand" | "neutral" }
> = {
  cash: { label: "Cash", tone: "success" },
  upi: { label: "UPI", tone: "brand" },
  card: { label: "Card", tone: "info" },
  bank: { label: "Bank transfer", tone: "neutral" },
};

// Tailwind tone mapping for class types (used by the weekly calendar).
export const CLASS_TYPE_META: Record<
  ClassType,
  { label: string; hex: string; soft: string; text: string }
> = {
  strength: { label: "Strength", hex: "#4f46e5", soft: "#eef2ff", text: "#4338ca" },
  hiit: { label: "HIIT", hex: "#e11d48", soft: "#fff1f2", text: "#be123c" },
  yoga: { label: "Yoga", hex: "#0d9488", soft: "#f0fdfa", text: "#0f766e" },
  spin: { label: "Spin", hex: "#ea580c", soft: "#fff7ed", text: "#c2410c" },
  crossfit: { label: "CrossFit", hex: "#7c3aed", soft: "#f5f3ff", text: "#6d28d9" },
  boxing: { label: "Boxing", hex: "#dc2626", soft: "#fef2f2", text: "#b91c1c" },
  pilates: { label: "Pilates", hex: "#db2777", soft: "#fdf2f8", text: "#be185d" },
  zumba: { label: "Zumba", hex: "#d97706", soft: "#fffbeb", text: "#b45309" },
  mobility: { label: "Mobility", hex: "#0284c7", soft: "#f0f9ff", text: "#0369a1" },
};

export const MEMBER_STATUS_META: Record<
  MemberStatus,
  { label: string; tone: "success" | "info" | "warning" | "danger" | "neutral" }
> = {
  active: { label: "Active", tone: "success" },
  trial: { label: "Trial", tone: "info" },
  frozen: { label: "Frozen", tone: "warning" },
  expired: { label: "Expired", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

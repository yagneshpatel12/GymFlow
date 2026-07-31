import { z } from "zod";
import {
  CLASS_TYPES,
  MEMBER_STATUSES,
  PAYMENT_METHODS,
  PLAN_INTERVALS,
  TRAINER_STATUSES,
} from "@/lib/types";

export const memberInput = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().optional().default(""),
  gender: z.enum(["male", "female", "other", ""]).optional().default(""),
  status: z.enum(MEMBER_STATUSES).default("active"),
  planId: z.string().min(1, "Choose a plan"),
  paymentMethod: z.enum(PAYMENT_METHODS).default("cash"),
  trainerId: z.string().optional().or(z.literal("")),
  joinDate: z.string().optional(),
  address: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  emergencyName: z.string().trim().optional().default(""),
  emergencyPhone: z.string().trim().optional().default(""),
});

export type MemberInput = z.infer<typeof memberInput>;

export const classInput = z.object({
  title: z.string().trim().min(2, "Class name is required"),
  type: z.enum(CLASS_TYPES).default("strength"),
  trainerId: z.string().optional().or(z.literal("")),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm time format"),
  durationMin: z.coerce.number().int().min(15).max(240).default(60),
  capacity: z.coerce.number().int().min(1).max(200).default(20),
  enrolled: z.coerce.number().int().min(0).default(0),
  room: z.string().trim().default("Studio A"),
  intensity: z.enum(["low", "medium", "high"]).default("medium"),
});

export type ClassInput = z.infer<typeof classInput>;

export const trainerInput = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().optional().default(""),
  title: z.string().trim().min(2, "Title is required").default("Personal Trainer"),
  specialties: z
    .array(z.string().trim())
    .or(
      z.string().transform((s) =>
        s.split(",").map((x) => x.trim()).filter(Boolean),
      ),
    )
    .default([]),
  bio: z.string().trim().optional().default(""),
  rating: z.coerce.number().min(0).max(5).default(5),
  status: z.enum(TRAINER_STATUSES).default("active"),
});

export type TrainerInput = z.infer<typeof trainerInput>;

export const planInput = z.object({
  name: z.string().trim().min(2, "Plan name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  interval: z.enum(PLAN_INTERVALS).default("monthly"),
  features: z
    .array(z.string().trim())
    .or(
      z.string().transform((s) =>
        s.split("\n").map((x) => x.trim()).filter(Boolean),
      ),
    )
    .default([]),
  color: z.string().default("brand"),
  isPopular: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export type PlanInput = z.infer<typeof planInput>;

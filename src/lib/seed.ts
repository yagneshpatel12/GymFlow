import bcrypt from "bcryptjs";
import { addMonths, subDays, subMonths, startOfDay } from "date-fns";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Plan } from "@/models/Plan";
import { Trainer } from "@/models/Trainer";
import { Member } from "@/models/Member";
import { GymClass } from "@/models/GymClass";
import { Attendance } from "@/models/Attendance";
import type { ClassType, MemberStatus, PlanInterval } from "@/lib/types";

/* ── tiny PRNG-free random helpers ─────────────────────────────────────── */
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];
const chance = (p: number) => Math.random() < p;
const sampleMany = <T>(arr: readonly T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++)
    out.push(copy.splice(randInt(0, copy.length - 1), 1)[0]);
  return out;
};

const FIRST = [
  "James","Olivia","Liam","Emma","Noah","Ava","Ethan","Sophia","Mason","Isabella",
  "Lucas","Mia","Aiden","Amelia","Caleb","Harper","Ryan","Ella","Nathan","Aria",
  "Marcus","Zoe","Diego","Nina","Omar","Priya","Kenji","Lena","Tariq","Sofia",
  "Hana","Andre","Chloe","Ravi","Grace","Sean","Maya","Victor","Ivy","Dante",
  "Leila","Cole","Nora","Felix","Ruby","Adam","Talia","Jonah","Bella","Kai",
];
const LAST = [
  "Reyes","Nguyen","Patel","Kim","Silva","Okafor","Rossi","Haddad","Cohen","Ali",
  "Torres","Wagner","Ivanov","Mensah","Costa","Larsson","Dubois","Novak","Yamamoto","Suzuki",
  "Bennett","Fletcher","Ramsey","Holloway","Whitfield","Carrington","Delgado","Bianchi","Fischer","Moreno",
];

const CLASS_LIBRARY: { title: string; type: ClassType; intensity: "low" | "medium" | "high" }[] = [
  { title: "Power Strength", type: "strength", intensity: "high" },
  { title: "Sunrise Yoga", type: "yoga", intensity: "low" },
  { title: "HIIT Blast", type: "hiit", intensity: "high" },
  { title: "Spin Ride", type: "spin", intensity: "high" },
  { title: "CrossFit WOD", type: "crossfit", intensity: "high" },
  { title: "Boxing Basics", type: "boxing", intensity: "medium" },
  { title: "Reformer Pilates", type: "pilates", intensity: "medium" },
  { title: "Zumba Party", type: "zumba", intensity: "medium" },
  { title: "Mobility & Recovery", type: "mobility", intensity: "low" },
  { title: "Deadlift Club", type: "strength", intensity: "high" },
  { title: "Vinyasa Flow", type: "yoga", intensity: "low" },
  { title: "Metcon Circuit", type: "hiit", intensity: "high" },
];
const ROOMS = ["Studio A", "Studio B", "Main Floor", "Spin Room", "Mat Room"];
const START_TIMES = ["06:00", "07:30", "09:00", "12:00", "17:30", "18:30", "19:30"];

function nameToEmail(name: string) {
  return (
    name.toLowerCase().replace(/[^a-z]+/g, ".") +
    randInt(1, 99) +
    "@example.com"
  );
}
function phone() {
  return `(${randInt(200, 989)}) ${randInt(200, 989)}-${String(randInt(0, 9999)).padStart(4, "0")}`;
}

/* ── plan definitions ──────────────────────────────────────────────────── */
function planSeeds(ownerId: string) {
  const defs: Array<{
    name: string; price: number; interval: PlanInterval; color: string;
    description: string; features: string[]; isPopular?: boolean; sortOrder: number;
  }> = [
    { name: "Day Pass", price: 15, interval: "monthly", color: "neutral", sortOrder: 0,
      description: "Casual access for drop-ins and visitors.",
      features: ["Full gym floor access", "1-day validity", "Locker included"] },
    { name: "Starter", price: 29, interval: "monthly", color: "sky", sortOrder: 1,
      description: "Everything a beginner needs to build the habit.",
      features: ["Unlimited gym access", "2 group classes / week", "Fitness assessment"] },
    { name: "Standard", price: 49, interval: "monthly", color: "brand", isPopular: true, sortOrder: 2,
      description: "Our most popular plan for consistent members.",
      features: ["Unlimited gym access", "Unlimited group classes", "1 PT session / month", "Nutrition guide"] },
    { name: "Premium", price: 89, interval: "monthly", color: "violet", sortOrder: 3,
      description: "Full-service training with personal coaching.",
      features: ["Everything in Standard", "4 PT sessions / month", "Recovery & sauna access", "Priority booking"] },
    { name: "Annual Pro", price: 799, interval: "annual", color: "amber", sortOrder: 4,
      description: "Best value - a full year, two months free.",
      features: ["Everything in Premium", "12 months access", "Guest passes ×6", "Free branded kit"] },
  ];
  return defs.map((d) => ({ ...d, ownerId, isActive: true }));
}

/* ── trainers ──────────────────────────────────────────────────────────── */
function trainerSeeds(ownerId: string) {
  const defs = [
    { name: "Marcus Reyes", title: "Head Strength Coach", specialties: ["Strength", "Powerlifting", "CrossFit"] },
    { name: "Elena Rossi", title: "Yoga & Mobility Lead", specialties: ["Yoga", "Mobility", "Pilates"] },
    { name: "Andre Mensah", title: "HIIT & Conditioning", specialties: ["HIIT", "Spin", "Conditioning"] },
    { name: "Priya Patel", title: "Personal Trainer", specialties: ["Weight Loss", "Nutrition", "Strength"] },
    { name: "Kenji Yamamoto", title: "Boxing Coach", specialties: ["Boxing", "Kickboxing", "Agility"] },
    { name: "Sofia Delgado", title: "Group Fitness Instructor", specialties: ["Zumba", "Spin", "Dance"] },
    { name: "Cole Bennett", title: "Personal Trainer", specialties: ["Hypertrophy", "Strength", "Rehab"] },
    { name: "Maya Holloway", title: "Pilates Instructor", specialties: ["Pilates", "Mobility", "Prenatal"] },
  ];
  return defs.map((d, i) => ({
    ownerId,
    name: d.name,
    email: nameToEmail(d.name).replace("example.com", "gymflow.app"),
    phone: phone(),
    title: d.title,
    specialties: d.specialties,
    bio: `${d.name.split(" ")[0]} brings ${randInt(4, 14)} years of coaching experience, helping members train smarter and stay consistent.`,
    rating: Math.round((4.3 + Math.random() * 0.7) * 10) / 10,
    status: i === 5 ? "away" : "active",
    hireDate: subMonths(new Date(), randInt(3, 48)),
    monthlyClasses: randInt(12, 40),
  }));
}

/* ── main entry: seed a full gym for one owner ─────────────────────────── */
export async function seedOwner(
  ownerId: string,
  opts: { members?: number; attendanceDays?: number } = {},
) {
  const memberCount = opts.members ?? 140;
  const attendanceDays = opts.attendanceDays ?? 90;

  // Clean any prior data for this owner (idempotent re-seed).
  await Promise.all([
    Plan.deleteMany({ ownerId }),
    Trainer.deleteMany({ ownerId }),
    Member.deleteMany({ ownerId }),
    GymClass.deleteMany({ ownerId }),
    Attendance.deleteMany({ ownerId }),
  ]);

  const plans = await Plan.insertMany(planSeeds(ownerId));
  const trainers = await Trainer.insertMany(trainerSeeds(ownerId));

  // Members with a realistic status distribution.
  const statusRoll = (): MemberStatus => {
    const r = Math.random();
    if (r < 0.7) return "active";
    if (r < 0.79) return "trial";
    if (r < 0.86) return "frozen";
    if (r < 0.94) return "expired";
    return "cancelled";
  };
  const paidPlans = plans.filter((p) => p.name !== "Day Pass");

  const now = new Date();
  const members = Array.from({ length: memberCount }).map(() => {
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    const status = statusRoll();
    const plan = pick(paidPlans);
    const joinDate = subDays(now, randInt(5, 720));
    const renewalDate = addMonths(
      joinDate,
      plan.interval === "annual" ? 12 : plan.interval === "quarterly" ? 3 : 1,
    );
    const isActiveish = status === "active" || status === "trial";
    return {
      ownerId,
      name,
      email: nameToEmail(name),
      phone: phone(),
      gender: pick(["male", "female", "female", "male", "other"] as const),
      status,
      planId: plan._id,
      paymentMethod: pick(["cash", "cash", "upi", "upi", "upi", "card", "bank"] as const),
      lastPaymentAt: subDays(now, randInt(0, 55)),
      trainerId: chance(0.4) ? pick(trainers)._id : undefined,
      joinDate,
      renewalDate,
      lastVisit: isActiveish ? subDays(now, randInt(0, 9)) : subDays(now, randInt(20, 120)),
      visitsThisMonth: isActiveish ? randInt(2, 22) : randInt(0, 3),
      emergencyContact: { name: `${pick(FIRST)} ${pick(LAST)}`, phone: phone() },
      notes: "",
    };
  });
  const memberDocs = await Member.insertMany(members);

  // Weekly recurring class schedule (Mon-Sat busy, Sun light).
  const classes: Array<Record<string, unknown>> = [];
  for (let day = 0; day <= 6; day++) {
    const slotsToday = day === 0 ? 3 : randInt(5, 7);
    const times = sampleMany(START_TIMES, slotsToday).sort();
    for (const startTime of times) {
      const lib = pick(CLASS_LIBRARY);
      const capacity = pick([12, 16, 20, 24, 30]);
      classes.push({
        ownerId,
        title: lib.title,
        type: lib.type,
        intensity: lib.intensity,
        trainerId: pick(trainers)._id,
        dayOfWeek: day,
        startTime,
        durationMin: pick([45, 45, 60, 60, 60, 75]),
        capacity,
        enrolled: randInt(Math.floor(capacity * 0.4), capacity),
        room: pick(ROOMS),
      });
    }
  }
  await GymClass.insertMany(classes);

  // 90 days of attendance history to drive the trend charts.
  const activeMembers = memberDocs.filter(
    (m) => m.status === "active" || m.status === "trial",
  );
  const attendance: Array<Record<string, unknown>> = [];
  for (let d = attendanceDays; d >= 0; d--) {
    const day = subDays(startOfDay(now), d);
    const weekday = day.getDay();
    // Busier early week, lighter weekends.
    const base = weekday === 0 ? 0.18 : weekday === 6 ? 0.28 : 0.42;
    for (const m of activeMembers) {
      if (chance(base)) {
        const hour = pick([6, 7, 8, 9, 12, 17, 18, 19, 20]);
        const checkInAt = new Date(day);
        checkInAt.setHours(hour, randInt(0, 59), 0, 0);
        attendance.push({
          ownerId,
          memberId: m._id,
          checkInAt,
          method: pick(["qr", "qr", "app", "manual", "kiosk"] as const),
        });
      }
    }
  }
  await Attendance.insertMany(attendance);

  await User.updateOne({ _id: ownerId }, { $set: { seeded: true } });

  return {
    plans: plans.length,
    trainers: trainers.length,
    members: memberDocs.length,
    classes: classes.length,
    attendance: attendance.length,
  };
}

/* ── demo account: created + richly seeded, used by the login page ─────── */
export async function seedDemo() {
  await connectDB();
  const email = (process.env.DEMO_EMAIL || "demo@gymflow.app").toLowerCase();
  const password = process.env.DEMO_PASSWORD || "demo1234";
  const passwordHash = await bcrypt.hash(password, 10);

  const demo = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Alex Morgan",
        email,
        passwordHash,
        gymName: "Ironworks Fitness",
        role: "demo",
        isDemo: true,
        avatarColor: "brand",
      },
    },
    { upsert: true, new: true },
  );

  const result = await seedOwner(String(demo._id), { members: 140, attendanceDays: 90 });
  return { demoId: String(demo._id), email, ...result };
}

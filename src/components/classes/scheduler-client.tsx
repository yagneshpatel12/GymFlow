"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, startOfWeek } from "date-fns";
import { Clock, Loader2, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { ClassFormModal } from "@/components/classes/class-form-modal";
import { cn } from "@/lib/utils";
import {
  CLASS_TYPES,
  CLASS_TYPE_META,
  DAYS,
  type ClassType,
} from "@/lib/types";
import type { ClassRow } from "@/lib/data/classes";
import type { TrainerOption } from "@/lib/data/members";

const DAY_START = 6 * 60; // 06:00
const DAY_END = 22 * 60; // 22:00
const HOUR_PX = 56;
const TOTAL_MIN = DAY_END - DAY_START;
const HEIGHT = (TOTAL_MIN / 60) * HOUR_PX;
const HOURS = Array.from({ length: TOTAL_MIN / 60 + 1 }, (_, i) => 6 + i);
// Display Monday-first.
const DISPLAY = [1, 2, 3, 4, 5, 6, 0];

const parse = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmt12 = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
};

type Positioned = ClassRow & { _lane: number; _cols: number };

function layoutDay(items: ClassRow[]): Positioned[] {
  const evs = items
    .map((c) => ({
      c,
      start: parse(c.startTime),
      end: parse(c.startTime) + c.durationMin,
      lane: 0,
      cols: 1,
    }))
    .sort((a, b) => a.start - b.start || a.end - b.end);

  let i = 0;
  while (i < evs.length) {
    let clusterEnd = evs[i].end;
    const cluster = [evs[i]];
    let j = i + 1;
    while (j < evs.length && evs[j].start < clusterEnd) {
      clusterEnd = Math.max(clusterEnd, evs[j].end);
      cluster.push(evs[j]);
      j++;
    }
    const laneEnds: number[] = [];
    for (const e of cluster) {
      let placed = false;
      for (let l = 0; l < laneEnds.length; l++) {
        if (e.start >= laneEnds[l]) {
          e.lane = l;
          laneEnds[l] = e.end;
          placed = true;
          break;
        }
      }
      if (!placed) {
        e.lane = laneEnds.length;
        laneEnds.push(e.end);
      }
    }
    for (const e of cluster) e.cols = laneEnds.length;
    i = j;
  }
  return evs.map((e) => ({ ...e.c, _lane: e.lane, _cols: e.cols }));
}

export function SchedulerClient({
  classes,
  trainers,
}: {
  classes: ClassRow[];
  trainers: TrainerOption[];
}) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<ClassType | "all">("all");
  const [trainerFilter, setTrainerFilter] = useState<string>("all");

  const [addOpen, setAddOpen] = useState(false);
  const [addDay, setAddDay] = useState(1);
  const [editClass, setEditClass] = useState<ClassRow | null>(null);
  const [selected, setSelected] = useState<ClassRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(
    () =>
      classes.filter(
        (c) =>
          (typeFilter === "all" || c.type === typeFilter) &&
          (trainerFilter === "all" || c.trainerId === trainerFilter),
      ),
    [classes, typeFilter, trainerFilter],
  );

  const byDay = useMemo(() => {
    const map: Record<number, ClassRow[]> = {};
    for (const d of DISPLAY) map[d] = [];
    for (const c of filtered) map[c.dayOfWeek]?.push(c);
    return map;
  }, [filtered]);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const todayDow = new Date().getDay();
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const showNow = nowMin >= DAY_START && nowMin <= DAY_END;

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/classes/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      setSelected(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            value={typeFilter}
            onChange={(v) => setTypeFilter(v as ClassType | "all")}
            className="w-40"
            options={[
              { value: "all", label: "All types" },
              ...CLASS_TYPES.map((t) => ({
                value: t,
                label: CLASS_TYPE_META[t].label,
              })),
            ]}
          />
          <Dropdown
            value={trainerFilter}
            onChange={setTrainerFilter}
            className="w-44"
            options={[
              { value: "all", label: "All trainers" },
              ...trainers.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
          <span className="hidden text-sm text-slate-400 sm:inline">
            {filtered.length} classes / week
          </span>
        </div>
        <Button
          onClick={() => {
            setAddDay(todayDow === 0 ? 1 : todayDow);
            setAddOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add class
        </Button>
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          {/* Header row */}
          <div
            className="grid border-b border-slate-100"
            style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}
          >
            <div />
            {DISPLAY.map((dow, i) => {
              const date = addDays(weekStart, i);
              const isToday = dow === todayDow;
              return (
                <div
                  key={dow}
                  className={cn(
                    "border-l border-slate-100 px-3 py-2.5 text-center",
                    isToday && "bg-brand-50/50",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs font-medium uppercase tracking-wide",
                      isToday ? "text-brand-600" : "text-slate-400",
                    )}
                  >
                    {DAYS[dow].slice(0, 3)}
                  </div>
                  <div
                    className={cn(
                      "mt-0.5 text-lg font-semibold",
                      isToday ? "text-brand-700" : "text-slate-700",
                    )}
                  >
                    {format(date, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div
            className="relative grid"
            style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}
          >
            {/* Time gutter */}
            <div className="relative" style={{ height: HEIGHT }}>
              {HOURS.map((h, idx) => (
                <div
                  key={h}
                  className="absolute right-2 -translate-y-1/2 text-[11px] font-medium text-slate-400"
                  style={{ top: idx * HOUR_PX }}
                >
                  {h % 12 === 0 ? 12 : h % 12} {h >= 12 ? "PM" : "AM"}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DISPLAY.map((dow) => {
              const positioned = layoutDay(byDay[dow] ?? []);
              const isToday = dow === todayDow;
              return (
                <div
                  key={dow}
                  className={cn(
                    "relative border-l border-slate-100",
                    isToday && "bg-brand-50/20",
                  )}
                  style={{ height: HEIGHT }}
                >
                  {/* Hour lines */}
                  {HOURS.map((h, idx) => (
                    <div
                      key={h}
                      className="absolute inset-x-0 border-t border-slate-100"
                      style={{ top: idx * HOUR_PX }}
                    />
                  ))}

                  {/* Now indicator */}
                  {isToday && showNow && (
                    <div
                      className="absolute inset-x-0 z-10"
                      style={{ top: ((nowMin - DAY_START) / 60) * HOUR_PX }}
                    >
                      <div className="relative">
                        <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />
                        <div className="border-t border-rose-500" />
                      </div>
                    </div>
                  )}

                  {/* Class blocks */}
                  {positioned.map((c) => {
                    const meta = CLASS_TYPE_META[c.type];
                    const startMin = parse(c.startTime);
                    const rawTop = ((startMin - DAY_START) / 60) * HOUR_PX;
                    const top = Math.max(0, Math.min(rawTop, HEIGHT - 28));
                    const height = Math.max(
                      28,
                      Math.min((c.durationMin / 60) * HOUR_PX, HEIGHT - top),
                    );
                    const widthPct = 100 / c._cols;
                    const compact = height < 52;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className="group absolute overflow-hidden rounded-lg border-l-[3px] px-2 py-1 text-left shadow-xs transition-all hover:z-20 hover:shadow-md"
                        style={{
                          top: top + 1,
                          height: height - 2,
                          left: `calc(${c._lane * widthPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          backgroundColor: meta.soft,
                          borderLeftColor: meta.hex,
                        }}
                      >
                        <div
                          className="truncate text-[12px] font-semibold leading-tight"
                          style={{ color: meta.text }}
                        >
                          {c.title}
                        </div>
                        {!compact && (
                          <>
                            <div className="truncate text-[11px] text-slate-500">
                              {fmt12(startMin)} · {c.room}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                              <Users className="h-3 w-3" />
                              {c.enrolled}/{c.capacity}
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        size="sm"
        title={selected?.title}
        footer={
          <>
            <Button
              variant="outline"
              className="text-rose-600 hover:bg-rose-50"
              onClick={() => selected && setDeleteTarget(selected)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
            <Button
              onClick={() => {
                setEditClass(selected);
                setSelected(null);
              }}
            >
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                tone="neutral"
                style={{
                  backgroundColor: CLASS_TYPE_META[selected.type].soft,
                  color: CLASS_TYPE_META[selected.type].text,
                }}
              >
                {CLASS_TYPE_META[selected.type].label}
              </Badge>
              <Badge tone="neutral" className="capitalize">
                {selected.intensity} intensity
              </Badge>
            </div>
            <DetailRow icon={Clock} text={`${DAYS[selected.dayOfWeek]} · ${fmt12(parse(selected.startTime))} - ${fmt12(parse(selected.startTime) + selected.durationMin)}`} />
            <DetailRow icon={MapPin} text={selected.room} />
            <DetailRow icon={Users} text={`${selected.enrolled} of ${selected.capacity} booked`} />
            <DetailRow icon={Pencil} text={`Coach: ${selected.trainerName}`} />
          </div>
        )}
      </Modal>

      {/* Add / edit modals */}
      <ClassFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => router.refresh()}
        trainers={trainers}
        defaultDay={addDay}
      />
      <ClassFormModal
        open={Boolean(editClass)}
        onClose={() => setEditClass(null)}
        onSaved={() => router.refresh()}
        trainers={trainers}
        gymClass={editClass}
      />

      {/* Delete confirm */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete class"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Remove {deleteTarget?.title} from the weekly schedule?
        </p>
      </Modal>
    </div>
  );
}

function DetailRow({ icon: Icon, text }: { icon: typeof Clock; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600">
      <Icon className="h-4 w-4 text-slate-400" />
      {text}
    </div>
  );
}

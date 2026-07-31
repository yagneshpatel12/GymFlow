import { Skeleton } from "@/components/ui/skeleton";
import { StatTilesSkeleton } from "@/components/ui/skeletons";

export default function ClassesLoading() {
  return (
    <div className="space-y-6">
      <StatTilesSkeleton />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="h-2.5 w-2.5 rounded-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Weekly calendar grid */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-[3rem_repeat(7,1fr)] border-b border-slate-100">
          <div className="p-3" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="border-l border-slate-100 p-3 text-center">
              <Skeleton className="mx-auto h-4 w-10" />
            </div>
          ))}
        </div>

        {/* Time grid with a few placeholder class blocks */}
        <div className="grid grid-cols-[3rem_repeat(7,1fr)]">
          <div className="space-y-8 p-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
          {Array.from({ length: 7 }).map((_, col) => (
            <div
              key={col}
              className="space-y-3 border-l border-slate-100 p-2"
              style={{ minHeight: 360 }}
            >
              {Array.from({ length: (col % 3) + 1 }).map((_, r) => (
                <Skeleton
                  key={r}
                  className="h-14 w-full rounded-lg"
                  style={{ marginTop: r === 0 ? (col % 4) * 20 : 0 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

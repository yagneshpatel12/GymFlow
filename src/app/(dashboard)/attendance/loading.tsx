import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, StatTilesSkeleton } from "@/components/ui/skeletons";

export default function AttendanceLoading() {
  return (
    <div className="space-y-6">
      <StatTilesSkeleton />

      {/* Last 7 days trend */}
      <SkeletonCard>
        <Skeleton className="h-5 w-28" />
        <div
          className="mt-4 flex items-end justify-between gap-3"
          style={{ height: 120 }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <Skeleton
                  className="w-full rounded-t-md"
                  style={{ height: `${30 + ((i * 37) % 65)}%` }}
                />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Check-in panel (2/5) + recent check-ins (3/5) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SkeletonCard>
            <Skeleton className="h-10 w-full" />
            {/* Method picker */}
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </SkeletonCard>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

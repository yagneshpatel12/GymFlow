import { Skeleton } from "@/components/ui/skeleton";
import { StatTilesSkeleton } from "@/components/ui/skeletons";

export default function PlansLoading() {
  return (
    <div className="space-y-6">
      <StatTilesSkeleton />

      {/* Add button row */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
          >
            <Skeleton className="h-1 w-full rounded-none" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <Skeleton className="h-8 w-20" />
              </div>

              <Skeleton className="mt-2 h-3.5 w-4/5" />

              <div className="mt-4 space-y-2.5">
                {Array.from({ length: 4 }).map((_, r) => (
                  <div key={r} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

/** Card shell that matches the app's white rounded card used everywhere. */
export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** One tile matching <StatTile>: label + icon square, then a big value. */
export function StatTileSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-20" />
    </div>
  );
}

/** The 4-up KPI row shared by most modules. */
export function StatTilesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatTileSkeleton key={i} />
      ))}
    </div>
  );
}

/** Title + subtitle + optional action button, matching page headers. */
export function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      {action && <Skeleton className="h-10 w-32" />}
    </div>
  );
}

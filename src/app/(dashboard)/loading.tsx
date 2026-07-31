import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-8 w-24" />
            <Skeleton className="mt-3 h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-[220px] w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 flex justify-center">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

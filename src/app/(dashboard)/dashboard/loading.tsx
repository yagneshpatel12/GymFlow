import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeaderSkeleton,
  SkeletonCard,
  StatTilesSkeleton,
} from "@/components/ui/skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      <StatTilesSkeleton />

      {/* Charts: attendance area (2 cols) + status donut */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonCard className="lg:col-span-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-[220px] w-full rounded-lg" />
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 flex justify-center">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
          </div>
        </SkeletonCard>
      </div>

      {/* Revenue bar + recent activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SkeletonCard className="lg:col-span-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-[200px] w-full rounded-lg" />
        </SkeletonCard>
        <SkeletonCard>
          <Skeleton className="h-5 w-28" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="ml-auto h-3.5 w-10" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

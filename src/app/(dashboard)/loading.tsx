import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, StatTilesSkeleton } from "@/components/ui/skeletons";

/**
 * Neutral fallback skeleton for the dashboard group. Each module has its own
 * loading.tsx shaped to its layout; this only shows for routes that do not.
 */
export default function DashboardGroupLoading() {
  return (
    <div className="space-y-6">
      <StatTilesSkeleton />
      <SkeletonCard>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-64 w-full rounded-lg" />
      </SkeletonCard>
    </div>
  );
}

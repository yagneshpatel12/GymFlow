import { Skeleton } from "@/components/ui/skeleton";

export default function TransformationsLoading() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
          >
            {/* Before / after image pair */}
            <div className="grid grid-cols-2">
              <Skeleton className="aspect-[3/4] rounded-none" />
              <Skeleton className="aspect-[3/4] rounded-none border-l-2 border-white" />
            </div>
            {/* Caption row */}
            <div className="flex items-center justify-between p-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

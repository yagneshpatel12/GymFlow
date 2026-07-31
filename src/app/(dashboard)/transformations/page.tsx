import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Images } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getTransformations } from "@/lib/data/transformations";
import { StatusBadge } from "@/components/members/status-badge";

export const metadata = { title: "Before & After" };

export default async function TransformationsPage() {
  const user = await requireUser();
  const items = await getTransformations(user.id);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Images className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-slate-900">
          No transformations yet
        </p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Open a member, upload their progress photos, then mark one as{" "}
          <span className="font-medium text-amber-600">Before</span> and one as{" "}
          <span className="font-medium text-emerald-600">After</span> - they&apos;ll
          appear here.
        </p>
        <Link
          href="/members"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Go to members <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <Link
            key={t.id}
            href={`/members/${t.id}`}
            className="group block overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="grid grid-cols-2">
              <figure className="relative">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/photos/${t.beforePhotoId}`}
                    alt={`${t.name} before`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="absolute left-2 top-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                  Before
                </figcaption>
                {t.beforeAt && (
                  <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {format(new Date(t.beforeAt), "MMM yyyy")}
                  </span>
                )}
              </figure>
              <figure className="relative border-l-2 border-white">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/photos/${t.afterPhotoId}`}
                    alt={`${t.name} after`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="absolute right-2 top-2 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                  After
                </figcaption>
                {t.afterAt && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {format(new Date(t.afterAt), "MMM yyyy")}
                  </span>
                )}
              </figure>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-semibold text-slate-900">{t.name}</span>
              <StatusBadge status={t.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ImagePlus,
  Loader2,
  MoreVertical,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fileToResizedDataUrl } from "@/lib/image";

type Photo = { id: string; takenAt: string | null };

export function MemberPhotos({
  memberId,
  photos,
  profilePhotoId,
  beforePhotoId,
  afterPhotoId,
}: {
  memberId: string;
  photos: Photo[];
  profilePhotoId: string | null;
  beforePhotoId: string | null;
  afterPhotoId: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const data = await fileToResizedDataUrl(file);
        await fetch(`/api/members/${memberId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
      }
      router.refresh();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function setRole(
    photoId: string,
    role: "profile" | "before" | "after",
    active: boolean,
  ) {
    setBusyId(photoId);
    setMenuId(null);
    try {
      await fetch(`/api/members/${memberId}/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, photoId: active ? null : photoId }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(photoId: string) {
    setBusyId(photoId);
    setMenuId(null);
    try {
      await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Progress photos</CardTitle>
          <p className="mt-0.5 text-sm text-slate-500">
            {photos.length} photo{photos.length === 1 ? "" : "s"} · mark a Before
            &amp; After to feature this member.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-12 text-slate-400 transition-colors hover:border-brand-300 hover:text-brand-500"
          >
            <ImagePlus className="h-7 w-7" />
            <span className="text-sm font-medium">
              Upload the member&apos;s first photo
            </span>
            <span className="text-xs">JPG or PNG, from your computer</span>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p) => {
              const isProfile = p.id === profilePhotoId;
              const isBefore = p.id === beforePhotoId;
              const isAfter = p.id === afterPhotoId;
              return (
                <div
                  key={p.id}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/photos/${p.id}`}
                    alt="Member progress"
                    className="h-full w-full object-cover"
                  />

                  {/* Role badges */}
                  <div className="absolute left-1.5 top-1.5 flex flex-wrap gap-1">
                    {isProfile && <PhotoTag tone="brand">Profile</PhotoTag>}
                    {isBefore && <PhotoTag tone="warning">Before</PhotoTag>}
                    {isAfter && <PhotoTag tone="success">After</PhotoTag>}
                  </div>

                  {/* Date */}
                  {p.takenAt && (
                    <div className="absolute bottom-1.5 left-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {format(new Date(p.takenAt), "MMM d, yyyy")}
                    </div>
                  )}

                  {/* Menu */}
                  <div className="absolute right-1.5 top-1.5">
                    <button
                      onClick={() => setMenuId(menuId === p.id ? null : p.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/45 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/65 group-hover:opacity-100 data-[open=true]:opacity-100"
                      data-open={menuId === p.id}
                    >
                      {busyId === p.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </button>
                    {menuId === p.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuId(null)}
                        />
                        <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                          <MenuItem
                            icon={UserRound}
                            label={isProfile ? "Unset profile" : "Set as profile"}
                            onClick={() => setRole(p.id, "profile", isProfile)}
                          />
                          <MenuItem
                            icon={Star}
                            label={isBefore ? "Unset Before" : "Set as Before"}
                            onClick={() => setRole(p.id, "before", isBefore)}
                          />
                          <MenuItem
                            icon={Star}
                            label={isAfter ? "Unset After" : "Set as After"}
                            onClick={() => setRole(p.id, "after", isAfter)}
                          />
                          <MenuItem
                            icon={Trash2}
                            label="Delete"
                            danger
                            onClick={() => remove(p.id)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PhotoTag({
  tone,
  children,
}: {
  tone: "brand" | "warning" | "success";
  children: React.ReactNode;
}) {
  return (
    <Badge tone={tone} className="px-1.5 py-0 text-[10px] shadow-sm">
      {children}
    </Badge>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Star;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
        danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

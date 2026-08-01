"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type RowMenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
};

const ROW_H = 38;

/**
 * A "..." action menu whose panel is rendered in a portal with fixed
 * positioning, so it is never clipped by a scroll container such as the
 * members table's overflow-x-auto wrapper. Right-aligned to the trigger by
 * default; flips upward when there isn't room below. Closes on outside-click,
 * scroll, resize, and Escape.
 */
export function RowMenu({
  items,
  width = 160,
  align = "right",
  triggerClassName,
  label = "Open actions",
}: {
  items: RowMenuItem[];
  width?: number;
  align?: "left" | "right";
  triggerClassName?: string;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  const place = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelH = items.length * ROW_H + 8;
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < panelH + 12 && r.top > panelH;
    const left = align === "right" ? r.right - width : r.left;
    setPos({
      top: openUp ? r.top - 6 - panelH : r.bottom + 6,
      // Keep the panel within the viewport horizontally.
      left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
    });
  };

  React.useEffect(() => {
    if (!open) return;
    place();
    const onDoc = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        data-open={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600",
          triggerClassName,
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{ top: pos.top, left: pos.left, width }}
            className="animate-fade-in fixed z-[60] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  item.danger
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

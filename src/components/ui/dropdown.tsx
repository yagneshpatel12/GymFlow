"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = { value: string; label: string };

const ROW_H = 40;

/**
 * A fully custom select/listbox that matches the design system. The open panel
 * is rendered in a portal with fixed positioning so it is never clipped by a
 * modal's scroll container (a native <select> escapes via the OS top layer;
 * this replicates that). Flips upward when there isn't room below, closes on
 * outside-click / scroll / resize, and Escape closes only the dropdown.
 */
export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => setMounted(true), []);

  const place = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelH = Math.min(options.length * ROW_H + 8, 264);
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < panelH + 12 && r.top > panelH;
    setPos({
      top: openUp ? r.top - 6 - panelH : r.bottom + 6,
      left: r.left,
      width: r.width,
    });
  };

  useEffect(() => {
    if (open && pos) activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [open, pos]);

  useEffect(() => {
    if (!open) return;
    place();
    const onDoc = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    // Capture phase + stopImmediatePropagation so Escape closes the dropdown
    // without also triggering a parent modal's Escape handler.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setOpen(false);
      }
    };
    // Close when the page/modal behind scrolls, but NOT when the options list
    // itself scrolls (including our auto-scroll-to-selected on open).
    const onScroll = (e: Event) => {
      if (e.target instanceof Node && panelRef.current?.contains(e.target)) {
        return;
      }
      setOpen(false);
    };
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
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 text-sm text-slate-700 shadow-xs transition-colors hover:border-slate-300 focus-visible:outline-none",
          open ? "border-brand-500 ring-2 ring-brand-500/20" : "border-slate-200",
          className,
        )}
      >
        <span className={cn("truncate", !selected && "text-slate-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {mounted &&
        open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="animate-fade-in fixed z-[60] max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  ref={active ? activeRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-brand-50 font-medium text-brand-700"
                      : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {active && (
                    <Check className="h-4 w-4 shrink-0 text-brand-600" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Dumbbell,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Users,
  UserCog,
  X,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Class Schedule", href: "/classes", icon: CalendarDays },
  { label: "Attendance", href: "/attendance", icon: QrCode },
  { label: "Before & After", href: "/transformations", icon: Images },
  { label: "Trainers", href: "/trainers", icon: UserCog },
  { label: "Membership Plans", href: "/plans", icon: CreditCard },
];

const STORAGE_KEY = "gf_sidebar_collapsed";

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeNav = NAV.find(
    (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
  );
  const pageTitle = activeNav?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-canvas">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
        )}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-[72px] z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-sm transition-colors hover:bg-slate-700 hover:text-white lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-800",
            collapsed ? "justify-center px-0" : "justify-between px-5",
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-brand">
              <Dumbbell className="h-5 w-5" />
            </span>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-white">
                GymFlow
              </span>
            )}
          </Link>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Manage
            </p>
          )}
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-200",
                  )}
                />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>

      {/* Main column */}
      <div className={cn(collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar
          user={user}
          title={pageTitle}
          onMenu={() => setMobileOpen(true)}
        />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function Topbar({
  user,
  title,
  onMenu,
}: {
  user: SessionUser;
  title: string;
  onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        onClick={onMenu}
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        {user.role === "demo" && (
          <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Demo mode
          </span>
        )}
        <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials(user.name)}
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              {user.name}
            </div>
            <div className="text-xs text-slate-500">{user.gymName}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoutButton({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      title={collapsed ? "Log out" : undefined}
      className={cn(
        "flex w-full items-center rounded-lg text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-60",
        collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2.5",
      )}
    >
      <LogOut className="h-[18px] w-[18px] shrink-0 text-slate-400" />
      {!collapsed && <span>{loading ? "Logging out…" : "Log out"}</span>}
    </button>
  );
}

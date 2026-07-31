import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { AuthBrandPanel } from "@/components/auth/brand-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel with looping clips */}
      <AuthBrandPanel />

      {/* Form panel */}
      <main className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Dumbbell className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">GymFlow</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm animate-fade-up">{children}</div>
        </div>
      </main>
    </div>
  );
}

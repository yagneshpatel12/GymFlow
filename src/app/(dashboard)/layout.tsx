import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { ToastProvider } from "@/components/ui/toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <ToastProvider>
      <DashboardShell user={user}>{children}</DashboardShell>
    </ToastProvider>
  );
}

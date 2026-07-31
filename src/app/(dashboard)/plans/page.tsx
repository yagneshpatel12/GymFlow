import { CreditCard, DollarSign, Star, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getPlansPageData } from "@/lib/data/plans";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { StatTile } from "@/components/dashboard/stat-tile";
import { PlansClient } from "@/components/plans/plans-client";

export const metadata = { title: "Membership Plans" };

export default async function PlansPage() {
  const user = await requireUser();
  const { plans, stats } = await getPlansPageData(user.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Plans offered" value={formatNumber(stats.total)} icon={CreditCard} />
        <StatTile label="Members on plans" value={formatNumber(stats.totalActive)} icon={Users} />
        <StatTile label="Monthly revenue" value={formatCurrency(stats.totalMrr)} icon={DollarSign} />
        <StatTile label="Most popular" value={stats.popularName} icon={Star} />
      </div>

      <PlansClient plans={plans} />
    </div>
  );
}

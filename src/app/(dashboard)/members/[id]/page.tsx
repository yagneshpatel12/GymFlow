import Link from "next/link";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  QrCode,
  UserCog,
  Wallet,
} from "lucide-react";
import { PAYMENT_METHOD_META } from "@/lib/types";
import { requireUser } from "@/lib/auth";
import { getMemberProfile, getFormOptions } from "@/lib/data/members";
import { formatCurrency } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/members/status-badge";
import { MemberProfileActions } from "@/components/members/member-profile-actions";
import { MemberPhotos } from "@/components/members/member-photos";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const [member, options] = await Promise.all([
    getMemberProfile(user.id, id),
    getFormOptions(user.id),
  ]);
  if (!member) notFound();

  const intervalLabel =
    member.plan?.interval === "annual"
      ? "/year"
      : member.plan?.interval === "quarterly"
        ? "/quarter"
        : "/month";

  return (
    <div className="space-y-6">
      <Link
        href="/members"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ChevronLeft className="h-4 w-4" /> Back to members
      </Link>

      {/* Header */}
      <Card>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={member.name}
              size="lg"
              src={member.profilePhotoId}
              className="h-14 w-14 text-lg"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {member.name}
                </h1>
                <StatusBadge status={member.status} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {member.email}
                </span>
                {member.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {member.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <MemberProfileActions
              member={member}
              plans={options.plans}
              trainers={options.trainers}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Membership */}
          <Card>
            <CardHeader>
              <CardTitle>Membership</CardTitle>
              <div className="flex items-center gap-2">
                <Badge tone={PAYMENT_METHOD_META[member.paymentMethod].tone}>
                  <Wallet className="h-3 w-3" />
                  {PAYMENT_METHOD_META[member.paymentMethod].label}
                </Badge>
                <Badge tone="brand">{member.plan?.name ?? "No plan"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {member.plan ? formatCurrency(member.plan.price) : "-"}
                </span>
                {member.plan && (
                  <span className="text-sm text-slate-500">{intervalLabel}</span>
                )}
              </div>
              {member.plan?.features?.length ? (
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {member.plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
                <Fact icon={Calendar} label="Member since" value={member.joinDate ? format(new Date(member.joinDate), "MMM yyyy") : "-"} />
                <Fact icon={CreditCard} label="Renews" value={member.renewalDate ? format(new Date(member.renewalDate), "MMM d, yyyy") : "-"} />
                <Fact icon={Wallet} label="Last payment" value={member.lastPaymentAt ? format(new Date(member.lastPaymentAt), "MMM d, yyyy") : "-"} />
                <Fact icon={Clock} label="Last visit" value={member.lastVisit ? formatDistanceToNow(new Date(member.lastVisit), { addSuffix: true }) : "-"} />
              </div>
            </CardContent>
          </Card>

          {/* Progress photos */}
          <MemberPhotos
            memberId={member.id}
            photos={member.photos}
            profilePhotoId={member.profilePhotoId}
            beforePhotoId={member.beforePhotoId}
            afterPhotoId={member.afterPhotoId}
          />

          {/* Recent check-ins */}
          <Card>
            <CardHeader>
              <CardTitle>Recent check-ins</CardTitle>
              <span className="text-sm text-slate-400">
                {member.visitsThisMonth} this month
              </span>
            </CardHeader>
            <CardContent>
              {member.recentCheckins.length ? (
                <ul className="divide-y divide-slate-50">
                  {member.recentCheckins.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 py-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <QrCode className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800">
                          {format(new Date(c.at), "EEEE, MMM d")}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format(new Date(c.at), "h:mm a")}
                        </div>
                      </div>
                      <Badge tone="neutral" className="capitalize">
                        {c.method}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">
                  No check-ins recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right / sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <Detail icon={Mail} label="Email" value={member.email} />
              <Detail icon={Phone} label="Phone" value={member.phone || "-"} />
              <Detail
                icon={MapPin}
                label="Address"
                value={member.address || "-"}
              />
              <Detail
                icon={Clock}
                label="Visits this month"
                value={String(member.visitsThisMonth)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned trainer</CardTitle>
            </CardHeader>
            <CardContent>
              {member.trainer ? (
                <div className="flex items-center gap-3">
                  <Avatar name={member.trainer.name} />
                  <div>
                    <div className="font-medium text-slate-900">
                      {member.trainer.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {member.trainer.title}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <UserCog className="h-4 w-4" /> No trainer assigned
                </div>
              )}
            </CardContent>
          </Card>

          {(member.emergencyContact.name || member.emergencyContact.phone) && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-medium text-slate-900">
                  {member.emergencyContact.name || "-"}
                </div>
                <div className="text-sm text-slate-500">
                  {member.emergencyContact.phone || "-"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="truncate text-sm font-medium text-slate-800">{value}</div>
      </div>
    </div>
  );
}

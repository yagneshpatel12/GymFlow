"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MEMBER_STATUS_META, type MemberStatus } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { STATUS_COLORS, ChartTooltip } from "./chart-common";

type Slice = { status: MemberStatus; count: number };

export function StatusDonut({ data }: { data: Slice[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const shown = data.filter((d) => d.count > 0);

  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-5 @[380px]:flex-row @[380px]:gap-5">
        <div className="relative h-[160px] w-[160px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={shown}
              dataKey="count"
              nameKey="status"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {shown.map((d) => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                const p = payload?.[0]?.payload as Slice | undefined;
                return (
                  <ChartTooltip
                    active={active}
                    rows={
                      p
                        ? [
                            {
                              label: `${MEMBER_STATUS_META[p.status].label} · ${Math.round((p.count / total) * 100)}%`,
                              value: formatNumber(p.count),
                              color: STATUS_COLORS[p.status],
                            },
                          ]
                        : []
                    }
                  />
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">
            {formatNumber(total)}
          </span>
          <span className="text-xs text-slate-500">members</span>
        </div>
      </div>

        <ul className="w-full space-y-2 @[380px]:min-w-0 @[380px]:flex-1">
          {data.map((d) => (
            <li key={d.status} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: STATUS_COLORS[d.status] }}
              />
              <span className="flex-1 text-sm text-slate-600">
                {MEMBER_STATUS_META[d.status].label}
              </span>
              <span className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
                {formatNumber(d.count)}
              </span>
              <span className="w-9 shrink-0 text-right text-xs text-slate-400 tabular-nums">
                {total > 0 ? Math.round((d.count / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

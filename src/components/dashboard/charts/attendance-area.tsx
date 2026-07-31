"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND, ChartTooltip } from "./chart-common";

type Point = { date: string; label: string; count: number };

export function AttendanceAreaChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.18} />
            <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="#eef1f5"
          strokeDasharray="0"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          minTickGap={40}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          dy={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ stroke: BRAND, strokeWidth: 1, strokeDasharray: "4 4" }}
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              title={payload?.[0]?.payload?.label}
              rows={
                payload?.length
                  ? [
                      {
                        label: "check-ins",
                        value: String(payload[0].value),
                        color: BRAND,
                      },
                    ]
                  : []
              }
            />
          )}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={BRAND}
          strokeWidth={2}
          fill="url(#attFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

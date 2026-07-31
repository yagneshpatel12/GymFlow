"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { BRAND, ChartTooltip } from "./chart-common";

type Point = { label: string; value: number };

export function RevenueBarChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eef1f5" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          dy={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickFormatter={(v) => `$${formatCompact(v as number)}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(5,150,105,0.06)" }}
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              title={payload?.[0]?.payload?.label}
              rows={
                payload?.length
                  ? [
                      {
                        label: "revenue",
                        value: formatCurrency(payload[0].value as number),
                        color: BRAND,
                      },
                    ]
                  : []
              }
            />
          )}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === data.length - 1 ? BRAND : "#a7f3d0"}
            />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v: React.ReactNode) => `$${formatCompact(Number(v))}`}
            fill="#64748b"
            fontSize={11}
            fontWeight={600}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import { format } from "date-fns";
import { arSA, enGB } from "date-fns/locale";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardDay } from "../api";
import { useT } from "@/lib/i18n";

const dateLocales = { ar: arSA, en: enGB } as const;

/**
 * Views and enquiries on one frame — the question the agency actually asks is
 * "does traffic turn into calls?", which needs both lines together.
 */
export function WeekChart({ data }: { data: DashboardDay[] }) {
  const { t, locale, isRtl } = useT();

  const rows = data.map((day) => ({
    ...day,
    label: format(new Date(day.date), "EEE", { locale: dateLocales[locale] }),
  }));

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gz-petrol-500)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--gz-petrol-500)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="var(--gz-limestone-300)"
            strokeDasharray="3 5"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: "var(--gz-limestone-300)" }}
            tick={{ fill: "var(--gz-limestone-600)", fontSize: 12 }}
            reversed={isRtl}
          />
          {/* Two scales, deliberately. Views run in the hundreds and enquiries
              in single digits; on one axis the enquiry line would sit flat on
              the floor and tell nobody anything. */}
          <YAxis
            yAxisId="views"
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fill: "var(--gz-limestone-600)", fontSize: 12 }}
            orientation={isRtl ? "right" : "left"}
          />
          <YAxis
            yAxisId="enquiries"
            tickLine={false}
            axisLine={false}
            width={32}
            allowDecimals={false}
            tick={{ fill: "var(--gz-clay-600)", fontSize: 12 }}
            orientation={isRtl ? "left" : "right"}
          />
          <Tooltip
            cursor={{ stroke: "var(--gz-limestone-400)" }}
            contentStyle={{
              background: "var(--gz-limestone-50)",
              border: "1px solid var(--gz-limestone-300)",
              borderRadius: "var(--gz-radius-md)",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              String(value ?? ""),
              name === "views" ? t.admin.chartViews : t.admin.chartEnquiries,
            ]}
          />
          <Area
            yAxisId="views"
            type="monotone"
            dataKey="views"
            stroke="var(--gz-petrol-700)"
            strokeWidth={2}
            fill="url(#viewsFill)"
          />
          <Line
            yAxisId="enquiries"
            type="monotone"
            dataKey="enquiries"
            stroke="var(--gz-clay-500)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--gz-clay-500)", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";
import { CODE_MARKS, computeCoupling, sweepDistance } from "@/lib/physics";
import { useGuide } from "@/lib/store";
import { formatSi } from "@/lib/utils";

function uvTick(uv: number): string {
  if (uv >= 1e6) return `${(uv / 1e6).toPrecision(2)} V`;
  if (uv >= 1e3) return `${(uv / 1e3).toPrecision(2)} mV`;
  if (uv >= 1) return `${uv >= 10 ? uv.toFixed(0) : uv.toPrecision(2)} µV`;
  return `${(uv * 1e3).toFixed(0)} nV`;
}

export function DistanceChart() {
  const store = useGuide();
  const source = store.sourceInput();
  const victim = store.victimInput();
  const data = useMemo(
    () =>
      sweepDistance(source, victim).map((p) => ({
        mm: p.d * 1000,
        uv: Math.max(p.v * 1e6, 1e-6),
      })),
    [
      source.currentA,
      source.pairSpacingM,
      source.lengthM,
      source.routing,
      source.pwmHz,
      source.rippleFraction,
      victim.id,
      victim.shield,
      victim.twisted,
      victim.loadOhm,
    ],
  );
  const now = computeCoupling(source, victim, store.distanceM);
  const immune = !Number.isFinite(victim.immunityV);
  const peakUv = data.reduce((m, p) => Math.max(m, p.uv), 1);
  const immUv = immune ? 0 : victim.immunityV * 1e6;
  const yMax = Math.max(peakUv * 6, immUv * 1.4, 20);
  const yMin = Math.max(0.05, Math.min(1, peakUv / 80));

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-fg">Noise versus distance</h2>
        <p className="font-mono text-xs text-muted">log millimetres</p>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, left: 4, bottom: 0 }}>
            <CartesianGrid
              stroke="color-mix(in oklab, var(--color-fg) 8%, transparent)"
              vertical={false}
            />
            <XAxis
              dataKey="mm"
              type="number"
              scale="log"
              domain={[1, 1500]}
              ticks={[1, 5, 10, 20, 50, 100, 300, 1000]}
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              tickFormatter={(v: number) => `${v}`}
              axisLine={{ stroke: "color-mix(in oklab, var(--color-fg) 14%, transparent)" }}
              tickLine={false}
            />
            <YAxis
              dataKey="uv"
              type="number"
              scale="log"
              domain={[yMin, yMax]}
              allowDataOverflow
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              tickFormatter={uvTick}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-raised)",
                border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--color-fg)",
              }}
              labelFormatter={(mm) => `${Number(mm).toFixed(0)} mm`}
              formatter={(value) => [formatSi(Number(value) / 1e6, "V"), "Coupled"]}
            />
            {!immune && immUv >= yMin && immUv <= yMax && (
              <ReferenceLine y={immUv} stroke="var(--color-fail)" strokeDasharray="4 4" />
            )}
            {CODE_MARKS.map((m) => (
              <ReferenceLine
                key={m.m}
                x={m.m * 1000}
                stroke="color-mix(in oklab, var(--color-fg) 14%, transparent)"
              />
            ))}
            {store.distanceM * 1000 >= 1 && (
              <ReferenceLine x={store.distanceM * 1000} stroke="var(--color-accent)" />
            )}
            <Line
              type="monotone"
              dataKey="uv"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 font-mono text-xs text-subtle">
        Now {formatSi(now.vTotalDiffRms, "V")} at {(store.distanceM * 1000).toFixed(0)} mm
        {!immune ? ` · immunity ${formatSi(victim.immunityV, "V")}` : ""}
      </p>
    </section>
  );
}

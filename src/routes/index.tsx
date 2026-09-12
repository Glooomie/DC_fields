import { createFileRoute } from "@tanstack/react-router";
import { ControlsPanel } from "@/components/controls-panel";
import { DistanceChart } from "@/components/distance-chart";
import { FieldCanvas } from "@/components/field-canvas";
import { GuideCopy } from "@/components/guide-copy";
import { Readout } from "@/components/readout";
import { Slider } from "@/components/ui/slider";
import { computeCoupling, PRESETS } from "@/lib/physics";
import { useGuide } from "@/lib/store";
import { formatMm } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const store = useGuide();
  const r = computeCoupling(store.sourceInput(), store.victimInput(), store.distanceM);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              Fieldline
            </p>
            <h1 className="mt-1 text-2xl leading-tight font-medium tracking-tight">
              What 1500 V DC cables couple into a neighbour
            </h1>
          </div>
          <p className="max-w-sm text-sm text-muted">
            True millimetres. Drag the victim cable or use the slider. Steady DC is
            silent; the inverter on the bus is not.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] sm:px-6">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-xl bg-surface p-3 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
            <FieldCanvas />
            <div className="mt-3 space-y-2 px-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm tabular-nums text-fg">
                  {formatMm(store.distanceM)} centre-to-centre
                </p>
                <p className="text-xs text-muted">
                  {store.currentA.toFixed(0)} A · {formatMm(store.pairSpacingM)} pair ·{" "}
                  {store.lengthM.toFixed(0)} m parallel
                </p>
              </div>
              <Slider
                min={0}
                max={1500}
                step={1}
                value={[Math.round(store.distanceM * 1000)]}
                onValueChange={(v) => store.setDistance((v[0] ?? 150) / 1000)}
                aria-label="Separation distance"
              />
            </div>
            <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => store.applyPreset(p.id)}
                  className="min-h-11 shrink-0 rounded-md bg-raised px-3 text-xs font-medium text-fg hover:bg-border"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <Readout />
          <DistanceChart />
        </div>

        <aside className="relative z-10 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto">
          <div className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
            <ControlsPanel />
          </div>
        </aside>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <GuideCopy />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-subtle sm:flex-row sm:justify-between sm:px-6">
          <span>
            {r.contact
              ? "Cables physically overlap at this spacing. The field is a near-contact estimate, not a short-circuit."
              : "Order-of-magnitude EMC model for 1500 V PV / BESS DC pairs."}
          </span>
          <span>AS/NZS 5033 · AS/NZS 3000 · IEC 61000</span>
        </div>
      </footer>
    </main>
  );
}

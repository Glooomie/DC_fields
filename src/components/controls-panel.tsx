import type { ReactNode } from "react";
import { PRESETS, VICTIMS, type Routing, type Shield } from "@/lib/physics";
import { useGuide } from "@/lib/store";
import { formatMm } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "min-h-11 rounded-sm bg-fg px-3 py-2 text-xs font-medium text-accent-fg"
          : "min-h-11 rounded-sm bg-raised px-3 py-2 text-xs font-medium text-muted hover:text-fg"
      }
    >
      {children}
    </button>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted">{label}</span>
        <span className="font-mono text-xs tabular-nums text-fg">{value}</span>
      </div>
      {children}
    </div>
  );
}

export function ControlsPanel() {
  const distanceM = useGuide((s) => s.distanceM);
  const currentA = useGuide((s) => s.currentA);
  const setDistance = useGuide((s) => s.setDistance);
  const pairSpacingM = useGuide((s) => s.pairSpacingM);
  const lengthM = useGuide((s) => s.lengthM);
  const routing = useGuide((s) => s.routing);
  const pwmHz = useGuide((s) => s.pwmHz);
  const rippleFraction = useGuide((s) => s.rippleFraction);
  const victimId = useGuide((s) => s.victimId);
  const shield = useGuide((s) => s.shield);
  const fieldMode = useGuide((s) => s.fieldMode);
  const setCurrent = useGuide((s) => s.setCurrent);
  const setPairSpacing = useGuide((s) => s.setPairSpacing);
  const setLength = useGuide((s) => s.setLength);
  const setRouting = useGuide((s) => s.setRouting);
  const setPwm = useGuide((s) => s.setPwm);
  const setRipple = useGuide((s) => s.setRipple);
  const setVictim = useGuide((s) => s.setVictim);
  const setShield = useGuide((s) => s.setShield);
  const setFieldMode = useGuide((s) => s.setFieldMode);
  const applyPreset = useGuide((s) => s.applyPreset);

  return (
    <div className="flex flex-col gap-6">
      <section className="space-y-3">
        <h2 className="text-xs font-medium tracking-wide text-muted uppercase">Presets</h2>
        <div className="flex flex-col gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              className="min-h-11 rounded-md bg-raised px-3 py-2.5 text-left transition-colors hover:bg-border"
            >
              <div className="text-sm font-medium text-fg">{p.label}</div>
              <div className="text-xs text-muted">{p.blurb}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-medium tracking-wide text-muted uppercase">1500 V DC source</h2>
        <Row label="Centre-to-centre" value={formatMm(distanceM)}>
          <Slider
            min={0}
            max={1500}
            step={1}
            value={[Math.round(distanceM * 1000)]}
            onValueChange={(v) => setDistance((v[0] ?? 150) / 1000)}
            aria-label="Separation distance"
          />
        </Row>
        <Row label="DC current" value={`${currentA.toFixed(0)} A`}>
          <Slider
            min={5}
            max={800}
            step={5}
            value={[currentA]}
            onValueChange={(v) => setCurrent(v[0] ?? 15)}
            aria-label="DC current"
          />
        </Row>
        <Row label="+ / − spacing" value={formatMm(pairSpacingM)}>
          <Slider
            min={10}
            max={400}
            step={2}
            value={[pairSpacingM * 1000]}
            onValueChange={(v) => setPairSpacing((v[0] ?? 20) / 1000)}
            aria-label="Pair spacing"
          />
        </Row>
        <Row label="Parallel run" value={`${lengthM.toFixed(0)} m`}>
          <Slider
            min={1}
            max={80}
            step={1}
            value={[lengthM]}
            onValueChange={(v) => setLength(v[0] ?? 20)}
            aria-label="Parallel run length"
          />
        </Row>
        <Row label="PWM / ripple" value={`${(pwmHz / 1000).toFixed(0)} kHz`}>
          <Slider
            min={2000}
            max={40000}
            step={1000}
            value={[pwmHz]}
            onValueChange={(v) => setPwm(v[0] ?? 16000)}
            aria-label="Inverter PWM frequency"
          />
        </Row>
        <Row label="Current ripple" value={`${(rippleFraction * 100).toFixed(0)} %`}>
          <Slider
            min={1}
            max={15}
            step={1}
            value={[rippleFraction * 100]}
            onValueChange={(v) => setRipple((v[0] ?? 5) / 100)}
            aria-label="Ripple fraction"
          />
        </Row>
        <div className="space-y-2">
          <span className="text-xs font-medium tracking-wide text-muted">Routing</span>
          <div className="flex flex-wrap gap-1.5">
            {(["open", "tray", "conduit"] as Routing[]).map((r) => (
              <Chip key={r} active={routing === r} onClick={() => setRouting(r)}>
                {r === "open" ? "Open air" : r === "tray" ? "Cable tray" : "Steel conduit"}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-medium tracking-wide text-muted uppercase">Nearby cable</h2>
        <div className="grid grid-cols-2 gap-1.5">
          {VICTIMS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVictim(v.id)}
              className={
                victimId === v.id
                  ? "min-h-11 rounded-md bg-fg px-2.5 py-2 text-left text-xs font-medium text-accent-fg"
                  : "min-h-11 rounded-md bg-raised px-2.5 py-2 text-left text-xs font-medium text-muted hover:text-fg"
              }
            >
              {v.short}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <span className="text-xs font-medium tracking-wide text-muted">Shield</span>
          <div className="flex flex-wrap gap-1.5">
            {(["none", "foil", "braid"] as Shield[]).map((s) => (
              <Chip key={s} active={shield === s} onClick={() => setShield(s)}>
                {s === "none" ? "Unshielded" : s === "foil" ? "Foil" : "Braid"}
              </Chip>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-medium tracking-wide text-muted">Field overlay</span>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={fieldMode === "b"} onClick={() => setFieldMode("b")}>
              Magnetic B
            </Chip>
            <Chip active={fieldMode === "e"} onClick={() => setFieldMode("e")}>
              Electric E
            </Chip>
            <Chip active={fieldMode === "cables"} onClick={() => setFieldMode("cables")}>
              Cables only
            </Chip>
          </div>
        </div>
      </section>
    </div>
  );
}

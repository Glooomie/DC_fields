import { CODE_MARKS } from "@/lib/physics";

export function GuideCopy() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <article className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
        <h2 className="text-sm font-medium text-fg">Steady DC does not induce</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Faraday’s law needs a changing flux. A constant 1500 V and a constant current
          make static E and B fields. They can bias a Hall probe or a compass; they do
          not put an AC voltage on a nearby pair. The noise is the inverter PWM that
          rides on the DC bus — typically a few percent current ripple and a common-mode
          voltage of hundreds of volts at 8–20 kHz.
        </p>
      </article>
      <article className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
        <h2 className="text-sm font-medium text-fg">Close the pair, then the distance</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A go/return pair is a magnetic dipole: residual B falls as 1/d² once you are
          farther than the +/− spacing. Splitting positive and negative across a tray
          (an “open loop”) turns that dipole into two monopoles. Coupling jumps by ten
          times or more. Keep H1Z2Z2-K positives and negatives touching, then move the
          signal cable out.
        </p>
      </article>
      <article className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
        <h2 className="text-sm font-medium text-fg">Safety is not EMC</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          AS/NZS 5033:2021 clause 4.4.3.2 asks for 50 mm segregation (or a medium-duty
          enclosure) between PV DC and other cables. That is a shock/fire rule. Comms
          practice is 300 mm, and analog at a few millivolts often wants more unless it
          is foil-shielded and the DC pair is tight.
        </p>
      </article>

      <article className="rounded-xl bg-surface p-4 md:col-span-2 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
        <h2 className="text-sm font-medium text-fg">What the numbers assume</h2>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
          <li>Electrically short run (20 m ≪ wavelength at 16 kHz).</li>
          <li>
            Inductive: V = 2πf M I<sub>ripple</sub>, with M from the two-wire loop formula.
            Twist and shield multiply the loop area / transfer.
          </li>
          <li>
            Capacitive: inverter common-mode (default 0.3 × V<sub>dc</sub>) into the victim
            via mutual C, loaded by the cable’s capacitance to ground and the input Z.
          </li>
          <li>
            Transient: V = M dI/dt for a 1 ms current step (cloud edge / MPPT), not a
            lightning stroke.
          </li>
          <li>
            First-order, air dielectric, no site resonances. Not a substitute for an EMC
            study or a wiring-rules inspection.
          </li>
        </ul>
      </article>

      <article className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
        <h2 className="text-sm font-medium text-fg">Marked distances</h2>
        <ul className="mt-2 space-y-2">
          {CODE_MARKS.map((m) => (
            <li key={m.m} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-muted">{m.label}</span>
              <span className="font-mono text-xs tabular-nums text-fg">
                {(m.m * 1000).toFixed(0)} mm
              </span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

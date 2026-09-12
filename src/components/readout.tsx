import { computeCoupling, VERDICT_COPY, victimById } from "@/lib/physics";
import { useGuide } from "@/lib/store";
import { formatSi } from "@/lib/utils";

const TONE: Record<string, string> = {
  immune: "text-immune",
  quiet: "text-quiet",
  workable: "text-workable",
  marginal: "text-marginal",
  fail: "text-fail",
};

const BAR: Record<string, string> = {
  immune: "bg-immune",
  quiet: "bg-quiet",
  workable: "bg-workable",
  marginal: "bg-marginal",
  fail: "bg-fail",
};

export function Readout() {
  const store = useGuide();
  const source = store.sourceInput();
  const victim = store.victimInput();
  const r = computeCoupling(source, victim, store.distanceM);
  const def = victimById(store.victimId);
  const copy = VERDICT_COPY[r.verdict];
  const pct = Number.isFinite(r.ratio) ? Math.min(r.ratio * 100, 160) : 0;

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Coupled noise</p>
          <p className={`mt-1 font-mono text-3xl leading-none font-medium tabular-nums ${TONE[r.verdict]}`}>
            {r.verdict === "immune" ? "0 V" : formatSi(r.vTotalDiffRms, "V")}
          </p>
          <p className="mt-1 text-xs text-muted">
            RMS at {source.pwmHz / 1000} kHz, differential
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${TONE[r.verdict]}`}>{copy.title}</p>
          <p className="mt-1 font-mono text-xs tabular-nums text-muted">
            budget {Number.isFinite(r.immunityV) ? formatSi(r.immunityV, "V") : "n/a"}
          </p>
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-raised">
        <div
          className={`h-full ${BAR[r.verdict]} transition-[width] duration-200`}
          style={{ width: `${r.verdict === "immune" ? 0 : Math.min(100, pct)}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-snug text-muted">{copy.body}</p>
      <p className="mt-2 text-xs leading-snug text-subtle">{def.hint}</p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        <Stat label="Inductive (ripple B)" value={formatSi(r.vInductiveRms, "V")} />
        <Stat label="Capacitive (PWM CM)" value={formatSi(r.vCapDiffRms, "V")} />
        <Stat label="Static B at victim" value={formatSi(r.bStaticT, "T")} />
        <Stat label="vs Earth field" value={`${r.bEarthRatio.toFixed(2)} ×`} />
        <Stat label="Static E at victim" value={formatSi(r.eStaticVm, "V/m")} />
        <Stat
          label="1 ms current step"
          value={formatSi(r.vTransientV, "V")}
        />
        <Stat label="Mutual M" value={formatSi(r.mHenry, "H")} />
        <Stat label="Ripple current" value={formatSi(r.iRippleA, "A")} />
      </dl>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="font-mono text-sm tabular-nums text-fg">{value}</dd>
    </div>
  );
}

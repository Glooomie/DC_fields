/**
 * Coupling from a 1500 V DC pair into a nearby cable.
 *
 * Steady DC does not induce voltage (dΦ/dt = 0). Noise is the inverter PWM
 * ripple and common-mode voltage that ride on the DC bus, plus the static
 * B/E fields themselves (Hall sensors, high-Z analog).
 *
 * Electrically short, weak-coupling, air dielectric. Ground is a perfect
 * plane. Ripple is treated as a sinusoid at the inverter PWM frequency.
 */

export const MU0 = 4 * Math.PI * 1e-7;
export const EPS0 = 8.854187817e-12;
export const EARTH_B_T = 50e-6;
export const PWM_DEFAULT_HZ = 16_000;
export const VOLTAGE_DEFAULT = 1500;

export type Routing = "open" | "tray" | "conduit";
export type Shield = "none" | "foil" | "braid";
export type VictimId =
  | "analog10"
  | "loop420"
  | "thermocouple"
  | "rs485"
  | "can"
  | "ethernet"
  | "fiber";

export type SourceInput = {
  voltageV: number;
  currentA: number;
  pairSpacingM: number;
  conductorRadiusM: number;
  lengthM: number;
  heightM: number;
  routing: Routing;
  pwmHz: number;
  rippleFraction: number;
  cmFraction: number;
};

export type VictimInput = {
  id: VictimId;
  pairSpacingM: number;
  conductorRadiusM: number;
  shield: Shield;
  twisted: boolean;
  loadOhm: number;
  immunityV: number;
};

export type CouplingResult = {
  distanceM: number;
  bStaticT: number;
  eStaticVm: number;
  mHenry: number;
  iRippleA: number;
  vCmV: number;
  vInductiveRms: number;
  vCapDiffRms: number;
  vCapCmRms: number;
  vTransientV: number;
  vTotalDiffRms: number;
  shieldMag: number;
  shieldEl: number;
  twistFactor: number;
  routingMag: number;
  routingEl: number;
  immunityV: number;
  ratio: number;
  verdict: Verdict;
  bEarthRatio: number;
  contact: boolean;
};

export type Verdict = "quiet" | "workable" | "marginal" | "fail" | "immune";

export type VictimDef = {
  id: VictimId;
  label: string;
  short: string;
  immunityV: number;
  pairSpacingM: number;
  conductorRadiusM: number;
  twisted: boolean;
  loadOhm: number;
  defaultShield: Shield;
  hint: string;
};

export const VICTIMS: VictimDef[] = [
  {
    id: "analog10",
    label: "0–10 V analog",
    short: "0–10 V",
    immunityV: 0.01,
    pairSpacingM: 0.004,
    conductorRadiusM: 0.0006,
    twisted: false,
    loadOhm: 10_000,
    defaultShield: "none",
    hint: "10 mV is 0.1 % of full scale. High-Z inputs pick up electric-field noise first.",
  },
  {
    id: "loop420",
    label: "4–20 mA loop",
    short: "4–20 mA",
    immunityV: 0.025,
    pairSpacingM: 0.004,
    conductorRadiusM: 0.0006,
    twisted: true,
    loadOhm: 250,
    defaultShield: "foil",
    hint: "25 mV across 250 Ω is 0.1 mA — about 0.6 % of span. Current loops reject common-mode well.",
  },
  {
    id: "thermocouple",
    label: "Thermocouple",
    short: "T/C",
    immunityV: 40e-6,
    pairSpacingM: 0.0015,
    conductorRadiusM: 0.0003,
    twisted: true,
    loadOhm: 100_000,
    defaultShield: "braid",
    hint: "Type K is ~41 µV/°C. A few tens of microvolts read as a degree.",
  },
  {
    id: "rs485",
    label: "RS-485 / Modbus",
    short: "RS-485",
    immunityV: 0.2,
    pairSpacingM: 0.0018,
    conductorRadiusM: 0.0004,
    twisted: true,
    loadOhm: 120,
    defaultShield: "foil",
    hint: "Differential noise margin is ~200 mV. Twisted pair plus 120 Ω termination is the usual tracker-comms stack.",
  },
  {
    id: "can",
    label: "CAN bus",
    short: "CAN",
    immunityV: 0.3,
    pairSpacingM: 0.0018,
    conductorRadiusM: 0.0004,
    twisted: true,
    loadOhm: 60,
    defaultShield: "foil",
    hint: "ISO 11898 recessive/dominant window is about 0.5 V; 300 mV of coupled noise starts to eat margin.",
  },
  {
    id: "ethernet",
    label: "Ethernet Cat6",
    short: "Cat6",
    immunityV: 1.0,
    pairSpacingM: 0.001,
    conductorRadiusM: 0.00025,
    twisted: true,
    loadOhm: 100,
    defaultShield: "none",
    hint: "Magnetics and tight twists make Cat6 robust. Still keep it out of the same tray as unshielded DC homeruns.",
  },
  {
    id: "fiber",
    label: "Fibre optic",
    short: "Fibre",
    immunityV: Number.POSITIVE_INFINITY,
    pairSpacingM: 0.002,
    conductorRadiusM: 0.0005,
    twisted: false,
    loadOhm: 1e9,
    defaultShield: "none",
    hint: "No electrical coupling. Weather stations and long tracker runs often move to fibre for this reason.",
  },
];

export const PRESETS = [
  {
    id: "string-rs485",
    label: "String + tracker RS-485",
    blurb: "15 A string pair, 20 m alongside Modbus.",
    source: {
      currentA: 15,
      pairSpacingM: 0.02,
      lengthM: 20,
      routing: "open" as Routing,
    },
    distanceM: 0.15,
    victimId: "rs485" as VictimId,
    shield: "foil" as Shield,
  },
  {
    id: "open-loop",
    label: "Open DC loop",
    blurb: "+ and − split across a tray. The worst common mistake.",
    source: {
      currentA: 15,
      pairSpacingM: 0.2,
      lengthM: 20,
      routing: "tray" as Routing,
    },
    distanceM: 0.28,
    victimId: "analog10" as VictimId,
    shield: "none" as Shield,
  },
  {
    id: "trunk-hall",
    label: "Combiner trunk",
    blurb: "400 A homerun next to a 4–20 mA sensor.",
    source: {
      currentA: 400,
      pairSpacingM: 0.03,
      lengthM: 12,
      routing: "tray" as Routing,
    },
    distanceM: 0.1,
    victimId: "loop420" as VictimId,
    shield: "foil" as Shield,
  },
  {
    id: "same-tray",
    label: "Same tray, 50 mm",
    blurb: "Code-minimum segregation, unshielded analog.",
    source: {
      currentA: 15,
      pairSpacingM: 0.02,
      lengthM: 30,
      routing: "tray" as Routing,
    },
    distanceM: 0.05,
    victimId: "analog10" as VictimId,
    shield: "none" as Shield,
  },
  {
    id: "recommended",
    label: "300 mm recommended",
    blurb: "Comms practice distance, foil RS-485.",
    source: {
      currentA: 15,
      pairSpacingM: 0.02,
      lengthM: 20,
      routing: "open" as Routing,
    },
    distanceM: 0.3,
    victimId: "rs485" as VictimId,
    shield: "foil" as Shield,
  },
] as const;

export const CODE_MARKS: { m: number; label: string; kind: "safety" | "emc" }[] = [
  { m: 0.05, label: "AS/NZS 5033 50 mm segregation", kind: "safety" },
  { m: 0.15, label: "EN 60204 150 mm power vs control", kind: "emc" },
  { m: 0.3, label: "Comms practice 300 mm", kind: "emc" },
  { m: 0.6, label: "Conservative analog 600 mm", kind: "emc" },
];

export function victimById(id: VictimId): VictimDef {
  return VICTIMS.find((v) => v.id === id) ?? VICTIMS[3];
}

function clampMin(d: number, min: number): number {
  return Math.max(d, min);
}

/** Residual static B of a go/return pair, in the plane of the pair. */
export function bPairTesla(currentA: number, pairSpacingM: number, distanceM: number): number {
  const s = pairSpacingM;
  const d = distanceM;
  const rP = clampMin(Math.abs(d - s / 2), 1e-4);
  const rN = clampMin(Math.abs(d + s / 2), 1e-4);
  const bP = (MU0 * currentA) / (2 * Math.PI * rP);
  const bN = (MU0 * currentA) / (2 * Math.PI * rN);
  return Math.abs(bP - bN);
}

/** Static E of a ±V/2 two-wire line, far-field dipole, V/m. */
export function ePairVm(voltageV: number, pairSpacingM: number, distanceM: number): number {
  const d = clampMin(distanceM, 1e-3);
  return (voltageV * pairSpacingM) / (Math.PI * d * d);
}

/**
 * Mutual inductance of two parallel two-wire loops (H).
 * Source +/− at ±s/2, victim +/− at d ± sv/2.
 * M = (μ0 L / 2π) ln( (r+− r−+) / (r++ r−−) )
 */
export function mutualHenry(
  lengthM: number,
  distanceM: number,
  sSrc: number,
  sVic: number,
): number {
  const srcP = -sSrc / 2;
  const srcN = sSrc / 2;
  const vicP = distanceM - sVic / 2;
  const vicN = distanceM + sVic / 2;
  const rPP = clampMin(Math.abs(srcP - vicP), 1e-5);
  const rPN = clampMin(Math.abs(srcP - vicN), 1e-5);
  const rNP = clampMin(Math.abs(srcN - vicP), 1e-5);
  const rNN = clampMin(Math.abs(srcN - vicN), 1e-5);
  const ratio = (rPN * rNP) / (rPP * rNN);
  return (MU0 * lengthM) / (2 * Math.PI) * Math.log(Math.max(ratio, 1e-12));
}

/** Mutual capacitance source-loop to victim-loop, far from ground, F. */
export function mutualFarad(
  lengthM: number,
  distanceM: number,
  rSrc: number,
  rVic: number,
): number {
  const d = clampMin(distanceM, rSrc + rVic + 1e-4);
  const cPrime = (Math.PI * EPS0) / Math.log(d / Math.sqrt(rSrc * rVic));
  return Math.max(cPrime, 1e-14) * lengthM;
}

function wireToGroundFarad(lengthM: number, heightM: number, radiusM: number): number {
  const h = Math.max(heightM, 0.05);
  const cPrime = (2 * Math.PI * EPS0) / Math.log((2 * h) / Math.max(radiusM, 1e-4));
  return cPrime * lengthM;
}

export function routingFactors(routing: Routing): { mag: number; el: number } {
  switch (routing) {
    case "tray":
      return { mag: 0.7, el: 0.45 };
    case "conduit":
      return { mag: 0.18, el: 0.04 };
    default:
      return { mag: 1, el: 1 };
  }
}

export function shieldFactors(shield: Shield, pwmHz: number): { mag: number; el: number } {
  const f = Math.max(pwmHz, 100);
  const skinBoost = Math.min(1, Math.log10(f / 1000 + 1) / 2);
  switch (shield) {
    case "foil":
      return { mag: 0.22 * (1 - 0.35 * skinBoost), el: 0.08 };
    case "braid":
      return { mag: 0.08 * (1 - 0.4 * skinBoost), el: 0.03 };
    default:
      return { mag: 1, el: 1 };
  }
}

export function twistFactor(twisted: boolean, id: VictimId): number {
  if (!twisted) return 1;
  if (id === "ethernet") return 0.04;
  if (id === "rs485" || id === "can") return 0.1;
  if (id === "thermocouple") return 0.12;
  return 0.18;
}

export function verdictFor(ratio: number, immune: boolean): Verdict {
  if (immune) return "immune";
  if (ratio < 0.1) return "quiet";
  if (ratio < 0.5) return "workable";
  if (ratio < 1) return "marginal";
  return "fail";
}

export function computeCoupling(
  source: SourceInput,
  victim: VictimInput,
  distanceM: number,
): CouplingResult {
  const minDist =
    source.pairSpacingM / 2 +
    victim.pairSpacingM / 2 +
    source.conductorRadiusM +
    victim.conductorRadiusM;
  const contact = distanceM < minDist * 0.98;
  const d = Math.max(distanceM, 1e-4);

  const { mag: routingMag, el: routingEl } = routingFactors(source.routing);
  const { mag: shieldMag, el: shieldEl } = shieldFactors(victim.shield, source.pwmHz);
  const twist = twistFactor(victim.twisted, victim.id);

  const bStaticT = bPairTesla(source.currentA, source.pairSpacingM, d) * routingMag;
  const eStaticVm = ePairVm(source.voltageV, source.pairSpacingM, d) * routingEl;

  const mHenry = Math.abs(mutualHenry(source.lengthM, d, source.pairSpacingM, victim.pairSpacingM));
  const iRippleA = source.currentA * source.rippleFraction;
  const omega = 2 * Math.PI * source.pwmHz;
  const zIn = victim.loadOhm;

  const vInductiveRms =
    omega * mHenry * (iRippleA / Math.SQRT2) * twist * shieldMag * routingMag;

  const cMLen = mutualFarad(source.lengthM, d, source.conductorRadiusM, victim.conductorRadiusM);
  const cG = wireToGroundFarad(source.lengthM, source.heightM, victim.conductorRadiusM);
  const vCmV = source.voltageV * source.cmFraction;
  const vDiv = vCmV * cMLen / Math.max(cMLen + cG, 1e-18);
  const zTh = 1 / Math.max(omega * (cMLen + cG), 1e-18);
  const vCapCmPeak = vDiv * (zIn / (zIn + zTh));
  const imbalance = victim.twisted ? 0.08 : 0.25;
  const vCapDiffRms = (vCapCmPeak * imbalance * shieldEl * routingEl) / Math.SQRT2;
  const vCapCmRms = (vCapCmPeak * shieldEl * routingEl) / Math.SQRT2;

  const diDt = source.currentA / 0.001;
  const vTransientV = mHenry * diDt * twist * shieldMag * routingMag;

  const immune = !Number.isFinite(victim.immunityV);
  const vTotalDiffRms = immune ? 0 : Math.hypot(vInductiveRms, vCapDiffRms);
  const ratio = immune ? 0 : vTotalDiffRms / Math.max(victim.immunityV, 1e-12);

  return {
    distanceM,
    bStaticT,
    eStaticVm,
    mHenry,
    iRippleA,
    vCmV,
    vInductiveRms,
    vCapDiffRms,
    vCapCmRms,
    vTransientV,
    vTotalDiffRms,
    shieldMag,
    shieldEl,
    twistFactor: twist,
    routingMag,
    routingEl,
    immunityV: victim.immunityV,
    ratio,
    verdict: verdictFor(ratio, immune),
    bEarthRatio: bStaticT / EARTH_B_T,
    contact,
  };
}

export function sweepDistance(
  source: SourceInput,
  victim: VictimInput,
  fromM = 0.001,
  toM = 1.5,
  points = 64,
): { d: number; v: number; b: number }[] {
  const out: { d: number; v: number; b: number }[] = [];
  const log0 = Math.log(fromM);
  const log1 = Math.log(toM);
  for (let i = 0; i < points; i++) {
    const d = Math.exp(log0 + ((log1 - log0) * i) / (points - 1));
    const r = computeCoupling(source, victim, d);
    out.push({ d, v: Math.max(r.vTotalDiffRms, 1e-12), b: r.bStaticT });
  }
  return out;
}

export const VERDICT_COPY: Record<Verdict, { title: string; body: string }> = {
  immune: {
    title: "No electrical coupling",
    body: "Fibre does not pick up E or B. Use it for long runs beside 1500 V homeruns.",
  },
  quiet: {
    title: "Quiet",
    body: "Coupled noise is under 10 % of this cable’s immunity. Fine for continuous parallel.",
  },
  workable: {
    title: "Workable",
    body: "Noise is noticeable but inside typical margin. Prefer a shorter parallel or a shield.",
  },
  marginal: {
    title: "Marginal",
    body: "More than half the noise budget is gone. Shorten the parallel, close the DC pair, or shield the victim.",
  },
  fail: {
    title: "Over immunity",
    body: "Expected coupled voltage exceeds this cable’s noise budget. Do not run them like this.",
  },
};

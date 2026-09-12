import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { a as CartesianGrid, c as Tooltip, i as Line, n as YAxis, o as ReferenceLine, r as XAxis, s as ResponsiveContainer, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-knbed_YQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var MU0 = 4 * Math.PI * 1e-7;
var EPS0 = 8854187817e-21;
var EARTH_B_T = 5e-5;
var PWM_DEFAULT_HZ = 16e3;
var VOLTAGE_DEFAULT = 1500;
var VICTIMS = [
	{
		id: "analog10",
		label: "0–10 V analog",
		short: "0–10 V",
		immunityV: .01,
		pairSpacingM: .004,
		conductorRadiusM: 6e-4,
		twisted: false,
		loadOhm: 1e4,
		defaultShield: "none",
		hint: "10 mV is 0.1 % of full scale. High-Z inputs pick up electric-field noise first."
	},
	{
		id: "loop420",
		label: "4–20 mA loop",
		short: "4–20 mA",
		immunityV: .025,
		pairSpacingM: .004,
		conductorRadiusM: 6e-4,
		twisted: true,
		loadOhm: 250,
		defaultShield: "foil",
		hint: "25 mV across 250 Ω is 0.1 mA — about 0.6 % of span. Current loops reject common-mode well."
	},
	{
		id: "thermocouple",
		label: "Thermocouple",
		short: "T/C",
		immunityV: 4e-5,
		pairSpacingM: .0015,
		conductorRadiusM: 3e-4,
		twisted: true,
		loadOhm: 1e5,
		defaultShield: "braid",
		hint: "Type K is ~41 µV/°C. A few tens of microvolts read as a degree."
	},
	{
		id: "rs485",
		label: "RS-485 / Modbus",
		short: "RS-485",
		immunityV: .2,
		pairSpacingM: .0018,
		conductorRadiusM: 4e-4,
		twisted: true,
		loadOhm: 120,
		defaultShield: "foil",
		hint: "Differential noise margin is ~200 mV. Twisted pair plus 120 Ω termination is the usual tracker-comms stack."
	},
	{
		id: "can",
		label: "CAN bus",
		short: "CAN",
		immunityV: .3,
		pairSpacingM: .0018,
		conductorRadiusM: 4e-4,
		twisted: true,
		loadOhm: 60,
		defaultShield: "foil",
		hint: "ISO 11898 recessive/dominant window is about 0.5 V; 300 mV of coupled noise starts to eat margin."
	},
	{
		id: "ethernet",
		label: "Ethernet Cat6",
		short: "Cat6",
		immunityV: 1,
		pairSpacingM: .001,
		conductorRadiusM: 25e-5,
		twisted: true,
		loadOhm: 100,
		defaultShield: "none",
		hint: "Magnetics and tight twists make Cat6 robust. Still keep it out of the same tray as unshielded DC homeruns."
	},
	{
		id: "fiber",
		label: "Fibre optic",
		short: "Fibre",
		immunityV: Number.POSITIVE_INFINITY,
		pairSpacingM: .002,
		conductorRadiusM: 5e-4,
		twisted: false,
		loadOhm: 1e9,
		defaultShield: "none",
		hint: "No electrical coupling. Weather stations and long tracker runs often move to fibre for this reason."
	}
];
var PRESETS = [
	{
		id: "string-rs485",
		label: "String + tracker RS-485",
		blurb: "15 A string pair, 20 m alongside Modbus.",
		source: {
			currentA: 15,
			pairSpacingM: .02,
			lengthM: 20,
			routing: "open"
		},
		distanceM: .15,
		victimId: "rs485",
		shield: "foil"
	},
	{
		id: "open-loop",
		label: "Open DC loop",
		blurb: "+ and − split across a tray. The worst common mistake.",
		source: {
			currentA: 15,
			pairSpacingM: .2,
			lengthM: 20,
			routing: "tray"
		},
		distanceM: .28,
		victimId: "analog10",
		shield: "none"
	},
	{
		id: "trunk-hall",
		label: "Combiner trunk",
		blurb: "400 A homerun next to a 4–20 mA sensor.",
		source: {
			currentA: 400,
			pairSpacingM: .03,
			lengthM: 12,
			routing: "tray"
		},
		distanceM: .1,
		victimId: "loop420",
		shield: "foil"
	},
	{
		id: "same-tray",
		label: "Same tray, 50 mm",
		blurb: "Code-minimum segregation, unshielded analog.",
		source: {
			currentA: 15,
			pairSpacingM: .02,
			lengthM: 30,
			routing: "tray"
		},
		distanceM: .05,
		victimId: "analog10",
		shield: "none"
	},
	{
		id: "recommended",
		label: "300 mm recommended",
		blurb: "Comms practice distance, foil RS-485.",
		source: {
			currentA: 15,
			pairSpacingM: .02,
			lengthM: 20,
			routing: "open"
		},
		distanceM: .3,
		victimId: "rs485",
		shield: "foil"
	}
];
var CODE_MARKS = [
	{
		m: .05,
		label: "AS/NZS 5033 50 mm segregation",
		kind: "safety"
	},
	{
		m: .15,
		label: "EN 60204 150 mm power vs control",
		kind: "emc"
	},
	{
		m: .3,
		label: "Comms practice 300 mm",
		kind: "emc"
	},
	{
		m: .6,
		label: "Conservative analog 600 mm",
		kind: "emc"
	}
];
function victimById(id) {
	return VICTIMS.find((v) => v.id === id) ?? VICTIMS[3];
}
function clampMin(d, min) {
	return Math.max(d, min);
}
/** Residual static B of a go/return pair, in the plane of the pair. */
function bPairTesla(currentA, pairSpacingM, distanceM) {
	const s = pairSpacingM;
	const d = distanceM;
	const rP = clampMin(Math.abs(d - s / 2), 1e-4);
	const rN = clampMin(Math.abs(d + s / 2), 1e-4);
	const bP = MU0 * currentA / (2 * Math.PI * rP);
	const bN = MU0 * currentA / (2 * Math.PI * rN);
	return Math.abs(bP - bN);
}
/** Static E of a ±V/2 two-wire line, far-field dipole, V/m. */
function ePairVm(voltageV, pairSpacingM, distanceM) {
	const d = clampMin(distanceM, .001);
	return voltageV * pairSpacingM / (Math.PI * d * d);
}
/**
* Mutual inductance of two parallel two-wire loops (H).
* Source +/− at ±s/2, victim +/− at d ± sv/2.
* M = (μ0 L / 2π) ln( (r+− r−+) / (r++ r−−) )
*/
function mutualHenry(lengthM, distanceM, sSrc, sVic) {
	const srcP = -sSrc / 2;
	const srcN = sSrc / 2;
	const vicP = distanceM - sVic / 2;
	const vicN = distanceM + sVic / 2;
	const rPP = clampMin(Math.abs(srcP - vicP), 1e-5);
	const rPN = clampMin(Math.abs(srcP - vicN), 1e-5);
	const rNP = clampMin(Math.abs(srcN - vicP), 1e-5);
	const rNN = clampMin(Math.abs(srcN - vicN), 1e-5);
	const ratio = rPN * rNP / (rPP * rNN);
	return MU0 * lengthM / (2 * Math.PI) * Math.log(Math.max(ratio, 1e-12));
}
/** Mutual capacitance source-loop to victim-loop, far from ground, F. */
function mutualFarad(lengthM, distanceM, rSrc, rVic) {
	const d = clampMin(distanceM, rSrc + rVic + 1e-4);
	const cPrime = Math.PI * EPS0 / Math.log(d / Math.sqrt(rSrc * rVic));
	return Math.max(cPrime, 1e-14) * lengthM;
}
function wireToGroundFarad(lengthM, heightM, radiusM) {
	const h = Math.max(heightM, .05);
	return 2 * Math.PI * EPS0 / Math.log(2 * h / Math.max(radiusM, 1e-4)) * lengthM;
}
function routingFactors(routing) {
	switch (routing) {
		case "tray": return {
			mag: .7,
			el: .45
		};
		case "conduit": return {
			mag: .18,
			el: .04
		};
		default: return {
			mag: 1,
			el: 1
		};
	}
}
function shieldFactors(shield, pwmHz) {
	const skinBoost = Math.min(1, Math.log10(Math.max(pwmHz, 100) / 1e3 + 1) / 2);
	switch (shield) {
		case "foil": return {
			mag: .22 * (1 - .35 * skinBoost),
			el: .08
		};
		case "braid": return {
			mag: .08 * (1 - .4 * skinBoost),
			el: .03
		};
		default: return {
			mag: 1,
			el: 1
		};
	}
}
function twistFactor(twisted, id) {
	if (!twisted) return 1;
	if (id === "ethernet") return .04;
	if (id === "rs485" || id === "can") return .1;
	if (id === "thermocouple") return .12;
	return .18;
}
function verdictFor(ratio, immune) {
	if (immune) return "immune";
	if (ratio < .1) return "quiet";
	if (ratio < .5) return "workable";
	if (ratio < 1) return "marginal";
	return "fail";
}
function computeCoupling(source, victim, distanceM) {
	const contact = distanceM < (source.pairSpacingM / 2 + victim.pairSpacingM / 2 + source.conductorRadiusM + victim.conductorRadiusM) * .98;
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
	const vInductiveRms = omega * mHenry * (iRippleA / Math.SQRT2) * twist * shieldMag * routingMag;
	const cMLen = mutualFarad(source.lengthM, d, source.conductorRadiusM, victim.conductorRadiusM);
	const cG = wireToGroundFarad(source.lengthM, source.heightM, victim.conductorRadiusM);
	const vCmV = source.voltageV * source.cmFraction;
	const vCapCmPeak = vCmV * cMLen / Math.max(cMLen + cG, 1e-18) * (zIn / (zIn + 1 / Math.max(omega * (cMLen + cG), 1e-18)));
	const vCapDiffRms = vCapCmPeak * (victim.twisted ? .08 : .25) * shieldEl * routingEl / Math.SQRT2;
	const vCapCmRms = vCapCmPeak * shieldEl * routingEl / Math.SQRT2;
	const vTransientV = mHenry * (source.currentA / .001) * twist * shieldMag * routingMag;
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
		contact
	};
}
function sweepDistance(source, victim, fromM = .001, toM = 1.5, points = 64) {
	const out = [];
	const log0 = Math.log(fromM);
	const log1 = Math.log(toM);
	for (let i = 0; i < points; i++) {
		const d = Math.exp(log0 + (log1 - log0) * i / (points - 1));
		const r = computeCoupling(source, victim, d);
		out.push({
			d,
			v: Math.max(r.vTotalDiffRms, 1e-12),
			b: r.bStaticT
		});
	}
	return out;
}
var VERDICT_COPY = {
	immune: {
		title: "No electrical coupling",
		body: "Fibre does not pick up E or B. Use it for long runs beside 1500 V homeruns."
	},
	quiet: {
		title: "Quiet",
		body: "Coupled noise is under 10 % of this cable’s immunity. Fine for continuous parallel."
	},
	workable: {
		title: "Workable",
		body: "Noise is noticeable but inside typical margin. Prefer a shorter parallel or a shield."
	},
	marginal: {
		title: "Marginal",
		body: "More than half the noise budget is gone. Shorten the parallel, close the DC pair, or shield the victim."
	},
	fail: {
		title: "Over immunity",
		body: "Expected coupled voltage exceeds this cable’s noise budget. Do not run them like this."
	}
};
var conductorRadius = .0014;
var useGuide = create((set, get) => ({
	voltageV: VOLTAGE_DEFAULT,
	currentA: 15,
	pairSpacingM: .02,
	lengthM: 20,
	heightM: .4,
	routing: "open",
	pwmHz: PWM_DEFAULT_HZ,
	rippleFraction: .05,
	cmFraction: .3,
	distanceM: .15,
	victimId: "rs485",
	shield: "foil",
	fieldMode: "b",
	dragging: false,
	setDistance: (m) => {
		set({ distanceM: Math.min(1.5, Math.max(0, m)) });
	},
	setCurrent: (a) => set({ currentA: a }),
	setPairSpacing: (m) => set({ pairSpacingM: m }),
	setLength: (m) => set({ lengthM: m }),
	setRouting: (r) => set({ routing: r }),
	setPwm: (hz) => set({ pwmHz: hz }),
	setRipple: (f) => set({ rippleFraction: f }),
	setVictim: (id) => {
		set({
			victimId: id,
			shield: victimById(id).defaultShield
		});
	},
	setShield: (s) => set({ shield: s }),
	setFieldMode: (m) => set({ fieldMode: m }),
	setDragging: (d) => set({ dragging: d }),
	applyPreset: (id) => {
		const p = PRESETS.find((x) => x.id === id);
		if (!p) return;
		set({
			currentA: p.source.currentA,
			pairSpacingM: p.source.pairSpacingM,
			lengthM: p.source.lengthM,
			routing: p.source.routing,
			distanceM: p.distanceM,
			victimId: p.victimId,
			shield: p.shield
		});
	},
	sourceInput: () => {
		const s = get();
		return {
			voltageV: s.voltageV,
			currentA: s.currentA,
			pairSpacingM: s.pairSpacingM,
			conductorRadiusM: conductorRadius,
			lengthM: s.lengthM,
			heightM: s.heightM,
			routing: s.routing,
			pwmHz: s.pwmHz,
			rippleFraction: s.rippleFraction,
			cmFraction: s.cmFraction
		};
	},
	victimInput: () => {
		const s = get();
		const v = victimById(s.victimId);
		return {
			id: v.id,
			pairSpacingM: v.pairSpacingM,
			conductorRadiusM: v.conductorRadiusM,
			shield: s.shield,
			twisted: v.twisted,
			loadOhm: v.loadOhm,
			immunityV: v.immunityV
		};
	}
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatSi(value, unit, digits = 2) {
	if (!Number.isFinite(value)) return `— ${unit}`;
	const abs = Math.abs(value);
	if (abs === 0) return `0 ${unit}`;
	for (const [scale, prefix] of [
		[0xe8d4a51000, "T"],
		[1e9, "G"],
		[1e6, "M"],
		[1e3, "k"],
		[1, ""],
		[.001, "m"],
		[1e-6, "µ"],
		[1e-9, "n"],
		[1e-12, "p"]
	]) if (abs >= scale) {
		const n = value / scale;
		const d = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : digits;
		return `${n.toFixed(d)} ${prefix}${unit}`;
	}
	return `${value.toExponential(2)} ${unit}`;
}
function formatMm(metres) {
	const mm = Math.max(0, metres * 1e3);
	if (mm < .05) return "0 mm";
	if (mm >= 1e3) return `${(mm / 1e3).toFixed(mm % 1e3 === 0 ? 0 : 2)} m`;
	if (mm >= 10) return `${mm >= 100 ? mm.toFixed(0) : mm.toFixed(1)} mm`;
	return `${mm.toFixed(1)} mm`;
}
function Slider({ className, ...props }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative z-10 h-11 w-full", className),
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative z-10 flex h-11 w-full select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow rounded-full bg-raised",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-5 rounded-full bg-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_20%,transparent)] outline-none focus-visible:ring-2 focus-visible:ring-accent" })]
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "min-h-11 rounded-sm bg-fg px-3 py-2 text-xs font-medium text-accent-fg" : "min-h-11 rounded-sm bg-raised px-3 py-2 text-xs font-medium text-muted hover:text-fg",
		children
	});
}
function Row({ label, value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs tabular-nums text-fg",
				children: value
			})]
		}), children]
	});
}
function ControlsPanel() {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Presets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1.5",
					children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => applyPreset(p.id),
						className: "min-h-11 rounded-md bg-raised px-3 py-2.5 text-left transition-colors hover:bg-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium text-fg",
							children: p.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: p.blurb
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: "1500 V DC source"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Centre-to-centre",
						value: formatMm(distanceM),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1500,
							step: 1,
							value: [Math.round(distanceM * 1e3)],
							onValueChange: (v) => setDistance((v[0] ?? 150) / 1e3),
							"aria-label": "Separation distance"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "DC current",
						value: `${currentA.toFixed(0)} A`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 5,
							max: 800,
							step: 5,
							value: [currentA],
							onValueChange: (v) => setCurrent(v[0] ?? 15),
							"aria-label": "DC current"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "+ / − spacing",
						value: formatMm(pairSpacingM),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 10,
							max: 400,
							step: 2,
							value: [pairSpacingM * 1e3],
							onValueChange: (v) => setPairSpacing((v[0] ?? 20) / 1e3),
							"aria-label": "Pair spacing"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Parallel run",
						value: `${lengthM.toFixed(0)} m`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 1,
							max: 80,
							step: 1,
							value: [lengthM],
							onValueChange: (v) => setLength(v[0] ?? 20),
							"aria-label": "Parallel run length"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "PWM / ripple",
						value: `${(pwmHz / 1e3).toFixed(0)} kHz`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 2e3,
							max: 4e4,
							step: 1e3,
							value: [pwmHz],
							onValueChange: (v) => setPwm(v[0] ?? 16e3),
							"aria-label": "Inverter PWM frequency"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Current ripple",
						value: `${(rippleFraction * 100).toFixed(0)} %`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 1,
							max: 15,
							step: 1,
							value: [rippleFraction * 100],
							onValueChange: (v) => setRipple((v[0] ?? 5) / 100),
							"aria-label": "Ripple fraction"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: "Routing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								"open",
								"tray",
								"conduit"
							].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: routing === r,
								onClick: () => setRouting(r),
								children: r === "open" ? "Open air" : r === "tray" ? "Cable tray" : "Steel conduit"
							}, r))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: "Nearby cable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: VICTIMS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setVictim(v.id),
							className: victimId === v.id ? "min-h-11 rounded-md bg-fg px-2.5 py-2 text-left text-xs font-medium text-accent-fg" : "min-h-11 rounded-md bg-raised px-2.5 py-2 text-left text-xs font-medium text-muted hover:text-fg",
							children: v.short
						}, v.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: "Shield"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								"none",
								"foil",
								"braid"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: shield === s,
								onClick: () => setShield(s),
								children: s === "none" ? "Unshielded" : s === "foil" ? "Foil" : "Braid"
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: "Field overlay"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: fieldMode === "b",
									onClick: () => setFieldMode("b"),
									children: "Magnetic B"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: fieldMode === "e",
									onClick: () => setFieldMode("e"),
									children: "Electric E"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: fieldMode === "cables",
									onClick: () => setFieldMode("cables"),
									children: "Cables only"
								})
							]
						})]
					})
				]
			})
		]
	});
}
function uvTick(uv) {
	if (uv >= 1e6) return `${(uv / 1e6).toPrecision(2)} V`;
	if (uv >= 1e3) return `${(uv / 1e3).toPrecision(2)} mV`;
	if (uv >= 1) return `${uv >= 10 ? uv.toFixed(0) : uv.toPrecision(2)} µV`;
	return `${(uv * 1e3).toFixed(0)} nV`;
}
function DistanceChart() {
	const store = useGuide();
	const source = store.sourceInput();
	const victim = store.victimInput();
	const data = (0, import_react.useMemo)(() => sweepDistance(source, victim).map((p) => ({
		mm: p.d * 1e3,
		uv: Math.max(p.v * 1e6, 1e-6)
	})), [
		source.currentA,
		source.pairSpacingM,
		source.lengthM,
		source.routing,
		source.pwmHz,
		source.rippleFraction,
		victim.id,
		victim.shield,
		victim.twisted,
		victim.loadOhm
	]);
	const now = computeCoupling(source, victim, store.distanceM);
	const immune = !Number.isFinite(victim.immunityV);
	const peakUv = data.reduce((m, p) => Math.max(m, p.uv), 1);
	const immUv = immune ? 0 : victim.immunityV * 1e6;
	const yMax = Math.max(peakUv * 6, immUv * 1.4, 20);
	const yMin = Math.max(.05, Math.min(1, peakUv / 80));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Noise versus distance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-muted",
					children: "log millimetres"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data,
						margin: {
							top: 8,
							right: 10,
							left: 4,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "color-mix(in oklab, var(--color-fg) 8%, transparent)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "mm",
								type: "number",
								scale: "log",
								domain: [1, 1500],
								ticks: [
									1,
									5,
									10,
									20,
									50,
									100,
									300,
									1e3
								],
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono"
								},
								tickFormatter: (v) => `${v}`,
								axisLine: { stroke: "color-mix(in oklab, var(--color-fg) 14%, transparent)" },
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								dataKey: "uv",
								type: "number",
								scale: "log",
								domain: [yMin, yMax],
								allowDataOverflow: true,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono"
								},
								tickFormatter: uvTick,
								axisLine: false,
								tickLine: false,
								width: 64
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-raised)",
									border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
									borderRadius: 8,
									fontSize: 12,
									color: "var(--color-fg)"
								},
								labelFormatter: (mm) => `${Number(mm).toFixed(0)} mm`,
								formatter: (value) => [formatSi(Number(value) / 1e6, "V"), "Coupled"]
							}),
							!immune && immUv >= yMin && immUv <= yMax && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								y: immUv,
								stroke: "var(--color-fail)",
								strokeDasharray: "4 4"
							}),
							CODE_MARKS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								x: m.m * 1e3,
								stroke: "color-mix(in oklab, var(--color-fg) 14%, transparent)"
							}, m.m)),
							store.distanceM * 1e3 >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								x: store.distanceM * 1e3,
								stroke: "var(--color-accent)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "uv",
								stroke: "var(--color-accent)",
								strokeWidth: 2,
								dot: false,
								isAnimationActive: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-subtle",
				children: [
					"Now ",
					formatSi(now.vTotalDiffRms, "V"),
					" at ",
					(store.distanceM * 1e3).toFixed(0),
					" mm",
					!immune ? ` · immunity ${formatSi(victim.immunityV, "V")}` : ""
				]
			})
		]
	});
}
var CODE = [
	{
		m: .05,
		tag: "50"
	},
	{
		m: .15,
		tag: "150"
	},
	{
		m: .3,
		tag: "300"
	},
	{
		m: .6,
		tag: "600"
	}
];
function readCss(name, fallback) {
	if (typeof document === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function magB(x, y, i, xP, xN) {
	const field = (xc, sign) => {
		const dx = x - xc;
		const r = Math.hypot(dx, y) || 1e-8;
		const mag = sign * MU0 * i / (2 * Math.PI * r);
		return {
			bx: mag * (-y / r),
			by: mag * (dx / r)
		};
	};
	const p = field(xP, 1);
	const n = field(xN, -1);
	return Math.hypot(p.bx + n.bx, p.by + n.by);
}
function magE(x, y, v, xP, xN, s, radius) {
	const acosh = Math.acosh(Math.max(s / (2 * radius), 1.01));
	const k = Math.PI * EPS0 / acosh * v / (2 * Math.PI * EPS0);
	const field = (xc, sign) => {
		const dx = x - xc;
		const r = Math.hypot(dx, y) || 1e-8;
		const mag = sign * k / r;
		return {
			ex: mag * (dx / r),
			ey: mag * (y / r)
		};
	};
	const p = field(xP, 1);
	const n = field(xN, -1);
	return Math.hypot(p.ex + n.ex, p.ey + n.ey);
}
function FieldCanvas() {
	const wrapRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const currentA = useGuide((s) => s.currentA);
	const pairSpacingM = useGuide((s) => s.pairSpacingM);
	const distanceM = useGuide((s) => s.distanceM);
	const voltageV = useGuide((s) => s.voltageV);
	const fieldMode = useGuide((s) => s.fieldMode);
	const setDistance = useGuide((s) => s.setDistance);
	const setDragging = useGuide((s) => s.setDragging);
	const victimId = useGuide((s) => s.victimId);
	const stateRef = (0, import_react.useRef)({
		currentA,
		pairSpacingM,
		distanceM,
		voltageV,
		fieldMode,
		victimId
	});
	stateRef.current = {
		currentA,
		pairSpacingM,
		distanceM,
		voltageV,
		fieldMode,
		victimId
	};
	const setDistanceRef = (0, import_react.useRef)(setDistance);
	setDistanceRef.current = setDistance;
	const setDraggingRef = (0, import_react.useRef)(setDragging);
	setDraggingRef.current = setDragging;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const colors = {
			bg: readCss("--color-surface", "#121416"),
			fg: readCss("--color-fg", "#e8e6e1"),
			muted: readCss("--color-muted", "#8a8884"),
			subtle: readCss("--color-subtle", "#5c5b58"),
			accent: readCss("--color-accent", "#7eb8b2"),
			pos: readCss("--color-dc-pos", "#c45c4a"),
			neg: readCss("--color-dc-neg", "#4a5870"),
			victim: readCss("--color-victim", "#c8ccd4")
		};
		let raf = 0;
		let width = 0;
		let height = 0;
		let dpr = 1;
		const heat = document.createElement("canvas");
		let heatKey = "";
		const layout = () => {
			const s = stateRef.current;
			const span = Math.max(s.distanceM * 1.45 + s.pairSpacingM, .42);
			const originM = s.pairSpacingM * .7;
			const metresToX = (m) => (m + originM) / span * width * .9 + width * .05;
			const metresToY = (m) => height * .52 - m / span * width * .9;
			const xToMetres = (px) => (px - width * .05) / (width * .9) * span - originM;
			return {
				span,
				metresToX,
				metresToY,
				xToMetres
			};
		};
		const paintHeat = () => {
			const s = stateRef.current;
			const key = [
				width,
				height,
				s.fieldMode,
				s.currentA,
				s.pairSpacingM,
				s.voltageV,
				s.distanceM.toFixed(2)
			].join("|");
			if (key === heatKey) return;
			heatKey = key;
			heat.width = width;
			heat.height = height;
			const hctx = heat.getContext("2d");
			if (!hctx) return;
			hctx.clearRect(0, 0, width, height);
			if (s.fieldMode === "cables" || width < 8) return;
			const { span, xToMetres } = layout();
			const xP = -s.pairSpacingM / 2;
			const xN = s.pairSpacingM / 2;
			const rIns = Math.max(.0032, s.pairSpacingM * .14);
			const rCond = rIns * .42;
			const step = 3;
			const img = hctx.createImageData(width, height);
			const data = img.data;
			let peak = 1e-18;
			const samples = new Float32Array(width * height);
			for (let py = 0; py < height; py += step) for (let px = 0; px < width; px += step) {
				const xm = xToMetres(px);
				const ym = (height * .52 - py) / (width * .9) * span;
				if (Math.hypot(xm - xP, ym) < rIns * .85 || Math.hypot(xm - xN, ym) < rIns * .85) continue;
				const m = s.fieldMode === "b" ? magB(xm, ym, s.currentA, xP, xN) : magE(xm, ym, s.voltageV, xP, xN, s.pairSpacingM, rCond);
				samples[py * width + px] = m;
				if (m > peak) peak = m;
			}
			const logPeak = Math.log10(peak);
			for (let py = 0; py < height; py += step) for (let px = 0; px < width; px += step) {
				const m = samples[py * width + px];
				if (m <= 0) continue;
				const a = Math.max(0, Math.min(1, (Math.log10(m) - (logPeak - 2.3)) / 2.3)) * .82;
				let r = 0;
				let g = 0;
				let b = 0;
				if (s.fieldMode === "b") {
					r = 80;
					g = 155;
					b = 165;
				} else {
					r = 175;
					g = 115;
					b = 108;
				}
				for (let dy = 0; dy < step; dy++) for (let dx = 0; dx < step; dx++) {
					const i = ((py + dy) * width + (px + dx)) * 4;
					if (i < 0 || i + 3 >= data.length) continue;
					data[i] = r;
					data[i + 1] = g;
					data[i + 2] = b;
					data[i + 3] = Math.round(255 * a);
				}
			}
			hctx.putImageData(img, 0, 0);
		};
		const draw = (now) => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			const rect = wrap.getBoundingClientRect();
			width = Math.max(1, Math.floor(rect.width));
			height = Math.max(1, Math.floor(rect.height));
			const bw = Math.floor(width * dpr);
			const bh = Math.floor(height * dpr);
			if (canvas.width !== bw || canvas.height !== bh) {
				canvas.width = bw;
				canvas.height = bh;
				canvas.style.width = `${width}px`;
				canvas.style.height = `${height}px`;
				heatKey = "";
			}
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const s = stateRef.current;
			const pulse = .5 + .5 * Math.sin(now / 420);
			const { span, metresToX, metresToY, xToMetres } = layout();
			const xP = -s.pairSpacingM / 2;
			const xN = s.pairSpacingM / 2;
			const rIns = Math.max(.0032, s.pairSpacingM * .14);
			paintHeat();
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0, 0, width, height);
			if (s.fieldMode !== "cables") ctx.drawImage(heat, 0, 0, width, height);
			const cxPair = metresToX(0);
			const cyPair = metresToY(0);
			const sPx = Math.abs(metresToX(s.pairSpacingM / 2) - metresToX(-s.pairSpacingM / 2));
			if (s.fieldMode === "b") {
				ctx.strokeStyle = colors.accent;
				for (let k = 1; k <= 9; k++) {
					const rx = sPx * .7 + k * Math.min(width, height) * .038;
					const ry = rx * .52;
					ctx.globalAlpha = .16 * (1 - k / 11);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.ellipse(cxPair, cyPair, rx, ry, 0, 0, Math.PI * 2);
					ctx.stroke();
				}
				ctx.globalAlpha = 1;
			} else if (s.fieldMode === "e") {
				const xPlus = metresToX(xP);
				const xMinus = metresToX(xN);
				ctx.strokeStyle = colors.pos;
				for (let k = -4; k <= 4; k++) {
					if (k === 0) continue;
					const bulge = k * Math.min(width, height) * .045;
					ctx.globalAlpha = .22;
					ctx.beginPath();
					ctx.moveTo(xPlus, cyPair);
					ctx.quadraticCurveTo((xPlus + xMinus) / 2, cyPair + bulge, xMinus, cyPair);
					ctx.stroke();
				}
				ctx.globalAlpha = 1;
			}
			ctx.strokeStyle = colors.subtle;
			ctx.globalAlpha = .4;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0, height * .52);
			ctx.lineTo(width, height * .52);
			ctx.stroke();
			ctx.globalAlpha = 1;
			const groundY = height * .86;
			ctx.setLineDash([3, 5]);
			ctx.beginPath();
			ctx.moveTo(width * .05, groundY);
			ctx.lineTo(width * .95, groundY);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.font = "11px 'IBM Plex Mono', monospace";
			ctx.fillStyle = colors.subtle;
			ctx.fillText("ground plane", width * .05, groundY + 16);
			for (const mark of CODE) {
				const x = metresToX(mark.m);
				if (x < 8 || x > width - 8) continue;
				ctx.strokeStyle = colors.subtle;
				ctx.globalAlpha = .32;
				ctx.beginPath();
				ctx.moveTo(x, height * .18);
				ctx.lineTo(x, height * .82);
				ctx.stroke();
				ctx.globalAlpha = 1;
				ctx.fillStyle = colors.muted;
				ctx.font = "10px 'IBM Plex Mono', monospace";
				ctx.textAlign = "center";
				ctx.fillText(`${mark.tag} mm`, x, height * .16);
				ctx.textAlign = "left";
			}
			const drawCable = (xm, fill, label, ring, scale = 1) => {
				const cx = metresToX(xm);
				const cy = metresToY(0);
				const pr = Math.min(20, Math.max(12, rIns / span * width * .9)) * scale;
				const cr = pr * .42;
				ctx.beginPath();
				ctx.arc(cx, cy, pr, 0, Math.PI * 2);
				ctx.fillStyle = "#1c1f23";
				ctx.fill();
				ctx.strokeStyle = fill;
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(cx, cy, cr, 0, Math.PI * 2);
				ctx.fillStyle = fill;
				ctx.fill();
				if (ring) {
					ctx.beginPath();
					ctx.arc(cx, cy, pr + 5 + pulse * 3, 0, Math.PI * 2);
					ctx.strokeStyle = colors.accent;
					ctx.globalAlpha = .4;
					ctx.lineWidth = 1;
					ctx.stroke();
					ctx.globalAlpha = 1;
				}
				ctx.fillStyle = colors.fg;
				ctx.font = "600 11px 'IBM Plex Sans', sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(label, cx, cy - pr - 8);
				ctx.textAlign = "left";
			};
			drawCable(xP, colors.pos, "+", false);
			drawCable(xN, colors.neg, "−", false);
			drawCable(s.distanceM, colors.victim, s.victimId === "fiber" ? "fibre" : "victim", true, .85);
			const x0 = metresToX(0);
			const x1 = metresToX(s.distanceM);
			const dimY = height * .7;
			ctx.strokeStyle = colors.accent;
			ctx.lineWidth = 1.25;
			ctx.beginPath();
			ctx.moveTo(x0, dimY);
			ctx.lineTo(x1, dimY);
			ctx.moveTo(x0, dimY - 6);
			ctx.lineTo(x0, dimY + 6);
			ctx.moveTo(x1, dimY - 6);
			ctx.lineTo(x1, dimY + 6);
			ctx.stroke();
			const label = formatMm(s.distanceM);
			ctx.font = "500 13px 'IBM Plex Mono', monospace";
			ctx.textAlign = "center";
			const tw = ctx.measureText(label).width;
			const mid = (x0 + x1) / 2;
			ctx.fillStyle = colors.bg;
			ctx.fillRect(mid - tw / 2 - 8, dimY - 11, tw + 16, 18);
			ctx.fillStyle = colors.accent;
			ctx.fillText(label, mid, dimY + 4);
			ctx.textAlign = "left";
			const b = bPairTesla(s.currentA, s.pairSpacingM, s.distanceM);
			const e = ePairVm(s.voltageV, s.pairSpacingM, s.distanceM);
			ctx.font = "11px 'IBM Plex Mono', monospace";
			ctx.fillStyle = colors.muted;
			const readout = s.fieldMode === "e" ? `E ≈ ${e >= 1e3 ? `${(e / 1e3).toFixed(1)} kV/m` : `${e.toFixed(0)} V/m`} at victim` : s.fieldMode === "b" ? `B ≈ ${(b * 1e6).toFixed(1)} µT at victim  ·  Earth 50 µT` : "Fields hidden";
			ctx.fillText(readout, width * .05, height - 16);
			const barM = span > .8 ? .2 : .1;
			const barW = barM / span * width * .9;
			const barX = width * .95;
			const barY = height - 18;
			ctx.strokeStyle = colors.fg;
			ctx.globalAlpha = .55;
			ctx.beginPath();
			ctx.moveTo(barX - barW, barY);
			ctx.lineTo(barX, barY);
			ctx.moveTo(barX - barW, barY - 4);
			ctx.lineTo(barX - barW, barY + 4);
			ctx.moveTo(barX, barY - 4);
			ctx.lineTo(barX, barY + 4);
			ctx.stroke();
			ctx.globalAlpha = 1;
			ctx.fillStyle = colors.muted;
			ctx.textAlign = "right";
			ctx.fillText(formatMm(barM), barX, barY - 8);
			ctx.textAlign = "left";
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		let armed = false;
		let dragging = false;
		let pointerId = null;
		let startX = 0;
		let startY = 0;
		const endDrag = (id) => {
			if (pointerId !== null && id !== void 0 && id !== pointerId) return;
			armed = false;
			if (dragging) {
				dragging = false;
				setDraggingRef.current(false);
				if (pointerId !== null && canvas.hasPointerCapture(pointerId)) try {
					canvas.releasePointerCapture(pointerId);
				} catch {}
			}
			pointerId = null;
		};
		const onDown = (ev) => {
			if (ev.button !== 0 && ev.pointerType === "mouse") return;
			armed = true;
			dragging = false;
			pointerId = ev.pointerId;
			startX = ev.clientX;
			startY = ev.clientY;
		};
		const onMove = (ev) => {
			if (pointerId !== null && ev.pointerId !== pointerId) return;
			if (!armed && !dragging) return;
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			if (!dragging) {
				if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
				if (Math.abs(dy) > Math.abs(dx) * 1.15) {
					armed = false;
					pointerId = null;
					return;
				}
				dragging = true;
				setDraggingRef.current(true);
				try {
					canvas.setPointerCapture(ev.pointerId);
				} catch {}
			}
			const { xToMetres } = layout();
			const rect = canvas.getBoundingClientRect();
			setDistanceRef.current(xToMetres(ev.clientX - rect.left));
			ev.preventDefault();
		};
		const onUp = (ev) => endDrag(ev.pointerId);
		const onBlur = () => endDrag();
		canvas.addEventListener("pointerdown", onDown);
		canvas.addEventListener("pointermove", onMove);
		canvas.addEventListener("pointerup", onUp);
		canvas.addEventListener("pointercancel", onUp);
		canvas.addEventListener("lostpointercapture", onUp);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("blur", onBlur);
		return () => {
			cancelAnimationFrame(raf);
			canvas.removeEventListener("pointerdown", onDown);
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerup", onUp);
			canvas.removeEventListener("pointercancel", onUp);
			canvas.removeEventListener("lostpointercapture", onUp);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("blur", onBlur);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative h-[min(42vh,380px)] min-h-[220px] w-full overflow-hidden rounded-lg bg-surface sm:h-[min(52vh,480px)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "h-full w-full cursor-ew-resize touch-pan-y",
			role: "slider",
			"aria-label": "Victim cable distance",
			"aria-valuemin": 0,
			"aria-valuemax": 1500,
			"aria-valuenow": Math.round(distanceM * 1e3),
			"aria-valuetext": formatMm(distanceM)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "pointer-events-none absolute top-3 left-3 text-xs tracking-wide text-muted",
			children: "Cross-section · drag the victim cable"
		})]
	});
}
function GuideCopy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Steady DC does not induce"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "Faraday’s law needs a changing flux. A constant 1500 V and a constant current make static E and B fields. They can bias a Hall probe or a compass; they do not put an AC voltage on a nearby pair. The noise is the inverter PWM that rides on the DC bus — typically a few percent current ripple and a common-mode voltage of hundreds of volts at 8–20 kHz."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Close the pair, then the distance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "A go/return pair is a magnetic dipole: residual B falls as 1/d² once you are farther than the +/− spacing. Splitting positive and negative across a tray (an “open loop”) turns that dipole into two monopoles. Coupling jumps by ten times or more. Keep H1Z2Z2-K positives and negatives touching, then move the signal cable out."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Safety is not EMC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "AS/NZS 5033:2021 clause 4.4.3.2 asks for 50 mm segregation (or a medium-duty enclosure) between PV DC and other cables. That is a shock/fire rule. Comms practice is 300 mm, and analog at a few millivolts often wants more unless it is foil-shielded and the DC pair is tight."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-4 md:col-span-2 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "What the numbers assume"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 space-y-1.5 text-sm leading-relaxed text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Electrically short run (20 m ≪ wavelength at 16 kHz)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Inductive: V = 2πf M I",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "ripple" }),
							", with M from the two-wire loop formula. Twist and shield multiply the loop area / transfer."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Capacitive: inverter common-mode (default 0.3 × V",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "dc" }),
							") into the victim via mutual C, loaded by the cable’s capacitance to ground and the input Z."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Transient: V = M dI/dt for a 1 ms current step (cloud edge / MPPT), not a lightning stroke." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "First-order, air dielectric, no site resonances. Not a substitute for an EMC study or a wiring-rules inspection." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "Marked distances"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: CODE_MARKS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: m.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs tabular-nums text-fg",
							children: [(m.m * 1e3).toFixed(0), " mm"]
						})]
					}, m.m))
				})]
			})
		]
	});
}
var TONE = {
	immune: "text-immune",
	quiet: "text-quiet",
	workable: "text-workable",
	marginal: "text-marginal",
	fail: "text-fail"
};
var BAR = {
	immune: "bg-immune",
	quiet: "bg-quiet",
	workable: "bg-workable",
	marginal: "bg-marginal",
	fail: "bg-fail"
};
function Readout() {
	const store = useGuide();
	const source = store.sourceInput();
	const r = computeCoupling(source, store.victimInput(), store.distanceM);
	const def = victimById(store.victimId);
	const copy = VERDICT_COPY[r.verdict];
	const pct = Number.isFinite(r.ratio) ? Math.min(r.ratio * 100, 160) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: "Coupled noise"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 font-mono text-3xl leading-none font-medium tabular-nums ${TONE[r.verdict]}`,
						children: r.verdict === "immune" ? "0 V" : formatSi(r.vTotalDiffRms, "V")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							"RMS at ",
							source.pwmHz / 1e3,
							" kHz, differential"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm font-medium ${TONE[r.verdict]}`,
						children: copy.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs tabular-nums text-muted",
						children: ["budget ", Number.isFinite(r.immunityV) ? formatSi(r.immunityV, "V") : "n/a"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-1 overflow-hidden rounded-full bg-raised",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full ${BAR[r.verdict]} transition-[width] duration-200`,
					style: { width: `${r.verdict === "immune" ? 0 : Math.min(100, pct)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-snug text-muted",
				children: copy.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-snug text-subtle",
				children: def.hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid grid-cols-2 gap-x-4 gap-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Inductive (ripple B)",
						value: formatSi(r.vInductiveRms, "V")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Capacitive (PWM CM)",
						value: formatSi(r.vCapDiffRms, "V")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Static B at victim",
						value: formatSi(r.bStaticT, "T")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "vs Earth field",
						value: `${r.bEarthRatio.toFixed(2)} ×`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Static E at victim",
						value: formatSi(r.eStaticVm, "V/m")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "1 ms current step",
						value: formatSi(r.vTransientV, "V")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Mutual M",
						value: formatSi(r.mHenry, "H")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Ripple current",
						value: formatSi(r.iRippleA, "A")
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-mono text-sm tabular-nums text-fg",
		children: value
	})] });
}
function Home() {
	const store = useGuide();
	const r = computeCoupling(store.sourceInput(), store.victimInput(), store.distanceM);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "Fieldline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl leading-tight font-medium tracking-tight",
						children: "What 1500 V DC cables couple into a neighbour"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-sm text-sm text-muted",
						children: "True millimetres. Drag the victim cable or use the slider. Steady DC is silent; the inverter on the bus is not."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-surface p-3 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldCanvas, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 space-y-2 px-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-sm tabular-nums text-fg",
											children: [formatMm(store.distanceM), " centre-to-centre"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted",
											children: [
												store.currentA.toFixed(0),
												" A · ",
												formatMm(store.pairSpacingM),
												" pair ·",
												" ",
												store.lengthM.toFixed(0),
												" m parallel"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										min: 0,
										max: 1500,
										step: 1,
										value: [Math.round(store.distanceM * 1e3)],
										onValueChange: (v) => store.setDistance((v[0] ?? 150) / 1e3),
										"aria-label": "Separation distance"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex gap-1.5 overflow-x-auto pb-1",
									children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => store.applyPreset(p.id),
										className: "min-h-11 shrink-0 rounded-md bg-raised px-3 text-xs font-medium text-fg hover:bg-border",
										children: p.label
									}, p.id))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DistanceChart, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "relative z-10 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsPanel, {})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-6xl px-4 pb-6 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideCopy, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-subtle sm:flex-row sm:justify-between sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.contact ? "Cables physically overlap at this spacing. The field is a near-contact estimate, not a short-circuit." : "Order-of-magnitude EMC model for 1500 V PV / BESS DC pairs." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AS/NZS 5033 · AS/NZS 3000 · IEC 61000" })]
				})
			})
		]
	});
}
//#endregion
export { Home as component };

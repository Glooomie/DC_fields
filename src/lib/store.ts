import { create } from "zustand";
import {
  type Routing,
  type Shield,
  type VictimId,
  PWM_DEFAULT_HZ,
  VOLTAGE_DEFAULT,
  victimById,
  type SourceInput,
  type VictimInput,
  PRESETS,
} from "./physics";

export type FieldMode = "b" | "e" | "cables";

type GuideState = {
  voltageV: number;
  currentA: number;
  pairSpacingM: number;
  lengthM: number;
  heightM: number;
  routing: Routing;
  pwmHz: number;
  rippleFraction: number;
  cmFraction: number;
  distanceM: number;
  victimId: VictimId;
  shield: Shield;
  fieldMode: FieldMode;
  dragging: boolean;
  setDistance: (m: number) => void;
  setCurrent: (a: number) => void;
  setPairSpacing: (m: number) => void;
  setLength: (m: number) => void;
  setRouting: (r: Routing) => void;
  setPwm: (hz: number) => void;
  setRipple: (f: number) => void;
  setVictim: (id: VictimId) => void;
  setShield: (s: Shield) => void;
  setFieldMode: (m: FieldMode) => void;
  setDragging: (d: boolean) => void;
  applyPreset: (id: string) => void;
  sourceInput: () => SourceInput;
  victimInput: () => VictimInput;
};

const conductorRadius = 0.0014;

export const useGuide = create<GuideState>((set, get) => ({
  voltageV: VOLTAGE_DEFAULT,
  currentA: 15,
  pairSpacingM: 0.02,
  lengthM: 20,
  heightM: 0.4,
  routing: "open",
  pwmHz: PWM_DEFAULT_HZ,
  rippleFraction: 0.05,
  cmFraction: 0.3,
  distanceM: 0.15,
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
    const v = victimById(id);
    set({ victimId: id, shield: v.defaultShield });
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
      shield: p.shield,
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
      cmFraction: s.cmFraction,
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
      immunityV: v.immunityV,
    };
  },
}));

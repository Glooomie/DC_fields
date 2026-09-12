import { useEffect, useRef } from "react";
import { EPS0, MU0, bPairTesla, ePairVm } from "@/lib/physics";
import { useGuide } from "@/lib/store";
import { formatMm } from "@/lib/utils";

const CODE = [
  { m: 0.05, tag: "50" },
  { m: 0.15, tag: "150" },
  { m: 0.3, tag: "300" },
  { m: 0.6, tag: "600" },
];

function readCss(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function magB(x: number, y: number, i: number, xP: number, xN: number): number {
  const field = (xc: number, sign: number) => {
    const dx = x - xc;
    const r = Math.hypot(dx, y) || 1e-8;
    const mag = (sign * MU0 * i) / (2 * Math.PI * r);
    return { bx: mag * (-y / r), by: mag * (dx / r) };
  };
  const p = field(xP, 1);
  const n = field(xN, -1);
  return Math.hypot(p.bx + n.bx, p.by + n.by);
}

function magE(
  x: number,
  y: number,
  v: number,
  xP: number,
  xN: number,
  s: number,
  radius: number,
): number {
  const acosh = Math.acosh(Math.max(s / (2 * radius), 1.01));
  const lambda = ((Math.PI * EPS0) / acosh) * v;
  const k = lambda / (2 * Math.PI * EPS0);
  const field = (xc: number, sign: number) => {
    const dx = x - xc;
    const r = Math.hypot(dx, y) || 1e-8;
    const mag = (sign * k) / r;
    return { ex: mag * (dx / r), ey: mag * (y / r) };
  };
  const p = field(xP, 1);
  const n = field(xN, -1);
  return Math.hypot(p.ex + n.ex, p.ey + n.ey);
}

type DrawState = {
  currentA: number;
  pairSpacingM: number;
  distanceM: number;
  voltageV: number;
  fieldMode: "b" | "e" | "cables";
  victimId: string;
};

export function FieldCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentA = useGuide((s) => s.currentA);
  const pairSpacingM = useGuide((s) => s.pairSpacingM);
  const distanceM = useGuide((s) => s.distanceM);
  const voltageV = useGuide((s) => s.voltageV);
  const fieldMode = useGuide((s) => s.fieldMode);
  const setDistance = useGuide((s) => s.setDistance);
  const setDragging = useGuide((s) => s.setDragging);
  const victimId = useGuide((s) => s.victimId);

  const stateRef = useRef<DrawState>({
    currentA,
    pairSpacingM,
    distanceM,
    voltageV,
    fieldMode,
    victimId,
  });
  stateRef.current = { currentA, pairSpacingM, distanceM, voltageV, fieldMode, victimId };
  const setDistanceRef = useRef(setDistance);
  setDistanceRef.current = setDistance;
  const setDraggingRef = useRef(setDragging);
  setDraggingRef.current = setDragging;

  useEffect(() => {
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
      victim: readCss("--color-victim", "#c8ccd4"),
    };

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const heat = document.createElement("canvas");
    let heatKey = "";

    const layout = () => {
      const s = stateRef.current;
      const span = Math.max(s.distanceM * 1.45 + s.pairSpacingM, 0.42);
      const originM = s.pairSpacingM * 0.7;
      const metresToX = (m: number) => ((m + originM) / span) * width * 0.9 + width * 0.05;
      const metresToY = (m: number) => height * 0.52 - (m / span) * width * 0.9;
      const xToMetres = (px: number) => ((px - width * 0.05) / (width * 0.9)) * span - originM;
      return { span, metresToX, metresToY, xToMetres };
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
        s.distanceM.toFixed(2),
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
      const rIns = Math.max(0.0032, s.pairSpacingM * 0.14);
      const rCond = rIns * 0.42;
      const step = 3;
      const img = hctx.createImageData(width, height);
      const data = img.data;
      let peak = 1e-18;
      const samples = new Float32Array(width * height);

      for (let py = 0; py < height; py += step) {
        for (let px = 0; px < width; px += step) {
          const xm = xToMetres(px);
          const ym = ((height * 0.52 - py) / (width * 0.9)) * span;
          if (Math.hypot(xm - xP, ym) < rIns * 0.85 || Math.hypot(xm - xN, ym) < rIns * 0.85) {
            continue;
          }
          const m =
            s.fieldMode === "b"
              ? magB(xm, ym, s.currentA, xP, xN)
              : magE(xm, ym, s.voltageV, xP, xN, s.pairSpacingM, rCond);
          samples[py * width + px] = m;
          if (m > peak) peak = m;
        }
      }

      const logPeak = Math.log10(peak);
      for (let py = 0; py < height; py += step) {
        for (let px = 0; px < width; px += step) {
          const m = samples[py * width + px];
          if (m <= 0) continue;
          const t = Math.max(0, Math.min(1, (Math.log10(m) - (logPeak - 2.3)) / 2.3));
          const a = t * 0.82;
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
          for (let dy = 0; dy < step; dy++) {
            for (let dx = 0; dx < step; dx++) {
              const i = ((py + dy) * width + (px + dx)) * 4;
              if (i < 0 || i + 3 >= data.length) continue;
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
              data[i + 3] = Math.round(255 * a);
            }
          }
        }
      }
      hctx.putImageData(img, 0, 0);
    };

    const draw = (now: number) => {
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
      const pulse = 0.5 + 0.5 * Math.sin(now / 420);
      const { span, metresToX, metresToY, xToMetres } = layout();
      const xP = -s.pairSpacingM / 2;
      const xN = s.pairSpacingM / 2;
      const rIns = Math.max(0.0032, s.pairSpacingM * 0.14);

      paintHeat();

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);
      if (s.fieldMode !== "cables") {
        ctx.drawImage(heat, 0, 0, width, height);
      }

      const cxPair = metresToX(0);
      const cyPair = metresToY(0);
      const sPx = Math.abs(metresToX(s.pairSpacingM / 2) - metresToX(-s.pairSpacingM / 2));
      if (s.fieldMode === "b") {
        ctx.strokeStyle = colors.accent;
        for (let k = 1; k <= 9; k++) {
          const rx = sPx * 0.7 + k * Math.min(width, height) * 0.038;
          const ry = rx * 0.52;
          ctx.globalAlpha = 0.16 * (1 - k / 11);
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
          const bulge = k * Math.min(width, height) * 0.045;
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.moveTo(xPlus, cyPair);
          ctx.quadraticCurveTo((xPlus + xMinus) / 2, cyPair + bulge, xMinus, cyPair);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = colors.subtle;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.52);
      ctx.lineTo(width, height * 0.52);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const groundY = height * 0.86;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(width * 0.05, groundY);
      ctx.lineTo(width * 0.95, groundY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillStyle = colors.subtle;
      ctx.fillText("ground plane", width * 0.05, groundY + 16);

      for (const mark of CODE) {
        const x = metresToX(mark.m);
        if (x < 8 || x > width - 8) continue;
        ctx.strokeStyle = colors.subtle;
        ctx.globalAlpha = 0.32;
        ctx.beginPath();
        ctx.moveTo(x, height * 0.18);
        ctx.lineTo(x, height * 0.82);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.muted;
        ctx.font = "10px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${mark.tag} mm`, x, height * 0.16);
        ctx.textAlign = "left";
      }

      const drawCable = (xm: number, fill: string, label: string, ring: boolean, scale = 1) => {
        const cx = metresToX(xm);
        const cy = metresToY(0);
        const pr = Math.min(20, Math.max(12, (rIns / span) * width * 0.9)) * scale;
        const cr = pr * 0.42;
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
          ctx.globalAlpha = 0.4;
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
      drawCable(s.distanceM, colors.victim, s.victimId === "fiber" ? "fibre" : "victim", true, 0.85);

      const x0 = metresToX(0);
      const x1 = metresToX(s.distanceM);
      const dimY = height * 0.7;
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
      const readout =
        s.fieldMode === "e"
          ? `E ≈ ${e >= 1000 ? `${(e / 1000).toFixed(1)} kV/m` : `${e.toFixed(0)} V/m`} at victim`
          : s.fieldMode === "b"
            ? `B ≈ ${(b * 1e6).toFixed(1)} µT at victim  ·  Earth 50 µT`
            : "Fields hidden";
      ctx.fillText(readout, width * 0.05, height - 16);

      const barM = span > 0.8 ? 0.2 : 0.1;
      const barW = (barM / span) * width * 0.9;
      const barX = width * 0.95;
      const barY = height - 18;
      ctx.strokeStyle = colors.fg;
      ctx.globalAlpha = 0.55;
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

      void xToMetres;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    let armed = false;
    let dragging = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;

    const endDrag = (id?: number) => {
      if (pointerId !== null && id !== undefined && id !== pointerId) return;
      armed = false;
      if (dragging) {
        dragging = false;
        setDraggingRef.current(false);
        if (pointerId !== null && canvas.hasPointerCapture(pointerId)) {
          try {
            canvas.releasePointerCapture(pointerId);
          } catch {
            /* already released */
          }
        }
      }
      pointerId = null;
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0 && ev.pointerType === "mouse") return;
      armed = true;
      dragging = false;
      pointerId = ev.pointerId;
      startX = ev.clientX;
      startY = ev.clientY;
    };

    const onMove = (ev: PointerEvent) => {
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
        } catch {
          /* capture optional */
        }
      }
      const { xToMetres } = layout();
      const rect = canvas.getBoundingClientRect();
      setDistanceRef.current(xToMetres(ev.clientX - rect.left));
      ev.preventDefault();
    };

    const onUp = (ev: PointerEvent) => endDrag(ev.pointerId);
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

  return (
    <div
      ref={wrapRef}
      className="relative h-[min(42vh,380px)] min-h-[220px] w-full overflow-hidden rounded-lg bg-surface sm:h-[min(52vh,480px)]"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-ew-resize touch-pan-y"
        role="slider"
        aria-label="Victim cable distance"
        aria-valuemin={0}
        aria-valuemax={1500}
        aria-valuenow={Math.round(distanceM * 1000)}
        aria-valuetext={formatMm(distanceM)}
      />
      <p className="pointer-events-none absolute top-3 left-3 text-xs tracking-wide text-muted">
        Cross-section · drag the victim cable
      </p>
    </div>
  );
}

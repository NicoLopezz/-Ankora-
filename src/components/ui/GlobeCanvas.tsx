"use client";

import { useEffect, useRef } from "react";

export type GlobeNode = {
  slug: string;
  name: string;
  tag: string;
  location: string;
  lat: number;
  lng: number;
};

const DEFAULT_NODES: GlobeNode[] = [
  { slug: "cafayate", name: "Cafayate Vineyards I", tag: "Tierra vitivinícola", location: "Salta, AR", lat: -26.09, lng: -66.01 },
  { slug: "alto-agrelo", name: "Alto Agrelo Estates", tag: "Inmobiliario productivo", location: "Mendoza, AR", lat: -33.05, lng: -68.88 },
  { slug: "cantini", name: "Cantini Estates", tag: "Viñedo + Hospitality", location: "Mendoza, AR", lat: -33.08, lng: -68.92 },
  { slug: "caravan-tech", name: "Caravan Tech", tag: "Livestock Tech", location: "Brasil · Argentina", lat: -15.78, lng: -47.93 },
];

const DEFAULT_CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [1, 2],
];

function fibonacciSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return pts;
}

// Polígonos simplificados de continentes en [lng, lat]. Precisión baja intencional:
// buscamos silueta reconocible, no cartografía exacta.
const LAND_POLYGONS: [number, number][][] = [
  // Sudamérica
  [[-81,-54],[-74,-52],[-67,-55],[-65,-40],[-60,-41],[-57,-35],[-53,-28],[-48,-25],[-40,-22],[-35,-10],[-42,-6],[-50,-1],[-58,4],[-62,8],[-70,11],[-75,9],[-79,6],[-81,0],[-81,-4],[-76,-6],[-72,-12],[-71,-22],[-73,-35],[-73,-46]],
  // Norteamérica (incluye Centroamérica)
  [[-168,66],[-155,72],[-140,70],[-125,70],[-95,72],[-80,73],[-60,82],[-45,75],[-55,62],[-62,55],[-70,48],[-70,43],[-75,40],[-76,37],[-81,32],[-85,30],[-90,29],[-97,26],[-99,22],[-97,18],[-93,17],[-87,15],[-83,9],[-79,9],[-82,13],[-96,16],[-106,22],[-114,29],[-122,36],[-125,42],[-124,48],[-132,54],[-140,58],[-152,60],[-165,54],[-168,62]],
  // Groenlandia
  [[-55,60],[-48,60],[-40,63],[-25,72],[-20,80],[-28,83],[-47,83],[-55,78],[-58,70],[-58,62]],
  // Europa + Asia (Eurasia)
  [[-10,36],[-5,42],[0,50],[-5,58],[6,62],[16,71],[30,71],[45,68],[60,72],[75,75],[100,77],[130,74],[145,72],[170,70],[180,66],[170,60],[158,52],[140,55],[135,43],[141,33],[130,33],[122,28],[117,22],[108,18],[104,10],[100,4],[103,1],[107,-2],[110,3],[118,6],[122,12],[121,18],[126,25],[132,32],[128,34],[115,38],[90,35],[75,30],[72,21],[68,23],[60,25],[56,25],[50,12],[44,12],[43,5],[42,-1],[40,-12],[45,-15],[43,2],[38,15],[33,27],[28,32],[20,32],[10,36],[2,37],[-8,36]],
  // África
  [[-17,22],[-15,12],[-10,4],[-5,5],[0,6],[5,4],[8,1],[12,-2],[14,-10],[13,-17],[14,-23],[18,-34],[22,-34],[28,-34],[33,-26],[35,-22],[40,-15],[42,-11],[51,-11],[51,-1],[42,11],[40,15],[37,19],[34,24],[28,30],[22,32],[14,32],[10,31],[2,30],[-5,28],[-12,25],[-16,22]],
  // Australia
  [[114,-22],[118,-20],[122,-17],[128,-15],[135,-12],[141,-12],[145,-14],[150,-18],[153,-25],[151,-32],[146,-37],[141,-38],[135,-35],[128,-33],[122,-32],[116,-32],[114,-26]],
  // Antártida (anillo)
  [[-180,-66],[-150,-70],[-120,-72],[-90,-72],[-60,-70],[-30,-70],[0,-68],[30,-68],[60,-70],[90,-70],[120,-66],[150,-68],[180,-66],[180,-85],[-180,-85]],
];

// Construye una máscara equirectangular de tierra: devuelve función sample(lng,lat) → 0|1.
function buildLandMaskSampler(w = 720, h = 360): (lng: number, lat: number) => boolean {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return () => true;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";

  for (const poly of LAND_POLYGONS) {
    ctx.beginPath();
    for (let i = 0; i < poly.length; i++) {
      const [lng, lat] = poly[i];
      const x = ((lng + 180) / 360) * w;
      const y = ((90 - lat) / 180) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  const data = ctx.getImageData(0, 0, w, h).data;
  return (lng: number, lat: number) => {
    const x = Math.max(0, Math.min(w - 1, Math.floor(((lng + 180) / 360) * w)));
    const y = Math.max(0, Math.min(h - 1, Math.floor(((90 - lat) / 180) * h)));
    const i = (y * w + x) * 4;
    return data[i] > 128;
  };
}

// xyz esfera → lat/lng
function vecToLatLng([x, y, z]: [number, number, number]): [number, number] {
  const lat = Math.asin(y) * (180 / Math.PI);
  const lng = (Math.atan2(z, -x) * (180 / Math.PI)) - 180;
  return [lat, ((lng + 540) % 360) - 180];
}

function latLngToVec(lat: number, lng: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
}

function rotate([x, y, z]: [number, number, number], yaw: number, pitch: number): [number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

function slerp(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-5) return a;
  const s = Math.sin(omega);
  const w0 = Math.sin((1 - t) * omega) / s;
  const w1 = Math.sin(t * omega) / s;
  return [a[0] * w0 + b[0] * w1, a[1] * w0 + b[1] * w1, a[2] * w0 + b[2] * w1];
}

type Props = {
  nodes?: GlobeNode[];
  connections?: [number, number][];
  pointCount?: number;
  density?: number; // multiplicador de radio (0..1)
  className?: string;
};

export function GlobeCanvas({
  nodes = DEFAULT_NODES,
  connections = DEFAULT_CONNECTIONS,
  pointCount = 1400,
  density = 0.9,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;

    // Generamos ~3x puntos, filtramos los que caen en océano para que queden
    // aprox `pointCount` sobre los continentes. En mobile reducimos a la mitad
    // para bajar CPU por frame sin sacrificar silueta reconocible.
    const effectivePointCount = isMobile ? Math.round(pointCount * 0.5) : pointCount;
    const isLand = buildLandMaskSampler();
    const rawPoints = fibonacciSphere(effectivePointCount * 3);
    const spherePoints = rawPoints.filter((v) => {
      const [lat, lng] = vecToLatLng(v);
      return isLand(lng, lat);
    });

    // Accent points: ~2 por continente que destellan en bronze sobre el dot
    // matrix. Fase desfasada por índice para que el brillo rote por el globo.
    const ACCENT_LATLNG: [number, number][] = [
      // Norteamérica
      [40.7, -74.0], [34.0, -118.2], [45.5, -73.6], [41.9, -87.6], [29.7, -95.4],
      // Centro + Caribe
      [19.4, -99.1], [18.5, -66.1],
      // Sudamérica (complemento — los 4 nodes reales viven en AR/BR)
      [4.7, -74.1], [-23.5, -46.6], [-12.0, -77.0], [10.5, -66.9],
      // Europa
      [51.5, -0.1], [48.9, 2.3], [52.5, 13.4], [41.9, 12.5], [40.4, -3.7], [59.3, 18.1],
      // África
      [-1.3, 36.8], [30.0, 31.2], [6.5, 3.4], [-26.2, 28.0], [33.6, -7.6],
      // Asia
      [35.7, 139.7], [1.35, 103.8], [25.0, 121.5], [28.6, 77.2], [25.2, 55.3], [22.3, 114.2], [31.2, 121.5],
      // Oceanía
      [-33.9, 151.2], [-36.8, 174.8], [-37.8, 144.9], [-31.9, 115.9],
    ];
    const accentVecs = ACCENT_LATLNG.map(([lat, lng]) => latLngToVec(lat, lng));
    const nodeVecs = nodes.map((n) => latLngToVec(n.lat, n.lng));
    const arcs = connections.map(([a, b]) => {
      const samples: [number, number, number][] = [];
      for (let i = 0; i <= 32; i++) samples.push(slerp(nodeVecs[a], nodeVecs[b], i / 32));
      return samples;
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      if (W === 0 || H === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = (Math.min(W, H) / 2) * density;
      centerX = W / 2;
      centerY = H / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const PITCH_BASE = 0.35;
    let pitch = PITCH_BASE;
    let pitchTarget = PITCH_BASE;
    let yaw = Math.PI * 1.05;

    // Offset del centro de proyección. Cuando hay focus desde Projects, el sello
    // está minimizado en bottom-right y solo se ve su cuadrante superior-izquierdo;
    // desplazamos el "centro" del globo hacia ese cuadrante para que el marker
    // enfocado caiga donde el usuario efectivamente lo ve.
    let centerBiasX = 0; // -0.5..0.5 (porcentaje de W)
    let centerBiasY = 0;
    let centerBiasTargetX = 0;
    let centerBiasTargetY = 0;
    let lastT = performance.now();
    let rafId: number | null = null;
    let visible = true;

    // --- Auto-tour: cada ciclo enfoca un marker, viaja + dwell, sigue al siguiente.
    let TRAVEL_MS = 2200;
    const DWELL_MS = 2600;
    const TRAVEL_AUTO = 2200;
    const TRAVEL_FOCUS = 900; // más ágil cuando viene de un evento externo (hover panel)
    let tourIdx = 0;
    let tourPhase: "travel" | "dwell" = "travel";
    let tourPhaseStart = performance.now();
    const getTargetYaw = (mIdx: number) => {
      const v = nodeVecs[mIdx];
      return Math.atan2(-v[0], v[2]);
    };
    let tourStartYaw = yaw;
    let tourTargetYaw = getTargetYaw(tourIdx);
    const easeInOut = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

    // --- Focus externo: cuando otro componente (ej. Projects) dispara `globe:focus`
    // con un slug, el tour se pausa y el globo enfoca + zoomea al marker indicado.
    let focusIdx: number | null = null;
    let zoomTarget = 1; // multiplicador sobre el radio base
    let zoomCurrent = 1;
    const onGlobeFocus = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string | null }>).detail;
      if (!detail) return;
      console.log("[globe:focus] receive →", detail.slug);
      if (!detail.slug) {
        focusIdx = null;
        zoomTarget = 1;
        pitchTarget = PITCH_BASE;
        centerBiasTargetX = 0;
        centerBiasTargetY = 0;
        return;
      }
      const idx = nodes.findIndex((n) => n.slug === detail.slug);
      if (idx < 0) {
        console.warn("[globe:focus] slug no matchea un nodo del globo:", detail.slug);
        return;
      }
      focusIdx = idx;
      zoomTarget = 2.8;
      // Tilt hacia la latitud del marker: pitch = lat en radianes, negado porque
      // en el sistema del canvas +pitch inclina el hemisferio norte hacia cámara.
      pitchTarget = -(nodes[idx].lat * Math.PI) / 180;
      // Desplaza el centro ~25% arriba-izquierda para que el marker caiga en el
      // cuadrante visible cuando el sello está minimizado en la esquina.
      centerBiasTargetX = -0.22;
      centerBiasTargetY = -0.22;
      TRAVEL_MS = TRAVEL_FOCUS;
      tourStartYaw = yaw;
      tourTargetYaw = getTargetYaw(idx);
      tourPhase = "travel";
      tourPhaseStart = performance.now();
    };
    window.addEventListener("globe:focus", onGlobeFocus);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && rafId == null) rafId = requestAnimationFrame(tick);
      },
      { threshold: 0 },
    );
    io.observe(container);

    const project = (v: [number, number, number]) => {
      const r = rotate(v, yaw, pitch);
      const rad = radius * zoomCurrent;
      const cx = centerX + W * centerBiasX;
      const cy = centerY + H * centerBiasY;
      return { x: cx + r[0] * rad, y: cy - r[1] * rad, z: r[2] };
    };

    const draw = (t: number) => {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      const rEff = radius * zoomCurrent;

      // halo bronze muy sutil
      const grad = ctx.createRadialGradient(centerX, centerY, rEff * 0.4, centerX, centerY, rEff * 1.2);
      grad.addColorStop(0, "rgba(203, 146, 80, 0.06)");
      grad.addColorStop(1, "rgba(203, 146, 80, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rEff * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // dot matrix — solo puntos en tierra
      for (let i = 0; i < spherePoints.length; i++) {
        const p = spherePoints[i];
        const r = rotate(p, yaw, pitch);
        if (r[2] < -0.02) continue;
        const x = centerX + r[0] * rEff;
        const y = centerY - r[1] * rEff;
        const depth = r[2];
        const size = 0.6 + depth * 1.2;
        const alpha = 0.18 + depth * 0.45;
        ctx.fillStyle = `rgba(232, 221, 201, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // decorative markers — replica visual de los nodes reales pero escalados
      // y con opacidad reducida. No rotan con el tour ni interactúan; funcionan
      // como "presencia global" del portfolio de assets.
      const DECO_RING_CYCLE = 3200;
      const DECO_RING_MAX = 22;
      const DECO_SCALE = 0.6;
      const DECO_OPACITY = 0.55;
      for (let i = 0; i < accentVecs.length; i++) {
        const pr = project(accentVecs[i]);
        if (pr.z < -0.05) continue;
        const visibleDepth = Math.max(0, Math.min(1, (pr.z + 0.2) / 1.2));
        const pulseScale = 1 + Math.sin(t / 520 + i * 0.7) * 0.1;
        const rBase = 4.5 * DECO_SCALE * (0.6 + visibleDepth * 0.7);

        // Glow rings expandiéndose
        for (let k = 0; k < 2; k++) {
          const phase = ((t / DECO_RING_CYCLE) + i * 0.17 + k * 0.5) % 1;
          const rr = rBase + phase * DECO_RING_MAX;
          const alpha = (1 - phase) * 0.5 * visibleDepth * DECO_OPACITY;
          ctx.strokeStyle = `rgba(203, 146, 80, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rr, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Halo radial
        const hGrad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, rBase * 4);
        hGrad.addColorStop(0, `rgba(203, 146, 80, ${0.45 * visibleDepth * DECO_OPACITY})`);
        hGrad.addColorStop(1, "rgba(203, 146, 80, 0)");
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase * 4 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Dot (core)
        ctx.fillStyle = `rgba(232, 221, 201, ${(0.7 * visibleDepth + 0.15) * DECO_OPACITY})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(203, 146, 80, ${0.85 * visibleDepth * DECO_OPACITY})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      // arcos con pulso
      for (const samples of arcs) {
        const segs = samples.map((s) => {
          const pr = project(s);
          return { x: pr.x, y: pr.y, depth: pr.z };
        });
        const pulse = (t / 2600) % 1;
        ctx.lineCap = "round";
        for (let i = 0; i < segs.length - 1; i++) {
          const a = segs[i];
          const b = segs[i + 1];
          if (a.depth < -0.05 && b.depth < -0.05) continue;
          const fade = Math.max(0, Math.min(1, (Math.min(a.depth, b.depth) + 0.3) / 0.8));
          const u = i / (segs.length - 2);
          const pulseDelta = Math.abs(((u - pulse + 1) % 1) - 0.5);
          const highlight = Math.max(0, 1 - pulseDelta * 6);
          const alpha = (0.12 + highlight * 0.6) * fade;
          ctx.strokeStyle = `rgba(203, 146, 80, ${alpha})`;
          ctx.lineWidth = 1 + highlight * 1.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // markers
      const RING_CYCLE = 2600;
      const RING_MAX = 32;
      for (let i = 0; i < nodeVecs.length; i++) {
        const pr = project(nodeVecs[i]);
        if (pr.z < -0.05) continue;
        const visibleDepth = Math.max(0, Math.min(1, (pr.z + 0.2) / 1.2));
        const pulseScale = 1 + Math.sin(t / 420 + i) * 0.12;
        const rBase = 4.5 * (0.6 + visibleDepth * 0.7);
        const isTourFocus = i === tourIdx && tourPhase === "dwell";

        // --- Glow rings expandiéndose (2 en fase desfasada)
        for (let k = 0; k < 2; k++) {
          const phase = ((t / RING_CYCLE) + i * 0.25 + k * 0.5) % 1;
          const rr = rBase + phase * RING_MAX;
          const alpha = (1 - phase) * 0.55 * visibleDepth;
          ctx.strokeStyle = `rgba(203, 146, 80, ${alpha})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, rr, 0, Math.PI * 2);
          ctx.stroke();
        }

        // --- Halo radial
        const haloScale = isTourFocus ? 5.2 : 4;
        const hGrad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, rBase * haloScale);
        hGrad.addColorStop(0, `rgba(203, 146, 80, ${(isTourFocus ? 0.75 : 0.55) * visibleDepth})`);
        hGrad.addColorStop(1, "rgba(203, 146, 80, 0)");
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase * haloScale * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // --- Dot (core)
        const core = isTourFocus ? rBase * 1.25 : rBase;
        ctx.fillStyle = `rgba(232, 221, 201, ${0.85 * visibleDepth + 0.15})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, core, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(203, 146, 80, ${0.95 * visibleDepth})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, core * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (t?: number) => {
      const now = t ?? performance.now();
      const dt = now - lastT;
      lastT = now;

      if (!reduced) {
        // Zoom lerp suave hacia el target (1.0 = base, 2.8 = focus externo).
        zoomCurrent += (zoomTarget - zoomCurrent) * Math.min(1, dt * 0.004);
        // Pitch lerp: mismo smoothing que zoom. Inclina el globo hacia la latitud del marker.
        pitch += (pitchTarget - pitch) * Math.min(1, dt * 0.004);
        // Bias del centro lerp (para que el focus caiga en el cuadrante visible).
        centerBiasX += (centerBiasTargetX - centerBiasX) * Math.min(1, dt * 0.004);
        centerBiasY += (centerBiasTargetY - centerBiasY) * Math.min(1, dt * 0.004);

        const elapsed = now - tourPhaseStart;
        if (tourPhase === "travel") {
          const p = Math.min(1, elapsed / TRAVEL_MS);
          let delta = ((tourTargetYaw - tourStartYaw + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
          yaw = tourStartYaw + delta * easeInOut(p);
          if (p >= 1) {
            tourPhase = "dwell";
            tourPhaseStart = now;
          }
        } else {
          // dwell: micro-drift solo si NO hay focus externo. Con focus, nos quedamos fijos.
          if (focusIdx === null) {
            yaw += dt * 0.00003;
            if (elapsed >= DWELL_MS) {
              tourIdx = (tourIdx + 1) % nodeVecs.length;
              tourStartYaw = yaw;
              tourTargetYaw = getTargetYaw(tourIdx);
              tourPhase = "travel";
              tourPhaseStart = now;
              TRAVEL_MS = TRAVEL_AUTO;
            }
          } else {
            // forzamos tourIdx al focus para que el halo "dwell" destaque el marker correcto
            tourIdx = focusIdx;
          }
        }
      }
      draw(now);
      if (visible) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("globe:focus", onGlobeFocus);
    };
  }, [nodes, connections, pointCount, density]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

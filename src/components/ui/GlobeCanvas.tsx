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
  { slug: "costa-norte", name: "Costa Norte", tag: "Inmobiliario", location: "Punta del Este, UY", lat: -34.97, lng: -54.95 },
  { slug: "pampa-fertil", name: "Pampa Fértil", tag: "Agro", location: "Buenos Aires, AR", lat: -34.6, lng: -58.38 },
  { slug: "solar-atacama", name: "Solar Atacama", tag: "Infraestructura", location: "Antofagasta, CL", lat: -23.65, lng: -70.4 },
  { slug: "cafayate-rwa", name: "Cafayate", tag: "Land Asset", location: "Salta, AR", lat: -26.09, lng: -66.01 },
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
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;

    // Generamos ~3x puntos, filtramos los que caen en océano para que queden
    // aprox `pointCount` sobre los continentes.
    const isLand = buildLandMaskSampler();
    const rawPoints = fibonacciSphere(pointCount * 3);
    const spherePoints = rawPoints.filter((v) => {
      const [lat, lng] = vecToLatLng(v);
      return isLand(lng, lat);
    });
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

    const pitch = 0.35;
    let yaw = Math.PI * 1.05;
    let lastT = performance.now();
    let rafId: number | null = null;
    let visible = true;

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
      return { x: centerX + r[0] * radius, y: centerY - r[1] * radius, z: r[2] };
    };

    const draw = (t: number) => {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      // halo bronze muy sutil
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.4, centerX, centerY, radius * 1.2);
      grad.addColorStop(0, "rgba(203, 146, 80, 0.06)");
      grad.addColorStop(1, "rgba(203, 146, 80, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // dot matrix — solo puntos en tierra
      for (let i = 0; i < spherePoints.length; i++) {
        const p = spherePoints[i];
        const r = rotate(p, yaw, pitch);
        if (r[2] < -0.02) continue;
        const x = centerX + r[0] * radius;
        const y = centerY - r[1] * radius;
        const depth = r[2];
        const size = 0.6 + depth * 1.2;
        const alpha = 0.18 + depth * 0.45;
        ctx.fillStyle = `rgba(232, 221, 201, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
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
      for (let i = 0; i < nodeVecs.length; i++) {
        const pr = project(nodeVecs[i]);
        if (pr.z < -0.05) continue;
        const visibleDepth = Math.max(0, Math.min(1, (pr.z + 0.2) / 1.2));
        const pulseScale = 1 + Math.sin(t / 420 + i) * 0.12;
        const rBase = 4.5 * (0.6 + visibleDepth * 0.7);

        const hGrad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, rBase * 4);
        hGrad.addColorStop(0, `rgba(203, 146, 80, ${0.55 * visibleDepth})`);
        hGrad.addColorStop(1, "rgba(203, 146, 80, 0)");
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase * 4 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(232, 221, 201, ${0.85 * visibleDepth + 0.15})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(203, 146, 80, ${0.95 * visibleDepth})`;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, rBase * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (t?: number) => {
      const now = t ?? performance.now();
      const dt = now - lastT;
      lastT = now;
      if (!reduced) yaw += dt * 0.00008;
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
    };
  }, [nodes, connections, pointCount, density]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

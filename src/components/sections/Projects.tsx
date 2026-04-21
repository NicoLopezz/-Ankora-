"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import type { ProjectDetail } from "./ProjectModal";

const ProjectModal = dynamic(
  () => import("./ProjectModal").then((m) => m.ProjectModal),
  { ssr: false },
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Media =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

type Project = {
  slug: string;
  tag: string;
  name: string;
  location: string;
  tir: string;
  min: string;
  status: "En emisión" | "Abierto" | "Próximamente";
  media: Media;
  detail: Omit<ProjectDetail, "slug" | "tag" | "name" | "location" | "tir" | "min" | "status" | "mediaSrc" | "mediaType" | "mediaAlt">;
};

const projects: Project[] = [
  {
    slug: "costa-norte",
    tag: "Inmobiliario",
    name: "Costa Norte",
    location: "Punta del Este, UY",
    tir: "12,4%",
    min: "USD 250",
    status: "En emisión",
    media: { type: "image", src: "/projects/costa-norte.jpg", alt: "Vista aérea del complejo residencial Costa Norte" },
    detail: {
      description:
        "Complejo residencial premium en primera línea de playa con 84 unidades, spa, piscinas infinity y acceso privado al mar. Desarrollo con permiso municipal aprobado y financiamiento bancario en cierre.",
      bullets: [
        "Fideicomiso inmobiliario bajo ley uruguaya",
        "Exit estimado por venta a developer internacional (mes 36)",
        "Distribución trimestral de rentas operativas",
        "Auditoría PwC + tasación independiente Colliers",
      ],
      timeline: "Emisión abr–may 2026 · Delivery Q4 2028",
      emitter: "Arkara Real Estate I S.A.",
      totalRaise: "USD 8.4 M",
      soldPct: 42,
    },
  },
  {
    slug: "pampa-fertil",
    tag: "Agro",
    name: "Pampa Fértil",
    location: "Buenos Aires, AR",
    tir: "18,7%",
    min: "USD 100",
    status: "Abierto",
    media: { type: "image", src: "/projects/pampa-fertil.jpg", alt: "Campo de soja en la Pampa húmeda" },
    detail: {
      description:
        "Campaña agrícola 2025/26 sobre 3.200 hectáreas en zona núcleo: soja de primera, maíz tardío y trigo de cobertura. Cobertura climática y de precio con futuros Matba-Rofex.",
      bullets: [
        "Seguro multirriesgo climático (granizo, sequía)",
        "Contratos forward con exportadoras tier-1",
        "Ciclo corto: 9 meses de campaña",
        "Reporte bimensual con imágenes satelitales",
      ],
      timeline: "Siembra sep 2026 · Cosecha may 2027",
      emitter: "Arkara Agro Fund II",
      totalRaise: "USD 3.1 M",
      soldPct: 76,
    },
  },
  {
    slug: "solar-atacama",
    tag: "Infraestructura",
    name: "Solar Atacama",
    location: "Antofagasta, CL",
    tir: "9,8%",
    min: "USD 500",
    status: "Próximamente",
    media: { type: "image", src: "/projects/solar-atacama.jpg", alt: "Obra de infraestructura solar en Atacama" },
    detail: {
      description:
        "Parque fotovoltaico de 120 MW con PPA a 18 años firmado con AES Andes. Construcción en marcha, interconexión prevista Q3 2027. Ingresos denominados en USD ajustados por CPI.",
      bullets: [
        "PPA a 18 años con investment-grade counterparty",
        "Tecnología bifacial + tracking single-axis",
        "Cobertura de construcción con Munich Re",
        "Payback estimado: 11 años",
      ],
      timeline: "Financial close sep 2026 · COD Q3 2027",
      emitter: "Arkara Infra Chile SpA",
      totalRaise: "USD 24 M",
      soldPct: 8,
    },
  },
  {
    slug: "cafayate-rwa",
    tag: "Land Asset",
    name: "Cafayate",
    location: "Cafayate, Salta · AR",
    tir: "30% APY",
    min: "USD 500",
    status: "En emisión",
    media: { type: "image", src: "/projects/cafayate.jpg", alt: "Finca Villagra-Romero en Cafayate, 500 ha de tierra virgen a 1.700 m" },
    detail: {
      description:
        "500 hectáreas de tierra virgen a 1.700 msnm en Cafayate con agua asegurada. Proyecto RWA que tokeniza el terreno 1:1 (1 token = 1 hectárea) y captura plusvalía estructurada vía activación hídrica, infraestructura productiva y puesta en valor como viñedo + hotel.",
      bullets: [
        "1 token = 1 hectárea identificable del campo",
        "Plusvalía por hitos: $0,50 → $0,70 (mes 6, activación hídrica) → $0,90 (mes 18, infra) → $1,30/m² (año 3)",
        "Early Adopters fraccionables: ticket mínimo USD 500 = 0,1 ha",
        "Rondas: R1 USD 5.000/ha · R2 6.500 · R3 8.450 · salida estimada ~USD 11.000/ha",
        "Potencial de desarrollo: viñedos de altura y hotel boutique con arquitectura integrada al terroir",
      ],
      timeline: "Adquisición hoy · Activación hídrica mes 6 · Infra mes 18 · Salida año 3",
      emitter: "Cafayate RWA · Finca Villagra-Romero",
      totalRaise: "USD 1.0 M (Early Adopters · 200 ha)",
      soldPct: 18,
      gallery: [
        { src: "/projects/cafayate.jpg", alt: "Bodega circular de hormigón y cristal entre viñedos de altura", caption: "Land Asset · 1.700 msnm" },
        { src: "/projects/cafayate-vineyard.jpg", alt: "Viñedo con arquitectura contemporánea integrada al terroir", caption: "Arquitectura integrada al terroir" },
        { src: "/projects/cafayate-cellar.jpg", alt: "Cava / wine cellar arquitectónica con bóvedas de ladrillo", caption: "Cava arquitectónica" },
      ],
    },
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function PanelMedia({ media, isActive, eager }: { media: Media; isActive: boolean; eager?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // video: solo reproduce cuando el panel está activo (ahorra CPU)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  if (media.type === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 800px"
        className="object-cover"
        priority={eager}
        loading={eager ? undefined : "lazy"}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Panel({
  p,
  isActive,
  isMobile,
  onEnter,
  onOpen,
  index,
}: {
  p: Project;
  isActive: boolean;
  isMobile: boolean;
  onEnter: () => void;
  onOpen: () => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 });

  // parallax casi imperceptible (±4px horizontal / ±3px vertical)
  const imgX = useTransform(sx, (v) => `${(v - 0.5) * 8}px`);
  const imgY = useTransform(sy, (v) => `${(v - 0.5) * 6}px`);
  const scale = 1.04;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <motion.div
      ref={ref}
      layout
      data-panel
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onMouseMove={handleMove}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      aria-label={`Ver detalles de ${p.name}`}
      tabIndex={0}
      data-cursor="hover"
      animate={isMobile ? {} : { flexGrow: isActive ? 4 : 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="group relative flex min-h-[520px] w-full cursor-pointer overflow-hidden rounded-[24px] border border-[var(--pale-oak)]/10 bg-[var(--surface)] isolate outline-none focus-visible:ring-2 focus-visible:ring-[var(--bronze)] md:min-h-0 md:rounded-[28px]"
      style={isMobile ? undefined : { flexBasis: 0 }}
    >
      {/* Media (image o video) con parallax */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          x: isActive ? imgX : 0,
          y: isActive ? imgY : 0,
          scale,
        }}
      >
        <PanelMedia media={p.media} isActive={isActive} eager={index === 0} />
      </motion.div>

      {/* Overlay oscuro — z:1 */}
      <motion.div
        aria-hidden
        animate={{ opacity: isActive ? 0.2 : 0.7 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="pointer-events-none absolute inset-0 z-[1] bg-[var(--night-bordeaux)]"
      />

      {/* Sombreado de profundidad — z:2 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 45%, color-mix(in oklab, var(--night-bordeaux) 92%, transparent) 100%)",
        }}
      />

      {/* Índice */}
      <div className="absolute left-6 top-6 z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/85">
        0{index + 1}
      </div>

      {/* Etiqueta rotada — colapsado (solo desktop) */}
      <AnimatePresence>
        {!isActive && !isMobile && (
          <motion.div
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
          >
            <span
              className="font-display text-[clamp(1.25rem,1.8vw,1.75rem)] font-light tracking-tight text-[var(--pale-oak)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {p.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido expandido */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative z-[5] flex w-full flex-col justify-between gap-10 p-6 md:p-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
              className="flex items-start justify-between"
            >
              <div className="flex flex-wrap items-center gap-2 pl-10 md:pl-12">
                <span className="rounded-full border border-[var(--pale-oak)]/30 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)] backdrop-blur-md">
                  {p.tag}
                </span>
                {p.status === "En emisión" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--bronze)]/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--night-bordeaux)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--night-bordeaux)]" />
                    Live
                  </span>
                )}
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/80 md:inline">
                {p.status}
              </span>
            </motion.div>

            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                <h3
                  className="font-display text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1] tracking-[-0.02em] text-[var(--pale-oak)]"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.35)" }}
                >
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--pale-oak)]/85">{p.location}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
                className="flex flex-col items-start gap-6 border-t border-[var(--pale-oak)]/20 pt-6 md:flex-row md:flex-wrap md:items-end md:justify-between"
              >
                <div className="flex gap-8 md:gap-10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/70">
                      TIR estimada
                    </p>
                    <p className="mt-1 font-display text-2xl text-[var(--bronze)] md:text-3xl">{p.tir}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/70">
                      Ticket mínimo
                    </p>
                    <p className="mt-1 font-display text-2xl text-[var(--pale-oak)] md:text-3xl">{p.min}</p>
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                  <a
                    href={`#invertir-${p.slug}`}
                    data-cursor="hover"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-gold group/btn text-sm"
                  >
                    Invertir
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover/btn:rotate-45" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen();
                    }}
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--pale-oak)]/40 bg-black/20 px-5 py-3 text-sm text-[var(--pale-oak)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--bronze)] hover:text-[var(--bronze)]"
                  >
                    Ver más
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Projects() {
  const [active, setActive] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const wrapRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leadRef = useRef<HTMLParagraphElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Sync con el globo del HeroSeal: cuando cambia el panel activo, el globo
  // enfoca + zoomea al marker correspondiente.
  useEffect(() => {
    const slug = projects[active]?.slug ?? null;
    if (typeof window !== "undefined") {
      console.log("[globe:focus] dispatch →", slug);
      window.dispatchEvent(new CustomEvent("globe:focus", { detail: { slug } }));
    }
  }, [active]);

  // Al salir de la sección (por scroll) o desmontar, liberamos el focus → auto-tour.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries[0].isIntersecting;
        if (!inView) {
          window.dispatchEvent(new CustomEvent("globe:focus", { detail: { slug: null } }));
        } else {
          const slug = projects[active]?.slug ?? null;
          window.dispatchEvent(new CustomEvent("globe:focus", { detail: { slug } }));
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.dispatchEvent(new CustomEvent("globe:focus", { detail: { slug: null } }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    if (!wrapRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const headingWords = headingRef.current?.querySelectorAll<HTMLElement>("[data-word]") ?? [];
      const panels = gridRef.current?.querySelectorAll<HTMLElement>("[data-panel]") ?? [];

      // Perspectiva para 3D rotations
      gsap.set(stageRef.current, { perspective: 1400 });
      gsap.set(titleRef.current, { opacity: 1, transformPerspective: 1400 });
      gsap.set(kickerRef.current, { x: 0, opacity: 1 });
      gsap.set(leadRef.current, { x: 0, opacity: 1 });
      gsap.set(headingWords, {
        display: "inline-block",
        transformOrigin: "50% 100%",
        y: 0,
        rotationX: 0,
        opacity: 1,
        filter: "blur(0px)",
      });
      gsap.set(panels, {
        yPercent: 80,
        rotationX: -22,
        scale: 0.9,
        opacity: 0,
        filter: "blur(10px)",
        transformOrigin: "50% 0%",
        transformPerspective: 1400,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(bgRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(gridRef.current, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current!,
          start: "top top",
          end: "bottom bottom",
          pin: stageRef.current!,
          pinSpacing: false,
          scrub: 1.1,
        },
      });

      // titleRef se mueve como bloque hacia el tope (sin escalar para no achicar kicker/lead)
      tl.to(
        titleRef.current,
        {
          y: "-32vh",
          ease: "power3.inOut",
          duration: 0.6,
        },
        0,
      );

      // Kicker: leve atenuación (sigue visible)
      tl.to(
        kickerRef.current,
        { opacity: 0.75, ease: "power3.out", duration: 0.5 },
        0,
      );

      // Lead: idem
      tl.to(
        leadRef.current,
        { opacity: 0.75, ease: "power3.out", duration: 0.5 },
        0,
      );

      // Heading: achica de verdad (de 5.5rem a ~40%), conservando legibilidad
      tl.to(
        headingRef.current,
        {
          scale: 0.45,
          transformOrigin: "0% 0%",
          ease: "power3.inOut",
          duration: 0.6,
        },
        0,
      );

      tl.fromTo(
        headingWords,
        {
          y: 0,
          rotationX: 0,
          filter: "blur(0px)",
        },
        {
          y: (i) => -8 - i * 3,
          rotationX: (i) => -10 - i * 4,
          filter: "blur(0px)",
          ease: "power2.out",
          stagger: { each: 0.04, from: "start" },
          duration: 0.5,
        },
        0.05,
      );

      // Glow radial que crece desde el centro
      tl.to(
        bgRef.current,
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.5 },
        0.15,
      );

      // Paneles: uno por uno, wipe clip-path + tilt 3D que se enderaza
      tl.to(
        panels,
        {
          yPercent: 0,
          rotationX: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "expo.out",
          stagger: { each: 0.08, from: "start" },
          duration: 0.7,
        },
        0.35,
      );

      // Linger final: la composición descansa antes del unpin
      tl.to({}, { duration: 0.6 }, 1.05);
    }, wrapRef);

    return () => ctx.revert();
  }, [isDesktop]);

  const openProject = openSlug ? projects.find((p) => p.slug === openSlug) : null;

  const openDetail: ProjectDetail | null = openProject
    ? {
        slug: openProject.slug,
        tag: openProject.tag,
        name: openProject.name,
        location: openProject.location,
        tir: openProject.tir,
        min: openProject.min,
        status: openProject.status,
        mediaSrc: openProject.media.src,
        mediaType: openProject.media.type,
        mediaAlt: openProject.media.type === "image" ? openProject.media.alt : undefined,
        ...openProject.detail,
      }
    : null;

  const header = (
    <div ref={titleRef} className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between" style={{ willChange: "transform" }}>
      <div>
        <p
          ref={kickerRef}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
          Oportunidades activas
        </p>
        <h2
          ref={headingRef}
          className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]"
          style={{ willChange: "transform", textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
        >
          <span data-word className="inline-block">Activos</span>{" "}
          <span data-word className="inline-block italic text-[var(--bronze)]">tangibles,</span>
          <br />
          <span data-word className="inline-block">rendimientos</span>{" "}
          <span data-word className="inline-block">medibles.</span>
        </h2>
      </div>
      <p
        ref={leadRef}
        className="max-w-xs text-sm text-[var(--pale-oak)]/60"
        style={{ willChange: "transform, opacity" }}
      >
        <span className="hidden md:inline">Hoverá un panel para explorarlo. La ficha se expande en el lugar.</span>
        <span className="md:hidden">Tocá un proyecto para ver más detalles.</span>
      </p>
    </div>
  );

  const grid = (
    <div
      ref={gridRef}
      className="flex w-full flex-col gap-4 md:h-[58vh] md:min-h-[440px] md:flex-row md:gap-4"
      style={{ willChange: "transform, opacity" }}
    >
      {projects.map((p, i) => (
        <Panel
          key={p.slug}
          p={p}
          index={i}
          isActive={isDesktop ? i === active : true}
          isMobile={!isDesktop}
          onEnter={() => setActive(i)}
          onOpen={() => setOpenSlug(p.slug)}
        />
      ))}
    </div>
  );

  // Versión mobile / reduced-motion: layout original, sin pin ni scrub
  if (!isDesktop) {
    return (
      <section id="proyectos" className="relative mx-auto w-full max-w-[1600px] scroll-mt-28 px-6 py-32 md:py-48">
        <div className="mb-14">{header}</div>
        {grid}
        <AnimatePresence>
          {openDetail && <ProjectModal project={openDetail} onClose={() => setOpenSlug(null)} />}
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section
      id="proyectos"
      ref={wrapRef}
      className="relative w-full scroll-mt-28"
      style={{ height: "320vh" }}
    >
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Glow de fondo que aparece cuando emerge el grid */}
        <div
          ref={bgRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 85%, color-mix(in oklab, var(--bronze) 18%, transparent) 0%, transparent 60%)",
            willChange: "opacity",
          }}
        />

        {/* Título centrado inicialmente */}
        <div
          className="absolute left-1/2 top-1/2 w-full max-w-[1600px] -translate-x-1/2 -translate-y-1/2 px-6"
          style={{ willChange: "transform" }}
        >
          {header}
        </div>

        {/* Grid emerge desde abajo */}
        <div
          className="absolute inset-x-0 bottom-8 mx-auto w-full max-w-[1600px] px-6 md:bottom-12"
        >
          {grid}
        </div>
      </div>

      <AnimatePresence>
        {openDetail && <ProjectModal project={openDetail} onClose={() => setOpenSlug(null)} />}
      </AnimatePresence>
    </section>
  );
}

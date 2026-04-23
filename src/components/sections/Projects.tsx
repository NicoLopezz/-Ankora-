"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ProjectDetail } from "./ProjectModal";

const ProjectModal = dynamic(
  () => import("./ProjectModal").then((m) => m.ProjectModal),
  { ssr: false },
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Media =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

type StatusKey = "en_emision" | "abierto" | "proximamente";

type ProjectStatic = {
  slug: string;
  statusKey: StatusKey;
  media: Media;
  galleryPaths: string[];
  soldPct: number;
};

type Project = ProjectStatic & {
  tag: string;
  name: string;
  location: string;
  tir: string;
  min: string;
  status: string;
  media: Media & { alt?: string };
  detail: Omit<ProjectDetail, "slug" | "tag" | "name" | "location" | "tir" | "min" | "status" | "mediaSrc" | "mediaType" | "mediaAlt">;
};

const projectsStatic: ProjectStatic[] = [
  {
    slug: "cafayate",
    statusKey: "en_emision",
    media: { type: "image", src: "/projects/cafayate/hero-main.jpg" },
    galleryPaths: [
      "/projects/cafayate/hero.jpg",
      "/projects/cafayate/vineyard-01.jpg",
      "/projects/cafayate/vineyard-02.jpg",
      "/projects/cafayate/render-01.jpeg",
      "/projects/cafayate/render-02.jpeg",
      "/projects/cafayate/map.png",
    ],
    soldPct: 0,
  },
  {
    slug: "alto-agrelo",
    statusKey: "proximamente",
    media: { type: "image", src: "/projects/alto-agrelo/hero-v2.jpg" },
    galleryPaths: [
      "/projects/alto-agrelo/hero-v2.jpg",
      "/projects/alto-agrelo/gallery-01.jpg",
      "/projects/alto-agrelo/gallery-02.jpg",
      "/projects/alto-agrelo/gallery-03.jpg",
      "/projects/alto-agrelo/gallery-04.jpg",
      "/projects/alto-agrelo/timeline.png",
    ],
    soldPct: 0,
  },
  {
    slug: "cantini",
    statusKey: "proximamente",
    media: { type: "image", src: "/projects/cantini/hero.jpg" },
    galleryPaths: [
      "/projects/cantini/hero.jpg",
      "/projects/cantini/gallery-01.jpg",
      "/projects/cantini/gallery-02.jpg",
      "/projects/cantini/gallery-03.jpg",
      "/projects/cantini/gallery-04.jpg",
      "/projects/cantini/gallery-05.jpg",
      "/projects/cantini/gallery-06.jpg",
      "/projects/cantini/gallery-07.jpg",
      "/projects/cantini/gallery-08.jpg",
    ],
    soldPct: 0,
  },
  {
    slug: "caravan-tech",
    statusKey: "proximamente",
    media: { type: "image", src: "/projects/caravan-tech/hero.jpg" },
    galleryPaths: [
      "/projects/caravan-tech/hero.jpg",
      "/projects/caravan-tech/gallery-01.png",
      "/projects/caravan-tech/gallery-02.png",
      "/projects/caravan-tech/infrastructure.png",
    ],
    soldPct: 0,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function PanelMedia({ media, alt, isActive, eager }: { media: Media; alt: string; isActive: boolean; eager?: boolean }) {
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
        alt={alt}
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
  mediaAlt,
  labels,
  isActive,
  isMobile,
  onEnter,
  onOpen,
  index,
}: {
  p: Project;
  mediaAlt: string;
  labels: {
    tir: string;
    ticketMin: string;
    invest: string;
    more: string;
    viewDetails: string;
    live: string;
  };
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
      aria-label={labels.viewDetails.replace("{name}", p.name)}
      tabIndex={0}
      data-cursor="hover"
      animate={isMobile ? {} : { flexGrow: isActive ? 4 : 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="group relative flex min-h-[520px] w-[82vw] max-w-[360px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-[24px] border border-[var(--pale-oak)]/10 bg-[var(--surface)] isolate outline-none focus-visible:ring-2 focus-visible:ring-[var(--bronze)] md:w-full md:max-w-none md:shrink md:snap-align-none md:min-h-0 md:rounded-[28px]"
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
        <PanelMedia media={p.media} alt={mediaAlt} isActive={isActive} eager={index === 0} />
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
                {p.statusKey === "en_emision" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--bronze)]/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--night-bordeaux)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--night-bordeaux)]" />
                    {labels.live}
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
                      {labels.tir}
                    </p>
                    <p className="mt-1 font-display text-2xl text-[var(--bronze)] md:text-3xl">{p.tir}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/70">
                      {labels.ticketMin}
                    </p>
                    <p className="mt-1 font-display text-2xl text-[var(--pale-oak)] md:text-3xl">{p.min}</p>
                  </div>
                </div>

                <div className="flex w-full flex-nowrap items-center gap-2 md:w-auto md:flex-wrap md:gap-3">
                  <a
                    href={`#invertir-${p.slug}`}
                    data-cursor="hover"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-gold group/btn flex-1 justify-center whitespace-nowrap text-sm md:flex-initial"
                  >
                    {labels.invest}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover/btn:rotate-45" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen();
                    }}
                    data-cursor="hover"
                    className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--pale-oak)]/40 bg-black/20 px-5 py-3 text-sm text-[var(--pale-oak)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--bronze)] hover:text-[var(--bronze)] md:flex-initial"
                  >
                    {labels.more}
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
  const t = useTranslations("projects");
  const [active, setActive] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  const projects: Project[] = projectsStatic.map((s) => {
    const base = `items.${s.slug}`;
    const galleryI18n = t.raw(`${base}.gallery`) as Array<{ alt: string; caption?: string }>;
    return {
      ...s,
      tag: t(`${base}.tag`),
      name: t(`${base}.name`),
      location: t(`${base}.location`),
      tir: t(`${base}.tir`),
      min: t(`${base}.min`),
      status: t(`status.${s.statusKey}`),
      media: { ...s.media, alt: t(`${base}.mediaAlt`) },
      detail: {
        description: t(`${base}.description`),
        bullets: t.raw(`${base}.bullets`) as string[],
        timeline: t(`${base}.timeline`),
        emitter: t(`${base}.emitter`),
        totalRaise: t(`${base}.totalRaise`),
        soldPct: s.soldPct,
        gallery: s.galleryPaths.map((src, i) => ({
          src,
          alt: galleryI18n[i]?.alt ?? "",
          caption: galleryI18n[i]?.caption,
        })),
      },
    };
  });

  const labels = {
    tir: t("labels.tir"),
    ticketMin: t("labels.ticketMin"),
    invest: t("labels.invest"),
    more: t("labels.more"),
    viewDetails: t.raw("labels.viewDetails") as string,
    live: t("labels.live"),
  };
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
        mediaAlt: openProject.media.alt,
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
          {t("kicker")}
        </p>
        <h2
          ref={headingRef}
          className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]"
          style={{ willChange: "transform", textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
        >
          {(t.raw("titleWords") as string[]).map((word, i) => (
            <span
              key={i}
              data-word
              className={`inline-block${i === 1 ? " italic text-[var(--bronze)]" : ""}`}
            >
              {word}
              {i === 1 ? <br /> : i < 3 ? " " : null}
            </span>
          ))}
        </h2>
      </div>
      <p
        ref={leadRef}
        className="max-w-xs text-sm text-[var(--pale-oak)]/60"
        style={{ willChange: "transform, opacity" }}
      >
        <span className="hidden md:inline">{t("leadDesktop")}</span>
        <span className="md:hidden">{t("leadMobile")}</span>
      </p>
    </div>
  );

  const grid = (
    <div
      ref={gridRef}
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:h-[58vh] md:min-h-[440px] md:w-full md:flex-row md:gap-4 md:overflow-visible md:px-0 md:pb-0"
      style={{ willChange: "transform, opacity" }}
    >
      {projects.map((p, i) => (
        <Panel
          key={p.slug}
          p={p}
          mediaAlt={p.media.alt ?? p.name}
          labels={labels}
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
      <section id="proyectos" className="relative mx-auto w-full max-w-[1600px] scroll-mt-28 px-6 py-20 md:py-48">
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

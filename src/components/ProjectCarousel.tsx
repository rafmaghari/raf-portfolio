"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import ProjectImage from "@/components/ProjectImage";

export type Project = {
  title: string;
  summary?: string;
  description: string;
  image?: string;
  screenshots?: { src: string; alt: string }[];
  links?: { appStore?: string; playStore?: string };
  tech: string[];
  year?: string;
  link?: string;
  client: string;
  private?: boolean;
};

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-500";
const button = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 ${focus}`;

// Unlike Motion 12's snapshot hook, this also responds to preference changes
// after hydration. A conservative server snapshot avoids an entrance slide.
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getReducedMotion = () => window.matchMedia(motionQuery).matches;

export default function ProjectCarousel({ projects, label }: { projects: Project[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState<Project | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => true);
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const [dragX, setDragX] = useState(0);
  const wheel = useRef({ distance: 0, last: 0, moved: false });
  const move = useCallback((direction: number) => {
    setIndex(current => (current + direction + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    // A non-passive listener contains horizontal trackpad gestures without
    // hijacking vertical page scrolling. Momentum belongs to the same gesture.
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || event.ctrlKey) return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheel.current.last > 180) wheel.current = { distance: 0, last: now, moved: false };
      wheel.current.last = now;
      wheel.current.distance += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1);
      if (!wheel.current.moved && Math.abs(wheel.current.distance) > 60) {
        move(wheel.current.distance > 0 ? 1 : -1);
        wheel.current.moved = true;
      }
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [move]);

  if (!projects.length) return null;

  return <>
    <div role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}
      data-reduced-motion={Boolean(reduced)} className={`selected-carousel ${focus}`}
      onKeyDown={event => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
        // Do not strand focus inside a slide that just became inert.
        if ((event.target as HTMLElement).closest("article")) event.currentTarget.focus();
      }}>
      <div ref={stage} data-carousel-stage className="selected-stage"
        onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest("button, a")) return;
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          dragged.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (!pointer.current || event.pointerId !== pointer.current.id) return;
          const x = event.clientX - pointer.current.x;
          const y = event.clientY - pointer.current.y;
          if (Math.abs(x) > 8 && Math.abs(x) > Math.abs(y)) dragged.current = true;
          if (dragged.current && !reduced) setDragX(Math.max(-100, Math.min(100, x * .35)));
        }}
        onPointerUp={event => {
          const start = pointer.current;
          if (!start || event.pointerId !== start.id) return;
          pointer.current = null;
          setDragX(0);
          if (!start) return;
          const x = event.clientX - start.x;
          if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(event.clientY - start.y)) move(x < 0 ? 1 : -1);
        }}
        onPointerCancel={() => { pointer.current = null; setDragX(0); }}
        onLostPointerCapture={() => { pointer.current = null; setDragX(0); }}>
        {projects.map((project, projectIndex) => {
          const offset = (projectIndex - index + projects.length + Math.floor(projects.length / 2)) % projects.length - Math.floor(projects.length / 2);
          const active = offset === 0;
          return <motion.article key={project.title} role="group" aria-roledescription="slide"
            aria-label={`${projectIndex + 1} of ${projects.length}`} aria-hidden={!active} inert={!active}
            data-active={active} initial={false}
            animate={{
              x: reduced || active ? (reduced ? 0 : dragX) : `${offset * 100}%`,
              scale: reduced || active ? 1 : .9,
              opacity: active ? 1 : reduced || Math.abs(offset) > 1 ? 0 : .38,
            }}
            transition={reduced ? { x: { duration: 0 }, scale: { duration: 0 }, opacity: { duration: .18 } } : { type: "spring", duration: .5, bounce: .2 }}
            style={{ zIndex: active ? 2 : 1, pointerEvents: active ? "auto" : "none", visibility: !reduced && Math.abs(offset) > 1 ? "hidden" : "visible" }}
            className="selected-card rounded-2xl border border-zinc-200/90 bg-[#fafaf9] dark:border-zinc-800 dark:bg-zinc-950">
            <ProjectImage src={project.image} title={project.title} screenshots={project.screenshots} />
            <motion.div key={String(active)} data-card-text className="flex flex-1 flex-col p-5 sm:p-7"
              initial={active ? { opacity: 0, transform: reduced ? "none" : "translateY(6px)" } : false}
              animate={{ opacity: 1, transform: "none" }} transition={{ duration: .2, delay: reduced ? 0 : .25 }}>
              <div className="mb-2 flex min-h-5 flex-wrap items-center gap-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 sm:text-xs">
                  {project.client}{project.year ? ` · ${project.year}` : ""}
                </p>
                {project.private && <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">Private project</span>}
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{project.title}</h3>
              <p className="mt-2 truncate text-sm text-zinc-600 dark:text-zinc-400" title={project.summary || project.description.split(/(?<=[.!?])\s/)[0]}>
                {project.summary || project.description.split(/(?<=[.!?])\s/)[0]}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <button type="button" className={button} tabIndex={active ? 0 : -1} onClick={() => setDetail(project)}>View details <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" /></button>
                <span aria-hidden="true" className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              </div>
            </motion.div>
          </motion.article>;
        })}
      </div>
      <div className="mx-auto mt-7 flex max-w-[800px] flex-wrap items-center justify-center gap-2 px-4 sm:gap-5">
        <button type="button" aria-label="Previous project" className={`selected-arrow ${focus}`} onClick={() => move(-1)}><ArrowLeftIcon aria-hidden="true" className="h-5 w-5" /></button>
        <div className="flex items-center" role="group" aria-label="Choose project">
          {projects.map((project, number) => <button key={project.title} type="button"
            aria-label={`Show project ${number + 1}: ${project.title}`} aria-current={index === number ? "true" : undefined}
            className={`selected-dot ${focus}`} onClick={() => setIndex(number)}><span className={index === number ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-300 dark:bg-zinc-600"} /></button>)}
        </div>
        <button type="button" aria-label="Next project" className={`selected-arrow ${focus}`} onClick={() => move(1)}><ArrowRightIcon aria-hidden="true" className="h-5 w-5" /></button>
      </div>
      <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">Swipe or use the arrows to explore</p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{index + 1} of {projects.length}: {projects[index].title}</p>
    </div>
    <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} className="relative z-[100]">
      <div className="fixed inset-0 bg-zinc-950/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <DialogPanel className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-[#fafaf9] text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 sm:rounded-2xl">
          {detail && <>
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-6 dark:border-zinc-800 sm:px-8">
              <div><p className="mb-2 text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{detail.client}{detail.year ? ` · ${detail.year}` : ""}</p><DialogTitle className="font-display text-2xl font-bold sm:text-3xl">{detail.title}</DialogTitle></div>
              <button type="button" aria-label="Close project details" className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-300 hover:bg-zinc-200 dark:border-zinc-600 dark:hover:bg-zinc-800 ${focus}`} onClick={() => setDetail(null)}><XMarkIcon className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            <div className="p-6 sm:p-8">
              {detail.private && <p className="mb-4 text-sm font-medium">Private project</p>}
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">{detail.description}</p>
              <h3 className="mb-3 mt-6 text-sm font-semibold">Built with</h3>
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">{detail.tech.map(tech => <li key={tech} className="rounded-md bg-zinc-200/80 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">{tech}</li>)}</ul>
              {!detail.private && <div className="mt-7 flex flex-wrap gap-3">
                {detail.links?.appStore && <a className={button} href={detail.links.appStore} target="_blank" rel="noopener noreferrer">App Store <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" /></a>}
                {detail.links?.playStore && <a className={button} href={detail.links.playStore} target="_blank" rel="noopener noreferrer">Google Play <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" /></a>}
                {detail.link && <a className={button} href={detail.link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" /></a>}
              </div>}
            </div>
          </>}
        </DialogPanel>
      </div>
    </Dialog>
  </>;
}

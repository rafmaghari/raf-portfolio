"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const projects = [
  { name: "CareTale", description: "Baby-care reminders and a lifelong baby book.", color: "#e9c8bb" },
  { name: "Lifeya", description: "Turning screen time into real-life activities.", color: "#cbd7c0" },
  { name: "Caretales Games", description: "Playful games for kids on iPhone and iPad.", color: "#e5d1a9" },
  { name: "Notee", description: "A little Mac menu bar app for capturing notes.", color: "#cbd9d6" },
  { name: "Peekee", description: "A macOS screen for keeping an eye on fleet status.", color: "#d1cbe1" },
  { name: "Caravea Connect", description: "A CRM for the caravan industry.", color: "#c9d8e3", url: "https://connect.caravea.au/", image: "/profile/connect.webp" },
  { name: "CodeCoffeeChill", description: "Explainers on code, creativity and technology.", color: "#e4d0b9" },
];

export default function ProfilePortfolio() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const [index, setIndex] = useState(0);
  const dragged = useRef(false);
  const pointerStart = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const move = useCallback((direction: number) => setIndex(current => (current + direction + projects.length) % projects.length), []);
  useEffect(() => {
    if (!open || detail) return;
    function onKey(event: KeyboardEvent) { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, detail, move]);
  const project = projects[index];
  return <>
    <nav className="profile-bottom-nav" aria-label="Quick navigation"><a href="#about">About</a><button type="button" onClick={() => {setDetail(false); setOpen(true);}}>Portfolio <span aria-hidden="true">↗</span></button><a href="#contact">Contact</a></nav>
    <Dialog open={open} onClose={() => {setOpen(false); setDetail(false);}} className="work-dialog">
      <div className="work-backdrop" aria-hidden="true" />
      <div className="work-position"><DialogPanel className="work-panel">
        <div className="work-heading"><div><p>SELECTED WORK</p><DialogTitle>Things I&apos;ve made<span>.</span></DialogTitle></div><button type="button" className="work-close" aria-label="Close portfolio" onClick={() => {setOpen(false); setDetail(false);}}>×</button></div>
        <AnimatePresence mode="wait" initial={false}>
          {detail ? <motion.div className="work-detail" key="detail" initial={{opacity:0,scale:reduced?1:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:reduced?1:.97}} transition={{duration:reduced?0:.2}}>
            <button type="button" className="work-back" onClick={() => setDetail(false)}>← Back to work</button><div className="work-detail-art" style={{backgroundColor:project.color}}><span>{project.name}</span></div><h3>{project.name}</h3><p>{project.description}</p>{project.url && <a href={project.url} target="_blank" rel="noreferrer">Visit project ↗</a>}
          </motion.div> : <motion.div key="carousel" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.18}}>
            <p className="work-subtitle">A selection of projects, big and small.</p><div className="work-card-wrap" onPointerDown={event => { pointerStart.current = event.clientX; dragged.current = false; }} onPointerUp={event => { if (pointerStart.current === null) return; const distance = event.clientX - pointerStart.current; pointerStart.current = null; if (Math.abs(distance) > 50) { dragged.current = true; move(distance < 0 ? 1 : -1); } }} onPointerCancel={() => { pointerStart.current = null; }}><motion.button type="button" className="work-card" style={{backgroundColor:project.color}} onClick={event => { if (!dragged.current || event.detail === 0) setDetail(true); dragged.current = false; }} aria-label={`Open ${project.name} details`} whileTap={reduced ? undefined : {scale:.99}}><span className="work-card-name">{project.name}</span>{project.image && <Image className="work-card-image" src={project.image} alt="Caravea Connect sign-in screen" width={900} height={563} />}<span className="work-card-meta"><span>{project.description}</span><span aria-hidden="true">↗</span></span></motion.button></div>
            <div className="work-controls"><span aria-live="polite">{String(index+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span><div><button type="button" aria-label="Previous project" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next project" onClick={() => move(1)}>→</button></div></div><p className="work-tip">Use the arrows or swipe to explore</p>
          </motion.div>}
        </AnimatePresence>
      </DialogPanel></div>
    </Dialog>
  </>;
}

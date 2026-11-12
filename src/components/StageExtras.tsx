"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ExtraState } from "@/components/ProfileExtras";

export default function StageExtras({ extras }: { extras: ExtraState }) {
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : .25 };
  return <>
    <AnimatePresence>{extras.fireworks && <motion.svg data-testid="fireworks-overlay" className="stage-effect" viewBox="0 0 500 540" preserveAspectRatio="none" aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={transition}><g data-motion className="firework-burst" fill="none" stroke="#777" strokeWidth="4" strokeLinecap="round"><path d="M62 120v-32m0 64v-22m-32-10H8m108 0H84M39 97 23 81m62 62 16 16m-16-62 16-16m-62 62-16 16"/><path d="M439 172v-30m0 60v-20m-30-10h-21m103 0h-21m-52-22-15-15m58 58 15 15m-15-58 15-15m-58 58-15 15"/></g></motion.svg>}</AnimatePresence>
    <AnimatePresence>{extras.balloons && <motion.svg data-testid="balloons-overlay" className="stage-effect" viewBox="0 0 500 540" preserveAspectRatio="none" aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={transition}><g data-motion className="balloon-float" stroke="#525252" strokeWidth="2"><path d="M52 295q-13 85 7 142M450 220q-12 105 3 163" fill="none"/><ellipse cx="52" cy="250" rx="29" ry="43" fill="#d6d3d1"/><ellipse cx="450" cy="176" rx="29" ry="43" fill="#e7e5e4"/><path d="m48 293 4-6 4 6zm398-74 4-6 4 6z" fill="#737373"/></g></motion.svg>}</AnimatePresence>
    <AnimatePresence>{extras.snow && <motion.svg data-testid="snow-overlay" className="stage-effect" viewBox="0 0 500 540" preserveAspectRatio="none" aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={transition}><g data-motion className="snow-fall" fill="#9b9b9b"><circle cx="40" cy="40" r="4"/><circle cx="125" cy="85" r="3"/><circle cx="386" cy="70" r="4"/><circle cx="460" cy="140" r="3"/><circle cx="30" cy="245" r="4"/><circle cx="475" cy="300" r="4"/><circle cx="90" cy="385" r="3"/><circle cx="410" cy="430" r="3"/><circle cx="36" cy="480" r="4"/><circle cx="475" cy="510" r="3"/></g></motion.svg>}</AnimatePresence>
  </>;
}

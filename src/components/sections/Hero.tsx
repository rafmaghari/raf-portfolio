"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { NightSky, PortraitExtras, type Extra, type ExtraState } from "@/components/ProfileExtras";

const glassesNames = ["Real glasses", "Sunglasses", "Round retro glasses", "Pixel glasses"];

function Glasses({ style }: { style: number }) {
  if (style === 0) return null;
  if (style === 3) return <svg viewBox="0 0 440 130" aria-hidden="true" className="profile-glasses"><path fill="#171717" d="M0 20h180v20h80V20h180v43h-20v26h-20v20H280V89h-20V60h-80v29h-20v20H40V89H20V63H0z"/><path fill="#fff" d="M25 30h36v10H25zm36 10h36v10H61zm221-10h36v10h-36zm36 10h36v10h-36z"/></svg>;
  if (style === 2) return <svg viewBox="0 0 440 130" aria-hidden="true" className="profile-glasses"><g fill="#8b4c30" fillOpacity=".12" stroke="#613a28" strokeWidth="10"><circle cx="102" cy="65" r="55"/><circle cx="338" cy="65" r="55"/><path fill="none" d="M157 60q63-35 126 0M45 54L0 42m395 12 45-12"/></g></svg>;
  return <svg viewBox="0 0 440 130" aria-hidden="true" className="profile-glasses"><path fill="#202628" stroke="#101719" strokeWidth="8" d="M8 26q80-15 165 0l14 17h66l14-17q85-15 165 0l-12 57q-6 31-43 32h-60q-39 0-47-36l-6-18h-48l-6 18q-8 36-47 36h-60Q66 114 60 83z"/><path d="M48 42h82m176 0h82" stroke="#a5c7c4" strokeOpacity=".55" strokeWidth="5"/></svg>;
}

export default function Hero() {
  const [glasses, setGlasses] = useState(0);
  const [cap, setCap] = useState(false);
  const [family, setFamily] = useState(false);
  const [extras, setExtras] = useState<ExtraState>({headset: false, coffee: false, laptop: false, party: false, night: false});
  const toggleExtra = (key: Extra) => setExtras(current => ({...current, [key]: !current[key]}));
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : { type: "spring" as const, duration: .5, bounce: .2 };
  return <section className={`profile-hero${extras.night ? " is-night" : ""}`} aria-labelledby="profile-title">
    {!extras.night && <svg className="profile-day-sun" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="21" fill="#dcaf6b"/><g stroke="#dcaf6b" strokeWidth="4" strokeLinecap="round"><path d="M50 5v13M50 82v13M5 50h13M82 50h13M18 18l9 9M73 73l9 9M82 18l-9 9M27 73l-9 9"/></g></svg>}
    <NightSky enabled={extras.night} />
    <div className="profile-hero-inner">
      <div className="profile-intro"><p>Hi, I&apos;m</p><h1 id="profile-title">Raf Maghari<span>.</span></h1><p className="profile-role">Developer, maker &amp; family man.</p><p className="profile-copy">I build thoughtful digital things, with a little curiosity and a lot of coffee.</p><a href="#about" className="profile-discover">More about me <span aria-hidden="true">↓</span></a></div>
      <div className={`profile-stage${family ? " is-family" : ""}`} aria-label="Interactive portrait of Raf">
        <AnimatePresence>{family && <motion.div className="family-backdrop" initial={{opacity: 0, scale: reduced ? 1 : .97}} animate={{opacity: .24, scale: 1}} exit={{opacity: 0}} transition={reduced ? {duration: 0} : {duration: .5, delay: .25}}><Image src="/profile/family.webp" alt="" fill sizes="800px" /></motion.div>}</AnimatePresence>
        <AnimatePresence>{family && ["abey", "piyang", "sigi-boy"].map((name, index) => <motion.div key={name} className={`family-person family-${name}`} initial={{ opacity: 0, scale: reduced ? 1 : .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : .96 }} transition={reduced ? { duration: 0 } : { duration: .35, delay: index * .08 }}><Image src={`/profile/${name}.webp`} alt="" fill sizes="300px" /></motion.div>)}</AnimatePresence>
        <div className="portrait" data-testid="portrait"><Image src="/profile/raf.webp" alt="Raf Maghari smiling" fill sizes="(max-width: 600px) 260px, 420px" priority />
          <PortraitExtras extras={extras} />
          <AnimatePresence mode="wait">{glasses !== 0 && <motion.div className="glasses-layer" key={glasses} data-testid="glasses-overlay" data-style={glassesNames[glasses]} initial={{ opacity: 0, y: !reduced && glasses === 3 ? -100 : 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition}><Glasses style={glasses}/></motion.div>}</AnimatePresence>
          <AnimatePresence>{cap && <motion.svg className="portrait-cap" data-testid="cap-overlay" viewBox="0 0 520 200" aria-hidden="true" initial={{opacity:0,y:reduced?0:-120}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-30}} transition={transition}><path d="M63 153C70 69 143 14 262 14s182 51 192 139z" fill="#173e3b"/><path d="M63 153c118-23 267-23 391 0l45 20c9 6 1 17-10 17H43c-17 0-23-11-8-19z" fill="#102e2d"/><path d="M260 18v123" stroke="#5a8881" strokeWidth="3" opacity=".7"/><circle cx="260" cy="16" r="9" fill="#102e2d"/></motion.svg>}</AnimatePresence>
        </div>
      </div>
      <div className="profile-controls"><p>Make yourself at home.</p><div className="profile-chips"><button type="button" onClick={() => setGlasses((glasses + 1) % 4)} aria-label={`Glasses: ${glassesNames[glasses]}. Change style`}><span aria-hidden="true">◉</span> Glasses <small>{glasses === 0 ? "+" : glassesNames[glasses]}</small></button><button type="button" aria-pressed={cap} onClick={() => setCap(!cap)}><span aria-hidden="true">⌒</span> Cap <small>{cap ? "On" : "+"}</small></button><button type="button" aria-pressed={family} onClick={() => setFamily(!family)}><span aria-hidden="true">♡</span> Family <small>{family ? "On" : "+"}</small></button>{([ ["headset", "Headset"], ["coffee", "Coffee mug"], ["laptop", "Laptop"], ["party", "Party mode"], ["night", "Day/night"] ] as const).map(([key, label]) => <button key={key} type="button" aria-pressed={extras[key]} onClick={() => toggleExtra(key)}>{label}<small>{extras[key] ? "On" : "+"}</small></button>)}</div><p className="profile-hint">A few things that make me, me.</p></div>
    </div>
  </section>;
}

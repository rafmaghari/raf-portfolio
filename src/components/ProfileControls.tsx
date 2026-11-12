"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { Extra, ExtraState } from "@/components/ProfileExtras";

type ControlKey = "glasses" | "cap" | "family" | Extra;
type Props = { open: boolean; onOpenChange: (open: boolean) => void; glasses: number; glassesName: string; cap: boolean; family: boolean; extras: ExtraState; onGlasses: () => void; onCap: () => void; onFamily: () => void; onExtra: (key: Extra) => void };
const controls: {key: ControlKey; label: string}[] = [
  {key:"glasses",label:"Glasses"},{key:"cap",label:"Cap"},{key:"family",label:"Family"},{key:"headset",label:"Headset"},
  {key:"coffee",label:"Coffee mug"},{key:"laptop",label:"Laptop"},{key:"party",label:"Party mode"},{key:"night",label:"Day/night"},
  {key:"fireworks",label:"Fireworks"},{key:"cat",label:"Cat"},{key:"duck",label:"Rubber duck"},{key:"balloons",label:"Balloons"},
  {key:"snow",label:"Snow"},{key:"coat",label:"Coat and tie"},{key:"beard",label:"Beard"},{key:"mustache",label:"Mustache"},
];

function ControlIcon({ name }: { name: ControlKey | "bag" }) {
  const paths: Record<ControlKey | "bag", React.ReactNode> = {
    bag: <><path d="M7 7V5a5 5 0 0 1 10 0v2M5 8h14l2 13H3z"/><path d="M8 12h8v5H8zM8 8v2m8-2v2"/></>,
    glasses: <><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><path d="M11 12h2M3 12 1.5 9m19.5 3L22.5 9"/></>,
    cap: <><path d="M4 14a8 8 0 0 1 16 0M3 16h19M5 16c3-3 11-3 15 0M12 6v7"/></>,
    family: <><circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M7 20v-2a5 5 0 0 1 10 0v2M1 19v-1a4 4 0 0 1 5-4m17 5v-1a4 4 0 0 0-5-4"/></>,
    headset: <><path d="M3 13v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="12" width="4" height="8" rx="2"/><rect x="18" y="12" width="4" height="8" rx="2"/></>,
    coffee: <><path d="M4 9h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM17 11h2a3 3 0 0 1 0 6h-2M8 6c-1-1 1-2 0-3m4 3c-1-1 1-2 0-3"/></>,
    laptop: <><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20l-2-4H4zM9 9l-2 2 2 2m6-4 2 2-2 2"/></>,
    party: <><path d="M4 20 11 3l9 14zM6 15l9 3M8 10l9 3M16 4l1-2m3 5 2-1M4 6 2 5"/></>,
    night: <><circle cx="8" cy="9" r="3"/><path d="M8 2V1M3 4 2 3m1 6H1m4 5-1 1m12-11a7 7 0 1 0 6 10 6 6 0 0 1-6-10z"/></>,
    fireworks: <><path d="M12 2v5m0 10v5M2 12h5m10 0h5M5 5l4 4m6 6 4 4M19 5l-4 4M9 15l-4 4"/><circle cx="12" cy="12" r="2"/></>,
    cat: <><path d="M4 10V3l5 3a10 10 0 0 1 6 0l5-3v7a8 8 0 0 1-16 0zM9 12h.1m5.8 0h.1M11 15l1 1 1-1M3 14l3 1m12 0 3-1"/></>,
    duck: <><path d="M4 14q-1-5 5-5 0-5 5-5t4 6l3 1-3 2q1 7-7 7-7 0-7-6zM14 8h.1M7 14q3 3 6 0"/></>,
    balloons: <><ellipse cx="8" cy="8" rx="4" ry="6"/><ellipse cx="17" cy="9" rx="4" ry="6"/><path d="M8 14q-3 4 2 8m7-7q-3 4 0 7"/></>,
    snow: <><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3"/></>,
    coat: <><path d="M5 4h14l3 17H2zM8 4l4 8 4-8M10 8l2 2 2-2M12 10l-2 8 2 2 2-2z"/></>,
    beard: <><path d="M5 10v3q0 7 7 9 7-2 7-9v-3M8 14l2 2m6-2-2 2M9 19h6"/></>,
    mustache: <><path d="M2 12q2 3 5 0 3-3 5 0 2-3 5 0 3 3 5 0-1 6-6 6-3 0-4-3-1 3-4 3-5 0-6-6z"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function ProfileControls(props: Props) {
  const active = (key: ControlKey) => key === "glasses" ? props.glasses !== 0 : key === "cap" ? props.cap : key === "family" ? props.family : props.extras[key];
  const toggle = (key: ControlKey) => key === "glasses" ? props.onGlasses() : key === "cap" ? props.onCap() : key === "family" ? props.onFamily() : props.onExtra(key);
  const equipped = controls.filter(item => active(item.key)).length;
  return <div className="inventory-anchor">
    <button type="button" className="inventory-trigger" aria-label="Open inventory" onClick={() => props.onOpenChange(true)}><span className="inventory-trigger-icon"><ControlIcon name="bag" /></span><span><strong>Open inventory</strong><small>{equipped ? `${equipped} equipped` : "16 things to play with"}</small></span><span aria-hidden="true" className="inventory-trigger-arrow">↗</span></button>
    <Dialog open={props.open} onClose={() => props.onOpenChange(false)} className="inventory-dialog">
      <div data-testid="inventory-backdrop" className="inventory-backdrop" aria-hidden="true" onClick={() => props.onOpenChange(false)} />
      <div className="inventory-position"><DialogPanel className="inventory-panel">
        <div className="inventory-heading"><div><p>RAF&apos;S KIT <span>·</span> 16 ITEMS</p><DialogTitle>Inventory<span>.</span></DialogTitle></div><button type="button" className="inventory-close" aria-label="Close inventory" onClick={() => props.onOpenChange(false)}>×</button></div>
        <p className="inventory-description">Pick an item to equip it. Tap again to put it away.</p>
        <div className="inventory-grid" role="group" aria-label="Portrait items">{controls.map(({key,label}, index) => <button key={key} type="button" className={`inventory-slot rarity-${index % 4}`} aria-pressed={active(key)} aria-label={key === "glasses" ? `Glasses: ${props.glassesName}. Change style` : label} onClick={() => toggle(key)}><span className="inventory-slot-icon"><ControlIcon name={key} /></span><span className="inventory-slot-label">{label}</span><span className="inventory-slot-state" aria-hidden="true">{active(key) ? "Equipped" : "Equip"}</span></button>)}</div>
      </DialogPanel></div>
    </Dialog>
  </div>;
}

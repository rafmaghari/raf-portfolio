"use client";

import type { Extra, ExtraState } from "@/components/ProfileExtras";

type ControlKey = "glasses" | "cap" | "family" | Extra;
type Props = { direction: string; glasses: number; glassesName: string; cap: boolean; family: boolean; extras: ExtraState; onGlasses: () => void; onCap: () => void; onFamily: () => void; onExtra: (key: Extra) => void };

const controls: { key: ControlKey; label: string }[] = [
  {key:"glasses",label:"Glasses"}, {key:"cap",label:"Cap"}, {key:"family",label:"Family"}, {key:"headset",label:"Headset"},
  {key:"coffee",label:"Coffee mug"}, {key:"laptop",label:"Laptop"}, {key:"party",label:"Party mode"}, {key:"night",label:"Day/night"},
];

function ControlIcon({ name }: { name: ControlKey }) {
  const paths: Record<ControlKey, React.ReactNode> = {
    glasses: <><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><path d="M11 12h2M3 12 1.5 9m19.5 3L22.5 9"/></>,
    cap: <><path d="M4 14a8 8 0 0 1 16 0M3 16h19M5 16c3-3 11-3 15 0M12 6v7"/></>,
    family: <><circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M7 20v-2a5 5 0 0 1 10 0v2M1 19v-1a4 4 0 0 1 5-4m17 5v-1a4 4 0 0 0-5-4"/></>,
    headset: <><path d="M3 13v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="12" width="4" height="8" rx="2"/><rect x="18" y="12" width="4" height="8" rx="2"/></>,
    coffee: <><path d="M4 9h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM17 11h2a3 3 0 0 1 0 6h-2M8 6c-1-1 1-2 0-3m4 3c-1-1 1-2 0-3"/></>,
    laptop: <><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20l-2-4H4zM9 9l-2 2 2 2m6-4 2 2-2 2"/></>,
    party: <><path d="M4 20 11 3l9 14zM6 15l9 3M8 10l9 3M16 4l1-2m3 5 2-1M4 6 2 5"/><circle cx="20" cy="3" r=".6"/></>,
    night: <><circle cx="8" cy="9" r="3"/><path d="M8 2V1M3 4 2 3m1 6H1m4 5-1 1m12-11a7 7 0 1 0 6 10 6 6 0 0 1-6-10z"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function ProfileControls(props: Props) {
  const active = (key: ControlKey) => key === "glasses" ? props.glasses !== 0 : key === "cap" ? props.cap : key === "family" ? props.family : props.extras[key];
  const toggle = (key: ControlKey) => key === "glasses" ? props.onGlasses() : key === "cap" ? props.onCap() : key === "family" ? props.onFamily() : props.onExtra(key);
  const names: Record<string,string> = {"1":"Orbit", "2":"Play tray", "3":"Studio dock"};
  return <div className={`profile-controls control-design control-design-${props.direction}`} data-testid="control-design" data-direction={props.direction}>
    <div className="control-heading"><span className="control-heading-mark" aria-hidden="true">✳</span><div><p>Make yourself at home.</p><span>{names[props.direction]} · Tap to play</span></div></div>
    <div className="control-grid" role="group" aria-label="Portrait accessories">
      {controls.map(({key,label}) => <button key={key} type="button" className={`control-button control-${key}`} aria-pressed={key === "glasses" ? undefined : active(key)} aria-label={key === "glasses" ? `Glasses: ${props.glassesName}. Change style` : label} data-active={active(key) ? "true" : "false"} onClick={() => toggle(key)}><span className="control-icon"><ControlIcon name={key} /></span><span className="control-label">{label}</span><span className="control-indicator" aria-hidden="true" /></button>)}
    </div>
    <p className="control-help">{props.direction === "1" ? "A little play, all around." : props.direction === "2" ? "Pick a piece. Make it yours." : "A little toolkit for this portrait."}</p>
  </div>;
}

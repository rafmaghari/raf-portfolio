"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Keep the moving copy outside the clipped hero; the accessible portrait stays in place. */
export function usePortraitMotion(portrait: RefObject<HTMLDivElement | null>, roll: boolean, dvd: boolean, reduced: boolean | null) {
  const dvdSession = useRef<{ exit: () => void; destroy: () => void } | null>(null);

  useEffect(() => {
    const element = portrait.current;
    if (!element || !roll) return;
    const rect = element.getBoundingClientRect();
    const distance = Math.max(0, Math.min(100, window.innerWidth - rect.right - 8));
    const scale = element.closest(".is-family") ? .78 : 1;
    const angle = distance / (rect.width / 2) * 180 / Math.PI;
    const animation = reduced
      ? element.animate([{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }], { duration: 500 })
      : element.animate([
        { transform: `translateX(0px) rotate(0deg) scale(${scale})` },
        { transform: `translateX(${distance}px) rotate(${angle}deg) scale(${scale})` },
        { transform: `translateX(0px) rotate(0deg) scale(${scale})` },
      ], { duration: 2000, easing: "ease-in-out" });
    return () => animation.cancel();
  }, [portrait, roll, reduced]);

  useEffect(() => {
    if (!dvd) { dvdSession.current?.exit(); return; }
    if (dvdSession.current) { dvdSession.current.destroy(); dvdSession.current = null; }
    const original = portrait.current;
    if (!original) return;
    const start = original.getBoundingClientRect();
    const badge = original.cloneNode(true) as HTMLDivElement;
    badge.dataset.testid = "dvd-badge";
    badge.setAttribute("aria-hidden", "true");
    Object.assign(badge.style, { position: "fixed", left: "0", top: "0", margin: "0", width: `${start.width}px`, height: `${start.height}px`, zIndex: "99", pointerEvents: "none", transformOrigin: "top left", transition: "none", visibility: "visible" });
    document.body.appendChild(badge);
    original.style.visibility = "hidden";
    const width = start.width * .55, height = start.height * .3;
    let x = Math.max(0, Math.min(start.left, innerWidth - width));
    let y = Math.max(0, Math.min(start.top, innerHeight - height));
    let vx = 75, vy = 57, elapsed = 0, last = 0, frame = 0, exiting = false, exitTime = 0;
    let exitX = 0, exitY = 0, tint = 0;
    const colors = ["#171717", "#737373", "#a3a3a3", "#525252"];
    const paint = (px: number, py: number, sx: number, sy: number) => {
      badge.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${sx}, ${sy})`;
    };
    const cleanup = () => {
      cancelAnimationFrame(frame);
      badge.remove();
      original.style.visibility = "";
      if (dvdSession.current?.destroy === cleanup) dvdSession.current = null;
    };
    const step = (now: number) => {
      if (document.hidden) { last = 0; frame = requestAnimationFrame(step); return; }
      const dt = last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      if (exiting) {
        exitTime += dt;
        const progress = reduced ? 1 : Math.min(exitTime / .65, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const home = original.getBoundingClientRect();
        paint(exitX + (home.left - exitX) * eased, exitY + (home.top - exitY) * eased, .55 + .45 * eased, .3 + .7 * eased);
        if (progress === 1) { cleanup(); return; }
      } else if (reduced) {
        const home = original.getBoundingClientRect();
        x = Math.max(0, Math.min(home.left + (home.width - width) / 2, innerWidth - width));
        y = Math.max(0, Math.min(home.top + (home.height - height) / 2, innerHeight - height));
        paint(x, y, .55, .3);
      } else if (elapsed < 1.4) {
        elapsed = Math.min(1.4, elapsed + dt);
        const t = elapsed / 1.4, eased = t * t * (3 - 2 * t);
        const maxX = Math.max(0, innerWidth - start.width * (1 - .45 * eased));
        const maxY = Math.max(0, innerHeight - start.height * (1 - .7 * eased));
        x = Math.max(0, Math.min(start.left, maxX)); y = Math.max(0, Math.min(start.top, maxY));
        paint(x, y, 1 - .45 * eased, 1 - .7 * eased);
      } else {
        const maxX = Math.max(0, innerWidth - width), maxY = Math.max(0, innerHeight - height);
        x += vx * dt; y += vy * dt;
        const hitX = x < 0 || x > maxX, hitY = y < 0 || y > maxY;
        if (hitX) { x = Math.max(0, Math.min(x, maxX)); vx = x === 0 ? Math.abs(vx) : -Math.abs(vx); }
        if (hitY) { y = Math.max(0, Math.min(y, maxY)); vy = y === 0 ? Math.abs(vy) : -Math.abs(vy); }
        if (hitX || hitY) {
          tint = (tint + 1) % colors.length;
          badge.style.boxShadow = `0 0 0 ${hitX && hitY ? 10 : 5}px ${colors[tint]}`;
          if (hitX && hitY) badge.animate([{ opacity: 1 }, { opacity: .55 }, { opacity: 1 }], {duration: 400});
        }
        paint(x, y, .55, .3);
      }
      frame = requestAnimationFrame(step);
    };
    dvdSession.current = { exit: () => { exiting = true; exitX = x; exitY = y; }, destroy: cleanup };
    frame = requestAnimationFrame(step);
  }, [dvd, portrait, reduced]);

  useEffect(() => () => dvdSession.current?.destroy(), []);
}

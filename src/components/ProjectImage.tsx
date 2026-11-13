"use client";

import Image from "next/image";
import { useState } from "react";

type ProjectImageProps = { src?: string; title: string; screenshots?: { src: string; alt: string }[] };

export default function ProjectImage({ src, title, screenshots }: ProjectImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (screenshots?.length) {
    return (
      <div className="aspect-[16/9] overflow-hidden bg-white flex justify-center gap-1 sm:gap-2 px-4 pt-3" aria-label={`${title} screenshots`}>
        {screenshots.slice(0, 3).map((screenshot) => (
          <div key={screenshot.src} className="relative h-full min-w-0 aspect-[222/480] overflow-hidden rounded-t-xl border border-b-0 border-zinc-200 bg-white">
            <Image src={screenshot.src} alt={screenshot.alt} fill sizes="(min-width: 640px) 16vw, 30vw" className="object-cover object-top" />
          </div>
        ))}
      </div>
    );
  }

  if (!src || failedSrc === src) {
    return (
      <div role="img" aria-label="Project image unavailable" className="aspect-[16/9] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
        <span className="font-display text-2xl font-bold text-zinc-500 dark:text-zinc-400">{title}</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
      <Image src={src} alt={`${title} project preview`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover object-top" onError={() => setFailedSrc(src)} />
    </div>
  );
}

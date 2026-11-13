"use client";

import Image from "next/image";
import { useState } from "react";

type ProjectImageProps = { src?: string; title: string };

export default function ProjectImage({ src, title }: ProjectImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

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

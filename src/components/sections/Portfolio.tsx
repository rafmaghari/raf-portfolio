"use client";

import config from "@/config.json";
import ProjectCarousel from "@/components/ProjectCarousel";
import styles from "./Portfolio.module.css";

export default function Portfolio() {
  return (
    <section id="portfolio" className={`${styles.portfolio} overflow-hidden border-b border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/30 pb-16 pt-24 sm:pb-24`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="section-label text-center">Selected work</p>
        <h2 className="heading-secondary mb-10 text-center sm:mb-14">{config.portfolio.title}</h2>
      </div>
      <ProjectCarousel projects={config.portfolio.projects} label={config.portfolio.title} />
    </section>
  );
}

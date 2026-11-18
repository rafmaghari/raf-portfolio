"use client";

import { useState, type CSSProperties } from "react";
import config from "@/config.json";
import CoreToolIcon from "@/components/CoreToolIcon";
import styles from "./Skills.module.css";

const { skills } = config;
const coreNames = new Set(skills.core.map((tool) => tool.skill));

export default function Skills() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="skills"
      className={`${styles.section} border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafaf9] dark:bg-zinc-950`}
    >
      <div className="section-container">
        <header className={styles.heading}>
          <h2 className="heading-secondary">{skills.title}</h2>
          <p>What I build with.</p>
        </header>

        <ul className={styles.core} aria-label="Core tools">
          {skills.core.map((tool) => (
            <li
              className={styles.tile}
              key={tool.name}
              tabIndex={0}
              title={tool.skill}
              style={{ "--brand": tool.color } as CSSProperties}
            >
              <span className={styles.mark}><CoreToolIcon icon={tool.icon} /></span>
              <span className={styles.name}>{tool.name}</span>
            </li>
          ))}
        </ul>

        <div className={styles.disclosure}>
          <p>And the rest of the toolkit.</p>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={expanded}
            aria-controls="all-tools"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Show fewer" : "Show all tools"}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d={expanded ? "m5 12 5-5 5 5" : "m5 8 5 5 5-5"} />
            </svg>
          </button>
        </div>

        <div id="all-tools" hidden={!expanded} className={styles.allTools}>
          {skills.categories.map((category) => (
            <div className={styles.category} key={category.name}>
              <h3>{category.name}</h3>
              <ul>
                {category.skills.filter((tool) => !coreNames.has(tool.name)).map((tool) => (
                  <li key={tool.name}>{tool.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

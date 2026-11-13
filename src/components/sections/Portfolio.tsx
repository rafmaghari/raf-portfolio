"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";
import ProjectImage from "@/components/ProjectImage";

type Project = {
  title: string;
  summary?: string;
  description: string;
  image?: string;
  screenshots?: { src: string; alt: string }[];
  links?: { appStore?: string; playStore?: string };
  tech: string[];
  year?: string;
  link?: string;
  client: string;
  private?: boolean;
};

const projects: Project[] = config.portfolio.projects;

const Portfolio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="portfolio"
      className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30"
    >
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label text-center">Selected work</p>
          <h2 className="heading-secondary text-center mb-14">
            {config.portfolio.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-[#fafaf9] dark:bg-zinc-950/50 overflow-hidden hover:border-zinc-600/50 dark:hover:border-zinc-400/50 transition-colors"
              >
                <ProjectImage src={project.image} title={project.title} screenshots={project.screenshots} />
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {project.client}{project.year ? ` · ${project.year}` : ""}
                    </p>
                    {project.private && <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">Private project</span>}
                  </div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                    {project.title}
                  </h3>
                  {project.summary && <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">{project.summary}</p>}
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-xs bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 6 ? (
                      <span className="px-2 py-0.5 text-xs text-zinc-500">
                        +{project.tech.length - 6}
                      </span>
                    ) : null}
                  </div>
                  {!project.private && project.links && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {([["appStore", "App Store"], ["playStore", "Google Play"]] as const).map(([key, label]) => project.links?.[key] && (
                        <a key={key} href={project.links[key]} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                          {key === "appStore" ? (
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.05 12.54c.03 3.14 2.75 4.18 2.78 4.19-.02.07-.43 1.49-1.44 2.95-.87 1.27-1.78 2.53-3.2 2.56-1.39.03-1.84-.82-3.43-.82-1.6 0-2.1.79-3.41.85-1.37.05-2.42-1.37-3.3-2.63-1.8-2.59-3.17-7.32-1.32-10.54.92-1.6 2.56-2.61 4.34-2.64 1.35-.03 2.62.91 3.44.91.83 0 2.37-1.13 4-.97.68.03 2.59.27 3.82 2.07-.1.06-2.3 1.34-2.28 4.07ZM14.43 4.73c.73-.89 1.22-2.12 1.09-3.35-1.05.04-2.33.7-3.08 1.59-.67.77-1.26 2.02-1.1 3.22 1.17.09 2.36-.6 3.09-1.46Z" /></svg>
                          ) : (
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M3 2.7v18.6L13.2 12 3 2.7Zm11.3 10.3-2.5 2.3 4.1 3.7 3.5-2c1.1-.6 1.1-1.4 0-2l-5.1-2Zm1.6-8L11.8 8.7l2.5 2.3 5.1-2c1.1-.6 1.1-1.4 0-2l-3.5-2ZM4.8 1.8l6.1 5.6 3.6-3.3-8-4.5c-.7-.4-1.3-.3-1.7.2Zm0 20.4c.4.5 1 .6 1.7.2l8-4.5-3.6-3.3-6.1 5.6Z" /></svg>
                          )}
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                  {!project.private && project.link && <a
                    href={project.link}
                    className="inline-flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project
                    <span className="ml-1" aria-hidden>
                      →
                    </span>
                  </a>}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;

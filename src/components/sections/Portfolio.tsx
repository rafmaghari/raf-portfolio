"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const { projects } = config.portfolio;

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
                className="group rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-[#fafaf9] dark:bg-zinc-950/50 overflow-hidden hover:border-teal-500/30 dark:hover:border-teal-500/25 transition-colors"
              >
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-2">
                    {project.client}
                  </p>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    {project.title}
                  </h3>
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
                  <a
                    href={project.link}
                    className="inline-flex items-center text-sm font-medium text-teal-700 dark:text-teal-400 hover:underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project
                    <span className="ml-1" aria-hidden>
                      →
                    </span>
                  </a>
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

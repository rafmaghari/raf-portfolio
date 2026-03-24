"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const experiences = config.experience.items;

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="experience"
      className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafaf9] dark:bg-zinc-950"
    >
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label text-center">Career</p>
          <h2 className="heading-secondary text-center mb-14">
            {config.experience.title}
          </h2>
          <div className="max-w-3xl mx-auto divide-y divide-zinc-200 dark:divide-zinc-800 border-t border-zinc-200 dark:border-zinc-800">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.period + exp.title}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-8 py-10 first:pt-0"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <p className="text-teal-700 dark:text-teal-400/90 font-medium text-sm mt-1">
                    {exp.company}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed list-disc list-outside pl-4 marker:text-zinc-400">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500 tabular-nums md:text-right md:pt-0.5 shrink-0">
                  {exp.period}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;

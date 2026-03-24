"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const { skills } = config;
const skillCategories = skills.categories;

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="skills"
      className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafaf9] dark:bg-zinc-950"
    >
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label text-center">Capabilities</p>
          <h2 className="heading-secondary text-center mb-14">
            {skills.title}
          </h2>
          <div className="space-y-12 max-w-3xl mx-auto">
            {skillCategories.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...category.skills]
                    .sort((a, b) => b.level - a.level)
                    .map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

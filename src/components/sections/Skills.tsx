"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const { skills } = config;
const skillCategories = skills.categories;

const SkillBar = ({ name, level }: { name: string; level: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 dark:text-gray-300">{name}</span>
        <span className="text-gray-600 dark:text-gray-400">{level}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="skills" className="bg-gray-50 dark:bg-gray-800 py-20">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-secondary text-center mb-12">
            {skills.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {skillCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-6 text-indigo-600 dark:text-indigo-500">
                  {category.name}
                </h3>
                <div>
                  {category.skills.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                    />
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

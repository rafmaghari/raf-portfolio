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
    <section id="experience" className="bg-white dark:bg-gray-900 py-20">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-secondary text-center mb-12">
            {config.experience.title}
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-900" />

            {/* Experience items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.period}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-600 dark:bg-indigo-500 rounded-full border-4 border-white dark:border-gray-900" />

                  {/* Content */}
                  <div
                    className={`ml-6 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pl-8" : "md:pr-8"
                    }`}
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                        {exp.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {exp.period}
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;

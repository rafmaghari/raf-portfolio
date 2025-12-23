"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const { projects } = config.portfolio;

// Placeholder colors for projects without images
const placeholderGradients = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-yellow-600",
  "from-violet-500 to-fuchsia-600",
  "from-lime-500 to-green-600",
];

const Portfolio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="portfolio" className="bg-white dark:bg-gray-900 py-20">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-secondary text-center mb-12">
            {config.portfolio.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className={`relative h-48 bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]} flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <pattern id={`grid-${index}`} width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100" height="100" fill={`url(#grid-${index})`}/>
                    </svg>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{project.title.charAt(0)}</span>
                    </div>
                    <span className="text-white/80 text-sm font-medium">{project.client}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;

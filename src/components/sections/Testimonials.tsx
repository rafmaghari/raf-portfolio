"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const testimonials = config.testimonials.items;

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-secondary text-center mb-12">
            {config.testimonials.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

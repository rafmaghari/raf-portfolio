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
    <section
      id="testimonials"
      className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30"
    >
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label text-center">Kind words</p>
          <h2 className="heading-secondary text-center mb-14">
            {config.testimonials.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.blockquote
                key={testimonial.name}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-[#fafaf9] dark:bg-zinc-950/50 p-7 sm:p-8"
              >
                <span
                  className="absolute top-6 left-6 font-display text-5xl leading-none text-teal-600/20 dark:text-teal-400/15 select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="relative text-zinc-700 dark:text-zinc-300 leading-relaxed pl-2 pt-6">
                  {testimonial.content}
                </p>
                <footer className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <cite className="not-italic font-semibold text-zinc-900 dark:text-white text-sm">
                    {testimonial.name}
                  </cite>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    {testimonial.role}
                  </p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

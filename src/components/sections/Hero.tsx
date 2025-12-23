"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import config from "@/config.json";

const { hero } = config;

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <h1 className="heading-primary mb-6">
              {hero.greeting}{" "}
              <span className="text-indigo-600 dark:text-indigo-500">
                {hero.name}
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 mb-8">
              {hero.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12">
              {hero.description}
            </p>
            <div className="flex gap-4">
              {hero.ctaButtons.map((button) => (
                <a
                  key={button.text}
                  href={button.href}
                  className={button.variant === "primary" ? "button-primary" : "button-secondary"}
                >
                  {button.text}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[550px] w-full rounded-2xl overflow-hidden order-first md:order-last"
          >
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              className="object-cover object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

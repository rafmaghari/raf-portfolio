"use client";

import { motion } from "framer-motion";
import config from "@/config.json";

const { hero, links } = config;

const roleLine =
  hero.roleTags?.join(" \\ ") ?? hero.title;

const extraCtas: {
  text: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
}[] = [];

if (links?.linkedin) {
  extraCtas.push({
    text: "LinkedIn",
    href: links.linkedin,
    variant: "ghost",
  });
}
if (links?.github) {
  extraCtas.push({
    text: "GitHub",
    href: links.github,
    variant: "ghost",
  });
}

const buttonClass = (variant: string) => {
  if (variant === "primary") return "button-primary";
  if (variant === "ghost") return "button-ghost";
  return "button-secondary";
};

const Hero = () => {
  return (
    <section className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafaf9] dark:bg-zinc-950">
      <div className="section-container w-full py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            {hero.greeting}
          </p>
          <h1 className="heading-primary mb-4">{hero.name}</h1>
          {hero.location ? (
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-4">
              {hero.location}
            </p>
          ) : null}
          <p className="text-base sm:text-lg text-teal-700 dark:text-teal-400/90 font-medium mb-6">
            {roleLine}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed mb-10">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {config.contact?.email ? (
              <a
                href={`mailto:${config.contact.email}`}
                className="button-primary"
              >
                Send email
              </a>
            ) : null}
            {hero.ctaButtons.map((button) => (
              <a
                key={button.text}
                href={button.href}
                className={buttonClass(button.variant)}
              >
                {button.text}
              </a>
            ))}
            {extraCtas.map((button) => (
              <a
                key={button.text}
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass(button.variant)}
              >
                {button.text}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

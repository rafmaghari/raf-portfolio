"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import config from "@/config.json";

const { contact } = config;

const COOLDOWN_SECONDS = 60;

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [botcheck, setBotcheck] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if checkbox is checked, it's a bot
    if (botcheck) {
      setStatus("success"); // Fake success for bots
      return;
    }

    // Cooldown check
    if (cooldown > 0) {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "62aa622b-e633-4e92-8209-a17863cd1052",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setCooldown(COOLDOWN_SECONDS); // Start cooldown
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="contact"
      className="bg-[#fafaf9] dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <p className="section-label text-center">Contact</p>
          <h2 className="heading-secondary text-center mb-4">{contact.title}</h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm mb-10 max-w-md mx-auto">
            Send a message and I&apos;ll get back to you as soon as I can.
          </p>
          {contact.email ? (
            <p className="text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 block mb-2">
                {contact.emailLabel ?? "Email"}
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="text-teal-700 dark:text-teal-400 font-medium hover:underline underline-offset-4"
              >
                {contact.email}
              </a>
            </p>
          ) : null}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 sm:p-8"
          >
            {/* Web3Forms Honeypot - hidden checkbox that bots will check */}
            <input
              type="checkbox"
              name="botcheck"
              checked={botcheck}
              onChange={(e) => setBotcheck(e.target.checked)}
              className="hidden"
              style={{ display: "none" }}
              tabIndex={-1}
              aria-hidden="true"
            />
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-[#fafaf9] dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 transition-all duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-[#fafaf9] dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 transition-all duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-[#fafaf9] dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 resize-none transition-all duration-200"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={status === "submitting" || cooldown > 0}
                className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              >
                {status === "submitting"
                  ? contact.form.submitButton.loadingText
                  : cooldown > 0
                  ? `Please wait ${cooldown}s`
                  : contact.form.submitButton.text}
              </button>
            </div>
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 dark:text-green-400 text-center"
              >
                {contact.messages.success}
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 text-center"
              >
                {contact.messages.error}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

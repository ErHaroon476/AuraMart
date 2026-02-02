"use client";

import { Mail, Phone, PhoneCall, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <main className="min-h-screen rounded-t-3xl bg-[rgb(var(--color-background))] text-slate-900">
      {/* Hero Section */}
      <section className="rounded-b-3xl bg-slate-900 px-6 py-16 text-center text-slate-50 shadow-lg">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold tracking-tight md:text-5xl"
        >
          About <span className="text-emerald-400">AuraMart</span>
        </motion.h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Building trust since <span className="font-semibold">1995</span> — wholesale leaders in cosmetics and beauty across Punjab, Pakistan.
        </p>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-5xl space-y-10 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Our journey
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">
            Since <strong>1995</strong>, AA Mart has been serving as a trusted cosmetics wholesale store in{" "}
            <strong>Okara, Pakistan</strong>. With over{" "}
            <span className="font-semibold">100,000+ happy and trusted customers</span>, we’ve built our reputation on authenticity, reliability, and long-lasting partnerships.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            We proudly work <strong>directly with world-renowned companies</strong> such as{" "}
            <em>Golden Pearl, Soft Touch, Olivia, Hemani, Keune, Care, Samsol</em> and many more. This ensures our customers receive{" "}
            <span className="font-semibold">100% authentic products</span> at wholesale rates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Our reach
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">
            We are proud distributors of cosmetics and beauty products all across the{" "}
            <strong>Punjab region</strong>. With our own fleet of{" "}
            <span className="font-semibold">dedicated delivery vehicles</span>, we guarantee{" "}
            <strong>safe, secure, and on-time deliveries</strong>.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            Our distribution system ensures beauty salons, retailers, and shopkeepers across Punjab are always stocked with authentic products at the best wholesale prices.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
            Get in touch
          </h2>
          <div className="space-y-4 text-slate-800">
            <p className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-emerald-600" />
              <a
                href="mailto:haroonnasim033@gmail.com"
                className="underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-700"
              >
                haroonnasim033@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-emerald-600" /> PTCL: 044-2527657
            </p>
            <p className="flex items-center gap-3">
              <PhoneCall className="h-6 w-6 text-emerald-600" /> Mobile: +92 346 7565857
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-emerald-600" /> Okara, Punjab, Pakistan
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

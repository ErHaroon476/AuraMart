"use client";

import { Mail, PhoneCall, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Support() {
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
          Customer <span className="text-emerald-400">support</span>
        </motion.h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Need help? We’re here 24/7 to assist with your orders, deliveries, or wholesale queries.
        </p>
      </section>

      {/* Support Options */}
      <section className="mx-auto grid max-w-4xl gap-10 px-6 py-16 text-center md:grid-cols-3">
        {/* Email Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <Mail className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="mb-4 text-sm text-slate-600">
            For queries and wholesale deals, email us anytime.
          </p>
          <a
            href="mailto:haroonnasim033@gmail.com"
            className="font-semibold text-emerald-700 underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-800"
          >
            haroonnasim033@gmail.com
          </a>
        </motion.div>

        {/* Phone Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <PhoneCall className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="mb-4 text-sm text-slate-600">
            Speak directly with our support team.
          </p>
          <p className="font-semibold text-slate-900">+92 346 7565857</p>
          <p className="text-sm text-slate-600">PTCL: 044-2527657</p>
        </motion.div>

        {/* Live Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
          <p className="mb-4 text-sm text-slate-600">
            Chat with our support agents in real time. (Coming soon 🚀)
          </p>
        </motion.div>
      </section>
    </main>
  );
}

"use client";

import { Mail, PhoneCall, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Support() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 text-orange-900 rounded-t-3xl overflow-hidden">
      {/* Hero Section */}
      <section className="bg-orange-900 text-white py-16 px-6 text-center rounded-b-3xl shadow-lg">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Customer <span className="text-orange-400">Support</span>
        </motion.h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-orange-100">
          Need help? We’re here 24/7 to assist with your orders, deliveries, or wholesale queries.
        </p>
      </section>

      {/* Support Options */}
      <section className="max-w-4xl mx-auto py-16 px-6 grid gap-10 md:grid-cols-3 text-center">
        {/* Email Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-orange-200"
        >
          <Mail className="w-12 h-12 text-orange-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">For queries and wholesale deals, email us anytime.</p>
          <a
            href="mailto:haroonnasim033@gmail.com"
            className="text-orange-700 font-semibold hover:underline"
          >
            haroonnasim033@gmail.com
          </a>
        </motion.div>

        {/* Phone Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-orange-200"
        >
          <PhoneCall className="w-12 h-12 text-orange-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-gray-600 mb-4">Speak directly with our support team.</p>
          <p className="font-semibold text-gray-800">+92 346 7565857</p>
          <p className="text-gray-600">PTCL: 044-2527657</p>
        </motion.div>

        {/* Live Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-orange-200"
        >
          <MessageCircle className="w-12 h-12 text-orange-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-4">
            Chat with our support agents in real time. (Coming Soon 🚀)
          </p>
        </motion.div>
      </section>
    </main>
  );
}

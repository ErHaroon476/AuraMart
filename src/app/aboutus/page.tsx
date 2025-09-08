"use client";

import { Mail, Phone, PhoneCall, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
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
          About <span className="text-orange-400">AA Mart</span>
        </motion.h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-orange-100">
          Building trust since <span className="font-semibold">1995</span> — wholesale leaders in cosmetics and beauty across Punjab, Pakistan.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto py-16 px-6 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold">Our Journey</h2>
          <p className="leading-relaxed text-lg text-gray-700">
            Since <strong>1995</strong>, AA Mart has been serving as a trusted cosmetics wholesale store in{" "}
            <strong>Okara, Pakistan</strong>. With over{" "}
            <span className="font-semibold">100,000+ happy and trusted customers</span>, we’ve built our reputation on authenticity, reliability, and long-lasting partnerships.
          </p>
          <p className="leading-relaxed text-lg text-gray-700">
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
          <h2 className="text-2xl md:text-3xl font-bold">Our Reach</h2>
          <p className="leading-relaxed text-lg text-gray-700">
            We are proud distributors of cosmetics and beauty products all across the{" "}
            <strong>Punjab region</strong>. With our own fleet of{" "}
            <span className="font-semibold">dedicated delivery vehicles</span>, we guarantee{" "}
            <strong>safe, secure, and on-time deliveries</strong>.
          </p>
          <p className="leading-relaxed text-lg text-gray-700">
            Our distribution system ensures beauty salons, retailers, and shopkeepers across Punjab are always stocked with authentic products at the best wholesale prices.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white shadow-lg rounded-2xl p-8 border border-orange-200"
        >
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="space-y-4 text-gray-800">
            <p className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-orange-700" />
              <a href="mailto:haroonnasim033@gmail.com" className="hover:text-orange-600 underline">
                haroonnasim033@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-orange-700" /> PTCL: 044-2527657
            </p>
            <p className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-orange-700" /> Mobile: +92 346 7565857
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-orange-700" /> Okara, Punjab, Pakistan
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

"use client";

import { auth, provider, signInWithPopup, signOut } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ShoppingCart, ShoppingBag, CreditCard, Package } from "lucide-react";
import Image from "next/image";

export default function AdminAuth() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser?.email === "haroonnasim033@gmail.com") {
        window.location.href = "/adminhn";
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      if (loggedInUser.email !== "haroonnasim033@gmail.com") {
        alert("❌ Access denied. Only the admin can log in.");
        await signOut(auth);
      } else {
        window.location.href = "/adminhn";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Floating animation variants
  const floating: Variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 text-gray-100">
      {/* Floating icons */}
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute top-20 left-10 text-blue-600 opacity-30"
      >
        <ShoppingCart size={80} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute bottom-32 right-12 text-green-500 opacity-30"
      >
        <ShoppingBag size={70} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute top-1/3 left-1/3 text-purple-500 opacity-25"
      >
        <CreditCard size={65} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute bottom-20 left-1/4 text-pink-500 opacity-25"
      >
        <Package size={75} />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
        className="relative z-10 bg-gray-900/90 backdrop-blur-md border border-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="flex justify-center mb-6"
        >
          <Image
            src="/logo.jpg"
            alt="AA Mart Logo"
            width={64}
            height={64}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-md"
          />
        </motion.div>

        <h1 className="text-3xl font-bold text-white">AA Mart Admin Portal</h1>
        <p className="text-gray-400 mt-2 mb-8">
          Sign in with your{" "}
          <span className="font-semibold text-blue-400">Google Account</span>{" "}
          to access the dashboard.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
            className="bg-white rounded-full"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Only authorized admin accounts are permitted.
        </p>
      </motion.div>
    </main>
  );
}

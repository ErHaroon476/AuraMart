"use client";

import { auth, provider, signInWithPopup, signOut } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ShoppingCart, ShoppingBag, CreditCard, Package } from "lucide-react";

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

  // Floating animation variants ✅ fixed typing
  const floating: Variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror" as const, // 👈 type-safe
      },
    },
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-green-50 to-white text-gray-800">
      {/* Floating Lucide icons */}
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute top-20 left-10 text-blue-400 opacity-50"
      >
        <ShoppingCart size={80} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute bottom-32 right-12 text-green-400 opacity-50"
      >
        <ShoppingBag size={70} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute top-1/3 left-1/3 text-purple-400 opacity-40"
      >
        <CreditCard size={65} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute bottom-20 left-1/4 text-pink-400 opacity-40"
      >
        <Package size={75} />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
        className="relative z-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="flex justify-center mb-6"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Admin Logo"
            className="w-16 h-16 drop-shadow-md"
          />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
        <p className="text-gray-500 mt-2 mb-8">
          Sign in with your{" "}
          <span className="font-semibold text-blue-500">Google Account</span>{" "}
          to access the dashboard.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 bg-gradient-to-r from-blue-500 to-green-400 hover:opacity-90 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 bg-white rounded-full"
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

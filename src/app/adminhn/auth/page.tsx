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
    } catch (err: any) {
      console.error("Sign-in error:", err.code, err.message);
      alert("Sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const floating: Variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: { duration: 6, repeat: Infinity, repeatType: "mirror" as const },
    },
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
      {/* Floating icons */}
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute left-10 top-20 text-emerald-500 opacity-25"
      >
        <ShoppingCart size={80} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute bottom-32 right-12 text-sky-500 opacity-25"
      >
        <ShoppingBag size={70} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute left-1/3 top-1/3 text-emerald-300 opacity-20"
      >
        <CreditCard size={65} />
      </motion.div>
      <motion.div
        variants={floating}
        animate="animate"
        className="absolute bottom-20 left-1/4 text-sky-400 opacity-20"
      >
        <Package size={75} />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center shadow-2xl backdrop-blur-md"
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
            alt="AuraMart Logo"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full shadow-md sm:h-20 sm:w-20"
          />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-50">AuraMart admin portal</h1>
        <p className="mt-2 mb-8 text-sm text-slate-400">
          Sign in with your{" "}
          <span className="font-semibold text-emerald-400">Google account</span> to access the dashboard.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 disabled:opacity-50"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
            className="rounded-full bg-white"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="mt-6 text-xs text-slate-400">
          Only authorized admin accounts are permitted.
        </p>
      </motion.div>
    </main>
  );
}

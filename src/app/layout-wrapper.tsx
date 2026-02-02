"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/Components/common/navbar";
import Footer from "@/Components/common/footer";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/adminhn");

  return (
    <div className="flex min-h-screen flex-col bg-[rgb(var(--color-background))]">
      {!isAdminRoute && <Navbar />}

      <main
        className={`flex-1 ${
          !isAdminRoute ? "px-4 py-6" : ""
        }`}
      >
        <div className={!isAdminRoute ? "mx-auto max-w-6xl" : ""}>{children}</div>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/Components/common/navbar";
import Footer from "@/Components/common/footer";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}

      <main className={`flex-1 ${!isAdminRoute ? "px-4 py-6" : ""}`}>
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

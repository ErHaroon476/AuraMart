
//Components/admin/AdminNavbar
"use client";

import { useRouter } from "next/navigation";
import { LogOut, PackagePlus, Boxes, ShoppingCart } from "lucide-react";
import { auth, signOut } from "@/lib/firebase";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/adminhn/auth");
  };

  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 py-4 text-slate-100 shadow-sm">
      {/* Logo / Brand */}
      <div
        className="cursor-pointer text-lg font-semibold tracking-tight"
        onClick={() => router.push("/adminhn")}
      >
        🛠️ Admin dashboard
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => router.push("/adminhn/add-product")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-200 transition hover:bg-slate-800 hover:text-white"
        >
          <PackagePlus className="w-4 h-4" /> Add Product
        </button>

        <button
          onClick={() => router.push("/adminhn/manage-products")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-200 transition hover:bg-slate-800 hover:text-white"
        >
          <Boxes className="w-4 h-4" /> Manage Products
        </button>

      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-500"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </nav>
  );
}

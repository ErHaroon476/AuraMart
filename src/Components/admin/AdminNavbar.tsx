
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
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-md">
      {/* Logo / Brand */}
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => router.push("/adminhn")}
      >
        🛠️ Admin Dashboard
      </div>

      {/* Links */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.push("/adminhn/add-product")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <PackagePlus className="w-4 h-4" /> Add Product
        </button>

        <button
          onClick={() => router.push("/adminhn/manage-products")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Boxes className="w-4 h-4" /> Manage Products
        </button>

      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </nav>
  );
}

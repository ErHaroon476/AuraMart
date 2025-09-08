"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/Components/admin/AdminNavbar";
import PendingOrders from "@/Components/admin/orders/PendingOrders";
import ConfirmedOrders from "@/Components/admin/orders/ConfirmedOrders";
import DeliveredOrders from "@/Components/admin/orders/DeliveredOrders";
import { auth, provider, signInWithPopup, db } from "@/lib/firebase";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "delivered">("pending");
  const [deleting, setDeleting] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // 🔹 Check admin auth on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || user.email !== "haroonnasim033@gmail.com") {
        router.replace("/adminhn/auth");
      } else {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 🔹 Delete all orders with re-auth
  const handleDeleteAllOrders = async () => {
    if (!confirm("⚠️ This will permanently delete ALL orders. Continue?")) return;

    try {
      // Re-authenticate admin
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      if (loggedInUser.email !== "haroonnasim033@gmail.com") {
        alert("❌ Access denied. Only the admin can perform this action.");
        return;
      }

      setDeleting(true);

      // Delete all orders
      const snap = await getDocs(collection(db, "orders"));
      const batch = writeBatch(db);
      snap.docs.forEach((docSnap) => {
        const orderRef = doc(db, "orders", docSnap.id);
        batch.delete(orderRef);
      });

      await batch.commit();
      alert("✅ All orders deleted successfully.");
      window.location.reload();
    } catch (err) {
      console.error("Delete orders failed:", err);
      alert("❌ Failed to delete orders. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs + Delete Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {["pending", "confirmed", "delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg shadow-md transition font-semibold ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleDeleteAllOrders}
            disabled={deleting}
            className="ml-auto px-4 py-2 rounded-lg shadow-md bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "🗑 Delete All Orders"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
          {activeTab === "pending" && <PendingOrders />}
          {activeTab === "confirmed" && <ConfirmedOrders />}
          {activeTab === "delivered" && <DeliveredOrders />}
        </div>
      </div>
    </div>
  );
}

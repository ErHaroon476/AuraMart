"use client";

import { useState } from "react";
import AdminNavbar from "@/Components/admin/AdminNavbar";
import PendingOrders from "@/Components/admin/orders/PendingOrders";
import ConfirmedOrders from "@/Components/admin/orders/ConfirmedOrders";
import DeliveredOrders from "@/Components/admin/orders/DeliveredOrders";
import { auth, provider, signInWithPopup } from "@/lib/firebase";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "delivered">("pending");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAllOrders = async () => {
    if (!confirm("⚠️ This will permanently delete ALL orders. Continue?")) return;

    try {
      // Step 1: Re-authenticate admin with Google
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      if (loggedInUser.email !== "haroonnasim033@gmail.com") {
        alert("❌ Access denied. Only the admin can perform this action.");
        return;
      }

      setDeleting(true);

      // Step 2: Delete all orders from Firestore
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />
      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {["pending", "confirmed", "delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg shadow-md transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          {/* Delete All Orders button */}
          <button
            onClick={handleDeleteAllOrders}
            disabled={deleting}
            className="ml-auto px-4 py-2 rounded-lg shadow-md bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "🗑 Delete All Orders"}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "pending" && <PendingOrders />}
        {activeTab === "confirmed" && <ConfirmedOrders />}
        {activeTab === "delivered" && <DeliveredOrders />}
      </div>
    </div>
  );
}

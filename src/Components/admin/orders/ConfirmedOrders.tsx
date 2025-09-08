"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import OrderCard from "./OrderCard";
import { downloadCSV } from "@/utils/download";

export default function ConfirmedOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(data.filter((o: any) => o.status === "confirmed"));
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const markAsDelivered = async (order: any) => {
    if (updatingId) return;
    try {
      setUpdatingId(order.id);
      await updateDoc(doc(db, "orders", order.id), {
        status: "delivered",
        deliveredAt: serverTimestamp(),
      });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownload = () => {
    const exportData = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber || "",
      status: o.status,
      customer: `${o.shipping.firstName} ${o.shipping.lastName}`,
      email: o.shipping.email,
      phone: o.shipping.phone,
      address: `${o.shipping.address}, ${o.shipping.city}, ${o.shipping.zip}`,
      payment: o.shipping.payment || "",
      items: o.items.map((i: any) => `${i.title} × ${i.quantity}`).join("; "),
      total: o.finalTotal,
      confirmedAt: o.confirmedAt?.toDate ? o.confirmedAt.toDate().toLocaleString() : "",
    }));
    downloadCSV("confirmed_orders.csv", exportData);
  };

  if (loading) return <p>Loading Confirmed Orders...</p>;
  if (orders.length === 0) return <p>No confirmed orders.</p>;

  return (
    <div className="space-y-6">
      {orders.length > 0 && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 mb-4 bg-green-600 hover:bg-green-500 rounded-lg shadow-md text-white"
        >
          Download Orders (CSV)
        </button>
      )}

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          actionLabel={updatingId === order.id ? "Updating..." : "Mark as Delivered"}
          actionDisabled={updatingId === order.id}
          onAction={() => markAsDelivered(order)}
        />
      ))}
    </div>
  );
}

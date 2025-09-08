"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import OrderCard from "./OrderCard";
import { downloadCSV } from "@/utils/download";

export default function DeliveredOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(data.filter((o: any) => o.status === "delivered"));
      setLoading(false);
    };
    fetchOrders();
  }, []);

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
      deliveredAt: o.deliveredAt?.toDate ? o.deliveredAt.toDate().toLocaleString() : "",
    }));
    downloadCSV("delivered_orders.csv", exportData);
  };

  if (loading) return <p>Loading Delivered Orders...</p>;
  if (orders.length === 0) return <p>No delivered orders yet.</p>;

  return (
    <div className="space-y-6">
      {orders.length > 0 && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 mb-4 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md text-white"
        >
          Download Orders (CSV)
        </button>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

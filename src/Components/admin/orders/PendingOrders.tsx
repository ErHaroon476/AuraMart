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
import { sendEmail } from "@/utils/email";
import OrderCard from "./OrderCard";
import { downloadCSV } from "@/utils/download";

export default function PendingOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(data.filter((o: any) => !o.status || o.status === "pending"));
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleConfirm = async (order: any) => {
    if (sendingId) return;
    try {
      setSendingId(order.id);

      // ✅ Update order status
      await updateDoc(doc(db, "orders", order.id), {
        status: "confirmed",
        confirmedAt: serverTimestamp(),
      });

      // ✅ Build payload exactly for EmailJS template
      const emailPayload = {
        order_id: order.orderNumber || order.id,
        email: order.shipping.email,
        orders: order.items.map((item: any) => ({
          name: item.title,
          units: item.quantity,
          price: (item.discountedPrice * item.quantity).toFixed(2),
          image_url: item.imageUrl || "https://via.placeholder.com/64",
        })),
        cost: {
          shipping: order.delivery || 0,
          tax: 0,
          total: order.finalTotal || 0,
        },
      };

      // ✅ Send confirmation email
      await sendEmail(emailPayload);

      // ✅ Remove confirmed order from pending list
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } finally {
      setSendingId(null);
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
      placedAt: o.createdAt?.toDate
        ? o.createdAt.toDate().toLocaleString()
        : "",
    }));
    downloadCSV("pending_orders.csv", exportData);
  };

  if (loading) return <p>Loading Pending Orders...</p>;
  if (orders.length === 0) return <p>No pending orders.</p>;

  return (
    <div className="space-y-6">
      {orders.length > 0 && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 mb-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md text-white"
        >
          Download Orders (CSV)
        </button>
      )}

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          actionLabel={sendingId === order.id ? "Confirming..." : "Confirm Order"}
          actionDisabled={sendingId === order.id}
          onAction={() => handleConfirm(order)}
        />
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/Components/admin/AdminNavbar";
import PendingOrders from "@/Components/admin/orders/PendingOrders";
import ConfirmedOrders from "@/Components/admin/orders/ConfirmedOrders";
import DeliveredOrders from "@/Components/admin/orders/DeliveredOrders";
import { auth, provider, signInWithPopup, db } from "@/lib/firebase";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { BarChart3, ShoppingBag, Clock, CheckCircle, Package, TrendingUp } from "lucide-react";

type StatusBarProps = {
  label: string;
  value: number;
  total: number;
  colorClass: string;
};

function StatusBar({ label, value, total, colorClass }: StatusBarProps) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span>
          {value} ({percent}%)
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "delivered">("pending");
  const [deleting, setDeleting] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    revenue: 0,
    revenueThisMonth: 0,
  });
  const [productCount, setProductCount] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState<{ label: string; total: number }[]>([]);

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

  // 🔹 Load high-level stats (orders + products)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersSnap, productsSnap] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "products")),
        ]);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let total = 0;
        let pending = 0;
        let confirmed = 0;
        let delivered = 0;
        let revenue = 0;
        let revenueThisMonth = 0;

        const revenueByDate: Record<string, number> = {};

        ordersSnap.docs.forEach((docSnap) => {
          const order: any = docSnap.data();
          total += 1;

          const status = order.status || "pending";
          if (status === "pending") pending += 1;
          else if (status === "confirmed") confirmed += 1;
          else if (status === "delivered") delivered += 1;

          const finalTotal = typeof order.finalTotal === "number" ? order.finalTotal : 0;
          revenue += finalTotal;

          const createdAt: Date | null = order.createdAt?.toDate ? order.createdAt.toDate() : null;
          if (createdAt && createdAt >= startOfMonth) {
            revenueThisMonth += finalTotal;
          }

          if (createdAt) {
            const key = createdAt.toISOString().slice(0, 10);
            revenueByDate[key] = (revenueByDate[key] || 0) + finalTotal;
          }
        });

        const series: { label: string; total: number }[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          const label = `${d.getDate()}/${d.getMonth() + 1}`;
          series.push({ label, total: revenueByDate[key] || 0 });
        }

        setOrderStats({
          total,
          pending,
          confirmed,
          delivered,
          revenue,
          revenueThisMonth,
        });
        setProductCount(productsSnap.size);
        setRevenueSeries(series);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!loadingAuth) {
      fetchStats();
    }
  }, [loadingAuth]);

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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-300">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminNavbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI cards */}
        <section className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total orders
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {statsLoading ? "—" : orderStats.total}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Pending / Confirmed
              </p>
              <p className="mt-2 text-sm text-slate-50">
                {statsLoading
                  ? "—"
                  : `${orderStats.pending} pending · ${orderStats.confirmed} confirmed`}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Delivered orders
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {statsLoading ? "—" : orderStats.delivered}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Products in catalog
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {statsLoading ? "—" : productCount}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-50">
                Orders by status
              </h2>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <StatusBar
                label="Pending"
                value={orderStats.pending}
                total={orderStats.total}
                colorClass="bg-amber-400"
              />
              <StatusBar
                label="Confirmed"
                value={orderStats.confirmed}
                total={orderStats.total}
                colorClass="bg-sky-400"
              />
              <StatusBar
                label="Delivered"
                value={orderStats.delivered}
                total={orderStats.total}
                colorClass="bg-emerald-400"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-50">
                Last 7 days revenue
              </h2>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              This month:{" "}
              <span className="font-semibold text-emerald-400">
                {statsLoading
                  ? "—"
                  : `Rs. ${orderStats.revenueThisMonth.toFixed(0)}`}
              </span>
            </p>
            <div className="mt-4 flex h-28 items-end gap-2">
              {revenueSeries.map((point) => {
                const max = Math.max(
                  ...revenueSeries.map((p) => p.total),
                  1
                );
                const height = (point.total / max) * 100;
                return (
                  <div
                    key={point.label}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className="w-full rounded-t-md bg-emerald-500/80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-slate-400">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Tabs + Delete Button */}
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["pending", "confirmed", "delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleDeleteAllOrders}
            disabled={deleting}
            className="ml-auto inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "🗑 Delete all orders"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
          {activeTab === "pending" && <PendingOrders />}
          {activeTab === "confirmed" && <ConfirmedOrders />}
          {activeTab === "delivered" && <DeliveredOrders />}
        </div>
      </div>
    </div>
  );
}

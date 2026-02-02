"use client";

import { motion } from "framer-motion";

interface Props {
  order: any;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}

export default function OrderCard({ order, actionLabel, actionDisabled, onAction }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-md transition hover:border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-400">
            Order ID: {order.id}
          </h2>
          {order.orderNumber && (
            <p className="text-sm text-slate-400">Order #: {order.orderNumber}</p>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            order.status === "pending"
              ? "bg-yellow-600/80 text-white"
              : order.status === "confirmed"
              ? "bg-emerald-600/80 text-white"
              : "bg-sky-600/80 text-white"
          }`}
        >
          {order.status?.toUpperCase() || "PENDING"}
        </span>
      </div>

      {/* Placed At */}
      <p className="text-sm text-slate-400">
        Placed At:{" "}
        {order.createdAt?.toDate
          ? order.createdAt.toDate().toLocaleString()
          : "N/A"}
      </p>

      {/* Customer Info */}
      <div>
        <h3 className="mb-1 font-semibold text-emerald-300">Customer info</h3>
        <div className="space-y-1 text-sm text-slate-200">
          <p>
            Name: {order.shipping.firstName} {order.shipping.lastName}
          </p>
          <p>Email: {order.shipping.email}</p>
          <p>Phone: {order.shipping.phone}</p>
          <p>
            Address: {order.shipping.address}, {order.shipping.city} -{" "}
            {order.shipping.zip}
          </p>
          <p>
            Payment: {order.shipping.payment?.toUpperCase?.() || "N/A"}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="mb-2 font-semibold text-emerald-300">Order items</h3>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-slate-800 pb-2"
            >
              {/* Left: Image + Title */}
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-14 w-14 rounded-md border border-slate-700 object-cover"
                />
                <div>
                  <p className="font-medium text-slate-100">{item.title}</p>
                  <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                </div>
              </div>
              {/* Right: Price */}
              <span className="font-semibold text-slate-100">
                Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-between border-t border-slate-800 pt-3 text-sm font-semibold text-slate-100">
        <span>Total (with delivery)</span>
        <span>Rs. {order.finalTotal.toFixed(2)}</span>
      </div>

      {/* Action Button */}
      {actionLabel && (
        <div className="flex justify-end pt-3">
          <button
            onClick={onAction}
            disabled={actionDisabled}
            className={`rounded-lg px-6 py-2 text-sm font-medium shadow-md transition ${
              actionDisabled
                ? "cursor-not-allowed bg-slate-700 text-slate-200"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </motion.div>
  );
}

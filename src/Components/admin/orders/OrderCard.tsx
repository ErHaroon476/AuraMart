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
      className="bg-gray-900 shadow-lg p-6 rounded-2xl space-y-5 border border-gray-800 hover:border-gray-700 transition"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-indigo-400">
            Order ID: {order.id}
          </h2>
          {order.orderNumber && (
            <p className="text-sm text-gray-400">Order #: {order.orderNumber}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            order.status === "pending"
              ? "bg-yellow-700 text-white"
              : order.status === "confirmed"
              ? "bg-green-700 text-white"
              : "bg-blue-700 text-white"
          }`}
        >
          {order.status?.toUpperCase() || "PENDING"}
        </span>
      </div>

      {/* Placed At */}
      <p className="text-gray-400 text-sm">
        Placed At:{" "}
        {order.createdAt?.toDate
          ? order.createdAt.toDate().toLocaleString()
          : "N/A"}
      </p>

      {/* Customer Info */}
      <div>
        <h3 className="font-semibold mb-1 text-indigo-300">Customer Info</h3>
        <div className="space-y-1 text-gray-300 text-sm">
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
        <h3 className="font-semibold mb-2 text-indigo-300">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-gray-700 pb-2"
            >
              {/* Left: Image + Title */}
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-md border border-gray-700"
                />
                <div>
                  <p className="font-medium text-gray-200">{item.title}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
              {/* Right: Price */}
              <span className="font-semibold text-gray-100">
                Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-gray-100">
        <span>Total (with delivery):</span>
        <span>Rs. {order.finalTotal.toFixed(2)}</span>
      </div>

      {/* Action Button */}
      {actionLabel && (
        <div className="flex justify-end pt-3">
          <button
            onClick={onAction}
            disabled={actionDisabled}
            className={`px-6 py-2 rounded-lg shadow-md transition ${
              actionDisabled
                ? "bg-gray-600 text-white cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </motion.div>
  );
}

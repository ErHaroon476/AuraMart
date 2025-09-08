"use client";

import { useCartStore } from "@/store/cartstore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const { items, removeItem, clearCart, addItem } = useCartStore();
  const [loading, setLoading] = useState(true);

  // Simulate loading for persisted cart items
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const increaseQuantity = (product: CartItem) => addItem(product);

  const decreaseQuantity = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      removeItem(id);
    } else {
      useCartStore.setState({
        items: items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      });
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <p className="text-gray-700">Loading cart items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-6 py-10 text-center"
      >
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty 🛒</h1>
        <Link
          href="/products"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-10"
    >
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl} // use Cloudinary URL from Firestore
                alt={item.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600">Rs. {item.discountedPrice}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Subtotal */}
            <p className="font-semibold w-20 text-right">
              Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
            </p>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Cart Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex justify-between items-center bg-white shadow p-6 rounded-xl"
      >
        <h2 className="text-xl font-bold">Total: Rs. {total.toFixed(2)}</h2>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Checkout
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

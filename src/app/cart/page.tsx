"use client";

import { useCartStore } from "@/store/cartstore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const { items, removeItem, clearCart, addItem } = useCartStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        <ShoppingCart className="mx-auto h-16 w-16 text-orange-500 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
          Your Cart is Empty 🛒
        </h1>

        <motion.button
          onClick={() => router.push("/products")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold px-8 sm:px-10 py-3 rounded-full shadow-lg hover:from-orange-400 hover:to-orange-600 transition-all duration-300"
        >
          View All Products
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-3 sm:px-6 py-6 sm:py-10"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Your Cart
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            {/* Product Info */}
            <div className="flex gap-4 items-start sm:items-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold leading-snug text-gray-800">
                  {item.title}
                </h2>
                <p className="text-orange-600 font-medium text-sm sm:text-base">
                  Rs. {item.discountedPrice}
                </p>
              </div>
            </div>

            {/* Controls + Price */}
            <div className="flex flex-wrap sm:flex-nowrap justify-between sm:justify-end items-center gap-3 w-full sm:w-auto">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-semibold text-sm sm:text-base text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQuantity(item)}
                  className="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Subtotal */}
              <p className="font-semibold text-sm sm:text-base text-gray-700">
                Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-orange-50 to-orange-100 shadow p-6 rounded-xl gap-4 border border-orange-200"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Total: <span className="text-orange-700">Rs. {total.toFixed(2)}</span>
        </h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.button
            onClick={clearCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Cart
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/checkout"
              className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-lg shadow-md hover:from-orange-500 hover:to-orange-700 transition-all text-center font-medium"
            >
              Checkout
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useCartStore } from "@/store/cartstore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, Home, MapPin } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Product } from "@/types/product";

// Shipping Info Type
interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  payment: "cod"; // only COD for now
}

// Cart Item Type
interface CartItem extends Product {
  quantity: number;
}

// Order Type for local receipt view
interface Order {
  id: string; // Firestore doc id
  orderNumber: string; // friendly number we store in Firestore for emails/UI
  items: CartItem[];
  total: number;
  delivery: number;
  finalTotal: number;
  shipping: ShippingInfo;
  createdAt: any;
  status: "pending" | "confirmed";
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const [form, setForm] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    payment: "cod",
  });

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  const delivery = total >= 2500 ? 0 : 199;
  const finalTotal = total + delivery;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    const required: (keyof ShippingInfo)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "zip",
    ];
    for (let field of required) {
      if (!form[field]) {
        alert(`⚠️ Please fill out ${field}`);
        return;
      }
    }

    // Friendly number for customer communications (also saved in Firestore)
    const orderNumber = "ORD-" + Date.now();

    const orderToSave = {
      items,
      total,
      delivery,
      finalTotal,
      shipping: form,
      createdAt: serverTimestamp(),
      status: "pending" as const,
      orderNumber,
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderToSave);

      clearCart();

      // For local receipt view
      setOrder({
        id: docRef.id, // Firestore doc id
        ...orderToSave,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while placing your order.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <p className="text-gray-700">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0 && !order) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 py-10 text-center"
      >
        <h1 className="text-3xl font-bold mb-4">No items to checkout 🛒</h1>
      </motion.div>
    );
  }

  // Receipt view
  if (order) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 py-10"
      >
        <h1 className="text-3xl font-bold mb-6">✅ Order Received</h1>
        <div className="bg-white shadow-lg p-6 rounded-xl space-y-4">
          <h2 className="text-2xl font-semibold mb-1">Order # {order.orderNumber}</h2>
          <p className="text-sm text-gray-500">Ref: {order.id}</p>

          <div>
            <h3 className="font-semibold mb-2">Customer Info</h3>
            <p>Name: {order.shipping.firstName} {order.shipping.lastName}</p>
            <p>Email: {order.shipping.email}</p>
            <p>Phone: {order.shipping.phone}</p>
            <p>Address: {order.shipping.address}, {order.shipping.city} - {order.shipping.zip}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 mt-4">Order Details</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.title} x {item.quantity}</span>
                <span>Rs. {(item.discountedPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>Rs. {order.delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>Rs. {order.finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Checkout Form view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10"
    >
      {/* Form */}
      <motion.div
        initial={{ x: -30 }}
        animate={{ x: 0 }}
        className="space-y-4 rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Shipping details</h2>
        <p className="mt-1 text-center text-xs text-red-700">
          ⚠️ Only orders from Punjab, Pakistan will be applicable. Confirmation messages will only be sent for Punjab
          orders.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
              <User className="text-gray-500" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleInputChange}
                className="w-full outline-none p-2"
              />
            </div>
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
              <User className="text-gray-500" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleInputChange}
                className="w-full outline-none p-2"
              />
            </div>
          </motion.div>
        </div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full outline-none p-2"
            />
          </div>
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
            <Phone className="text-gray-500" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleInputChange}
              className="w-full outline-none p-2"
            />
          </div>
        </motion.div>

        <motion.div whileFocus={{ scale: 1.02 }}>
          <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
            <Home className="text-gray-500" />
            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleInputChange}
              className="w-full outline-none p-2"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
              <MapPin className="text-gray-500" />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleInputChange}
                className="w-full outline-none p-2"
              />
            </div>
          </motion.div>
          <motion.div whileFocus={{ scale: 1.02 }}>
            <div className="flex items-center gap-2 border p-2 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
              <MapPin className="text-gray-500" />
              <input
                type="text"
                name="zip"
                placeholder="Zip / Postal Code"
                value={form.zip}
                onChange={handleInputChange}
                className="w-full outline-none p-2"
              />
            </div>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 mt-4"
        >
          Place Order (Cash on Delivery)
        </button>
     
      </motion.div>

     {/* Order Summary */}
<motion.div
  initial={{ x: 30 }}
  animate={{ x: 0 }}
  className="bg-white shadow-lg p-6 rounded-xl flex flex-col"
>
  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
  <div className="flex-1 overflow-y-auto space-y-4 max-h-[60vh]">
    {items.map((item) => (
      <div
        key={item.id}
        className="flex justify-between items-center border-b pb-3"
      >
        <div className="flex items-center gap-3">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
        </div>
        <p className="font-semibold">
          Rs. {(item.discountedPrice * item.quantity).toFixed(2)}
        </p>
      </div>
    ))}
  </div>

  <div className="mt-6 flex justify-between text-xl font-bold">
    <span>Subtotal:</span>
    <span>Rs. {total.toFixed(2)}</span>
  </div>
  <div className="flex justify-between text-lg mt-2">
    <span>Delivery:</span>
    <span>Rs. {delivery.toFixed(2)}</span>
  </div>

  {/* Hint for free delivery */}
{total < 2500 ? (
  <p className="text-lg text-orange-800 mt-1">
    Free delivery on orders above Rs. 2500
  </p>
) : (
  <p className="text-lg text-green-800 font-semibold mt-1">
    You got free delivery 🎉
  </p>
)}
  <div className="flex justify-between text-xl font-bold mt-2">
    <span>Total:</span>
    <span>Rs. {finalTotal.toFixed(2)}</span>
  </div>
</motion.div>

    </motion.div>
  );
}

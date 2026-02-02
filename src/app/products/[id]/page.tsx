"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartstore";
import { ShoppingCart, Zap, ArrowLeft } from "lucide-react"; // Lucide icons

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Product, "id">;
          setProduct({ id: docSnap.id, ...data });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-lg text-slate-500 animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">
          Product not found
        </h1>
        <button
          className="mx-auto flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-emerald-500"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert("✅ Product added to cart!");
  };

  const handleCheckout = () => {
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Back Button */}
      <button
        className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-600 transition hover:text-slate-900"
        onClick={() => router.push("/products")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </button>

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="w-full overflow-hidden rounded-3xl bg-slate-50 shadow-xl">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full rounded-3xl object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Title */}
          <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
            {product.title}
          </h1>

          {/* Category */}
          <p className="text-xs text-slate-500">
            Category:{" "}
            <span className="font-medium capitalize text-emerald-600">
              {product.category}
            </span>
          </p>

          {/* Featured Tag */}
          {product.featured && (
            <span className="inline-block w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 shadow-sm">
              ★ Featured product
            </span>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-emerald-600">
              Rs. {product.discountedPrice}
            </span>
            {product.discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-lg text-slate-400 line-through">
                  Rs. {product.actualPrice}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-600">
                  -{product.discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm leading-relaxed text-slate-700">
              {product.description}
            </p>
          )}

          {/* Specs */}
          {product.specs?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Specifications
              </h3>
              <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
                {product.specs.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {product.benefits?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Benefits
              </h3>
              <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-emerald-500 md:flex-none"
            >
              <ShoppingCart className="h-5 w-5" /> Add to cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 md:flex-none"
            >
              <Zap className="h-5 w-5" /> Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartstore";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      {/* Wrap clickable content in Link */}
      <Link href={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:h-48 md:h-56">
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-slate-100"
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: "cover",
              filter: "blur(18px)",
            }}
          />

          {/* Main image */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="relative h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-md">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-2 text-sm font-semibold sm:mt-3 sm:text-base line-clamp-2 text-slate-900 transition group-hover:text-slate-700">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-1">
          {product.discountedPrice < product.actualPrice ? (
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-emerald-600 sm:text-base">
                Rs. {product.discountedPrice}
              </p>
              <p className="text-xs text-slate-400 line-through sm:text-sm">
                Rs. {product.actualPrice}
              </p>
            </div>
          ) : (
            <p className="text-sm font-bold text-slate-900 sm:text-base">
              Rs. {product.actualPrice}
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
        }}
        className="mt-3 w-full rounded-full bg-emerald-600 px-2 py-1 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-500"
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}

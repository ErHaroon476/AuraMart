"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartstore";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="group border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white max-w-xs">
      {/* Wrap clickable content in Link */}
      <Link href={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative w-full h-48 md:h-56 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {/* Blurred background for small images */}
          <div
            className="absolute inset-0 bg-gray-200"
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: "cover",
              filter: "blur(20px)",
            }}
          ></div>

          {/* Main image */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="relative w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mt-3 group-hover:text-orange-600 transition">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-1">
          {product.discountedPrice < product.actualPrice ? (
            <div className="flex items-center gap-2">
              <p className="text-red-600 font-bold">
                Rs. {product.discountedPrice}
              </p>
              <p className="text-gray-500 line-through text-sm">
                Rs. {product.actualPrice}
              </p>
            </div>
          ) : (
            <p className="text-gray-800 font-bold">Rs. {product.actualPrice}</p>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent Link click
          addToCart(product);
        }}
        className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md transition"
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}

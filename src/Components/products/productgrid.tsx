"use client";

import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import ProductCard from "../products/productcard";

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 col-span-full">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="cursor-pointer"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartstore";

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
      <div className="container mx-auto px-6 py-16 text-center">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition"
          onClick={() => router.push("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert("✅ Product added to cart!");
  };

  const handleCheckout = () => {
    addToCart(product); // optionally add before checkout
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        className="mb-6 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition"
        onClick={() => router.push("/products")}
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image with Hover Zoom */}
        <div className="w-full overflow-hidden rounded-2xl shadow-lg">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900">
            {product.title}
          </h1>

          {/* Category */}
          <p className="text-sm text-gray-500 capitalize">
            Category:{" "}
            <span className="font-medium text-orange-600">
              {product.category}
            </span>
          </p>

          {/* Featured Tag */}
          {product.featured && (
            <span className="inline-block bg-yellow-100 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
              ★ Featured Product
            </span>
          )}

          {/* Price Section */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-orange-700">
              Rs. {product.discountedPrice}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-gray-400 line-through">
                  Rs. {product.actualPrice}
                </span>
                <span className="text-red-600 font-semibold">
                  -{product.discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Specifications */}
          {product.specs?.length > 0 && (
            <div>
              <h3 className="font-semibold mt-2 mb-1 text-orange-700">
                Specifications:
              </h3>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {product.specs.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {product.benefits?.length > 0 && (
            <div>
              <h3 className="font-semibold mt-2 mb-1 text-orange-700">
                Benefits:
              </h3>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition shadow-md"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition shadow-md"
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

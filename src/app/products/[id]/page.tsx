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
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-full hover:from-orange-700 hover:to-orange-800 transition shadow-md flex items-center gap-2 mx-auto"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
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
    <div className="container mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-900 transition"
        onClick={() => router.push("/products")}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="w-full rounded-3xl overflow-hidden shadow-xl bg-gray-50">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover rounded-3xl transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Category */}
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-orange-600 capitalize">
              {product.category}
            </span>
          </p>

          {/* Featured Tag */}
          {product.featured && (
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full w-fit shadow-sm">
              ★ Featured Product
            </span>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-orange-700">
              Rs. {product.discountedPrice}
            </span>
            {product.discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-lg">
                  Rs. {product.actualPrice}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-full">
                  -{product.discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Specs */}
          {product.specs?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-orange-700">
                Specifications
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
              <h3 className="font-semibold text-lg mb-2 text-orange-700">
                Benefits
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
              className="flex items-center justify-center gap-2 flex-1 md:flex-none bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-full font-medium hover:from-orange-700 hover:to-orange-800 transition shadow-md"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex items-center justify-center gap-2 flex-1 md:flex-none bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition shadow-md"
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

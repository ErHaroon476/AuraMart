"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductGrid from "@/Components/products/productgrid";
import { Product } from "@/types/product";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const categories = [
  { name: "All Products", slug: "all" },
  { name: "Facial Care", slug: "facial-care" },
  { name: "Skin Care", slug: "skincare" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Perfumes & Body Sprays", slug: "perfumes" },
  { name: "Parlour Items", slug: "parlour-items" },
];

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();

  // ✅ Only run on client
  useEffect(() => {
    setMounted(true);

    const query = searchParams.get("search")?.toLowerCase() || "";
    setSearchQuery(query);

    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedProducts: Product[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Product)
      );

      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchParams]);

  if (!mounted) {
    // Render nothing until mounted
    return null;
  }

  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (p.category &&
        p.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory);

    const matchesSearch =
      searchQuery === "" || p.title.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <motion.button
            key={cat.slug}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full font-semibold transition-all border shadow-sm ${
              selectedCategory === cat.slug
                ? "bg-gradient-to-r from-orange-700 to-orange-900 text-white border-orange-900 shadow-md"
                : "bg-white text-orange-900 border-orange-300 hover:bg-orange-700 hover:text-white hover:border-orange-700"
            }`}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No products found.
        </p>
      )}
    </div>
  );
}

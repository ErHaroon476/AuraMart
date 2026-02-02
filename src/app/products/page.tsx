"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import ProductGrid from "@/Components/products/productgrid";
import { Product } from "@/types/product";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";

const categories = [
  { name: "All Products", slug: "all" },
  { name: "Facial Care", slug: "facial-care" },
  { name: "Skin Care", slug: "skincare" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Perfumes & Body Sprays", slug: "perfumes" },
  { name: "Baby Care", slug: "baby-care" },
];

function ProductsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔹 Fetch products and set searchQuery from URL
  useEffect(() => {
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

  // 🔹 Filtered products based on category + search query
  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (p.category &&
        p.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory);

    const matchesSearch =
      searchQuery === "" || p.title.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  // 🔹 Handle category click
  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);

    // If "All Products", clear search query from URL
    if (slug === "all" && searchQuery) {
      router.push("/products");
      setSearchQuery("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-slate-900">
        All products
      </h1>
      <p className="mb-8 text-center text-sm text-slate-500">
        Browse our full collection or filter by category.
      </p>

      {/* Category Buttons */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <motion.button
            key={cat.slug}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all ${
              selectedCategory === cat.slug
                ? "bg-emerald-600 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
            }`}
            onClick={() => handleCategoryClick(cat.slug)}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading products...</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}

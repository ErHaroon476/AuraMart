"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProductGrid from "@/Components/products/productgrid";
import { Product } from "@/types/product";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

import { ShieldCheck, LucideTimer, Truck, ThumbsUp } from "lucide-react";


const banners = ["/B1.jpg","/B2.png","/B3.jpeg","/B4.webp"];

const categories = [
  { name: "Skincare", slug: "skincare", img: "/skincare.png" },
  { name: "Facial Care", slug: "facial-care", img: "/facialcare.png" },
  { name: "Hair Care", slug: "hair-care", img: "/haircare.png" },
  { name: "Scents", slug: "perfumes", img: "/perfume.png" },
  { name: "Baby Care", slug: "baby-care", img: "/babycare.jpeg" },
];

export default function LandingPage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("skincare");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts: Product[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Filter products by category
  const filteredProducts: Product[] =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  // 🔹 Featured products
  const featuredProducts: Product[] = products.filter((p) => p.featured);

  // 🔹 Banner rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative space-y-16">
      {/* Hero / Banner */}
      <section className="relative flex w-full items-center justify-center">

  {/* Soft glow behind banner */}
  <motion.div
    key={currentBanner}
    className="absolute inset-0 -z-10"
    style={{
      backgroundImage: `url(${banners[currentBanner]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(70px)", // softer blur
      opacity: 0.4,         // lighter so it blends
      transform: "scale(1.1)", // spread just outside banner
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4 }}
    transition={{ duration: 2.0 }}
  />

  {/* Banner Container */}
  <div className="relative z-10 flex w-full max-w-6xl cursor-pointer items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
    <AnimatePresence mode="wait">
      <motion.img
        key={currentBanner}
        src={banners[currentBanner]}
        alt={`Banner ${currentBanner + 1}`}
        className="h-full w-full max-h-[480px] rounded-3xl object-contain lg:object-cover"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
        onClick={() => router.push("/products")}
      />
    </AnimatePresence>

    {/* Dots */}
    <div className="absolute bottom-4 z-20 flex w-full justify-center gap-2">
      {banners.map((_, index) => (
        <motion.div
          key={index}
          onClick={() => setCurrentBanner(index)}
          className={`h-2.5 rounded-full cursor-pointer transition-all ${
            currentBanner === index
              ? "w-6 bg-gradient-to-r from-orange-400 to-orange-600 shadow-md"
              : "w-2.5 bg-white/60 hover:bg-white"
          }`}
          initial={false}
          animate={{
            scale: currentBanner === index ? 1.2 : 1,
          }}
        />
      ))}
    </div>
  </div>
</section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto mb-16 max-w-6xl px-4 md:px-6">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Featured products
          </h2>
          <p className="mb-8 text-center text-sm text-slate-500">
            Hand-picked bestsellers and customer favorites from AuraMart.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductGrid products={featuredProducts} />
          </motion.div>
        </section>
      )}
  <section className="border-y border-slate-200 bg-white/70 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 text-center md:grid-cols-4 gap-10">
     
     
        {/* Authentic products */}
   <div className="flex flex-col items-center gap-4">
     <ShieldCheck className="h-12 w-12 text-emerald-600" strokeWidth={1.6} />
     <p className="text-base font-semibold text-slate-900">100% genuine products</p>
   </div>

   {/* fast delivery */}
   <div className="flex flex-col items-center gap-4">
     <LucideTimer className="h-12 w-12 text-emerald-600" strokeWidth={1.6} />
     <p className="text-base font-semibold text-slate-900">Fast dispatch</p>
   </div>

   {/* Free Delivery */}
   <div className="flex flex-col items-center gap-4">
     <Truck className="h-12 w-12 text-emerald-600" strokeWidth={1.6} />
     <p className="text-base font-semibold text-slate-900">
       Free delivery over Rs. 2,000
     </p>
   </div>

   {/* Customers */}
   <div className="flex flex-col items-center gap-4">
     <ThumbsUp className="h-12 w-12 text-emerald-600" strokeWidth={1.6} />
     <p className="text-base font-semibold text-slate-900">
       10,000+ happy customers
     </p>
   </div>

     
     
     
      </div>
    </section>

{/* Categories */}
<section className="mb-16 text-center">
  <h2 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
    Shop by category
  </h2>
  <p className="mb-8 text-sm text-slate-500">
    Explore skincare, haircare, fragrances and more tailored for you.
  </p>

  <div className="flex flex-wrap justify-center gap-4 px-4 sm:gap-6 md:gap-8">
    {categories.map((cat, idx) => (
      <motion.div
        key={cat.slug}
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1, duration: 0.4 }}
        className={`flex flex-col items-center cursor-pointer transition-all ${
          selectedCategory === cat.slug ? "scale-110" : ""
        }`}
        onClick={() => setSelectedCategory(cat.slug)}
      >
        <div className="relative">
          <img
            src={cat.img}
            alt={cat.name}
            className="h-12 w-12 rounded-full border-2 border-emerald-500 p-1 shadow-md transition sm:h-14 sm:w-14 md:h-16 md:w-16"
          />
          {selectedCategory === cat.slug && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white shadow-md">
              Active
            </span>
          )}
        </div>
        <span className="mt-2 text-xs font-semibold text-slate-900 sm:text-sm md:text-base">
          {cat.name}
        </span>
      </motion.div>
    ))}
  </div>
</section>

      {/* Filtered Products */}
      <section className="mx-auto mb-16 max-w-6xl px-4 md:px-6">
        <h2 className="mb-2 text-center text-2xl font-semibold capitalize tracking-tight text-slate-900 md:text-3xl">
          {selectedCategory === "all"
            ? "All Products"
            : `${selectedCategory.replace("-", " ")} Products`}
        </h2>
        {loading ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading products...
          </p>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p className="mt-10 text-center text-sm text-slate-500">
            No products found in this category.
          </p>
        )}
      </section>

{/* View All Products */}
<div className="mb-20 text-center">
  <motion.button
    onClick={() => router.push("/products")}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-10 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-emerald-500"
  >
    View all products
  </motion.button>
</div>

    </div>
  );
}

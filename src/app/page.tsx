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
    <div className="relative">
<div className="relative w-full flex justify-center items-center mb-12">

  {/* Leakage Glow Limited to Banner Area */}
  <motion.div
    key={currentBanner}
    className="absolute inset-0 -z-10"
    style={{
      backgroundImage: `url(${banners[currentBanner]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(50px)", // softer blur
      opacity: 0.8,         // lighter so it blends
      transform: "scale(1.1)", // spread just outside banner
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4 }}
    transition={{ duration: 2.0 }}
  />

  {/* Banner Container */}
  <div className="relative w-full flex justify-center items-center rounded-3xl overflow-hidden shadow-xl cursor-pointer max-w-6xl z-10">
    <AnimatePresence mode="wait">
      <motion.img
        key={currentBanner}
        src={banners[currentBanner]}
        alt={`Banner ${currentBanner + 1}`}
        className="w-full max-h-[500px] rounded-3xl object-contain lg:object-cover"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
        onClick={() => router.push("/products")}
      />
    </AnimatePresence>

    {/* Dots */}
    <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
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
</div>

   {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-orange-900">
            Featured Products
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductGrid products={featuredProducts} />
          </motion.div>
        </section>
      )}
  <section className="py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-18 text-center">
     
     
        {/* Authentic products */}
   <div className="flex flex-col items-center gap-8">
     <ShieldCheck className="w-12 h-12 text-gray-600" strokeWidth={1.3} />
     <p className="text-lg font-semibold text-gray-700">100% Genuine Products</p>
   </div>

   {/* fast delivery */}
   <div className="flex flex-col items-center gap-8">
     <LucideTimer className="w-12 h-12 text-gray-600" strokeWidth={1.3} />
     <p className="text-lg font-semibold text-gray-700">Fast Delivery</p>
   </div>

   {/* Free Delivery */}
   <div className="flex flex-col items-center gap-8">
     <Truck className="w-12 h-12 text-gray-600" strokeWidth={1.3} />
     <p className="text-lg font-semibold text-gray-700">
       Free Delivery Over 2000 Shopping
     </p>
   </div>

   {/* Customers */}
   <div className="flex flex-col items-center gap-8">
     <ThumbsUp className="w-12 h-12 text-gray-600" strokeWidth={1.3} />
     <p className="text-lg font-semibold text-gray-700">
       10,000+ Happy Customers
     </p>
   </div>

     
     
     
      </div>
    </section>
{/* Categories */}
<section className="mb-16 text-center">
  <h2 className="text-2xl md:text-3xl font-bold mb-8 text-orange-900">
    Shop by Category
  </h2>

  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-4">
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
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-orange-700 p-1 shadow-md transition"
          />
          {selectedCategory === cat.slug && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-700 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
              Active
            </span>
          )}
        </div>
        <span className="mt-2 font-semibold text-xs sm:text-sm md:text-base text-orange-900">
          {cat.name}
        </span>
      </motion.div>
    ))}
  </div>
</section>

      {/* Filtered Products */}
      <section className="container mx-auto px-4 md:px-6 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center capitalize">
          {selectedCategory === "all"
            ? "All Products"
            : `${selectedCategory.replace("-", " ")} Products`}
        </h2>
        {loading ? (
          <p className="text-center text-gray-500 mt-10 text-orange-900">Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No products found in this category.
          </p>
        )}
      </section>
{/* View All Products */}
<div className="text-center mb-20">
  <motion.button
    onClick={() => router.push("/products")}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-r from-orange-700 to-orange-900 text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-800 transition-all duration-300"
  >
    View All Products
  </motion.button>
</div>

    </div>
  );
}

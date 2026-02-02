"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartstore";
import { ShoppingCart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { Product } from "@/types/product";

export default function Navbar() {
  const cartCount = useCartStore((state) => state.items.length);
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/support", label: "Support" },
    { href: "/aboutus", label: "About Us" },
  ];

  // 🔹 Fetch products
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedProducts: Product[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Product)
      );
      setProducts(fetchedProducts);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Filter suggestions
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 6));
  }, [query, products]);

  // 🔹 Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  // 🔹 Handle suggestion click
  const handleSuggestionClick = (title: string) => {
    router.push(`/products?search=${encodeURIComponent(title)}`);
    setQuery("");
    setSuggestions([]);
  };

  // 🔹 Handle "All Products" click → show all products
  const handleAllProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/products");
    setQuery("");
    setSuggestions([]);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 sm:px-6 py-2 sm:py-3 relative">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Image
            src="/logo.jpg"
            alt="AAMart Logo"
            width={36}
            height={36}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md border border-emerald-500/40"
          />
          <span className="text-lg sm:text-xl font-semibold tracking-tight text-slate-50 select-none">
            <span className="text-emerald-400">Aura</span>Mart
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-36 sm:w-52 md:w-64 lg:w-80">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-slate-700 bg-slate-900/60 pl-3 pr-9 py-1.5 text-xs sm:text-sm outline-none text-slate-100 placeholder:text-slate-400 shadow-inner focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
{/* Suggestions Dropdown */}
{suggestions.length > 0 && (
  <div
    className="absolute left-0 right-0 mt-1 rounded-lg border border-slate-800 bg-slate-900/95 shadow-xl backdrop-blur max-h-60 overflow-y-auto z-50"
  >
    {suggestions.map((p) => (
      <div
        key={p.id}
        onClick={() => handleSuggestionClick(p.title)}
        className="px-3 py-2 text-xs sm:text-sm text-slate-100 hover:bg-slate-800/80 cursor-pointer flex justify-between items-start gap-2"
      >
        {/* Title side */}
        <span className="whitespace-normal break-words flex-1 leading-snug">
          {p.title}
        </span>

        {/* Price side */}
        <div className="text-right text-xs sm:text-sm shrink-0">
          {p.discountedPrice < p.actualPrice ? (
            <>
              <span className="text-emerald-400 font-semibold block">
                Rs {p.discountedPrice}
              </span>
              <span className="text-slate-500 line-through text-[10px] sm:text-xs">
                Rs {p.actualPrice}
              </span>
            </>
          ) : (
            <span className="text-emerald-400 font-semibold">
              Rs {p.actualPrice}
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
)}

</div>

        {/* Links + Cart */}
        <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-8 mt-2 sm:mt-0">
          {links.map((link) => {
            // If "Products", handle special "All Products" click
            const isProducts = link.href === "/products";
            return (
              <Link
                key={link.href}
                href={isProducts ? "#" : link.href}
                onClick={isProducts ? handleAllProductsClick : undefined}
                className={`relative text-sm sm:text-base font-medium transition-all duration-300 ${
                  pathname === link.href && (!isProducts || query === "")
                    ? "text-emerald-300"
                    : "text-slate-100 hover:text-emerald-300"
                } group`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full transition-all duration-500 ease-out ${
                    pathname === link.href && (!isProducts || query === "")
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-1.5 sm:p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md"
          >
            <ShoppingCart className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

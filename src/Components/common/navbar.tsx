"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartstore";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const cartCount = useCartStore((state) => state.items.length);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/support", label: "Support" },
    { href: "/aboutus", label: "About Us" },
  ];

  return (
    <nav className="bg-orange-900 shadow-xl rounded-b-2xl sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 sm:py-3">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Image
            src="/logo.jpg"
            alt="AAMart Logo"
            width={30}
            height={30}
            className="sm:w-12 sm:h-12 rounded-full border border-transparent shadow-[0_0_20px_rgba(255,140,66,0.6)]"
          />
          <span className="text-lg sm:text-xl font-bold tracking-wide text-white select-none">
            AA
            <span className="text-orange-400 drop-shadow-[0_0_10px_rgba(255,140,66,0.7)]">
              Mart
            </span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center space-x-3 sm:space-x-5 md:space-x-8 mt-2 sm:mt-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm sm:text-base font-medium transition-all duration-300 ${
                pathname === link.href
                  ? "text-orange-300"
                  : "text-orange-100 hover:text-orange-300"
              } group`}
            >
              {link.label}
              {/* Animated underline */}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full transition-all duration-500 ease-out
                ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
          ))}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-1.5 sm:p-2 rounded-full bg-orange-800 hover:bg-orange-700 transition-colors shadow-md"
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

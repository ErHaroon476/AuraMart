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
  ];

  return (
    <nav className="bg-orange-900 shadow-xl rounded-b-2xl sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.jpg"
            alt="AAMart Logo"
            width={48}
            height={48}
            className="rounded-full border border-transparent shadow-[0_0_20px_rgba(255,140,66,0.6)]"
          />
          <span className="text-xl font-bold tracking-wide text-white select-none">
            AA
            <span className="text-orange-400 drop-shadow-[0_0_10px_rgba(255,140,66,0.7)]">
            Mart
            </span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-base font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "text-orange-300"
                  : "text-orange-100 hover:text-orange-300"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute left-0 -bottom-1 w-full h-1 bg-orange-300 rounded-full"></span>
              )}
            </Link>
          ))}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full bg-orange-800 hover:bg-orange-700 transition-colors shadow-md"
          >
            <ShoppingCart className="text-white w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useCart } from "@/context/CardContext";

export default function CartIcon() {
  const { totalItems, loading } = useCart();

  return (
    <Link href="/cart" className="relative flex items-center gap-2">
      <div className="relative">
        <span className="text-2xl">🛒</span>

        {!loading && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>

      <span className="font-medium">Cart</span>
    </Link>
  );
}

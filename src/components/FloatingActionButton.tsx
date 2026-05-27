"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingActionButton() {
  const pathname = usePathname();

  // Only show on helpers page
  if (!pathname.startsWith("/helpers")) {
    return null;
  }

  return (
    <Link
      href="/helpers/add"
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all duration-200 transform hover:scale-110 z-50"
      title="Add new helper"
    >
      +
    </Link>
  );
}

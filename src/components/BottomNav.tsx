"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", path: "/dashboard", icon: "🏠" },
  { name: "Helpers", path: "/helpers", icon: "👥" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto px-0 flex items-center justify-around h-20">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-blue-600 border-t-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

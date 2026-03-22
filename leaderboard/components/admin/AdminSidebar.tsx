"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/contributions", label: "Contribuciones", icon: "📝" },
  { href: "/admin/persons", label: "Personas", icon: "👥" },
  { href: "/admin/types", label: "Tipos", icon: "🏷️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="text-lg font-bold">
          Leaderboard
        </Link>
        <p className="text-xs text-gray-400 mt-1">Panel Admin</p>
      </div>

      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-gray-800 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        {session?.user?.email && (
          <p className="text-xs text-gray-500 mb-2 truncate" title={session.user.email}>
            {session.user.email}
          </p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

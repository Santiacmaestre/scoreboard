"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { status } = useSession();

  // Login and unauthorized pages render without the admin shell
  if (pathname === "/admin/login" || pathname === "/admin/unauthorized") {
    return <>{children}</>;
  }

  // Show loading spinner while session is being resolved.
  // This prevents the race condition: we NEVER redirect or show errors
  // until the auth state is fully resolved.
  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">Cargando sesión...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const { status } = useSession();

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">Cargando sesión...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/admin/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

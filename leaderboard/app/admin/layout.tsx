import AdminSidebar from "@/components/admin/AdminSidebar";
import SessionProvider from "@/components/admin/SessionProvider";

export const metadata = {
  title: "Admin — Leaderboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </SessionProvider>
  );
}

"use client";

import { signOut, useSession } from "next-auth/react";

export default function UnauthorizedPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const handleTryAnotherAccount = async () => {
    // 1. Invalidate NextAuth session
    await signOut({ redirect: false });

    // 2. Clear all client-side storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage access errors
    }

    // 3. Server-side logout clears cookies + Cognito session, then redirects to /admin/login
    window.location.href = "/api/auth/logout";
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-400 text-sm">Verificando permisos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Acceso no autorizado
        </h1>

        <p className="text-sm text-gray-600 mb-1">
          No tienes permisos de administrador.
        </p>

        {email ? (
          <p className="text-sm text-gray-500 mb-6">
            Tu cuenta{" "}
            <span className="font-medium text-gray-700">{email}</span> no está
            autorizada para acceder al panel de administración.
          </p>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            Tu cuenta no está autorizada para acceder al panel de
            administración.
          </p>
        )}

        <button
          onClick={handleTryAnotherAccount}
          className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Intentar con otra cuenta
        </button>
      </div>
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-6">
          Inicia sesión para acceder al panel de administración
        </p>

        {error === "AccessDenied" && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            Tu cuenta no tiene permisos de administrador.
          </div>
        )}

        {error && error !== "AccessDenied" && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg p-3 mb-4">
            Error de autenticación: <code className="font-mono text-xs">{error}</code>
          </div>
        )}

        <button
          onClick={() => {
            if (error === "AccessDenied") {
              window.location.href = "/api/auth/logout?relogin=true";
            } else {
              signIn("cognito", { callbackUrl: "/admin", redirect: true });
            }
          }}
          className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {error === "AccessDenied"
            ? "Intentar con otra cuenta"
            : "Iniciar sesión con Google"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

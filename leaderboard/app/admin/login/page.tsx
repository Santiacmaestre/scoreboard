"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // If there's an error param but user didn't explicitly try to login,
    // it's likely from a Cognito logout redirect — clean the URL silently
    if (error && !sessionStorage.getItem("login_attempted")) {
      router.replace("/admin/login");
      return;
    }
    if (error) {
      setShowError(true);
      sessionStorage.removeItem("login_attempted");
    }
  }, [error, router]);

  function handleLogin() {
    sessionStorage.setItem("login_attempted", "true");
    signIn("cognito", { callbackUrl: "/admin", redirect: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-6">
          Inicia sesión para acceder al panel de administración
        </p>

        {showError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error === "AccessDenied"
              ? "Tu cuenta no tiene permisos de administrador."
              : "Error al iniciar sesión. Intenta de nuevo."}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Iniciar sesión con Google
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

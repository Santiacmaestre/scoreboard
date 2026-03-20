"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-6">
          Inicia sesión para acceder al panel de administración
        </p>
        <button
          onClick={() => signIn("cognito", { callbackUrl: "/admin" })}
          className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";
import {
  MOCK_CONTRIBUTORS,
  MOCK_LEADERS,
} from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export default function PersonsPage() {
  const [persons, setPersons] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      setPersons([...MOCK_CONTRIBUTORS, ...MOCK_LEADERS]);
      setLoading(false);
      return;
    }

    Promise.all([
      fetch("/api/leaderboard?type=contributors").then((r) => r.json()),
      fetch("/api/leaderboard?type=leaders").then((r) => r.json()),
    ])
      .then(([contribJson, leadersJson]) => {
        setPersons([
          ...(contribJson.data || []),
          ...(leadersJson.data || []),
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(person: UserProfile) {
    if (
      !confirm(
        `¿Eliminar a "${person.name}" y todas sus contribuciones? Esta acción no se puede deshacer.`
      )
    )
      return;

    if (USE_MOCK) {
      setPersons((prev) => prev.filter((p) => p.userId !== person.userId));
      return;
    }

    try {
      const res = await fetch(`/api/users/${person.userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPersons((prev) => prev.filter((p) => p.userId !== person.userId));
      }
    } catch (err) {
      console.error("Error deleting person:", err);
    }
  }

  async function handleChangeSection(person: UserProfile) {
    const newSection =
      person.section === "contributors" ? "leaders" : "contributors";
    const label =
      newSection === "leaders" ? "Líderes" : "Contribuidores";

    if (!confirm(`¿Mover a "${person.name}" a ${label}?`)) return;

    if (USE_MOCK) {
      setPersons((prev) =>
        prev.map((p) =>
          p.userId === person.userId ? { ...p, section: newSection } : p
        )
      );
      return;
    }

    try {
      const res = await fetch(`/api/users/${person.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: newSection }),
      });
      if (res.ok) {
        setPersons((prev) =>
          prev.map((p) =>
            p.userId === person.userId ? { ...p, section: newSection } : p
          )
        );
      }
    } catch (err) {
      console.error("Error changing section:", err);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Personas</h1>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Cargando...
          </div>
        ) : persons.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No hay personas registradas
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Sección
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">
                  Puntos
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">
                  Contribuciones
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...persons]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((person) => (
                  <tr key={person.userId} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: person.avatarColor }}
                        >
                          {person.initials}
                        </span>
                        <span className="font-medium text-gray-900">
                          {person.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          person.section === "leaders"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {person.section === "leaders"
                          ? "Líder"
                          : "Contribuidor"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {person.totalPoints}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {person.totalContributions}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleChangeSection(person)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          title={
                            person.section === "contributors"
                              ? "Promover a Líder"
                              : "Mover a Contribuidor"
                          }
                        >
                          {person.section === "contributors"
                            ? "→ Líder"
                            : "→ Contribuidor"}
                        </button>
                        <button
                          onClick={() => handleDelete(person)}
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

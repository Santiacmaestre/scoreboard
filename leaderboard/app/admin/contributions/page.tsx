"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Contribution, ContributionTypeConfig } from "@/lib/types";
import {
  MOCK_CONTRIBUTIONS,
  MOCK_CONTRIBUTION_TYPES,
} from "@/lib/mock-data";
import ContributionTable from "@/components/admin/ContributionTable";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [types, setTypes] = useState<ContributionTypeConfig[]>([]);

  useEffect(() => {
    if (USE_MOCK) {
      setContributions(
        Object.values(MOCK_CONTRIBUTIONS)
          .flat()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
      setTypes(MOCK_CONTRIBUTION_TYPES);
      return;
    }

    Promise.all([
      fetch("/api/contributions").then((r) => r.json()),
      fetch("/api/types").then((r) => r.json()),
    ])
      .then(([contribJson, typesJson]) => {
        setContributions(contribJson.data || []);
        setTypes(typesJson.data || []);
      })
      .catch(console.error);
  }, []);

  async function handleDelete(contrib: Contribution) {
    if (!confirm(`¿Eliminar "${contrib.title}"?`)) return;

    if (USE_MOCK) {
      setContributions((prev) => prev.filter((c) => c.id !== contrib.id));
      return;
    }

    try {
      await fetch(`/api/contributions/${contrib.userId}:${contrib.id}`, {
        method: "DELETE",
      });
      setContributions((prev) => prev.filter((c) => c.id !== contrib.id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contribuciones</h1>
        <Link
          href="/admin/contributions/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Nueva contribución
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <ContributionTable
          contributions={contributions}
          types={types}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ContributionTypeConfig } from "@/lib/types";
import { MOCK_CONTRIBUTION_TYPES } from "@/lib/mock-data";
import TypeManager from "@/components/admin/TypeManager";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export default function TypesPage() {
  const [types, setTypes] = useState<ContributionTypeConfig[]>([]);

  useEffect(() => {
    if (USE_MOCK) {
      setTypes(MOCK_CONTRIBUTION_TYPES);
      return;
    }
    fetch("/api/types")
      .then((r) => r.json())
      .then((json) => setTypes(json.data || []))
      .catch(console.error);
  }, []);

  async function handleSave(
    data: Omit<ContributionTypeConfig, "active" | "createdAt">
  ) {
    if (USE_MOCK) {
      setTypes((prev) => [
        ...prev,
        { ...data, active: true, createdAt: new Date().toISOString() },
      ]);
      return;
    }

    try {
      const res = await fetch("/api/types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.data) setTypes((prev) => [...prev, json.data]);
    } catch (err) {
      console.error("Error creating type:", err);
    }
  }

  async function handleUpdate(
    slug: string,
    data: Partial<ContributionTypeConfig>
  ) {
    if (USE_MOCK) {
      setTypes((prev) =>
        prev.map((t) => (t.slug === slug ? { ...t, ...data } : t))
      );
      return;
    }

    try {
      await fetch(`/api/types/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setTypes((prev) =>
        prev.map((t) => (t.slug === slug ? { ...t, ...data } : t))
      );
    } catch (err) {
      console.error("Error updating type:", err);
    }
  }

  async function handleDeactivate(slug: string) {
    if (!confirm("¿Desactivar este tipo?")) return;

    if (USE_MOCK) {
      setTypes((prev) => prev.filter((t) => t.slug !== slug));
      return;
    }

    try {
      await fetch(`/api/types/${slug}`, { method: "DELETE" });
      setTypes((prev) => prev.filter((t) => t.slug !== slug));
    } catch (err) {
      console.error("Error deactivating type:", err);
    }
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <TypeManager
          types={types}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onDeactivate={handleDeactivate}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Contribution, ContributionTypeConfig } from "@/lib/types";

interface EditContributionModalProps {
  contribution: Contribution;
  types: ContributionTypeConfig[];
  onSave: (updated: Contribution) => void;
  onClose: () => void;
}

export default function EditContributionModal({
  contribution,
  types,
  onSave,
  onClose,
}: EditContributionModalProps) {
  const [typeSlug, setTypeSlug] = useState(contribution.typeSlug);
  const [title, setTitle] = useState(contribution.title);
  const [description, setDescription] = useState(contribution.description || "");
  const [points, setPoints] = useState(String(contribution.points));
  const [date, setDate] = useState(contribution.date);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const pointsNum = Number(points);
    if (!pointsNum || pointsNum <= 0) {
      setError("Los puntos deben ser un número positivo");
      return;
    }
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        `/api/contributions/${contribution.userId}:${contribution.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            typeSlug,
            title: title.trim(),
            description: description.trim() || undefined,
            points: pointsNum,
            date,
          }),
        }
      );

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Error al guardar");
        setSaving(false);
        return;
      }

      onSave({
        ...contribution,
        typeSlug,
        title: title.trim(),
        description: description.trim() || undefined,
        points: pointsNum,
        date,
      });
    } catch {
      setError("Error de conexión");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Editar contribución
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              value={typeSlug}
              onChange={(e) => setTypeSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              required
            >
              {types.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos *
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ContributionTypeConfig, AppliesTo } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface TypeManagerProps {
  types: ContributionTypeConfig[];
  onSave: (type: Omit<ContributionTypeConfig, "active" | "createdAt">) => void;
  onUpdate: (slug: string, data: Partial<ContributionTypeConfig>) => void;
  onDeactivate: (slug: string) => void;
}

export default function TypeManager({
  types,
  onSave,
  onUpdate,
  onDeactivate,
}: TypeManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [appliesTo, setAppliesTo] = useState<AppliesTo>("both");
  const [colorDot, setColorDot] = useState("#378ADD");
  const [colorBadgeBg, setColorBadgeBg] = useState("#E6F1FB");
  const [colorBadgeText, setColorBadgeText] = useState("#185FA5");

  function resetForm() {
    setName("");
    setSlug("");
    setAppliesTo("both");
    setColorDot("#378ADD");
    setColorBadgeBg("#E6F1FB");
    setColorBadgeText("#185FA5");
    setEditingSlug(null);
    setShowForm(false);
  }

  function handleEdit(t: ContributionTypeConfig) {
    setName(t.name);
    setSlug(t.slug);
    setAppliesTo(t.appliesTo);
    setColorDot(t.colorDot);
    setColorBadgeBg(t.colorBadgeBg);
    setColorBadgeText(t.colorBadgeText);
    setEditingSlug(t.slug);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalSlug = slug || slugify(name);

    if (editingSlug) {
      onUpdate(editingSlug, {
        name,
        appliesTo,
        colorDot,
        colorBadgeBg,
        colorBadgeText,
      });
    } else {
      onSave({
        name,
        slug: finalSlug,
        appliesTo,
        colorDot,
        colorBadgeBg,
        colorBadgeText,
      });
    }

    resetForm();
  }

  const appliesToLabel = (v: AppliesTo) =>
    v === "both"
      ? "Ambos"
      : v === "contributors"
        ? "Contribuidores"
        : "Líderes";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Tipos de contribución
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            + Nuevo tipo
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingSlug) setSlug(slugify(e.target.value));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!!editingSlug}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aplica a
            </label>
            <select
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value as AppliesTo)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            >
              <option value="both">Ambos</option>
              <option value="contributors">Contribuidores</option>
              <option value="leaders">Líderes</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color dot
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorDot}
                  onChange={(e) => setColorDot(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={colorDot}
                  onChange={(e) => setColorDot(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge bg
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorBadgeBg}
                  onChange={(e) => setColorBadgeBg(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={colorBadgeBg}
                  onChange={(e) => setColorBadgeBg(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge text
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorBadgeText}
                  onChange={(e) => setColorBadgeText(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={colorBadgeText}
                  onChange={(e) => setColorBadgeText(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-gray-500">Preview:</span>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorDot }}
            />
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: colorBadgeBg, color: colorBadgeText }}
            >
              {name || "Nombre"}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {editingSlug ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Types list */}
      <div className="space-y-2">
        {types.map((t) => (
          <div
            key={t.slug}
            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-lg"
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: t.colorDot }}
            />
            <span className="text-sm font-medium text-gray-900 flex-1">
              {t.name}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: t.colorBadgeBg, color: t.colorBadgeText }}
            >
              {t.name}
            </span>
            <span className="text-xs text-gray-400 w-24">
              {appliesToLabel(t.appliesTo)}
            </span>
            <button
              onClick={() => handleEdit(t)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
            >
              Editar
            </button>
            <button
              onClick={() => onDeactivate(t.slug)}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              Desactivar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

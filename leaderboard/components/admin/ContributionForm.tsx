"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, ContributionTypeConfig, Section } from "@/lib/types";
import {
  MOCK_CONTRIBUTION_TYPES,
  MOCK_CONTRIBUTORS,
  MOCK_LEADERS,
} from "@/lib/mock-data";
import PersonAutocomplete from "./PersonAutocomplete";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export default function ContributionForm() {
  const router = useRouter();

  const [selectedPerson, setSelectedPerson] = useState<UserProfile | null>(null);
  const [isNewPerson, setIsNewPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [newPersonSection, setNewPersonSection] = useState<Section>("contributors");
  const [types, setTypes] = useState<ContributionTypeConfig[]>([]);
  const [typeSlug, setTypeSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  // The effective section: from existing person or from new person selection
  const effectiveSection: Section | null = selectedPerson
    ? selectedPerson.section
    : isNewPerson
      ? newPersonSection
      : null;

  const filteredTypes = types.filter(
    (t) =>
      !effectiveSection ||
      t.appliesTo === "both" ||
      t.appliesTo === effectiveSection
  );

  const allMockPersons = [...MOCK_CONTRIBUTORS, ...MOCK_LEADERS];

  function handleCreateNew(name: string) {
    setIsNewPerson(true);
    setNewPersonName(name);
    setSelectedPerson(null);
    setTypeSlug("");
  }

  function handleSelectPerson(person: UserProfile | null) {
    setSelectedPerson(person);
    setIsNewPerson(false);
    setNewPersonName("");
    setNewPersonEmail("");
    setTypeSlug("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const pointsNum = Number(points);
    if (!pointsNum || pointsNum <= 0) {
      setError("Los puntos deben ser un número positivo");
      return;
    }

    if (!selectedPerson && !newPersonName) {
      setError("Selecciona o crea una persona");
      return;
    }

    if (!typeSlug) {
      setError("Selecciona un tipo de contribución");
      return;
    }

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    // Validate type compatibility with person's section
    if (effectiveSection) {
      const selectedType = types.find((t) => t.slug === typeSlug);
      if (
        selectedType &&
        selectedType.appliesTo !== "both" &&
        selectedType.appliesTo !== effectiveSection
      ) {
        setError(
          `El tipo "${selectedType.name}" no aplica para ${effectiveSection === "contributors" ? "contribuidores" : "líderes"}`
        );
        return;
      }
    }

    setSaving(true);

    const body = {
      personId: selectedPerson?.userId || null,
      newPerson: isNewPerson
        ? {
            name: newPersonName,
            email: newPersonEmail || undefined,
            section: newPersonSection,
          }
        : undefined,
      typeSlug,
      title: title.trim(),
      description: description.trim() || undefined,
      points: pointsNum,
      date,
    };

    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      router.push("/admin/contributions");
      return;
    }

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Error al guardar");
        setSaving(false);
        return;
      }

      router.push("/admin/contributions");
    } catch {
      setError("Error de conexión");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Person */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Persona *
        </label>
        <PersonAutocomplete
          value={selectedPerson}
          onSelect={handleSelectPerson}
          onCreateNew={handleCreateNew}
          useMock={USE_MOCK}
          mockPersons={allMockPersons}
        />
      </div>

      {/* Existing person section (read-only) */}
      {selectedPerson && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sección
          </label>
          <input
            type="text"
            value={
              selectedPerson.section === "contributors"
                ? "Contribuidores"
                : "Líderes"
            }
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500"
          />
        </div>
      )}

      {/* New person fields */}
      {isNewPerson && (
        <div className="border border-dashed border-indigo-200 rounded-lg p-4 bg-indigo-50/30 space-y-3">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Nueva persona
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newPersonEmail}
              onChange={(e) => setNewPersonEmail(e.target.value)}
              placeholder="opcional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sección *
            </label>
            <select
              value={newPersonSection}
              onChange={(e) => {
                setNewPersonSection(e.target.value as Section);
                setTypeSlug("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            >
              <option value="contributors">Contribuidores</option>
              <option value="leaders">Líderes</option>
            </select>
          </div>
        </div>
      )}

      {/* Type */}
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
          <option value="">Seleccionar tipo...</option>
          {filteredTypes.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Intro a AWS Lambda"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Detalles opcionales..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none resize-none"
        />
      </div>

      {/* Points */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Puntos *
        </label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          min="1"
          placeholder="0"
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
        />
      </div>

      {/* Actions */}
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
          onClick={() => router.push("/admin/contributions")}
          className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

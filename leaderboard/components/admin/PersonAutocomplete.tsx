"use client";

import { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/lib/types";

interface PersonAutocompleteProps {
  value: UserProfile | null;
  onSelect: (person: UserProfile | null) => void;
  onCreateNew: (name: string) => void;
  useMock?: boolean;
  mockPersons?: UserProfile[];
}

export default function PersonAutocomplete({
  value,
  onSelect,
  onCreateNew,
  useMock,
  mockPersons = [],
}: PersonAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        if (useMock) {
          const filtered = mockPersons.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
        } else {
          const res = await fetch(
            `/api/persons?search=${encodeURIComponent(query)}`
          );
          const json = await res.json();
          setResults(json.data || []);
        }
      } catch {
        setResults([]);
      }
      setLoading(false);
      setIsOpen(true);
    }, 300);
  }, [query, useMock, mockPersons]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (value) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
          style={{ backgroundColor: value.avatarColor }}
        >
          {value.initials}
        </div>
        <span className="text-sm font-medium text-gray-900 flex-1">
          {value.name}
        </span>
        <button
          type="button"
          onClick={() => {
            onSelect(null);
            setQuery("");
          }}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        placeholder="Buscar o crear nueva persona..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-400">Buscando...</div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-3 py-2 text-sm text-gray-400">
              No se encontraron resultados
            </div>
          )}

          {results.map((person) => (
            <button
              key={person.userId}
              type="button"
              onClick={() => {
                onSelect(person);
                setIsOpen(false);
                setQuery("");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{ backgroundColor: person.avatarColor }}
              >
                {person.initials}
              </div>
              <span className="text-sm text-gray-900">{person.name}</span>
            </button>
          ))}

          {query.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                onCreateNew(query);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left border-t border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                +
              </span>
              <span className="text-sm text-indigo-600 font-medium">
                Crear &quot;{query}&quot;
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

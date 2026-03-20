"use client";

import { Contribution, ContributionTypeConfig } from "@/lib/types";
import { getTypeColors, formatRelativeTime } from "@/lib/utils";

interface ContributionTableProps {
  contributions: Contribution[];
  types: ContributionTypeConfig[];
  onDelete?: (contribution: Contribution) => void;
}

export default function ContributionTable({
  contributions,
  types,
  onDelete,
}: ContributionTableProps) {
  if (contributions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No hay contribuciones registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">
              Título
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">
              Tipo
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">
              Puntos
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">
              Fecha
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((contrib) => {
            const colors = getTypeColors(contrib.typeSlug, types);
            const typeName =
              types.find((t) => t.slug === contrib.typeSlug)?.name ||
              contrib.typeSlug;

            return (
              <tr
                key={contrib.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">
                    {contrib.title}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {typeName}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                  {contrib.points}
                </td>
                <td className="py-3 px-4 text-gray-400">
                  {formatRelativeTime(contrib.createdAt)}
                </td>
                <td className="py-3 px-4 text-right">
                  {onDelete && (
                    <button
                      onClick={() => onDelete(contrib)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

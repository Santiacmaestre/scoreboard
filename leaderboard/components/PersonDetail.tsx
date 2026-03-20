"use client";

import { UserDetail, ContributionTypeConfig } from "@/lib/types";
import { formatLastContribution } from "@/lib/utils";
import Avatar from "./Avatar";
import MetricCard from "./MetricCard";
import ContributionItem from "./ContributionItem";

interface PersonDetailProps {
  detail: UserDetail | null;
  loading: boolean;
  types: ContributionTypeConfig[];
}

export default function PersonDetail({
  detail,
  loading,
  types,
}: PersonDetailProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="animate-pulse text-sm">Cargando...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">👈</div>
          <p className="text-sm">Selecciona una persona para ver su detalle</p>
        </div>
      </div>
    );
  }

  const { profile, contributions } = detail;

  const memberDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("es-CO", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="p-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          initials={profile.initials}
          color={profile.avatarColor}
          size="lg"
        />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
          {memberDate && (
            <p className="text-sm text-gray-500">
              Miembro desde {memberDate}
            </p>
          )}
        </div>
        <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
          #{profile.rank}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard
          label="Puntos totales"
          value={profile.totalPoints.toLocaleString()}
          icon="⭐"
        />
        <MetricCard
          label="Contribuciones"
          value={profile.totalContributions}
          icon="📦"
        />
        <MetricCard label="Última contrib." value={formatLastContribution(detail.lastContributionAt)} icon="🕐" />
      </div>

      {/* Contributions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Contribuciones recientes
        </h3>
        {contributions.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            Sin contribuciones registradas
          </p>
        ) : (
          <div>
            {contributions.slice(0, 10).map((contrib) => (
              <ContributionItem
                key={contrib.id}
                contribution={contrib}
                types={types}
              />
            ))}
          </div>
        )}
        {contributions.length > 10 && (
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3 transition-colors">
            Ver todas las contribuciones →
          </button>
        )}
      </div>
    </div>
  );
}

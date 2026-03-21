"use client";

import { useEffect, useState } from "react";
import {
  MOCK_CONTRIBUTORS,
  MOCK_LEADERS,
  MOCK_CONTRIBUTIONS,
  MOCK_CONTRIBUTION_TYPES,
} from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

interface Stats {
  totalPersons: number;
  totalContributions: number;
  totalTypes: number;
  totalPoints: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPersons: 0,
    totalContributions: 0,
    totalTypes: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    if (USE_MOCK) {
      const allPersons = [...MOCK_CONTRIBUTORS, ...MOCK_LEADERS].filter(
        (p, i, arr) => arr.findIndex((x) => x.userId === p.userId) === i
      );
      const allContribs = Object.values(MOCK_CONTRIBUTIONS).flat();
      setStats({
        totalPersons: allPersons.length,
        totalContributions: allContribs.length,
        totalTypes: MOCK_CONTRIBUTION_TYPES.length,
        totalPoints: allContribs.reduce((s, c) => s + c.points, 0),
      });
      return;
    }

    Promise.all([
      fetch("/api/leaderboard?type=contributors").then((r) => r.json()),
      fetch("/api/leaderboard?type=leaders").then((r) => r.json()),
      fetch("/api/contributions").then((r) => r.json()),
      fetch("/api/types").then((r) => r.json()),
    ])
      .then(([contribJson, leadersJson, contribsJson, typesJson]) => {
        const allPersons = [
          ...(contribJson.data || []),
          ...(leadersJson.data || []),
        ];
        const allContribs = contribsJson.data || [];
        setStats({
          totalPersons: allPersons.length,
          totalContributions: allContribs.length,
          totalTypes: (typesJson.data || []).length,
          totalPoints: allPersons.reduce(
            (s: number, p: { totalPoints: number }) => s + p.totalPoints,
            0
          ),
        });
      })
      .catch(console.error);
  }, []);

  const cards = [
    { label: "Personas", value: stats.totalPersons, icon: "👥" },
    { label: "Contribuciones", value: stats.totalContributions, icon: "📝" },
    { label: "Tipos activos", value: stats.totalTypes, icon: "🏷️" },
    { label: "Puntos totales", value: stats.totalPoints.toLocaleString(), icon: "⭐" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

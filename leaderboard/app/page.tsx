"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, UserDetail, ContributionTypeConfig } from "@/lib/types";
import {
  MOCK_CONTRIBUTORS,
  MOCK_LEADERS,
  MOCK_CONTRIBUTIONS,
  MOCK_CONTRIBUTION_TYPES,
} from "@/lib/mock-data";
import LeaderboardTabs from "@/components/LeaderboardTabs";
import RankingList from "@/components/RankingList";
import PersonDetail from "@/components/PersonDetail";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

type Tab = "contributors" | "leaders";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("contributors");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [types, setTypes] = useState<ContributionTypeConfig[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (USE_MOCK) {
      setUsers(activeTab === "contributors" ? MOCK_CONTRIBUTORS : MOCK_LEADERS);
      setSelectedUserId(null);
      setUserDetail(null);
      setShowMobileDetail(false);
      return;
    }

    setError(null);
    fetch(`/api/leaderboard?type=${activeTab}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || `API error ${res.status}`);
        }
        setUsers(json.data || []);
        setSelectedUserId(null);
        setUserDetail(null);
        setShowMobileDetail(false);
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        setError(err.message || "Error cargando datos");
      });
  }, [activeTab]);

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setLoadingDetail(true);
    setShowMobileDetail(true);

    if (USE_MOCK) {
      const allUsers = [...MOCK_CONTRIBUTORS, ...MOCK_LEADERS];
      const profile = allUsers.find((u) => u.userId === userId);
      if (profile) {
        const contributions = MOCK_CONTRIBUTIONS[userId] || [];
        const lastContributionAt = contributions.length > 0
          ? contributions[0].createdAt || contributions[0].date
          : null;
        setUserDetail({
          profile,
          contributions,
          lastContributionAt,
        });
      }
      setLoadingDetail(false);
      return;
    }

    fetch(`/api/users/${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((json) => {
        setUserDetail({
          profile: json.profile,
          contributions: json.contributions,
          lastContributionAt: json.lastContributionAt ?? null,
        });
      })
      .catch(console.error)
      .finally(() => setLoadingDetail(false));
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
        style={{ minHeight: "600px" }}
      >
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-2">
            Error: {error}
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          <div
            className={`w-full md:w-2/5 border-r border-gray-100 overflow-y-auto ${
              showMobileDetail ? "hidden md:block" : ""
            }`}
          >
            <RankingList
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={handleSelectUser}
            />
          </div>

          <div
            className={`w-full md:w-3/5 ${
              showMobileDetail ? "" : "hidden md:block"
            }`}
          >
            {showMobileDetail && (
              <button
                onClick={() => setShowMobileDetail(false)}
                className="md:hidden flex items-center gap-2 px-4 py-3 text-sm text-indigo-600 font-medium border-b border-gray-100 w-full cursor-pointer"
              >
                ← Volver al ranking
              </button>
            )}
            <PersonDetail
              detail={userDetail}
              loading={loadingDetail}
              types={types}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

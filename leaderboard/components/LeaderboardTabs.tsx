"use client";

type Tab = "contributors" | "leaders";

interface LeaderboardTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
}: LeaderboardTabsProps) {
  return (
    <div className="flex">
      <button
        onClick={() => onTabChange("contributors")}
        className={`flex-1 px-6 py-3 text-sm font-semibold transition-all rounded-tl-xl cursor-pointer
          ${
            activeTab === "contributors"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
          }
        `}
      >
        Contribuidores
      </button>
      <button
        onClick={() => onTabChange("leaders")}
        className={`flex-1 px-6 py-3 text-sm font-semibold transition-all rounded-tr-xl cursor-pointer
          ${
            activeTab === "leaders"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"
          }
        `}
      >
        Líderes
      </button>
    </div>
  );
}

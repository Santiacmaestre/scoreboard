"use client";

import { UserProfile } from "@/lib/types";
import Avatar from "./Avatar";

interface RankingRowProps {
  user: UserProfile;
  isSelected: boolean;
  onClick: () => void;
}

export default function RankingRow({ user, isSelected, onClick }: RankingRowProps) {
  const isFirst = user.rank === 1;

  const baseClasses = "w-full flex items-center gap-3 px-4 py-3 cursor-pointer text-left border-b border-gray-100 outline-none transition-all duration-150 ease-in-out";

  let stateClasses: string;
  if (isFirst && isSelected) {
    stateClasses = "bg-gradient-to-r from-amber-50 to-orange-50 border-l-3 border-l-amber-500 shadow-[inset_0_0_0_1px_#EF9F27]";
  } else if (isFirst) {
    stateClasses = "bg-gradient-to-r from-amber-50 to-orange-50 border-l-3 border-l-amber-500 hover:shadow-sm";
  } else if (isSelected) {
    stateClasses = "bg-blue-50 border-l-3 border-l-[#378ADD]";
  } else {
    stateClasses = "bg-white border-l-3 border-l-transparent hover:bg-gray-50 hover:shadow-sm";
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${baseClasses} ${stateClasses}`}
    >
      <span className="text-sm font-semibold text-gray-400 w-6 text-right">
        {user.rank}
      </span>
      <Avatar initials={user.initials} color={user.avatarColor} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-400">{user.totalContributions} {user.totalContributions === 1 ? "contribución" : "contribuciones"}</p>
      </div>
      <span
        className={`text-sm font-bold tabular-nums ${
          isFirst ? "text-amber-700" : "text-gray-700"
        }`}
      >
        {user.totalPoints.toLocaleString()}
      </span>
    </div>
  );
}

"use client";

import { UserProfile } from "@/lib/types";
import RankingRow from "./RankingRow";

interface RankingListProps {
  users: UserProfile[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export default function RankingList({
  users,
  selectedUserId,
  onSelectUser,
}: RankingListProps) {
  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100" role="listbox" aria-label="Ranking">
      {users.map((user) => (
        <RankingRow
          key={user.userId}
          user={user}
          isSelected={selectedUserId === user.userId}
          onClick={() => onSelectUser(user.userId)}
        />
      ))}
    </div>
  );
}

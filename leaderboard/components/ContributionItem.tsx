"use client";

import { Contribution, ContributionTypeConfig } from "@/lib/types";
import { getTypeColors, formatRelativeTime, FALLBACK_TYPE_COLORS } from "@/lib/utils";

interface ContributionItemProps {
  contribution: Contribution;
  types: ContributionTypeConfig[];
}

export default function ContributionItem({ contribution, types }: ContributionItemProps) {
  const colors = getTypeColors(contribution.typeSlug, types);
  const typeName = types.find((t) => t.slug === contribution.typeSlug)?.name || contribution.typeSlug;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div
        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
        style={{ backgroundColor: colors.dot }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {contribution.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            {formatRelativeTime(contribution.createdAt)}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs font-medium text-gray-600">
            +{contribution.points} pts
          </span>
        </div>
      </div>
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {typeName}
      </span>
    </div>
  );
}

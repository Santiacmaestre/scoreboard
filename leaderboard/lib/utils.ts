import { ContributionTypeConfig } from "./types";

export const AVATAR_COLORS = [
  "#854F0B", // amber
  "#115E59", // teal
  "#5B21B6", // purple
  "#9A3412", // coral
  "#1E40AF", // blue
];

export const FALLBACK_TYPE_COLORS = {
  dot: "#6B7280",
  bg: "#F3F4F6",
  text: "#374151",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Justo ahora";
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 30) return `Hace ${diffDays}d`;
  return date.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
}

export function formatLastContribution(dateString: string | null): string {
  if (!dateString) return "Sin actividad";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) return "Hoy";
  if (diffDays < 30) return `~${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return `~${months} ${months === 1 ? "mes" : "meses"}`;
  const years = Math.floor(diffDays / 365);
  return `~${years} ${years === 1 ? "año" : "años"}`;
}

export function getTypeColors(
  typeSlug: string,
  types: ContributionTypeConfig[]
): { dot: string; bg: string; text: string } {
  const t = types.find((ct) => ct.slug === typeSlug);
  if (!t) return FALLBACK_TYPE_COLORS;
  return { dot: t.colorDot, bg: t.colorBadgeBg, text: t.colorBadgeText };
}

"use client";

interface AvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-13 h-13 text-lg",
};

export default function Avatar({ initials, color, size = "md" }: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

"use client";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
}

export default function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center min-w-0">
      <div className="text-xl sm:text-2xl mb-1">{icon}</div>
      <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value}</div>
      <div className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-tight">{label}</div>
    </div>
  );
}

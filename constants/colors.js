export const colors = [
  "#ef4444",
  "#dc2626",
  "#f97316",
  "#ea580c",
  "#f59e0b",
  "#d97706",
  "#eab308",
  "#ca8a04",
  "#84cc16",
  "#65a30d",
  "#22c55e",
  "#16a34a",
  "#10b981",
  "#059669",
  "#14b8a6",
  "#0d9488",
  "#06b6d4",
  "#0891b2",
  "#0ea5e9",
  "#0284c7",
  "#3b82f6",
  "#2563eb",
  "#6366f1",
  "#4f46e5",
  "#8b5cf6",
  "#7c3aed",
  "#d946ef",
  "#c026d3",
  "#ec4899",
  "#db2777",
  "#f43f5e",
  "#e11d48",
]

export function getRandomColor(colors) {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

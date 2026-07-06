export function GiftCardStatusBadge({ value }: { value: string }) {
  const tone = value === "ISSUED" || value === "SENT" ? "bg-emerald-50 text-emerald-700" : value === "FAILED" || value === "CANCELLED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{value.replace(/_/g, " ")}</span>;
}

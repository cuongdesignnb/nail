import { Gift } from "lucide-react";

export function GiftCardPreview({
  type,
  to,
  from,
  value,
  message,
  serviceSummary,
  gratuity,
  total,
}: {
  type: "AMOUNT" | "SERVICE";
  to: string;
  from: string;
  value: string;
  message: string;
  serviceSummary?: string;
  gratuity?: string;
  total?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e4cfac] bg-[#fffaf1] shadow-[0_24px_80px_rgba(92,62,38,0.14)]">
      <div className="relative min-h-[320px] bg-[radial-gradient(circle_at_20%_10%,#fff7d8,transparent_30%),linear-gradient(135deg,#fffaf1,#ead6b7)] p-7 text-[#3d2d24]">
        <div className="absolute right-6 top-6 rounded-full border border-[#caa46b] bg-white/50 p-3">
          <Gift size={22} />
        </div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#8b6748]">Aera Nail Lounge</p>
        <h3 className="mt-2 font-serif text-3xl">A Gift of Luxury</h3>
        <div className="mt-10 rounded-2xl border border-white/70 bg-white/55 p-5 backdrop-blur">
          <span className="rounded-full bg-[#7b4e34] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white">{type === "SERVICE" ? "Service" : "Amount"}</span>
          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[#997553]">To</dt>
              <dd className="break-words text-xl font-semibold">{to || "Someone special"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[#997553]">From</dt>
              <dd className="break-words text-lg">{from || "With love"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[#997553]">Gift</dt>
              <dd className="break-words text-2xl font-semibold">{value || "Select a gift"}</dd>
            </div>
            {type === "SERVICE" && serviceSummary && (
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[#997553]">Services</dt>
                <dd className="break-words text-sm">{serviceSummary}</dd>
              </div>
            )}
            {type === "SERVICE" && (
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[#997553]">Total</dt>
                <dd className="break-words text-lg font-semibold">{total} {gratuity ? <span className="text-sm font-normal">incl. {gratuity} gratuity</span> : null}</dd>
              </div>
            )}
          </dl>
          <p className="mt-5 line-clamp-4 break-words text-sm italic text-[#674938]">{message || "A thoughtful gift from Aera Nail Lounge."}</p>
        </div>
      </div>
    </div>
  );
}

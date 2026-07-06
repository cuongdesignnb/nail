"use client";

type GiftCardIssuePreviewProps = {
  type: "AMOUNT" | "SERVICE";
  amountLabel: string;
  serviceName?: string;
  recipientName: string;
  senderName: string;
  message?: string;
};

export default function GiftCardIssuePreview({
  type,
  amountLabel,
  serviceName,
  recipientName,
  senderName,
  message,
}: GiftCardIssuePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#eadfd5] bg-[#fffaf2] p-4 shadow-[var(--admin-shadow-sm)]">
      <div className="rounded-xl border border-[#e3c9ad] bg-gradient-to-br from-[#fff8ec] via-[#f7eadb] to-[#d7a46d] p-5 text-[#3b2418]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a5a37]">Aera Nail Lounge</p>
            <h3 className="mt-2 font-heading text-2xl font-bold">Gift Card</h3>
          </div>
          <div className="rounded-full border border-[#c58a58] px-3 py-1 text-xs font-bold uppercase text-[#70401f]">
            {type === "SERVICE" ? "Service" : "Amount"}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a5a37]">Value</p>
          <p className="mt-1 break-words text-2xl font-bold">{type === "SERVICE" ? serviceName || "Selected service" : amountLabel}</p>
          {type === "SERVICE" && <p className="mt-1 text-sm font-semibold text-[#70401f]">{amountLabel}</p>}
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-[#8a5a37]">To</dt>
            <dd className="mt-1 break-words font-semibold">{recipientName || "Recipient"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-[#8a5a37]">From</dt>
            <dd className="mt-1 break-words font-semibold">{senderName || "Aera Nail Lounge"}</dd>
          </div>
        </dl>

        {message && (
          <p className="mt-6 line-clamp-4 rounded-xl bg-white/45 p-3 text-sm leading-relaxed text-[#5d3a27]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

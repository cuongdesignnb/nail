"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Mail, Send } from "lucide-react";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import { adminRoutes } from "@/lib/admin/admin-routes";
import GiftCardIssuePreview from "./GiftCardIssuePreview";
import GiftCardIssueSummary from "./GiftCardIssueSummary";

type GiftCardCatalog = {
  settings: {
    currency: string;
    amountPresetValues: number[];
    minCustomAmount: number;
    maxCustomAmount: number;
    allowCustomAmount: boolean;
  };
  categories: Array<{
    id: string;
    name: string;
    services: Array<{
      id: string;
      name: string;
      durationMinutes: number;
      price: number;
      categoryId: string | null;
    }>;
  }>;
};

type FieldErrors = Record<string, string[] | undefined>;

const inputClass =
  "mt-1.5 h-11 w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-3 text-sm text-[var(--admin-ink)] outline-none transition placeholder:text-[var(--admin-placeholder)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15";
const textareaClass =
  "mt-1.5 min-h-[96px] w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-3 py-2 text-sm text-[var(--admin-ink)] outline-none transition placeholder:text-[var(--admin-placeholder)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15";

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value || 0);
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs font-medium text-[var(--admin-danger)]">{errors[0]}</p>;
}

export default function IssueGiftCardForm({ catalog }: { catalog: GiftCardCatalog }) {
  const router = useRouter();
  const toast = useToast();
  const firstPreset = catalog.settings.amountPresetValues[0] || catalog.settings.minCustomAmount;
  const firstCategoryId = catalog.categories[0]?.id || "";

  const [type, setType] = useState<"AMOUNT" | "SERVICE">("AMOUNT");
  const [amount, setAmount] = useState(String(firstPreset));
  const [categoryId, setCategoryId] = useState(firstCategoryId);
  const [serviceId, setServiceId] = useState(catalog.categories[0]?.services[0]?.id || "");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("Aera Nail Lounge");
  const [senderEmail, setSenderEmail] = useState("hello@aeranailounge.com");
  const [message, setMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = useMemo(
    () => catalog.categories.find((category) => category.id === categoryId) || catalog.categories[0],
    [catalog.categories, categoryId],
  );
  const selectedService = useMemo(
    () => selectedCategory?.services.find((service) => service.id === serviceId) || selectedCategory?.services[0],
    [selectedCategory, serviceId],
  );
  const numericAmount = Number(amount);
  const selectedValue = type === "SERVICE" ? selectedService?.price || 0 : numericAmount;
  const valueLabel = money(selectedValue, catalog.settings.currency);

  const valid =
    recipientName.trim().length > 0 &&
    recipientEmail.includes("@") &&
    senderName.trim().length > 0 &&
    senderEmail.includes("@") &&
    message.length <= 280 &&
    internalNote.length <= 500 &&
    (type === "SERVICE"
      ? Boolean(selectedService?.id)
      : Number.isInteger(numericAmount) &&
        numericAmount >= catalog.settings.minCustomAmount &&
        numericAmount <= catalog.settings.maxCustomAmount);

  function chooseCategory(nextCategoryId: string) {
    const nextCategory = catalog.categories.find((category) => category.id === nextCategoryId);
    setCategoryId(nextCategoryId);
    setServiceId(nextCategory?.services[0]?.id || "");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setFieldErrors({});
    setFormError("");

    const payload = {
      type,
      amount: type === "AMOUNT" ? numericAmount : undefined,
      serviceId: type === "SERVICE" ? selectedService?.id : undefined,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      message,
      internalNote,
      sendEmail,
    };

    try {
      const response = await fetch("/api/admin/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        throw new Error(json.error || "Unable to issue Gift Card.");
      }

      if (sendEmail && json.giftCard.emailStatus === "SENT") {
        toast.success("Gift Card issued and sent to recipient.");
      } else if (sendEmail && json.giftCard.emailStatus === "FAILED") {
        toast.warning("Gift Card issued, but email delivery failed. You can resend it from the Gift Card details page.");
      } else {
        toast.success("Gift Card issued successfully.");
      }

      router.push(adminRoutes.giftCardDetail(json.giftCard.id));
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unable to issue Gift Card.";
      setFormError(messageText);
      toast.error("Gift Card was not issued.", messageText);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="issue-gift-card-form" onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Gift Card Type</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { value: "AMOUNT" as const, title: "Amount Gift Card", copy: "Issue a flexible dollar value." },
              { value: "SERVICE" as const, title: "Service Gift Card", copy: "Issue for a selected service." },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  type === option.value
                    ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]"
                    : "border-[var(--admin-border)] bg-white hover:bg-[var(--admin-surface-hover)]"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-bold text-[var(--admin-ink)]">
                  <Gift size={16} />
                  {option.title}
                </span>
                <span className="mt-1 block text-xs text-[var(--admin-muted)]">{option.copy}</span>
              </button>
            ))}
          </div>

          {type === "AMOUNT" ? (
            <div className="mt-5">
              <label className="text-sm font-semibold text-[var(--admin-ink)]">Gift Card Value</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {catalog.settings.amountPresetValues.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className={`h-9 rounded-full border px-3 text-sm font-semibold transition ${
                      Number(amount) === preset
                        ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white"
                        : "border-[var(--admin-border)] bg-white text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)]"
                    }`}
                  >
                    {money(preset, catalog.settings.currency)}
                  </button>
                ))}
              </div>
              <input className={inputClass} inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} placeholder="Custom amount" />
              <p className="mt-1 text-xs text-[var(--admin-muted)]">
                USD only. Minimum {money(catalog.settings.minCustomAmount, catalog.settings.currency)}, maximum {money(catalog.settings.maxCustomAmount, catalog.settings.currency)}.
              </p>
              <FieldError errors={fieldErrors.amount} />
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[var(--admin-ink)]">
                Service Category
                <select className={inputClass} value={categoryId} onChange={(event) => chooseCategory(event.target.value)}>
                  {catalog.categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-[var(--admin-ink)]">
                Select Service
                <select className={inputClass} value={selectedService?.id || ""} onChange={(event) => setServiceId(event.target.value)}>
                  {(selectedCategory?.services || []).map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.durationMinutes} min - {money(service.price, catalog.settings.currency)}
                    </option>
                  ))}
                </select>
              </label>
              <FieldError errors={fieldErrors.serviceId} />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Recipient Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--admin-ink)]">
              Recipient Name *
              <input className={inputClass} value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="Client name" />
              <FieldError errors={fieldErrors.recipientName} />
            </label>
            <label className="text-sm font-semibold text-[var(--admin-ink)]">
              Recipient Email *
              <input className={inputClass} value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="client@example.com" />
              <FieldError errors={fieldErrors.recipientEmail} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Sender Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--admin-ink)]">
              Sender Name *
              <input className={inputClass} value={senderName} onChange={(event) => setSenderName(event.target.value)} placeholder="Aera Nail Lounge" />
              <FieldError errors={fieldErrors.senderName} />
            </label>
            <label className="text-sm font-semibold text-[var(--admin-ink)]">
              Sender Email *
              <input className={inputClass} value={senderEmail} onChange={(event) => setSenderEmail(event.target.value)} placeholder="hello@aeranailounge.com" />
              <FieldError errors={fieldErrors.senderEmail} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Personal Message</h2>
          <textarea className={textareaClass} value={message} maxLength={280} onChange={(event) => setMessage(event.target.value)} placeholder="Optional note for the recipient" />
          <div className="mt-1 flex justify-between text-xs text-[var(--admin-muted)]">
            <FieldError errors={fieldErrors.message} />
            <span>{message.length}/280</span>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Delivery</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setSendEmail(true)} className={`rounded-xl border p-4 text-left ${sendEmail ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]" : "border-[var(--admin-border)] bg-white"}`}>
              <span className="flex items-center gap-2 text-sm font-bold"><Mail size={16} /> Send by Email Now</span>
              <span className="mt-1 block text-xs text-[var(--admin-muted)]">Recipient receives the digital Gift Card immediately.</span>
            </button>
            <button type="button" onClick={() => setSendEmail(false)} className={`rounded-xl border p-4 text-left ${!sendEmail ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]" : "border-[var(--admin-border)] bg-white"}`}>
              <span className="text-sm font-bold">Create Without Sending Email</span>
              <span className="mt-1 block text-xs text-[var(--admin-muted)]">Email status remains pending until sent later.</span>
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
          <h2 className="text-sm font-bold text-[var(--admin-ink)]">Internal Note</h2>
          <textarea className={textareaClass} value={internalNote} maxLength={500} onChange={(event) => setInternalNote(event.target.value)} placeholder="Admin-only audit note" />
          <div className="mt-1 flex justify-between text-xs text-[var(--admin-muted)]">
            <FieldError errors={fieldErrors.internalNote} />
            <span>{internalNote.length}/500</span>
          </div>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <GiftCardIssuePreview
          type={type}
          amountLabel={valueLabel}
          serviceName={selectedService?.name}
          recipientName={recipientName}
          senderName={senderName}
          message={message}
        />
        <GiftCardIssueSummary type={type} valueLabel={valueLabel} recipientEmail={recipientEmail} sendEmail={sendEmail} />
        {formError && <p className="rounded-xl border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)] p-3 text-sm font-semibold text-[var(--admin-danger)]">{formError}</p>}
        <button
          type="submit"
          disabled={!valid || submitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--admin-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          {submitting ? "Issuing Gift Card..." : "Issue Gift Card"}
        </button>
      </aside>
    </form>
  );
}

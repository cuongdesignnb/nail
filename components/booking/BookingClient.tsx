"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ArrowRight, CalendarDays, Check, Clock3, Sparkles, UserRound } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";

type Catalog = {
  services: Array<{ id: string; name: string; shortDescription?: string | null; durationMinutes: number; price: number }>;
  addons: Array<{ id: string; name: string; description?: string | null; price: number }>;
  technicians: Array<{ id: string; name: string; role: string; specialty: string; rating: number }>;
  payment: { enabled: boolean; currency: string; chargeMode: string; depositPercentage: number; bookingHoldMinutes: number };
};

type Quote = {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentAmount: number;
  remainingAmount: number;
  chargeMode: "deposit" | "full";
  depositPercentage: number;
  currency: string;
  durationMinutes: number;
};

type PayPalConfig = {
  enabled: boolean;
  clientId: string | null;
  currency: string;
  intent: "capture";
};

const today = new Date().toISOString().slice(0, 10);

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value || 0);
}

export function BookingClient() {
  const [step, setStep] = useState(1);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [paypalConfig, setPaypalConfig] = useState<PayPalConfig | null>(null);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [technicianId, setTechnicianId] = useState("no-preference");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reminderConsent: true,
    marketingConsent: false,
  });
  const [notes, setNotes] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [checkout, setCheckout] = useState<{ publicToken: string; expiresAt: string } | null>(null);
  const checkoutRef = useRef<{ publicToken: string; expiresAt: string } | null>(null);
  const [result, setResult] = useState<{ bookingCode: string; id: string; status?: string } | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function load() {
      const [catalogRes, paypalRes] = await Promise.all([
        fetch("/api/public/booking/catalog", { cache: "no-store" }),
        fetch("/api/public/paypal/config", { cache: "no-store" }),
      ]);
      const catalogJson = await catalogRes.json();
      const paypalJson = await paypalRes.json();
      if (catalogJson.success) setCatalog(catalogJson.data);
      if (paypalJson.success) setPaypalConfig(paypalJson.data);
    }
    load().catch(() => setError("Unable to load booking options."));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceFromUrl = params.get("service");
    const promoFromUrl = params.get("promo") ?? "";
    if (serviceFromUrl) setServiceIds([serviceFromUrl]);
    if (promoFromUrl) setPromoCode(promoFromUrl);
  }, []);

  useEffect(() => {
    if (serviceIds.length === 0) {
      setQuote(null);
      setAvailableSlots([]);
      return;
    }
    const controller = new AbortController();
    async function loadQuoteAndAvailability() {
      const quoteRes = await fetch("/api/public/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceIds, addonIds, promotionCode: promoCode, date, time, technicianId }),
        signal: controller.signal,
      });
      const quoteJson = await quoteRes.json();
      if (quoteJson.success) setQuote(quoteJson.data);

      const params = new URLSearchParams({ date, technicianId });
      serviceIds.forEach((id) => params.append("serviceIds", id));
      addonIds.forEach((id) => params.append("addonIds", id));
      const availabilityRes = await fetch(`/api/public/booking/availability?${params.toString()}`, { signal: controller.signal });
      const availabilityJson = await availabilityRes.json();
      if (availabilityJson.success) {
        setAvailableSlots(availabilityJson.data.availableSlots);
        if (!time || !availabilityJson.data.availableSlots.includes(time)) {
          setTime(availabilityJson.data.availableSlots[0] || "");
        }
      }
    }
    loadQuoteAndAvailability().catch((err) => {
      if (err?.name !== "AbortError") setError("Unable to refresh quote or availability.");
    });
    return () => controller.abort();
  }, [serviceIds, addonIds, promoCode, date, technicianId, time]);

  const selectedTechnician = useMemo(() => {
    if (!catalog) return null;
    if (technicianId === "no-preference") return null;
    return catalog.technicians.find((tech) => tech.id === technicianId) || null;
  }, [catalog, technicianId]);

  const validDetails =
    customer.firstName.trim() &&
    customer.lastName.trim() &&
    customer.email.includes("@") &&
    customer.phone.trim().length >= 7;

  const readyToPay =
    serviceIds.length > 0 &&
    time &&
    quote &&
    validDetails &&
    policyAccepted &&
    paypalConfig?.enabled &&
    paypalConfig.clientId;

  function toggle(list: string[], id: string, setter: (next: string[]) => void) {
    setter(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
    checkoutRef.current = null;
    setCheckout(null);
  }

  async function createOrder() {
    setError("");
    setProcessing(true);
    const res = await fetch("/api/public/booking-checkouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceIds,
        addonIds,
        technicianId,
        date,
        time,
        promotionCode: promoCode,
        customer,
        notes,
        policyAccepted,
        policyVersion: "current-policy-version",
      }),
    });
    const json = await res.json();
    setProcessing(false);
    if (!json.success) {
      setError(json.error || "Unable to start PayPal checkout.");
      throw new Error(json.error || "Unable to start PayPal checkout.");
    }
    const nextCheckout = { publicToken: json.data.publicToken, expiresAt: json.data.expiresAt };
    checkoutRef.current = nextCheckout;
    setCheckout(nextCheckout);
    return json.data.paypalOrderId;
  }

  async function captureOrder(orderId: string) {
    const activeCheckout = checkoutRef.current ?? checkout;
    if (!activeCheckout?.publicToken) {
      setError("Secure checkout session was not found. Please try again.");
      return;
    }
    setProcessing(true);
    setError("");
    const res = await fetch(`/api/public/booking-checkouts/${activeCheckout.publicToken}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalOrderId: orderId }),
    });
    const json = await res.json();
    setProcessing(false);
    if (!json.success) {
      setError(json.error || "Payment could not be verified.");
      return;
    }
    const booking = json.data.booking;
    setResult({ id: booking.id, bookingCode: booking.bookingCode, status: "CONFIRMED" });
  }

  async function submitManualBookingRequest() {
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceIds,
          addonIds,
          technicianId,
          date,
          time,
          promotionCode: promoCode,
          customer,
          notes,
          policyAccepted,
          policyVersion: "current-policy-version",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unable to create booking request.");
      }
      const booking = json.data.booking;
      setResult({ id: booking.id, bookingCode: booking.bookingCode, status: booking.status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create booking request.");
    } finally {
      setProcessing(false);
    }
  }

  if (result) {
    const confirmed = result.status === "CONFIRMED" || result.status === "Confirmed";
    return (
      <PageShell
        eyebrow={confirmed ? "Booking Confirmed" : "Booking Request Received"}
        title={confirmed ? "Your Appointment Is Confirmed" : "We Received Your Booking Request"}
        copy={confirmed ? "Your PayPal payment was verified and your appointment is confirmed." : "Our reception team will review and confirm payment details shortly."}
      >
        <section className="lux-card booking-success">
          <h2>{result.bookingCode}</h2>
          <p>Please save your booking code. We look forward to seeing you.</p>
          <Link className="primary-btn" href="/">Back to Home</Link>
        </section>
      </PageShell>
    );
  }

  if (!catalog || !paypalConfig) {
    return (
      <PageShell eyebrow="Online Booking" title="Book Your Appointment" copy="Loading booking options...">
        <section className="lux-card">Loading secure checkout...</section>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Online Booking" title="Book Your Appointment" copy="Choose services, technician, time and pay securely with PayPal.">
      <section className="booking-layout">
        <div className="booking-main">
          <div className="stepper">
            {["Service", "Technician", "Date & Time", "Details", "Review & Pay"].map((label, index) => (
              <button className={step === index + 1 ? "active" : ""} key={label} onClick={() => setStep(index + 1)}>
                {index + 1}. {label}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="booking-panel">
              <h3>Choose Service</h3>
              <div className="booking-options">
                {catalog.services.map((service) => (
                  <button className={serviceIds.includes(service.id) ? "selected" : ""} key={service.id} onClick={() => toggle(serviceIds, service.id, setServiceIds)}>
                    <Sparkles size={18} />
                    <b>{service.name}</b>
                    <span>{service.durationMinutes} min - {money(service.price, quote?.currency || catalog.payment.currency)}</span>
                  </button>
                ))}
              </div>
              <h3>Add-ons</h3>
              <div className="booking-options compact-options">
                {catalog.addons.map((addon) => (
                  <button className={addonIds.includes(addon.id) ? "selected" : ""} key={addon.id} onClick={() => toggle(addonIds, addon.id, setAddonIds)}>
                    <b>{addon.name}</b>
                    <span>+{money(addon.price, quote?.currency || catalog.payment.currency)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-panel">
              <h3>Select Technician</h3>
              <div className="booking-options">
                <button className={technicianId === "no-preference" ? "selected" : ""} onClick={() => setTechnicianId("no-preference")}>
                  <UserRound size={18} />
                  <b>No Preference</b>
                  <span>Assign the best available specialist</span>
                </button>
                {catalog.technicians.map((tech) => (
                  <button className={technicianId === tech.id ? "selected" : ""} key={tech.id} onClick={() => setTechnicianId(tech.id)}>
                    <UserRound size={18} />
                    <b>{tech.name}</b>
                    <span>{tech.specialty} - {tech.rating} rating</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-panel">
              <h3>Pick Date & Time</h3>
              <label>Date<input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} /></label>
              <div className="booking-options compact-options">
                {availableSlots.map((slot) => (
                  <button className={time === slot ? "selected" : ""} key={slot} onClick={() => setTime(slot)}><Clock3 size={16} /> {slot}</button>
                ))}
                {availableSlots.length === 0 && <p className="form-error">No available slots for this selection.</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="booking-panel form-grid">
              <h3>Add Details</h3>
              <input placeholder="First Name" value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />
              <input placeholder="Last Name" value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />
              <input placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
              <input placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              <input placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <textarea placeholder="Notes or special requests" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <label className="check-label"><input type="checkbox" checked={customer.reminderConsent} onChange={(e) => setCustomer({ ...customer, reminderConsent: e.target.checked })} /> Send appointment reminders</label>
              <label className="check-label"><input type="checkbox" checked={customer.marketingConsent} onChange={(e) => setCustomer({ ...customer, marketingConsent: e.target.checked })} /> Send occasional offers</label>
            </div>
          )}

          {step === 5 && (
            <div className="booking-panel">
              <h3>Review & Pay</h3>
              <p>Secure Payment - PayPal Checkout</p>
              {quote?.chargeMode === "deposit" ? (
                <p>Deposit due today: <b>{money(quote.paymentAmount, quote.currency)}</b>. Remaining balance at appointment: <b>{money(quote.remainingAmount, quote.currency)}</b>.</p>
              ) : (
                <p>Full payment due today: <b>{money(quote?.paymentAmount || 0, quote?.currency || "USD")}</b>.</p>
              )}
              {checkout && <p>Your selected time is temporarily reserved until {new Date(checkout.expiresAt).toLocaleTimeString()}.</p>}
              <label className="check-label"><input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} /> I agree to the booking and cancellation policy.</label>
              {!paypalConfig.enabled && <p className="form-error">Online payment is not configured yet. Submit a booking request and our reception team will confirm it.</p>}
              {error && <p className="form-error">{error}</p>}
              {processing && <p>Processing secure payment...</p>}
              {!paypalConfig.enabled && (
                <button
                  className="primary-btn"
                  disabled={processing || serviceIds.length === 0 || !time || !quote || !validDetails || !policyAccepted}
                  onClick={submitManualBookingRequest}
                >
                  Submit Booking Request
                </button>
              )}
              {readyToPay && paypalConfig.clientId && (
                <PayPalScriptProvider options={{ clientId: paypalConfig.clientId, currency: quote?.currency || paypalConfig.currency, intent: "capture" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "pill" }}
                    disabled={processing}
                    createOrder={createOrder}
                    onApprove={async (data) => {
                      if (data.orderID) await captureOrder(data.orderID);
                    }}
                    onCancel={() => setError("Payment was cancelled. Your slot remains held only until the checkout timer expires.")}
                    onError={() => setError("PayPal payment failed. Please try again while your checkout is still valid.")}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          )}

          <div className="booking-actions">
            <button className="secondary-btn" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}>Back</button>
            {step < 5 && <button className="primary-btn" disabled={(step === 1 && serviceIds.length === 0) || (step === 3 && !time)} onClick={() => setStep(step + 1)}>Continue <ArrowRight size={15} /></button>}
          </div>
        </div>

        <aside className="booking-summary lux-card">
          <h3>Booking Summary</h3>
          <p><CalendarDays size={16} /> {date}{time ? ` at ${time}` : ""}</p>
          <p><UserRound size={16} /> {selectedTechnician?.name ?? "No Preference"}</p>
          {serviceIds.map((id) => <p key={id}><Check size={15} /> {catalog.services.find((service) => service.id === id)?.name}</p>)}
          {addonIds.map((id) => <p key={id}><Check size={15} /> {catalog.addons.find((addon) => addon.id === id)?.name}</p>)}
          <hr />
          <p>Duration <b>{quote?.durationMinutes ?? 0} min</b></p>
          <p>Subtotal <b>{money(quote?.subtotal || 0, quote?.currency || catalog.payment.currency)}</b></p>
          <p>Discount <b>-{money(quote?.discountAmount || 0, quote?.currency || catalog.payment.currency)}</b></p>
          <p>Tax <b>{money(quote?.taxAmount || 0, quote?.currency || catalog.payment.currency)}</b></p>
          <p>Due Today <b>{money(quote?.paymentAmount || 0, quote?.currency || catalog.payment.currency)}</b></p>
          <h3>Total {money(quote?.totalAmount || 0, quote?.currency || catalog.payment.currency)}</h3>
        </aside>
      </section>
    </PageShell>
  );
}

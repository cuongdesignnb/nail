"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, Sparkles, UserRound } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { addons, packages, services, technicians } from "@/lib/data";
import { calculateQuote } from "@/lib/pricing";

const today = new Date().toISOString().slice(0, 10);

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [technicianId, setTechnicianId] = useState("no-preference");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("10:00");
  const [promoCode, setPromoCode] = useState("");
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "", type: "New" as "New" | "Returning", reminderConsent: true });
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<{ bookingCode: string } | null>(null);
  const [error, setError] = useState("");
  const quote = useMemo(() => calculateQuote(serviceIds, addonIds, promoCode), [serviceIds, addonIds, promoCode]);
  const qualified = technicians.filter((tech) => serviceIds.length === 0 || serviceIds.every((id) => tech.serviceIds.includes(id)));
  const selectedTechnician = technicianId === "no-preference" ? qualified[0] : technicians.find((tech) => tech.id === technicianId);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceFromUrl = params.get("service");
    const packageFromUrl = params.get("package");
    const promoFromUrl = params.get("promo") ?? "";
    const packageServiceIds = packages.find((pkg) => pkg.id === packageFromUrl)?.serviceIds ?? [];
    if (serviceFromUrl) setServiceIds([serviceFromUrl]);
    if (!serviceFromUrl && packageServiceIds.length > 0) setServiceIds(packageServiceIds);
    if (promoFromUrl) setPromoCode(promoFromUrl);
  }, []);

  function toggle(list: string[], id: string, setter: (next: string[]) => void) {
    setter(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  }

  async function submitBooking() {
    setError("");
    const response = await fetch("/api/public/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceIds,
        addonIds,
        technicianId: selectedTechnician?.id ?? "",
        date,
        time,
        customer,
        notes,
        promotionCode: promoCode
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Booking failed");
      return;
    }
    setResult(payload.data);
  }

  if (result) {
    return (
      <PageShell eyebrow="Booking Confirmed" title="Your Appointment Request Is In" copy="A reception team member will confirm your deposit and appointment details.">
        <section className="lux-card booking-success">
          <h2>{result.bookingCode}</h2>
          <p>Please save your booking code. You will receive an email confirmation after deposit payment is verified.</p>
          <Link className="primary-btn" href="/">Back to Home</Link>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Online Booking" title="Book Your Appointment" copy="Choose services, technician, time and details in five simple steps.">
      <section className="booking-layout">
        <div className="booking-main">
          <div className="stepper">
            {["Service", "Technician", "Date & Time", "Details", "Confirm"].map((label, index) => (
              <button className={step === index + 1 ? "active" : ""} key={label} onClick={() => setStep(index + 1)}>
                {index + 1}. {label}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="booking-panel">
              <h3>Choose Service</h3>
              <div className="booking-options">
                {services.map((service) => (
                  <button className={serviceIds.includes(service.id) ? "selected" : ""} key={service.id} onClick={() => toggle(serviceIds, service.id, setServiceIds)}>
                    <Sparkles size={18} />
                    <b>{service.name}</b>
                    <span>{service.duration} min · ${service.price}</span>
                  </button>
                ))}
              </div>
              <h3>Add-ons</h3>
              <div className="booking-options compact-options">
                {addons.map((addon) => (
                  <button className={addonIds.includes(addon.id) ? "selected" : ""} key={addon.id} onClick={() => toggle(addonIds, addon.id, setAddonIds)}>
                    <b>{addon.name}</b>
                    <span>+{addon.duration} min · ${addon.price}</span>
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
                {qualified.map((tech) => (
                  <button className={technicianId === tech.id ? "selected" : ""} key={tech.id} onClick={() => setTechnicianId(tech.id)}>
                    <UserRound size={18} />
                    <b>{tech.name}</b>
                    <span>{tech.specialty} · {tech.rating} rating</span>
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
                {["10:00", "10:30", "11:00", "12:00", "13:30", "14:00", "15:30", "16:00", "17:30", "18:00"].map((slot) => (
                  <button className={time === slot ? "selected" : ""} key={slot} onClick={() => setTime(slot)}><Clock3 size={16} /> {slot}</button>
                ))}
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
              <select value={customer.type} onChange={(e) => setCustomer({ ...customer, type: e.target.value as "New" | "Returning" })}>
                <option>New</option>
                <option>Returning</option>
              </select>
              <input placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <textarea placeholder="Notes or special requests" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <label className="check-label"><input type="checkbox" checked={customer.reminderConsent} onChange={(e) => setCustomer({ ...customer, reminderConsent: e.target.checked })} /> Send appointment reminders</label>
            </div>
          )}

          {step === 5 && (
            <div className="booking-panel">
              <h3>Confirm Booking</h3>
              <p>Please review the summary and confirm your appointment request. Deposit status will be tracked as pending until payment is connected.</p>
              <label className="check-label"><input type="checkbox" defaultChecked /> I agree to the booking and cancellation policy.</label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-btn" onClick={submitBooking}>Confirm Booking <ArrowRight size={15} /></button>
            </div>
          )}

          <div className="booking-actions">
            <button className="secondary-btn" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}>Back</button>
            {step < 5 && <button className="primary-btn" disabled={step === 1 && serviceIds.length === 0} onClick={() => setStep(step + 1)}>Continue <ArrowRight size={15} /></button>}
          </div>
        </div>

        <aside className="booking-summary lux-card">
          <h3>Booking Summary</h3>
          <p><CalendarDays size={16} /> {date} at {time}</p>
          <p><UserRound size={16} /> {selectedTechnician?.name ?? "No Preference"}</p>
          {serviceIds.map((id) => <p key={id}><Check size={15} /> {services.find((service) => service.id === id)?.name}</p>)}
          <hr />
          <p>Duration <b>{quote.duration} min</b></p>
          <p>Subtotal <b>${quote.subtotal.toFixed(2)}</b></p>
          <p>Discount <b>-${quote.discountAmount.toFixed(2)}</b></p>
          <p>Tax <b>${quote.taxAmount.toFixed(2)}</b></p>
          <p>Deposit <b>${quote.depositAmount.toFixed(2)}</b></p>
          <h3>Total ${quote.totalAmount.toFixed(2)}</h3>
        </aside>
      </section>
    </PageShell>
  );
}

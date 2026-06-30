import { addons, business, promotions, services } from "./data";

export function calculateQuote(serviceIds: string[], addonIds: string[], promoCode?: string) {
  const selectedServices = services.filter((service) => serviceIds.includes(service.id));
  const selectedAddons = addons.filter((addon) => addonIds.includes(addon.id));
  const subtotal = selectedServices.reduce((sum, service) => sum + service.price, 0) + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const duration = selectedServices.reduce((sum, service) => sum + service.duration, 0) + selectedAddons.reduce((sum, addon) => sum + addon.duration, 0);
  const promotion = promotions.find((item) => item.active && item.code.toLowerCase() === promoCode?.toLowerCase());
  const discountAmount = promotion ? (promotion.discountType === "percentage" ? subtotal * (promotion.amount / 100) : promotion.amount) : 0;
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxable * business.taxRate;
  const totalAmount = taxable + taxAmount;
  const depositAmount = totalAmount * business.depositRate;

  return {
    subtotal: round(subtotal),
    duration,
    discountAmount: round(discountAmount),
    taxAmount: round(taxAmount),
    depositAmount: round(depositAmount),
    totalAmount: round(totalAmount),
    promotion
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

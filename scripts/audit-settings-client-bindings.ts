import fs from "node:fs";

const checks: Array<[string, string, RegExp]> = [
  ["Homepage uses Public Settings", "components/home/HomeClient.tsx", /PublicSiteSettings/],
  ["Contact uses Public Settings", "app/(site)/contact/page.tsx", /getPublicSiteSettings/],
  ["Shell uses Public Settings", "lib/site-shell/public-shell.service.ts", /getPublicSiteSettings/],
  ["Booking catalog uses Public Settings", "lib/payments/booking-checkout/checkout.service.ts", /getPublicSiteSettings/],
  ["Normal booking is pay-at-salon", "lib/payments/booking-checkout/checkout.service.ts", /chargeMode:\s*"pay_at_salon"/],
  ["Booking has no PayPal import", "lib/payments/booking-checkout/checkout.service.ts", /paypal/i],
  ["Legacy fixture availability is retired", "app/api/public/availability/route.ts", /status:\s*410/],
];
let failed = false;
for (const [label, file, pattern] of checks) {
  const source = fs.readFileSync(file, "utf8");
  const shouldBeAbsent = label.includes("no PayPal");
  const pass = shouldBeAbsent ? !pattern.test(source) : pattern.test(source);
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;

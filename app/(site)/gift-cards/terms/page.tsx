export default function GiftCardTermsPage() {
  const terms = [
    "Gift Cards are redeemable in salon at Aera Nail Lounge.",
    "Amount Gift Cards may be used partially until the remaining balance is depleted.",
    "Service Gift Cards are valid for the selected service snapshot. Upgrades may be paid in person at the salon.",
    "Gift Cards are not redeemable for cash and are not automatically applied during online booking.",
    "Please present the Gift Card code and recipient email during checkout.",
  ];
  return (
    <main className="bg-[#fbf4e8] px-4 py-16 text-[#3d2d24]">
      <section className="mx-auto max-w-3xl rounded-[28px] border border-[#ead9bd] bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9a6a46]">Gift Cards</p>
        <h1 className="mt-3 font-serif text-5xl">Terms & Conditions</h1>
        <ul className="mt-8 space-y-4 text-[#725744]">
          {terms.map((term) => <li key={term} className="rounded-2xl bg-[#fffaf1] p-4">{term}</li>)}
        </ul>
      </section>
    </main>
  );
}

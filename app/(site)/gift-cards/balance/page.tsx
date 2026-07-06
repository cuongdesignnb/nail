import { GiftCardBalanceForm } from "@/components/gift-cards/GiftCardBalanceForm";

export default function GiftCardBalancePage() {
  return (
    <main className="bg-[#fbf4e8] px-4 py-16 text-[#3d2d24]">
      <section className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9a6a46]">Gift Cards</p>
        <h1 className="mt-3 font-serif text-5xl">Check Balance</h1>
        <p className="mt-4 text-[#725744]">Enter the Gift Card code and recipient email to view the current balance.</p>
      </section>
      <GiftCardBalanceForm />
    </main>
  );
}

import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { promotions } from "@/lib/data";

export default function AdminPromotionsPage() {
  return <AdminTablePage title="Promotions" copy="Create promo codes, validity windows and usage restrictions." headers={["Code", "Title", "Amount", "First Booking", "Active"]} rows={promotions.map((promo) => [promo.code, promo.title, promo.amount, promo.firstBookingOnly ? "Yes" : "No", promo.active ? "Yes" : "No"])} />;
}

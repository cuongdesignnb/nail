import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { reviews } from "@/lib/data";

export default function AdminReviewsPage() {
  return <AdminTablePage title="Reviews" copy="Approve, hide and reply to client feedback." headers={["Customer", "Rating", "Review", "Status"]} rows={reviews.map((review) => [review.customer, review.rating, review.text, review.approved ? "Approved" : "Hidden"])} />;
}

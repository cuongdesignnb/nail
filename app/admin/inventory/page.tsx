import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { inventory } from "@/lib/data";

export default function AdminInventoryPage() {
  return <AdminTablePage title="Inventory" copy="Track stock, suppliers, reorder levels and movement history." headers={["Item", "SKU", "Category", "Stock", "Reorder", "Supplier"]} rows={inventory.map((item) => [item.name, item.sku, item.category, item.currentStock, item.reorderLevel, item.supplier])} />;
}

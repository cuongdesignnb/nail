// ═══════════════════════════════════════════════════════════════════════
// AERA NAIL LOUNGE — Admin UI Development Fixtures
// ═══════════════════════════════════════════════════════════════════════
//
// ⚠️ WARNING: These are DEVELOPMENT-ONLY typed fixtures for UI component
// development and testing. They must NEVER be imported by production
// Admin page routes. They must NEVER be used as fallback data when
// APIs fail. API failures must show real Error States with Retry action.
//
// To verify: Search for imports of this file. If any production page
// (app/admin/*) imports from here, it is a bug.
// ═══════════════════════════════════════════════════════════════════════

/* ── Type Definitions ──────────────────────────────────────────────── */

export interface AdminBookingListItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  services: string[];
  technician: string;
  scheduledStartAt: string;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  chargeMode: string | null;
  paidAmount: number;
  totalAmount: number;
}

export interface AdminCustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalPaid: number;
  lastPaymentDate: string | null;
  paymentProvider: string | null;
}

export interface AdminDashboardMetrics {
  appointments: { value: number; change: number | null; trend: 'up' | 'down' | 'neutral' | 'new' };
  revenue: { value: number; change: number | null; trend: 'up' | 'down' | 'neutral' | 'new' };
  newClients: { value: number; change: number | null; trend: 'up' | 'down' | 'neutral' | 'new' };
  averageRating: { value: number; change: number | null; trend: 'up' | 'down' | 'neutral' | 'new' };
}

export interface AdminInventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  supplier: string | null;
  costPerUnit: number | null;
}

export interface AdminNotificationItem {
  id: string;
  type: 'booking' | 'review' | 'inventory' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

/* ── Sample Fixture Data (Development Only) ────────────────────────── */

export const FIXTURE_BOOKINGS: AdminBookingListItem[] = [
  {
    id: "fix-001",
    bookingCode: "AERA-2024-001",
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    services: ["Gel Manicure", "Spa Pedicure"],
    technician: "Sarah L.",
    scheduledStartAt: new Date().toISOString(),
    status: "Confirmed",
    paymentStatus: "Paid",
    paymentProvider: "PayPal",
    chargeMode: "full",
    paidAmount: 95.00,
    totalAmount: 95.00,
  },
  {
    id: "fix-002",
    bookingCode: "AERA-2024-002",
    customerName: "Emily Smith",
    customerEmail: "emily@example.com",
    services: ["Classic Manicure"],
    technician: "Any",
    scheduledStartAt: new Date(Date.now() + 86400000).toISOString(),
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentProvider: "PayPal",
    chargeMode: null,
    paidAmount: 0,
    totalAmount: 45.00,
  },
];

export const FIXTURE_CUSTOMERS: AdminCustomerListItem[] = [
  {
    id: "cust-001",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "(310) 555-0101",
    totalBookings: 12,
    totalPaid: 1140.00,
    lastPaymentDate: "2024-03-15T10:30:00Z",
    paymentProvider: "PayPal",
  },
];

export const FIXTURE_INVENTORY: AdminInventoryItem[] = [
  {
    id: "inv-001",
    name: "OPI Gel Base Coat",
    sku: "OPI-GBC-001",
    category: "Gel Polish",
    currentStock: 8,
    reorderLevel: 5,
    unit: "bottle",
    supplier: "OPI International",
    costPerUnit: 12.50,
  },
  {
    id: "inv-002",
    name: "Acetone Remover",
    sku: "ACE-REM-001",
    category: "Supplies",
    currentStock: 2,
    reorderLevel: 10,
    unit: "gallon",
    supplier: "Sally Beauty",
    costPerUnit: 8.99,
  },
];

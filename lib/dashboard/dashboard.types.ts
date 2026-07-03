// ---------------------------------------------------------------------------
// Dashboard type definitions
// ---------------------------------------------------------------------------

export type DateRangeKey = 'today' | '7d' | '30d' | 'month' | 'year' | 'custom';

export interface DateRange {
  key: DateRangeKey;
  from: Date;
  to: Date;
  previousFrom: Date;
  previousTo: Date;
  label: string;
}

export interface DashboardKpi {
  label: string;
  value: number;
  previousValue: number;
  formattedValue: string;
  change: number | null;          // percentage
  changeLabel: string;            // "+12%", "New", "No change"
  trend: 'up' | 'down' | 'neutral' | 'new';
}

export interface DashboardAppointment {
  id: string;
  bookingCode: string;
  customerName: string;
  services: string[];
  technicianName: string | null;
  scheduledStartAt: string;
  scheduledEndAt: string;
  status: string;
  totalAmount: number;
}

export interface DashboardOverview {
  meta: {
    range: {
      key: string;
      from: string;
      to: string;
      timezone: string;
      currency: string;
    };
    generatedAt: string;
  };

  kpis: {
    appointments: DashboardKpi;
    collectedRevenue: DashboardKpi;
    newClients: DashboardKpi;
    averageRating: DashboardKpi;
  };

  revenueSeries: Array<{ date: string; label: string; value: number }>;
  bookingStatus: Array<{ status: string; count: number }>;

  todaySchedule: DashboardAppointment[];
  upcomingAppointments: DashboardAppointment[];

  topTechnicians: Array<{
    id: string;
    name: string;
    avatar: string | null;
    completedAppointments: number;
    bookedValue: number;
    rating: number | null;
  }>;

  topServices: Array<{
    id: string;
    name: string;
    bookingCount: number;
    revenue: number;
  }>;

  inventoryAlerts: Array<{
    id: string;
    name: string;
    currentStock: number;
    reorderLevel: number;
    unit: string;
  }>;

  recentReviews: Array<{
    id: string;
    customer: string;
    rating: number;
    text: string;
    createdAt: string;
  }>;

  serviceCategoryDistribution: Array<{
    id: string;
    name: string;
    count: number;
    percentage: number;
  }>;

  atAGlance: AtAGlance;
}

// ---------------------------------------------------------------------------
// Backward-compatible type aliases (used by existing UI components)
// ---------------------------------------------------------------------------

export type AtAGlance = {
  totalClients: number;
  activeTechnicians: number;
  activeServices: number;
  activePackages: number;
  activePromotions: number;
  pendingConfirmations: number;
  lowStockItems: number;
};

export type TopTechnician = {
  id: string;
  name: string;
  avatar: string | null;
  role?: string;
  appointments: number;
  revenue: number;
  completedAppointments?: number;
  bookedValue?: number;
  rating?: number | null;
};

export type TopService = {
  id: string;
  name: string;
  category?: string;
  count: number;
  revenue: number;
  bookingCount?: number;
};

export type InventoryAlert = {
  id: string;
  name: string;
  sku?: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
};

export type DashboardReview = {
  id: string;
  customer: string;
  rating: number;
  text: string;
  date?: string;
  createdAt?: string;
};

export type ServiceCategoryData = {
  id?: string;
  category: string;
  name?: string;
  count: number;
  revenue?: number;
  percentage?: number;
};

export type RevenueDataPoint = {
  date: string;
  label: string;
  value: number;
};

export type BookingStatusData = {
  status: string;
  count: number;
};

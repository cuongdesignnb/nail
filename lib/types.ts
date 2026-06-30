export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Checked In"
  | "In Service"
  | "Completed"
  | "Cancelled"
  | "No Show";

export type PaymentStatus =
  | "Unpaid"
  | "Deposit Pending"
  | "Deposit Paid"
  | "Partially Paid"
  | "Paid"
  | "Refunded"
  | "Failed";

export type Service = {
  id: string;
  slug: string;
  category: string;
  name: string;
  description: string;
  longDescription: string;
  duration: number;
  price: number;
  image: string;
  addons: string[];
  technicianIds: string[];
  faqs: { question: string; answer: string }[];
};

export type Technician = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialty: string;
  rating: number;
  experience: string;
  serviceIds: string[];
};

export type Package = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  serviceIds: string[];
  featured?: boolean;
};

export type Booking = {
  id: string;
  bookingCode: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: "New" | "Returning";
    reminderConsent: boolean;
  };
  serviceIds: string[];
  addonIds: string[];
  technicianId: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  depositAmount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  internalNotes?: string;
  promotionCode?: string;
  createdAt: string;
  updatedAt: string;
};

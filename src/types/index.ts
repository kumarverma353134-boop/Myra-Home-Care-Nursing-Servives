/**
 * MYRA Home Care Nursing Services - Core Type Definitions
 * Patna, Bihar, India | Contact: 8893671162
 */

export type UserRole = 'customer' | 'staff' | 'manager' | 'owner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified?: boolean; // For staff
  qualification?: string; // For staff
  designation?: string; // For staff
  verificationDate?: string;
  verifiedBy?: string;
  status: 'active' | 'pending_approval' | 'suspended';
  sessionExpiryMinutes?: number;
}

export interface PatientProfile {
  id: string;
  customerId: string;
  fullName: string;
  relationship: string; // Father, Mother, Child, Self, Other
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  medicalConditions: string;
  specialCareInstructions?: string;
}

export interface SavedAddress {
  id: string;
  customerId: string;
  label: string; // Home, Clinic, Parent's House
  fullAddress: string;
  landmark: string;
  city: string; // Patna
  pincode: string;
  isDefault?: boolean;
}

export interface HealthcareService {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  category: 'Critical Care' | 'General Nursing' | 'Specialized Procedures' | 'Rehabilitation' | 'Medical Equipment';
  shortDesc: string;
  fullDesc: string;
  features: string[];
  durationOptions: string[];
  startingPrice: number;
  isAvailable24x7: boolean;
  isActive: boolean;
  badge?: string;
  icon?: string;
}

export type BookingStatus = 
  | 'pending_quotation'
  | 'quotation_sent'
  | 'quotation_rejected'
  | 'quotation_accepted'
  | 'staff_assigned'
  | 'staff_accepted'
  | 'staff_unable'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'upi';
export type PaymentStatus = 'pending' | 'submitted_verification' | 'verified_paid' | 'rejected' | 'refunded';

export interface BookingQuotation {
  id: string;
  amount: number;
  notes: string;
  validUntil: string; // 72 hours from generation
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. MYRA-2026-1042
  customerId: string;
  customerName: string;
  customerPhone: string;
  patientId: string;
  patientName: string;
  patientRelation: string;
  patientAge: number;
  serviceId: string;
  serviceName: string;
  bookingType: 'asap' | 'scheduled';
  startDate: string;
  shiftDuration: string; // e.g. 12 Hours Day, 24 Hours, Single Visit
  address: string;
  landmark?: string;
  careNotes?: string;
  source: 'website' | 'phone' | 'whatsapp' | 'ai_assistant';
  status: BookingStatus;
  quotation?: BookingQuotation;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffDesignation?: string;
  assignedStaffQualification?: string;
  assignedStaffPhoto?: string;
  staffAcceptedAt?: string;
  staffUnableReason?: string;
  serviceStartedAt?: string;
  serviceCompletedAt?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  upiTransactionId?: string;
  paidAt?: string;
  verifiedBy?: string;
  createdAt: string;
  rescheduleRequested?: {
    requestedDate: string;
    requestedTime: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface StaffSchedule {
  id: string;
  staffId: string;
  staffName: string;
  bookingId?: string;
  serviceName: string;
  patientName: string;
  location: string;
  date: string;
  shift: string;
  startTime?: string;
  endTime?: string;
  status: 'upcoming' | 'checked_in' | 'completed' | 'leave';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // e.g. customer_manager_123 or manager_staff_456
  channel: 'customer_manager' | 'manager_staff';
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  bookingId?: string;
  category: 'Billing' | 'Staff Conduct' | 'Service Quality' | 'Scheduling' | 'General Query';
  priority: 'High' | 'Medium' | 'Low';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface CustomerReview {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  rating: number; // 1 to 5
  reviewText: string;
  isApproved: boolean; // Must be approved by Owner to show publicly
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  category: 'Booking' | 'Staff' | 'Payment' | 'Security' | 'Settings' | 'Review' | 'Quotation';
  recordId?: string;
  timestamp: string;
  details: string;
}

export interface SystemSettings {
  businessName: string;
  brandName: string;
  phone: string;
  secondaryPhone: string;
  whatsapp: string;
  email: string;
  location: string;
  heroTitle: string;
  heroSubtitle: string;
  stat1Title: string;
  stat1Desc: string;
  stat2Title: string;
  stat2Desc: string;
  stat3Title: string;
  stat3Desc: string;
  infoTitle: string;
  infoDesc: string;
  teamPills: string[];
  upiId: string;
  upiPayeeName: string;
  isUpiEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessageHi: string;
  maintenanceMessageEn: string;
  expectedReopenTime: string;
  publicReviewsEnabled: boolean;
  appDownloadSectionEnabled: boolean;
  appTitle: string;
  appDescription: string;
  appStatusText: string;
  appAvailable: boolean;
  apkDownloadUrl: string;
  appVersion: string;
  allowCustomerRegistration: boolean;
  allowNewBookings: boolean;
  emergencyDisclaimer: string;
  announcementText?: string;
  announcementActive: boolean;
  sessionTimeoutMinutes: number;
}

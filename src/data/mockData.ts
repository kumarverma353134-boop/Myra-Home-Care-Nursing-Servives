import { 
  UserProfile, 
  PatientProfile, 
  SavedAddress, 
  Booking, 
  StaffSchedule, 
  SupportTicket, 
  CustomerReview, 
  ActivityLog, 
  SystemSettings,
  ChatMessage 
} from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  businessName: 'MYRA Home Care Nursing Services',
  brandName: 'MYRA HomeCare',
  phone: '88936 71162',
  secondaryPhone: '88936 59849',
  whatsapp: '+91 88936 59849',
  email: 'myrahomecareservices@gmail.com',
  location: 'Patna, Bihar, India',
  heroTitle: 'Better Care ❤️ Better Life',
  heroSubtitle: 'आपके भरोसेमंद साथी — घर पर ही बेहतर ईलाज। Professional home care nursing, patient attendants & medical support at your doorstep in Patna.',
  stat1Title: 'Male & Female Staff',
  stat1Desc: 'Available · मेल एवं फीमेल स्टाफ उपलब्ध',
  stat2Title: '24/7 Service Support',
  stat2Desc: 'Because Your Health Matters ❤️',
  stat3Title: 'Patna, Bihar',
  stat3Desc: 'Room / Home care ke liye संपर्क करें',
  infoTitle: 'Care with responsibility',
  infoDesc: "Share the patient's care requirement, location and preferred timing with our manager. The team will confirm the suitable service, quotation and staff availability before booking.",
  teamPills: ['Male Staff', 'Female Staff', 'Nursing Support', 'Patient Attendants', 'Home Sample Collection', 'Medicine Delivery'],
  upiId: '8893671162@okbizaxis',
  upiPayeeName: 'MYRA HomeCare Services',
  isUpiEnabled: true,
  maintenanceMode: false,
  maintenanceMessageHi: 'हमारी वेबसाइट रखरखाव के अधीन है। आपातकालीन नर्सिंग सहायता हेतु सीधे 8893671162 पर कॉल करें।',
  maintenanceMessageEn: 'Our website is undergoing scheduled maintenance. For immediate nursing assistance, call 8893671162 directly.',
  expectedReopenTime: '2 Hours',
  publicReviewsEnabled: true,
  appDownloadSectionEnabled: true,
  appTitle: 'MYRA Mobile App',
  appDescription: 'The official app download will appear here when MYRA publishes a release.',
  appStatusText: 'APP NOT AVAILABLE YET',
  appAvailable: false,
  apkDownloadUrl: 'https://myrahomecare.in/downloads/myra-app-v1.0.apk',
  appVersion: '1.0.0-PROD',
  allowCustomerRegistration: true,
  allowNewBookings: true,
  emergencyDisclaimer: 'Important: MYRA Home Care provides supportive home nursing & care attendant assistance. We are not an ambulance or emergency hospital substitute. In acute medical crises, call 108 or proceed to the nearest hospital emergency department immediately.',
  announcementText: '24x7 Verified Nursing Support now operational across all major areas of Patna: Boring Road, Kankarbagh, Bailey Road, Patliputra & Danapur.',
  announcementActive: true,
  sessionTimeoutMinutes: 30
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-owner-1',
    name: 'MYRA Business Administrator',
    email: 'myrahomecareservices@gmail.com',
    phone: '8893671162',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-manager-1',
    name: 'Vikram Singh (Operations Lead)',
    email: 'manager.myra@gmail.com',
    phone: '9508745152',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:30:00Z',
    status: 'active'
  },
  {
    id: 'usr-staff-1',
    name: 'Pooja Sharma, RN',
    email: 'pooja.nurse@gmail.com',
    phone: '9835012345',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1594824813579-3172c9a35e4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T11:00:00Z',
    isVerified: true,
    qualification: 'B.Sc Nursing (RNC Registered)',
    designation: 'Senior Critical Care Staff Nurse',
    verificationDate: '2026-02-03',
    verifiedBy: 'MYRA Business Administrator',
    status: 'active'
  },
  {
    id: 'usr-staff-2',
    name: 'Rajesh Kumar, GNM',
    email: 'rajesh.gnm@gmail.com',
    phone: '9835067890',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T14:20:00Z',
    isVerified: true,
    qualification: 'General Nursing & Midwifery (GNM)',
    designation: 'Bedside & Post-Surgical Care Nurse',
    verificationDate: '2026-02-12',
    verifiedBy: 'MYRA Business Administrator',
    status: 'active'
  },
  {
    id: 'usr-staff-3',
    name: 'Anjali Kumari',
    email: 'anjali.care@gmail.com',
    phone: '9835044421',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T10:00:00Z',
    isVerified: false,
    qualification: 'Diploma in Patient Attendant & First Aid',
    designation: 'Elderly Care Assistant',
    status: 'pending_approval'
  },
  {
    id: 'usr-customer-1',
    name: 'Kumar Verma',
    email: 'kumarverma353134@gmail.com',
    phone: '9876543210',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T16:00:00Z',
    status: 'active'
  }
];

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-1',
    customerId: 'usr-customer-1',
    fullName: 'Ramakant Verma',
    relationship: 'Father',
    age: 68,
    gender: 'male',
    bloodGroup: 'B+',
    medicalConditions: 'Post-stroke hemiplegia, Hypertension, Type-2 Diabetes',
    specialCareInstructions: 'Needs 2-hourly turning in bed to prevent decubitus ulcers. Strict sugar-free diabetic diet.'
  },
  {
    id: 'pat-2',
    customerId: 'usr-customer-1',
    fullName: 'Sunita Verma',
    relationship: 'Mother',
    age: 63,
    gender: 'female',
    bloodGroup: 'O+',
    medicalConditions: 'Osteoarthritis bilateral knees, Mild COPD',
    specialCareInstructions: 'Daily vital checks (SpO2 & BP) and gentle range-of-motion leg physiotherapy.'
  }
];

export const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    customerId: 'usr-customer-1',
    label: 'Home (Boring Road)',
    fullAddress: 'Flat 302, Shanti Vihar Apartment, East Boring Canal Road',
    landmark: 'Near Panchmukhi Hanuman Mandir',
    city: 'Patna',
    pincode: '800001',
    isDefault: true
  },
  {
    id: 'addr-2',
    customerId: 'usr-customer-1',
    label: "Parents' House (Kankarbagh)",
    fullAddress: 'House No. 42, Road No. 4, Rajendra Nagar / Kankarbagh Colony',
    landmark: 'Opposite Shivaji Park',
    city: 'Patna',
    pincode: '800020',
    isDefault: false
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-101',
    bookingNumber: 'MYRA-2026-0101',
    customerId: 'usr-customer-1',
    customerName: 'Kumar Verma',
    customerPhone: '9876543210',
    patientId: 'pat-1',
    patientName: 'Ramakant Verma',
    patientRelation: 'Father',
    patientAge: 68,
    serviceId: 'srv-1',
    serviceName: '12/24 Hr General Nursing Care',
    bookingType: 'scheduled',
    startDate: '2026-11-05',
    shiftDuration: '12 Hours Day Shift',
    address: 'Flat 302, Shanti Vihar Apartment, East Boring Canal Road, Patna - 800001',
    landmark: 'Near Panchmukhi Hanuman Mandir',
    careNotes: 'Need a compassionate nurse for day duty. Assist with sponge bath, sugar tracking, and Ryle’s tube feeding.',
    source: 'website',
    status: 'in_progress',
    quotation: {
      id: 'quot-101',
      amount: 1200,
      notes: '12-Hour Day Shift Nursing Care inclusive of travel & sterile vitals charting kit.',
      validUntil: '2026-11-08T18:00:00Z',
      createdAt: '2026-11-04T08:00:00Z',
      status: 'accepted'
    },
    assignedStaffId: 'usr-staff-1',
    assignedStaffName: 'Pooja Sharma, RN',
    assignedStaffDesignation: 'Senior Critical Care Staff Nurse',
    assignedStaffQualification: 'B.Sc Nursing (RNC Registered)',
    assignedStaffPhoto: 'https://images.unsplash.com/photo-1594824813579-3172c9a35e4e?w=150&auto=format&fit=crop&q=80',
    staffAcceptedAt: '2026-11-04T09:15:00Z',
    serviceStartedAt: '2026-11-04T08:00:00Z',
    paymentMethod: 'upi',
    paymentStatus: 'verified_paid',
    paymentAmount: 1200,
    upiTransactionId: 'UPI492817291048',
    paidAt: '2026-11-04T08:45:00Z',
    verifiedBy: 'Vikram Singh (Operations Lead)',
    createdAt: '2026-11-03T16:20:00Z'
  },
  {
    id: 'book-102',
    bookingNumber: 'MYRA-2026-0102',
    customerId: 'usr-customer-1',
    customerName: 'Kumar Verma',
    customerPhone: '9876543210',
    patientId: 'pat-2',
    patientName: 'Sunita Verma',
    patientRelation: 'Mother',
    patientAge: 63,
    serviceId: 'srv-6',
    serviceName: 'Physiotherapy & Rehabilitation',
    bookingType: 'asap',
    startDate: '2026-11-05',
    shiftDuration: 'Single 45-60 min Session',
    address: 'House No. 42, Road No. 4, Rajendra Nagar / Kankarbagh Colony, Patna - 800020',
    landmark: 'Opposite Shivaji Park',
    careNotes: 'Knee mobilization physiotherapy for severe bilateral osteoarthritis.',
    source: 'ai_assistant',
    status: 'quotation_sent',
    quotation: {
      id: 'quot-102',
      amount: 700,
      notes: 'Consultation & manual therapy with portable electro-modality by registered BPT therapist.',
      validUntil: '2026-11-07T12:00:00Z',
      createdAt: '2026-11-04T12:00:00Z',
      status: 'pending'
    },
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    paymentAmount: 700,
    createdAt: '2026-11-04T11:45:00Z'
  },
  {
    id: 'book-103',
    bookingNumber: 'MYRA-2026-0103',
    customerId: 'usr-customer-1',
    customerName: 'Kumar Verma',
    customerPhone: '9876543210',
    patientId: 'pat-1',
    patientName: 'Ramakant Verma',
    patientRelation: 'Father',
    patientAge: 68,
    serviceId: 'srv-8',
    serviceName: 'Injection & IV Infusion Administration',
    bookingType: 'scheduled',
    startDate: '2026-10-28',
    shiftDuration: 'Single Procedure Visit',
    address: 'Flat 302, Shanti Vihar Apartment, East Boring Canal Road, Patna - 800001',
    careNotes: 'IV Multivitamin infusion administered safely as per doctor prescription.',
    source: 'website',
    status: 'completed',
    quotation: {
      id: 'quot-103',
      amount: 350,
      notes: 'Sterile IV cannulation and infusion monitoring visit.',
      validUntil: '2026-10-30T10:00:00Z',
      createdAt: '2026-10-27T10:00:00Z',
      status: 'accepted'
    },
    assignedStaffId: 'usr-staff-2',
    assignedStaffName: 'Rajesh Kumar, GNM',
    assignedStaffDesignation: 'Bedside & Post-Surgical Care Nurse',
    assignedStaffQualification: 'General Nursing & Midwifery (GNM)',
    assignedStaffPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    staffAcceptedAt: '2026-10-27T14:00:00Z',
    serviceStartedAt: '2026-10-28T10:00:00Z',
    serviceCompletedAt: '2026-10-28T11:15:00Z',
    paymentMethod: 'cash',
    paymentStatus: 'verified_paid',
    paymentAmount: 350,
    paidAt: '2026-10-28T11:10:00Z',
    verifiedBy: 'Vikram Singh (Operations Lead)',
    createdAt: '2026-10-27T09:10:00Z'
  }
];

export const INITIAL_SCHEDULES: StaffSchedule[] = [
  {
    id: 'sch-1',
    staffId: 'usr-staff-1',
    staffName: 'Pooja Sharma, RN',
    bookingId: 'book-101',
    serviceName: '12/24 Hr General Nursing Care',
    patientName: 'Ramakant Verma',
    location: 'East Boring Canal Road, Patna',
    date: '2026-11-04',
    shift: '08:00 AM - 08:00 PM',
    status: 'checked_in',
    checkInTime: '07:55 AM'
  },
  {
    id: 'sch-2',
    staffId: 'usr-staff-1',
    staffName: 'Pooja Sharma, RN',
    bookingId: 'book-101',
    serviceName: '12/24 Hr General Nursing Care',
    patientName: 'Ramakant Verma',
    location: 'East Boring Canal Road, Patna',
    date: '2026-11-05',
    shift: '08:00 AM - 08:00 PM',
    status: 'upcoming'
  },
  {
    id: 'sch-3',
    staffId: 'usr-staff-2',
    staffName: 'Rajesh Kumar, GNM',
    bookingId: 'book-103',
    serviceName: 'Injection & IV Infusion Administration',
    patientName: 'Ramakant Verma',
    location: 'East Boring Canal Road, Patna',
    date: '2026-10-28',
    shift: '10:00 AM - 11:30 AM',
    status: 'completed',
    checkInTime: '09:58 AM',
    checkOutTime: '11:20 AM'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'SUP-401',
    customerId: 'usr-customer-1',
    customerName: 'Kumar Verma',
    customerPhone: '9876543210',
    bookingId: 'book-101',
    category: 'Scheduling',
    priority: 'Medium',
    subject: 'Requesting shift extension by 2 hours tomorrow',
    description: 'Hello, our family doctor might visit at 8:30 PM tomorrow. Can Pooja Sister extend the shift until 10:00 PM?',
    status: 'in_progress',
    createdAt: '2026-11-04T10:30:00Z'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    bookingId: 'book-103',
    customerId: 'usr-customer-1',
    customerName: 'Kumar Verma',
    serviceName: 'Injection & IV Infusion Administration',
    rating: 5,
    reviewText: 'Nurse Rajesh Kumar was exceptionally polite, clean, and gentle with my elderly father in Patna. The IV cannula was placed in one attempt without pain.',
    isApproved: true,
    createdAt: '2026-10-29T10:00:00Z'
  },
  {
    id: 'rev-2',
    bookingId: 'book-99',
    customerId: 'usr-cust-2',
    customerName: 'Dr. Anand Kishore (Danapur)',
    serviceName: 'ICU Setup & Critical Care at Home',
    rating: 5,
    reviewText: 'Setting up the ventilator and oxygen concentrator at our Danapur home was handled with complete hospital-grade professionalism. Life-saving service in Patna!',
    isApproved: true,
    createdAt: '2026-10-25T14:30:00Z'
  },
  {
    id: 'rev-3',
    bookingId: 'book-98',
    customerId: 'usr-cust-3',
    customerName: 'Suman Sinha (Kankarbagh)',
    serviceName: 'Elderly & Geriatric Care',
    rating: 5,
    reviewText: 'My mother is 82 and needed daily assisted walking and medication reminders. The MYRA attendant treats her just like her own grandmother.',
    isApproved: true,
    createdAt: '2026-10-20T11:00:00Z'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    actorId: 'usr-owner-1',
    actorName: 'MYRA Business Administrator',
    actorRole: 'owner',
    action: 'Approved Staff Verification',
    category: 'Staff',
    recordId: 'usr-staff-1',
    timestamp: '2026-02-03T11:30:00Z',
    details: 'Verified Pooja Sharma B.Sc Nursing degree and RNC registration credentials physically.'
  },
  {
    id: 'log-2',
    actorId: 'usr-manager-1',
    actorName: 'Vikram Singh',
    actorRole: 'manager',
    action: 'Verified UPI Payment',
    category: 'Payment',
    recordId: 'book-101',
    timestamp: '2026-11-04T08:45:00Z',
    details: 'Confirmed bank credit for UTR UPI492817291048 (₹1200) for booking MYRA-2026-0101.'
  },
  {
    id: 'log-3',
    actorId: 'usr-manager-1',
    actorName: 'Vikram Singh',
    actorRole: 'manager',
    action: 'Generated Quotation',
    category: 'Quotation',
    recordId: 'book-102',
    timestamp: '2026-11-04T12:00:00Z',
    details: 'Generated 72-hour valid quotation of ₹700 for Physiotherapy session.'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'customer_manager_book-101',
    channel: 'customer_manager',
    senderId: 'usr-customer-1',
    senderName: 'Kumar Verma',
    senderRole: 'customer',
    text: 'Namaste Vikram ji, Nurse Pooja has arrived safely at our residence. Thank you for the punctual coordination.',
    timestamp: '2026-11-04T08:05:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    conversationId: 'customer_manager_book-101',
    channel: 'customer_manager',
    senderId: 'usr-manager-1',
    senderName: 'Vikram Singh (Manager)',
    senderRole: 'manager',
    text: 'Namaste Kumar ji! Glad to hear. If you need any document verification or prescription updates, please feel free to send them on our WhatsApp: 8893671162.',
    timestamp: '2026-11-04T08:08:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    conversationId: 'manager_staff_usr-staff-1',
    channel: 'manager_staff',
    senderId: 'usr-manager-1',
    senderName: 'Vikram Singh (Manager)',
    senderRole: 'manager',
    text: 'Pooja Sister, please ensure you check Mr. Ramakant blood sugar before and after lunch, and chart in the physical register.',
    timestamp: '2026-11-04T07:40:00Z',
    isRead: true
  },
  {
    id: 'msg-4',
    conversationId: 'manager_staff_usr-staff-1',
    channel: 'manager_staff',
    senderId: 'usr-staff-1',
    senderName: 'Pooja Sharma, RN',
    senderRole: 'staff',
    text: 'Yes Sir, already checked fasting blood sugar (138 mg/dL). Will report again at 2 PM.',
    timestamp: '2026-11-04T08:15:00Z',
    isRead: true
  }
];

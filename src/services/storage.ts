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
  ChatMessage, 
  HealthcareService,
  UserRole
} from '../types';
import { MYRA_SERVICES } from '../data/servicesData';
import { 
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_PATIENTS, 
  INITIAL_ADDRESSES, 
  INITIAL_BOOKINGS, 
  INITIAL_SCHEDULES, 
  INITIAL_TICKETS, 
  INITIAL_REVIEWS, 
  INITIAL_LOGS, 
  INITIAL_CHATS 
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'myra_current_user',
  SETTINGS: 'myra_system_settings',
  USERS: 'myra_users_db',
  SERVICES: 'myra_services_db',
  BOOKINGS: 'myra_bookings_db',
  PATIENTS: 'myra_patients_db',
  ADDRESSES: 'myra_addresses_db',
  SCHEDULES: 'myra_schedules_db',
  TICKETS: 'myra_tickets_db',
  REVIEWS: 'myra_reviews_db',
  LOGS: 'myra_logs_db',
  CHATS: 'myra_chats_db',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDatabase();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('myra_')) this.notify();
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (err) {
      console.error(`Failed to save to localStorage (${key}):`, err);
    }
  }

  public initDatabase(forceReset = false) {
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
      this.setItem(STORAGE_KEYS.SERVICES, MYRA_SERVICES);
      this.setItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      this.setItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
      this.setItem(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
      this.setItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
      this.setItem(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
      this.setItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      this.setItem(STORAGE_KEYS.LOGS, INITIAL_LOGS);
      this.setItem(STORAGE_KEYS.CHATS, INITIAL_CHATS);

      // Default active session is Customer
      this.setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS.find(u => u.role === 'customer'));
    }
  }

  // --- Auth & Current User ---
  public getCurrentUser(): UserProfile | null {
    return this.getItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  public setCurrentUser(user: UserProfile | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    if (user) {
      this.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'User Logged In',
        category: 'Security',
        details: `${user.role.toUpperCase()} session started for ${user.email}.`
      });
    }
  }

  public switchRole(role: UserRole): UserProfile {
    const users = this.getUsers();
    let target = users.find(u => u.role === role);
    if (!target) {
      target = {
        id: `usr-${role}-${Date.now()}`,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${role}@myrahomecare.in`,
        phone: '8893671162',
        role,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      this.saveUser(target);
    }
    this.setCurrentUser(target);
    return target;
  }

  public getUsers(): UserProfile[] {
    return this.getItem<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public saveUser(user: UserProfile): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  // --- Settings ---
  public getSettings(): SystemSettings {
    const saved = this.getItem<Partial<SystemSettings>>(STORAGE_KEYS.SETTINGS, {});
    return { ...INITIAL_SETTINGS, ...saved };
  }

  public updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    this.addLog({
      actorId: 'owner',
      actorName: 'System Administrator',
      actorRole: 'owner',
      action: 'Updated Settings',
      category: 'Settings',
      details: `Settings updated: ${Object.keys(updates).join(', ')}`
    });
    return updated;
  }

  // --- Services ---
  public getServices(): HealthcareService[] {
    const saved = this.getItem<HealthcareService[] | null>(STORAGE_KEYS.SERVICES, null);
    if (!saved || saved.length === 0) return MYRA_SERVICES;
    return saved.map(s => {
      const def = MYRA_SERVICES.find(m => m.id === s.id);
      return def ? { ...def, ...s, icon: s.icon || def.icon } : s;
    });
  }

  public updateService(service: HealthcareService): void {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === service.id);
    if (idx >= 0) {
      services[idx] = service;
      this.setItem(STORAGE_KEYS.SERVICES, services);
    }
  }

  public saveService(service: HealthcareService): void {
    this.updateService(service);
  }

  public addService(service: HealthcareService): void {
    const services = this.getServices();
    services.push(service);
    this.setItem(STORAGE_KEYS.SERVICES, services);
    this.addLog({
      actorId: 'manager',
      actorName: 'Operations Manager',
      actorRole: 'manager',
      action: 'Added Service',
      category: 'Settings',
      details: `Added new service ${service.name} (₹${service.startingPrice})`
    });
  }

  public deleteService(id: string): void {
    const services = this.getServices().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.SERVICES, services);
    this.addLog({
      actorId: 'manager',
      actorName: 'Operations Manager',
      actorRole: 'manager',
      action: 'Deleted Service',
      category: 'Settings',
      details: `Deleted service ${id}`
    });
  }

  public setServices(services: HealthcareService[]): void {
    this.setItem(STORAGE_KEYS.SERVICES, services);
    this.addLog({
      actorId: 'owner',
      actorName: 'System Administrator',
      actorRole: 'owner',
      action: 'Updated Services List',
      category: 'Settings',
      details: `Updated ${services.length} healthcare services catalogue.`
    });
  }

  // --- Bookings ---
  public getBookings(): Booking[] {
    return this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  public getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  public saveBooking(booking: Booking): void {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === booking.id);
    if (idx >= 0) {
      bookings[idx] = booking;
    } else {
      bookings.unshift(booking);
    }
    this.setItem(STORAGE_KEYS.BOOKINGS, bookings);
  }

  public createBooking(data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Booking {
    const count = this.getBookings().length + 1;
    const newBooking: Booking = {
      ...data,
      id: `book-${Date.now()}`,
      bookingNumber: `MYRA-2026-0${100 + count}`,
      createdAt: new Date().toISOString()
    };
    this.saveBooking(newBooking);

    this.addLog({
      actorId: newBooking.customerId,
      actorName: newBooking.customerName,
      actorRole: 'customer',
      action: 'New Booking Created',
      category: 'Booking',
      recordId: newBooking.id,
      details: `${newBooking.serviceName} requested for patient ${newBooking.patientName} (${newBooking.bookingType.toUpperCase()})`
    });

    return newBooking;
  }

  // --- Patients ---
  public getPatients(customerId?: string): PatientProfile[] {
    const all = this.getItem<PatientProfile[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    return customerId ? all.filter(p => p.customerId === customerId) : all;
  }

  public savePatient(patient: PatientProfile): void {
    const patients = this.getItem<PatientProfile[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx >= 0) {
      patients[idx] = patient;
    } else {
      patients.push(patient);
    }
    this.setItem(STORAGE_KEYS.PATIENTS, patients);
  }

  // --- Addresses ---
  public getAddresses(customerId?: string): SavedAddress[] {
    const all = this.getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
    return customerId ? all.filter(a => a.customerId === customerId) : all;
  }

  public saveAddress(address: SavedAddress): void {
    const addresses = this.getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
    const idx = addresses.findIndex(a => a.id === address.id);
    if (idx >= 0) {
      addresses[idx] = address;
    } else {
      addresses.push(address);
    }
    this.setItem(STORAGE_KEYS.ADDRESSES, addresses);
  }

  // --- Schedules ---
  public getSchedules(staffId?: string): StaffSchedule[] {
    const all = this.getItem<StaffSchedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    return staffId ? all.filter(s => s.staffId === staffId) : all;
  }

  public saveSchedule(schedule: StaffSchedule): void {
    const schedules = this.getItem<StaffSchedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    const idx = schedules.findIndex(s => s.id === schedule.id);
    if (idx >= 0) schedules[idx] = schedule;
    else schedules.push(schedule);
    this.setItem(STORAGE_KEYS.SCHEDULES, schedules);
  }

  public deleteSchedule(id: string): void {
    const schedules = this.getItem<StaffSchedule[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    this.setItem(STORAGE_KEYS.SCHEDULES, schedules.filter(schedule => schedule.id !== id));
  }

  // --- Tickets ---
  public getTickets(): SupportTicket[] {
    return this.getItem<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  }

  public saveTicket(ticket: SupportTicket): void {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === ticket.id);
    if (idx >= 0) {
      tickets[idx] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    this.setItem(STORAGE_KEYS.TICKETS, tickets);
  }

  // --- Reviews ---
  public getReviews(onlyApproved = false): CustomerReview[] {
    const all = this.getItem<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return onlyApproved ? all.filter(r => r.isApproved) : all;
  }

  public saveReview(review: CustomerReview): void {
    const reviews = this.getItem<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const idx = reviews.findIndex(r => r.id === review.id);
    if (idx >= 0) {
      reviews[idx] = review;
    } else {
      reviews.unshift(review);
    }
    this.setItem(STORAGE_KEYS.REVIEWS, reviews);
  }

  // --- Chats ---
  public getChats(conversationId?: string): ChatMessage[] {
    const all = this.getItem<ChatMessage[]>(STORAGE_KEYS.CHATS, INITIAL_CHATS);
    return conversationId ? all.filter(c => c.conversationId === conversationId) : all;
  }

  public sendChatMessage(data: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>): ChatMessage {
    const chats = this.getItem<ChatMessage[]>(STORAGE_KEYS.CHATS, INITIAL_CHATS);
    const newMsg: ChatMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    chats.push(newMsg);
    this.setItem(STORAGE_KEYS.CHATS, chats);
    return newMsg;
  }

  // --- Activity Logs ---
  public getLogs(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  }

  public addLog(entry: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    this.setItem(STORAGE_KEYS.LOGS, logs);
  }

  // --- Export Full DB as JSON ---
  public exportDatabaseJSON(): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'MYRA Home Care Nursing Services',
      location: 'Patna, Bihar',
      settings: this.getSettings(),
      users: this.getUsers(),
      services: this.getServices(),
      bookings: this.getBookings(),
      patients: this.getPatients(),
      addresses: this.getAddresses(),
      schedules: this.getSchedules(),
      tickets: this.getTickets(),
      reviews: this.getReviews(),
      logs: this.getLogs(),
      chats: this.getChats()
    };
    return JSON.stringify(payload, null, 2);
  }
}

export const storage = new StorageService();

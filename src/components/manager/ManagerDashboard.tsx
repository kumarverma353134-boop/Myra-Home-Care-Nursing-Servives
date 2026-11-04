import React, { useState } from 'react';
import { 
  UserProfile, 
  Booking, 
  StaffSchedule, 
  SupportTicket, 
  HealthcareService, 
  ChatMessage 
} from '../../types';
import { storage } from '../../services/storage';
import { ManagerStaffManagement } from './ManagerStaffManagement';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  UserPlus, 
  FileCheck, 
  AlertCircle, 
  MessageSquare, 
  Search, 
  LogOut, 
  CreditCard, 
  Phone, 
  Plus, 
  Send,
  Eye,
  Check,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Activity,
  Trash2,
  Edit,
  DollarSign
} from 'lucide-react';

interface ManagerDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'services' | 'bookings' | 'quotations' | 'staff' | 'payments' | 'tickets' | 'chats' | 'manual' | 'numbers'
  >('services');

  const [settings, setSettings] = useState(() => storage.getSettings());
  const [primaryPhoneInput, setPrimaryPhoneInput] = useState(settings.phone || '8893671162');
  const [secondaryPhoneInput, setSecondaryPhoneInput] = useState(settings.secondaryPhone || '8893659849');
  const [savePhoneSuccess, setSavePhoneSuccess] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [servicesList, setServicesList] = useState<HealthcareService[]>(() => storage.getServices());
  const allBookings = storage.getBookings();
  const allStaff = storage.getUsers().filter((u) => u.role === 'staff' && u.isVerified && u.status === 'active');
  const allTickets = storage.getTickets();
  const chatMessages = storage.getChats();

  // Quotation Generator Modal state
  const [quotationBookingId, setQuotationBookingId] = useState<string | null>(null);
  const [quotationAmount, setQuotationAmount] = useState<number>(1200);
  const [quotationNotes, setQuotationNotes] = useState('12-Hour Day Shift Bedside Nursing Care by verified RNC nurse.');

  // Staff Assignment state
  const [assignBookingId, setAssignBookingId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(allStaff[0]?.id || '');

  // Active Chat
  const [chatChannel, setChatChannel] = useState<'customer_manager' | 'manager_staff'>('customer_manager');
  const [chatInput, setChatInput] = useState('');

  // Manual Booking form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState(servicesList[0]?.id || 'srv-1');
  const [manualPatient, setManualPatient] = useState('Elderly Mother');
  const [manualAddress, setManualAddress] = useState('Boring Road, Patna');
  const [manualSource, setManualSource] = useState<'phone' | 'whatsapp'>('phone');

  // Service Management State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceHindiName, setNewServiceHindiName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(500);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'nursing' | 'attendant' | 'clinical' | 'equipment' | 'emergency'>('nursing');
  const [newServiceIcon, setNewServiceIcon] = useState('🩺');

  // Issue Quotation handler
  const handleIssueQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotationBookingId) return;

    const bk = storage.getBookingById(quotationBookingId);
    if (bk) {
      bk.quotation = {
        id: `quot-${Date.now()}`,
        amount: Number(quotationAmount),
        notes: quotationNotes,
        validUntil: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      bk.status = 'quotation_sent';
      bk.paymentAmount = Number(quotationAmount);
      storage.saveBooking(bk);

      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'manager',
        action: 'Issued 72-Hour Quotation',
        category: 'Quotation',
        recordId: bk.id,
        details: `Issued quotation of ₹${quotationAmount} for ${bk.serviceName} (${bk.bookingNumber})`
      });

      setQuotationBookingId(null);
      alert('72-Hour Quotation dispatched to Customer Dashboard!');
    }
  };

  // Assign Staff handler
  const handleAssignStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignBookingId || !selectedStaffId) return;

    const bk = storage.getBookingById(assignBookingId);
    const staff = allStaff.find((s) => s.id === selectedStaffId);

    if (bk && staff) {
      bk.assignedStaffId = staff.id;
      bk.assignedStaffName = staff.name;
      bk.assignedStaffDesignation = staff.designation || 'Staff Nurse';
      bk.assignedStaffQualification = staff.qualification || 'GNM/B.Sc RN';
      bk.status = 'staff_assigned';
      storage.saveBooking(bk);

      // Create schedule entry
      storage.saveSchedule({
        id: `sch-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        bookingId: bk.id,
        serviceName: bk.serviceName,
        patientName: bk.patientName,
        location: bk.address,
        date: bk.startDate,
        shift: bk.shiftDuration,
        status: 'upcoming'
      });

      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'manager',
        action: 'Assigned Staff',
        category: 'Staff',
        recordId: bk.id,
        details: `Assigned nurse ${staff.name} to booking ${bk.bookingNumber}`
      });

      setAssignBookingId(null);
      alert(`Staff ${staff.name} assigned to booking ${bk.bookingNumber}!`);
    }
  };

  // Verify UPI Payment
  const handleVerifyPayment = (bookingId: string, status: 'verified_paid' | 'rejected') => {
    const bk = storage.getBookingById(bookingId);
    if (!bk) return;

    bk.paymentStatus = status;
    bk.paidAt = status === 'verified_paid' ? new Date().toISOString() : undefined;
    bk.verifiedBy = user.name;
    storage.saveBooking(bk);

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'manager',
      action: status === 'verified_paid' ? 'Verified UPI Payment' : 'Rejected UPI Payment',
      category: 'Payment',
      recordId: bk.id,
      details: `Manager ${user.name} marked payment for ${bk.bookingNumber} as ${status.toUpperCase()} (UTR: ${bk.upiTransactionId || 'N/A'})`
    });

    alert(`Payment ${status === 'verified_paid' ? 'Verified & Marked Paid' : 'Rejected'}!`);
  };

  // Create Manual Booking
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    const srv = servicesList.find((s) => s.id === manualServiceId) || servicesList[0];
    const newBk = storage.createBooking({
      customerId: `cust-manual-${Date.now()}`,
      customerName: manualName,
      customerPhone: manualPhone,
      patientId: `pat-manual-${Date.now()}`,
      patientName: manualPatient,
      patientRelation: 'Family Member',
      patientAge: 65,
      serviceId: srv.id,
      serviceName: srv.name,
      bookingType: 'asap',
      startDate: new Date().toISOString().split('T')[0],
      shiftDuration: '12 Hours Day Shift',
      address: manualAddress,
      careNotes: `Manual inquiry received via ${manualSource.toUpperCase()}`,
      source: manualSource,
      status: 'pending_quotation',
      paymentMethod: 'upi',
      paymentStatus: 'pending',
      paymentAmount: srv.startingPrice
    });

    setManualName('');
    setManualPhone('');
    setActiveTab('bookings');
    alert(`Manual booking draft ${newBk.bookingNumber} created successfully!`);
  };

  // Service Price Update Handler
  const handleSaveServicePrice = (serviceId: string) => {
    const srv = servicesList.find((s) => s.id === serviceId);
    if (!srv) return;

    srv.startingPrice = Number(editPriceValue);
    storage.saveService(srv);
    setServicesList([...storage.getServices()]);
    setEditingServiceId(null);

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'manager',
      action: 'Updated Service Price',
      category: 'Services',
      recordId: srv.id,
      details: `Manager set ${srv.name} price to ₹${editPriceValue}`
    });
    alert(`Price updated to ₹${editPriceValue} for ${srv.name}!`);
  };

  // Add Service Handler
  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSrv: HealthcareService = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      hindiName: newServiceHindiName.trim() || undefined,
      category: newServiceCategory,
      shortDesc: newServiceDesc.trim() || 'Professional clinical care in Patna.',
      fullDesc: newServiceDesc.trim() || 'Professional clinical care in Patna provided by verified nursing staff.',
      startingPrice: Number(newServicePrice),
      priceUnit: 'per shift/visit',
      isAvailable: true,
      icon: newServiceIcon || '🩺'
    };

    storage.addService(newSrv);
    setServicesList(storage.getServices());
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceHindiName('');
    setNewServiceDesc('');

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'manager',
      action: 'Added New Service',
      category: 'Services',
      recordId: newSrv.id,
      details: `Manager added ${newSrv.name} with price ₹${newSrv.startingPrice}`
    });

    alert(`New service "${newSrv.name}" added successfully and published!`);
  };

  // Delete Service Handler
  const handleDeleteService = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from available services?`)) return;

    storage.deleteService(id);
    setServicesList(storage.getServices());

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'manager',
      action: 'Deleted Service',
      category: 'Services',
      recordId: id,
      details: `Manager deleted service: ${name}`
    });

    alert(`Service "${name}" removed successfully.`);
  };

  // Chat send
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    storage.sendChatMessage({
      conversationId: chatChannel === 'customer_manager' ? 'customer_manager_book-101' : `manager_staff_${allStaff[0]?.id || 'staff-1'}`,
      channel: chatChannel,
      senderId: user.id,
      senderName: `${user.name} (Manager)`,
      senderRole: 'manager',
      text: chatInput.trim()
    });
    setChatInput('');
  };

  // Filtered bookings
  const filteredBookings = allBookings.filter((b) =>
    b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Save Helpline Numbers handler
  const handleSaveHelplineNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings({
      phone: primaryPhoneInput.trim(),
      secondaryPhone: secondaryPhoneInput.trim(),
      whatsapp: `+91 ${secondaryPhoneInput.trim()}`
    });
    setSettings(storage.getSettings());
    setSavePhoneSuccess(true);
    setTimeout(() => setSavePhoneSuccess(false), 3000);
    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'manager',
      action: 'Updated Helpline Numbers',
      category: 'Settings',
      details: `Manager updated primary: ${primaryPhoneInput}, secondary: ${secondaryPhoneInput}`
    });
  };

  return (
    <div className="min-h-screen bg-[#071228] text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#040e22] border-b border-indigo-950 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-white">
                Operations Manager Workspace
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Patna Operations Desk
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Logged in: <strong className="text-white">{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('manual')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Booking</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#0c1a36] p-3 rounded-2xl border border-indigo-950 shadow-sm space-y-1 text-xs font-semibold">
            {/* Services & Pricing Tab */}
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'services' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Services & Pricing Manager</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full">
                {servicesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'bookings' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Bookings & Dispatch</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {allBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quotations')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'quotations' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Issue 72h Quotations</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                {allBookings.filter((b) => b.status === 'pending_quotation').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'staff' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Staff Roster & Assign</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {allStaff.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'payments' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Verify UPI Payments</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                {allBookings.filter((b) => b.paymentStatus === 'submitted_verification').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'tickets' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                <span>Inquiries & Leads</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {allTickets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'chats' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Communications Hub</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('numbers')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'numbers' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Helpline & WhatsApp (CMS)</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold px-1.5 py-0.5 rounded">
                LIVE
              </span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="p-4 bg-[#0c1a36] rounded-2xl border border-indigo-950 shadow-sm space-y-3 text-xs">
            <span className="font-bold text-white block uppercase tracking-wider text-[10px]">
              Daily Operations (Patna)
            </span>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Services:</span>
              <strong className="text-cyan-300">{servicesList.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Shifts:</span>
              <strong className="text-white">{allBookings.filter((b) => b.status === 'in_progress').length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Awaiting Nurse:</span>
              <strong className="text-amber-400">{allBookings.filter((b) => !b.assignedStaffId).length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pending Quotations:</span>
              <strong className="text-white">{allBookings.filter((b) => b.status === 'pending_quotation').length}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Pane */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 0: Services & Pricing Management */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="bg-[#0c1a36] p-5 rounded-2xl border border-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold text-[10px] uppercase mb-1">
                    Manager Authority Desk
                  </div>
                  <h2 className="text-lg font-bold text-white">Services & Pricing Management</h2>
                  <p className="text-xs text-slate-300">
                    Decide starting prices, add new clinical services, or delete services directly without contacting any software engineer.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Cards / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-[#0c1a36] border border-indigo-950 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-indigo-700/60 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#08152e] border border-indigo-900 flex items-center justify-center text-xl shrink-0">
                          {srv.icon || '🩺'}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{srv.name}</h3>
                          {srv.hindiName && (
                            <span className="text-xs font-black text-emerald-400 block">
                              {srv.hindiName}
                            </span>
                          )}
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {srv.shortDesc}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteService(srv.id, srv.name)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-indigo-950 flex items-center justify-between">
                      {editingServiceId === srv.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-xs text-slate-400 font-bold">₹</span>
                          <input
                            type="number"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(Number(e.target.value))}
                            className="w-24 px-2 py-1 bg-[#071228] border border-indigo-500 rounded-lg text-white font-bold text-xs"
                          />
                          <button
                            onClick={() => handleSaveServicePrice(srv.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingServiceId(null)}
                            className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting Fee</span>
                            <span className="text-base font-extrabold text-cyan-400">₹{srv.startingPrice}</span>
                          </div>
                          <button
                            onClick={() => {
                              setEditingServiceId(srv.id);
                              setEditPriceValue(srv.startingPrice);
                            }}
                            className="px-3 py-1 bg-[#08152e] hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Change Price</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: Bookings Management */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Patient Bookings & Scheduling</h2>
                  <p className="text-xs text-slate-400">Approve requests, assign nurses, and track shift completions in Patna</p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by patient, service, or booking..."
                    className="pl-9 pr-3 py-1.5 rounded-xl bg-[#0c1a36] border border-slate-700 text-white text-xs w-full sm:w-64 focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-[#0c1a36] p-5 rounded-2xl border border-indigo-950 shadow-sm space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-950 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300">{b.bookingNumber}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-white font-semibold">{b.serviceName}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[11px] text-indigo-300 capitalize">Source: {b.source}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        b.status === 'in_progress' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        b.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        b.status === 'quotation_sent' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        b.status === 'staff_unable' ? 'bg-red-950 text-red-300 border border-red-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {b.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Patient / Contact</span>
                        <span className="font-bold text-white block">{b.patientName}</span>
                        <span className="text-slate-300 block">{b.customerName} ({b.customerPhone})</span>
                        <span className="text-slate-400 text-[11px] truncate block">{b.address}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Assigned Nurse</span>
                        {b.assignedStaffName ? (
                          <div>
                            <span className="font-bold text-emerald-400 block">{b.assignedStaffName}</span>
                            <span className="text-slate-400 text-[11px]">{b.assignedStaffQualification}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAssignBookingId(b.id);
                              setSelectedStaffId(allStaff[0]?.id || '');
                            }}
                            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Assign Verified Staff</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Payment & Quotation</span>
                        <span className="font-bold text-cyan-400 block">
                          ₹{b.quotation ? b.quotation.amount : b.paymentAmount}
                        </span>
                        <span className={`text-[11px] font-semibold ${
                          b.paymentStatus === 'verified_paid' ? 'text-emerald-400' :
                          b.paymentStatus === 'submitted_verification' ? 'text-amber-400' :
                          'text-slate-400'
                        }`}>
                          Payment: {b.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="pt-2 border-t border-indigo-950 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-slate-400 text-[11px] italic">
                        {b.careNotes || 'No specific care notes.'}
                      </p>

                      <div className="flex items-center gap-2">
                        {b.status === 'pending_quotation' && (
                          <button
                            onClick={() => {
                              setQuotationBookingId(b.id);
                              setQuotationAmount(b.paymentAmount || 1200);
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold"
                          >
                            Generate 72h Quotation
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setAssignBookingId(b.id);
                            setSelectedStaffId(allStaff[0]?.id || '');
                          }}
                          className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-lg font-medium"
                        >
                          {b.assignedStaffName ? 'Reassign Staff' : 'Assign Staff'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Quotations */}
          {activeTab === 'quotations' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">72-Hour Formal Quotation Desk</h2>
                <p className="text-xs text-slate-400">Generate legally binding, transparent quotations for patient families in Patna</p>
              </div>

              <div className="space-y-3">
                {allBookings.map((bk) => (
                  <div key={bk.id} className="bg-[#0c1a36] p-4 rounded-xl border border-indigo-950 text-xs flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono font-bold text-cyan-300 block">{bk.bookingNumber} - {bk.serviceName}</span>
                      <span className="text-slate-400">Patient: {bk.patientName} ({bk.shiftDuration})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {bk.quotation ? (
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 text-sm block">₹{bk.quotation.amount}</span>
                          <span className="text-[10px] text-slate-400">Status: {bk.quotation.status.toUpperCase()}</span>
                        </div>
                      ) : (
                        <span className="text-amber-400 font-semibold">No Quotation Issued</span>
                      )}

                      <button
                        onClick={() => {
                          setQuotationBookingId(bk.id);
                          setQuotationAmount(bk.quotation?.amount || bk.paymentAmount || 1200);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                      >
                        {bk.quotation ? 'Revise Quotation' : 'Issue Quotation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Staff Management + Weekly Shift Calendar */}
          {activeTab === 'staff' && <ManagerStaffManagement manager={user} />}

          {/* TAB 4: Verify UPI Payments */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Verify UPI & Cash Receipts</h2>
                <p className="text-xs text-slate-400">Inspect customer-submitted bank UTR numbers and record verified revenue</p>
              </div>

              <div className="space-y-3">
                {allBookings.map((bk) => (
                  <div key={bk.id} className="bg-[#0c1a36] p-5 rounded-2xl border border-indigo-950 shadow-sm space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                      <span className="font-mono font-bold text-cyan-300">{bk.bookingNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bk.paymentStatus === 'verified_paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        bk.paymentStatus === 'submitted_verification' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {bk.paymentStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Amount Due</span>
                        <span className="font-bold text-white text-base">₹{bk.paymentAmount}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Submitted UPI UTR</span>
                        <span className="font-mono font-semibold text-cyan-300 text-xs">
                          {bk.upiTransactionId || 'No UTR Submitted'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Client</span>
                        <span className="font-semibold text-slate-300">{bk.customerName} ({bk.customerPhone})</span>
                      </div>
                    </div>

                    {bk.paymentStatus === 'submitted_verification' && (
                      <div className="pt-2 border-t border-indigo-950 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerifyPayment(bk.id, 'rejected')}
                          className="px-3 py-1.5 border border-red-800 text-red-300 hover:bg-red-950 rounded-lg font-semibold"
                        >
                          Reject UTR
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(bk.id, 'verified_paid')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-xs"
                        >
                          Confirm Bank Credit (Mark Paid)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Tickets & Inquiries */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Inquiries & Callbacks</h2>
                <p className="text-xs text-slate-400">Inbound inquiries from website callback form and patient support requests</p>
              </div>

              <div className="space-y-3">
                {allTickets.map((tkt) => (
                  <div key={tkt.id} className="bg-[#0c1a36] p-5 rounded-2xl border border-indigo-950 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-cyan-300">{tkt.ticketNumber} · {tkt.subject}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                        {tkt.priority} Priority · {tkt.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                      {tkt.description}
                    </p>
                    <div className="pt-2 text-slate-400 text-[11px] flex justify-between">
                      <span>Sender: {tkt.customerName} ({tkt.customerPhone})</span>
                      <span>Received: {new Date(tkt.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Comms Hub */}
          {activeTab === 'chats' && (
            <div className="bg-[#0c1a36] rounded-3xl border border-indigo-950 shadow-sm flex flex-col h-[520px]">
              <div className="p-4 border-b border-indigo-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChatChannel('customer_manager')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      chatChannel === 'customer_manager' ? 'bg-indigo-600 text-white' : 'bg-[#08152e] text-slate-400'
                    }`}
                  >
                    Customer Conversations
                  </button>
                  <button
                    onClick={() => setChatChannel('manager_staff')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      chatChannel === 'manager_staff' ? 'bg-indigo-600 text-white' : 'bg-[#08152e] text-slate-400'
                    }`}
                  >
                    Staff Nurse Comms
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#08152e] text-xs">
                {chatMessages
                  .filter((m) => m.channel === chatChannel)
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          msg.senderId === user.id
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-[#0c1a36] text-slate-200 border border-indigo-950 rounded-bl-none shadow-xs'
                        }`}
                      >
                        <span className="font-bold block text-[10px] mb-0.5 opacity-80">
                          {msg.senderName}
                        </span>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="p-3 border-t border-indigo-950 flex items-center gap-2 bg-[#0c1a36]">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChat();
                  }}
                  placeholder="Type operational response..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#071228] border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
                />
                <button
                  onClick={handleSendChat}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: Manual Booking Form */}
          {activeTab === 'manual' && (
            <div className="bg-[#0c1a36] p-6 rounded-3xl border border-indigo-950 shadow-sm space-y-4 text-xs">
              <div>
                <h2 className="text-lg font-bold text-white">Create Manual Booking Draft</h2>
                <p className="text-slate-400">Record inquiries received via phone calls or WhatsApp (+91 88936 71162 / +91 88936 59849)</p>
              </div>

              <form onSubmit={handleCreateManualBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Customer / Guardian Name</label>
                    <input
                      type="text"
                      required
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="e.g. Anand Kishore"
                      className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Service Required</label>
                    <select
                      value={manualServiceId}
                      onChange={(e) => setManualServiceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                    >
                      {servicesList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} (from ₹{s.startingPrice})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Source of Inquiry</label>
                    <select
                      value={manualSource}
                      onChange={(e) => setManualSource(e.target.value as 'phone' | 'whatsapp')}
                      className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                    >
                      <option value="phone">Direct Phone Call (88936 71162)</option>
                      <option value="whatsapp">WhatsApp Message (88936 59849)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Patient Name & Relationship</label>
                  <input
                    type="text"
                    value={manualPatient}
                    onChange={(e) => setManualPatient(e.target.value)}
                    placeholder="e.g. Smt. Kanti Devi (Mother, Age 72)"
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Patna Service Address</label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="e.g. Road No. 4, Kankarbagh Colony, Patna"
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                  >
                    Save Manual Booking
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: Helpline & WhatsApp Numbers (CMS) */}
          {activeTab === 'numbers' && (
            <div className="bg-[#0c1a36] p-6 rounded-3xl border border-indigo-950 shadow-sm space-y-6">
              <div className="border-b border-indigo-950 pb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Phone className="w-4 h-4" />
                  <span>Website Contact & Helpline CMS</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  Manage Helpline & WhatsApp Phone Numbers
                </h2>
                <p className="text-xs text-slate-400">
                  Update primary and secondary helpline numbers from the official poster. Changes immediately reflect across the public website, headers, action buttons, and WhatsApp shortcuts.
                </p>
              </div>

              {savePhoneSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Helpline numbers updated successfully and published live!</span>
                </div>
              )}

              <form onSubmit={handleSaveHelplineNumbers} className="space-y-4 max-w-xl text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Primary Helpline & Call Number
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryPhoneInput}
                    onChange={(e) => setPrimaryPhoneInput(e.target.value)}
                    placeholder="8893671162"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#071228] border border-slate-700 text-white font-mono text-sm focus:border-indigo-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Official Banner Call: +91 88936 71162
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Secondary & WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={secondaryPhoneInput}
                    onChange={(e) => setSecondaryPhoneInput(e.target.value)}
                    placeholder="8893659849"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#071228] border border-slate-700 text-white font-mono text-sm focus:border-indigo-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Official Banner WhatsApp: +91 88936 59849
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Auto-saved to local persistent storage.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Save & Publish Numbers Live
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ADD SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0c1a36] rounded-3xl max-w-lg w-full border border-indigo-900 p-6 space-y-4 text-xs shadow-2xl text-slate-100">
            <h3 className="font-bold text-white text-base">Add New Healthcare Service</h3>
            <p className="text-slate-400">
              New services will appear in the 4×4 grid on the main website and inside the customer portal.
            </p>

            <form onSubmit={handleAddNewService} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Service Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="e.g. ECG at Home"
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hindi Subtitle</label>
                  <input
                    type="text"
                    value={newServiceHindiName}
                    onChange={(e) => setNewServiceHindiName(e.target.value)}
                    placeholder="e.g. घर पर ईसीजी टेस्ट"
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                  >
                    <option value="nursing">Nursing</option>
                    <option value="attendant">Patient Care (GDA)</option>
                    <option value="clinical">Clinical Procedure</option>
                    <option value="emergency">Ambulance / Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={newServiceIcon}
                    onChange={(e) => setNewServiceIcon(e.target.value)}
                    placeholder="🩺"
                    className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Summary of procedure, sterile instruments, and nursing protocols..."
                  className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs"
                >
                  Add & Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUOTATION MODAL */}
      {quotationBookingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0c1a36] rounded-3xl max-w-md w-full border border-indigo-900 p-6 space-y-4 text-xs shadow-2xl text-slate-100">
            <h3 className="font-bold text-white text-sm">Issue Formal 72-Hour Quotation</h3>
            <p className="text-slate-400">
              Set the total price for this nursing shift/visit. The customer will have 72 hours to accept or decline.
            </p>

            <form onSubmit={handleIssueQuotation} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Quotation Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={quotationAmount}
                  onChange={(e) => setQuotationAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 font-bold text-sm text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notes / Scope of Care</label>
                <textarea
                  rows={3}
                  value={quotationNotes}
                  onChange={(e) => setQuotationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuotationBookingId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-xs"
                >
                  Dispatch Quotation (72h)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN STAFF MODAL */}
      {assignBookingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0c1a36] rounded-3xl max-w-md w-full border border-indigo-900 p-6 space-y-4 text-xs shadow-2xl text-slate-100">
            <h3 className="font-bold text-white text-sm">Assign Registered Nurse to Shift</h3>

            <form onSubmit={handleAssignStaff} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Available Staff</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white font-medium"
                >
                  {allStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.qualification || 'Nurse'}) - {s.isVerified ? 'VERIFIED' : 'PENDING'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignBookingId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs"
                >
                  Confirm Staff Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

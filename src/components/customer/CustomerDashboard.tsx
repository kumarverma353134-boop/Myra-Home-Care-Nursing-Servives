import React, { useState } from 'react';
import { 
  UserProfile, 
  Booking, 
  PatientProfile, 
  SavedAddress, 
  SupportTicket, 
  CustomerReview, 
  ChatMessage, 
  HealthcareService 
} from '../../types';
import { storage } from '../../services/storage';
import { QRCodeGenerator } from '../common/QRCodeGenerator';
import { 
  HeartPulse, 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle, 
  Send, 
  Plus, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Trash2,
  FileText,
  Activity,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface CustomerDashboardProps {
  user: UserProfile;
  onOpenBooking: () => void;
  onLogout: () => void;
  onOpenAI: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  onOpenBooking,
  onLogout,
  onOpenAI
}) => {
  const [activeTab, setActiveTab] = useState<
    'services' | 'bookings' | 'patients' | 'quotations' | 'payments' | 'chat' | 'reviews' | 'security'
  >('services');

  const settings = storage.getSettings();
  const allServices = storage.getServices();
  const allBookings = storage.getBookings().filter((b) => b.customerId === user.id);
  const allPatients = storage.getPatients(user.id);
  const allReviews = storage.getReviews().filter((r) => r.customerId === user.id);

  // Active chat conversation
  const [chatInput, setChatInput] = useState('');
  const chatMessages = storage.getChats();

  // Quotation acceptance/rejection state
  const handleQuotationAction = (bookingId: string, action: 'accept' | 'reject') => {
    const booking = storage.getBookingById(bookingId);
    if (!booking || !booking.quotation) return;

    if (action === 'accept') {
      booking.quotation.status = 'accepted';
      booking.status = 'quotation_accepted';
      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'customer',
        action: 'Accepted Quotation',
        category: 'Quotation',
        recordId: booking.id,
        details: `Customer accepted quotation of ₹${booking.quotation.amount} for ${booking.serviceName}`
      });
    } else {
      booking.quotation.status = 'rejected';
      booking.status = 'quotation_rejected';
      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'customer',
        action: 'Rejected Quotation',
        category: 'Quotation',
        recordId: booking.id,
        details: `Customer declined quotation of ₹${booking.quotation.amount}`
      });
    }

    storage.saveBooking(booking);
    alert(`Quotation ${action === 'accept' ? 'accepted' : 'declined'} successfully!`);
  };

  // UPI payment UTR submission
  const [enteredUtr, setEnteredUtr] = useState('');
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  const handleUtrSubmit = (bookingId: string) => {
    if (!enteredUtr.trim()) {
      alert('Please enter your 12-digit UPI Reference / UTR Number.');
      return;
    }
    const booking = storage.getBookingById(bookingId);
    if (!booking) return;

    booking.upiTransactionId = enteredUtr.trim();
    booking.paymentStatus = 'submitted_verification';
    storage.saveBooking(booking);

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'customer',
      action: 'Submitted UPI Payment',
      category: 'Payment',
      recordId: booking.id,
      details: `Customer submitted UTR ${enteredUtr} for ₹${booking.paymentAmount}`
    });

    setEnteredUtr('');
    alert('UTR submitted! Our Operations Desk will verify and mark as paid.');
  };

  // Add Family Patient state
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState<number>(65);
  const [newPatientRel, setNewPatientRel] = useState('Father');
  const [newPatientCond, setNewPatientCond] = useState('');

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newPat: PatientProfile = {
      id: `pat-${Date.now()}`,
      customerId: user.id,
      fullName: newPatientName.trim(),
      age: Number(newPatientAge),
      relationship: newPatientRel,
      gender: 'other',
      medicalConditions: newPatientCond.trim() || 'Bedridden / General Geriatric Care'
    };

    storage.savePatient(newPat);
    setNewPatientName('');
    setNewPatientCond('');
    setShowAddPatient(false);
    alert('Family patient profile saved!');
  };

  // Chat message submit
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    storage.sendChatMessage({
      conversationId: 'customer_manager_patna',
      channel: 'customer_manager',
      senderId: user.id,
      senderName: user.name,
      senderRole: 'customer',
      text: chatInput.trim()
    });
    setChatInput('');
  };

  // Review submission
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const bk = allBookings.find((b) => b.id === (reviewBookingId || allBookings[0]?.id));
    if (!bk) return;

    const review: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerId: user.id,
      customerName: user.name,
      bookingId: bk.id,
      serviceName: bk.serviceName,
      rating: reviewRating,
      reviewText: reviewComment.trim(),
      isApproved: false,
      createdAt: new Date().toISOString()
    };

    storage.saveReview(review);
    setReviewComment('');
    alert('Thank you! Your verified review has been submitted for verification.');
  };

  return (
    <div className="min-h-screen bg-[#071228] text-slate-100 flex flex-col font-sans">
      {/* Top Customer Header Bar */}
      <div className="bg-[#040e22] border-b border-cyan-950 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold shadow-sm">
            <HeartPulse className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{user.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold uppercase">
                Customer Workspace
              </span>
            </h1>
            <p className="text-[11px] text-cyan-200/70">{user.email} · Patna, Bihar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book Home Nurse</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0c1a36] p-3 rounded-2xl border border-cyan-950 shadow-sm space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'services' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>16 Services (4×4 Grid)</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded-full">
                16
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'bookings' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>My Bookings</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {allBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'patients' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <span>Patient Profiles</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {allPatients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quotations')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'quotations' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Pending Quotations</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                {allBookings.filter((b) => b.status === 'quotation_sent').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'payments' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-400" />
                <span>UPI & Receipts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'chat' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-teal-400" />
                <span>Chat with Manager</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'reviews' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-teal-400" />
                <span>Service Reviews</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'security' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Security & Account</span>
              </div>
            </button>
          </div>

          {/* WhatsApp Direct Helpline Box */}
          <div className="p-4 bg-[#0c1a36] rounded-2xl border border-emerald-900/50 text-xs space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Direct Helpline & WhatsApp
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              No medical files stored on web. Share prescriptions and discharge summaries directly on our verified WhatsApp:
            </p>
            <a
              href="https://wa.me/918893659849"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              WhatsApp: +91 88936 59849
            </a>
            <a
              href="tel:+918893671162"
              className="block text-center py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-sm mt-1"
            >
              Call: +91 88936 71162
            </a>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 space-y-6">
          {/* Featured MYRA Home Care Banner */}
          <div className="rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-[#030914] relative group">
            <img
              src="/assets/aistudio/IMG-20261104-WA0013_4d11b61e.jpg"
              alt="MYRA Home Care Banner"
              className="w-full h-auto object-contain max-h-[280px] sm:max-h-[340px] mx-auto rounded-3xl"
            />
            <div className="absolute top-3 right-3 bg-[#071228]/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/40 text-[11px] font-black text-emerald-300 shadow-md">
              Patna 24/7 Verified Care
            </div>
          </div>

          {/* TAB 0: 16 Services (4x4 Grid) */}
          {activeTab === 'services' && (
            <div className="bg-[#0c1a36] rounded-3xl border border-cyan-950 p-6 space-y-6 shadow-xl">
              <div className="border-b border-cyan-950 pb-4">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-widest mb-1">
                  हमारी सेवाएं · OUR CARE SERVICES
                </div>
                <h2 className="text-xl font-bold text-white">Healthcare Support at Home (16 Services in 4×4 Grid)</h2>
                <p className="text-xs text-cyan-200/80">Choose any service below to request home nurse, attendant or clinical care in Patna.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {allServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-[#08152e] border border-cyan-950 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm hover:shadow-cyan-500/10 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                        {srv.icon || '🩺'}
                      </div>
                      <h3 className="font-bold text-white text-xs leading-snug group-hover:text-cyan-300">
                        {srv.name}
                      </h3>
                      {srv.hindiName && (
                        <span className="text-[10px] font-black text-emerald-400 block mb-1">
                          {srv.hindiName}
                        </span>
                      )}
                      <p className="text-[11px] text-slate-300 line-clamp-2 mb-3">
                        {srv.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-cyan-400">
                        ₹{srv.startingPrice}
                      </span>
                      <button
                        onClick={onOpenBooking}
                        className="px-2.5 py-1 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded-lg text-[11px] font-bold hover:bg-cyan-600 hover:text-white transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: Bookings */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">My Service Bookings</h2>
                  <p className="text-xs text-cyan-200/70">Track active bedside nursing, ICU setups, and completed shifts in Patna</p>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Request</span>
                </button>
              </div>

              {allBookings.length === 0 ? (
                <div className="p-12 text-center bg-[#0c1a36] rounded-2xl border border-cyan-950">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-200">No bookings yet</p>
                  <p className="text-xs text-slate-400 mt-1">Request a qualified nurse or patient attendant to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#0c1a36] rounded-2xl border border-cyan-950 p-5 shadow-sm space-y-4"
                    >
                      {/* Top Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950 pb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-300">{b.bookingNumber}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300 capitalize">{b.bookingType} Shift</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          b.status === 'in_progress' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          b.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          b.status === 'quotation_sent' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {b.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Service Requested</span>
                          <span className="font-bold text-white text-sm block">{b.serviceName}</span>
                          <span className="text-slate-400 text-[11px]">{b.shiftDuration}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">Patient Details</span>
                          <span className="font-semibold text-slate-200 block">
                            {b.patientName} ({b.patientRelation}, Age {b.patientAge})
                          </span>
                          <span className="text-slate-400 text-[11px] truncate block">{b.address}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">Assigned Staff</span>
                          {b.assignedStaffName ? (
                            <div>
                              <span className="font-bold text-emerald-400 block flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                {b.assignedStaffName}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {b.assignedStaffQualification || 'Registered Nurse'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-amber-400 font-medium">Assignment Pending</span>
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-cyan-950 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-slate-300">
                          Fee: <strong className="text-white">₹{b.quotation ? b.quotation.amount : b.paymentAmount}</strong> ({b.paymentStatus.toUpperCase()})
                        </div>

                        <div className="flex items-center gap-2">
                          {b.status === 'quotation_sent' && (
                            <button
                              onClick={() => setActiveTab('quotations')}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold"
                            >
                              Review Quotation
                            </button>
                          )}

                          {b.status === 'completed' && (
                            <button
                              onClick={() => {
                                setReviewBookingId(b.id);
                                setActiveTab('reviews');
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-semibold flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>Leave Review</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setPayingBookingId(b.id);
                              setActiveTab('payments');
                            }}
                            className="px-3 py-1.5 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white rounded-lg font-medium"
                          >
                            Payment & QR
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Patient Profiles */}
          {activeTab === 'patients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Family Patient Profiles</h2>
                  <p className="text-xs text-cyan-200/70">Manage medical conditions and care instructions under one account</p>
                </div>
                <button
                  onClick={() => setShowAddPatient(true)}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Patient</span>
                </button>
              </div>

              {showAddPatient && (
                <form onSubmit={handleAddPatient} className="bg-[#0c1a36] p-5 rounded-2xl border border-cyan-950 shadow-md space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">Add New Family Member</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newPatientName}
                        onChange={(e) => setNewPatientName(e.target.value)}
                        placeholder="e.g. Ramakant Verma"
                        className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Relationship</label>
                      <select
                        value={newPatientRel}
                        onChange={(e) => setNewPatientRel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Spouse</option>
                        <option>Child</option>
                        <option>Grandparent</option>
                        <option>Self</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Age</label>
                      <input
                        type="number"
                        value={newPatientAge}
                        onChange={(e) => setNewPatientAge(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Medical Conditions</label>
                      <input
                        type="text"
                        value={newPatientCond}
                        onChange={(e) => setNewPatientCond(e.target.value)}
                        placeholder="e.g. Bedridden, diabetes, post-op..."
                        className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPatient(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg"
                    >
                      Save Patient Profile
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPatients.map((pat) => (
                  <div key={pat.id} className="bg-[#0c1a36] p-5 rounded-2xl border border-cyan-950 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{pat.fullName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold text-[11px]">
                        {pat.relationship} (Age {pat.age})
                      </span>
                    </div>
                    <p className="text-slate-300">
                      <strong className="text-slate-100">Medical Conditions:</strong> {pat.medicalConditions}
                    </p>
                    {pat.specialCareInstructions && (
                      <p className="text-slate-400 italic text-[11px]">
                        Care Note: {pat.specialCareInstructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Quotations */}
          {activeTab === 'quotations' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">72-Hour Formal Quotations</h2>
                <p className="text-xs text-cyan-200/70">Every quotation issued by our operations desk is legally binding for 72 hours</p>
              </div>

              {allBookings.filter((b) => b.quotation).map((b) => (
                <div key={b.id} className="bg-[#0c1a36] p-5 rounded-2xl border border-cyan-950 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                    <span className="font-mono font-bold text-cyan-300">{b.bookingNumber}</span>
                    <span className="text-slate-300">{b.serviceName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block">Total Quotation Fee</span>
                      <span className="text-xl font-bold text-cyan-400">₹{b.quotation?.amount}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Validity</span>
                      <span className="text-amber-400 font-semibold">Valid for 72 Hours</span>
                    </div>
                  </div>

                  <p className="text-slate-300 bg-[#08152e] p-3 rounded-xl border border-cyan-950">
                    {b.quotation?.notes}
                  </p>

                  {b.quotation?.status === 'pending' ? (
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleQuotationAction(b.id, 'reject')}
                        className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl font-semibold"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleQuotationAction(b.id, 'accept')}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-sm"
                      >
                        Accept Quotation & Confirm Staff
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 text-right">
                      <span className="font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                        Status: {b.quotation?.status.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Payments & Dynamic UPI QR */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Payment Center (UPI & Cash)</h2>
                <p className="text-xs text-cyan-200/70">Pay directly via any UPI app or cash on duty without gateway charges</p>
              </div>

              {/* Dynamic QR Box */}
              <div className="bg-[#0c1a36] p-6 rounded-3xl border border-cyan-950 shadow-md flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white p-3 rounded-2xl shadow-inner">
                  <QRCodeGenerator
                    value={`upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.upiPayeeName)}&cu=INR`}
                    size={160}
                  />
                </div>

                <div className="space-y-3 flex-1 text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Configured UPI Payee ID</span>
                    <span className="text-base font-mono font-bold text-cyan-300">{settings.upiId}</span>
                    <span className="text-slate-300 block text-[11px]">{settings.upiPayeeName}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    Open Google Pay, PhonePe, Paytm, or BHIM. Scan the QR code or pay directly to the UPI ID. Once paid, enter your 12-digit UTR/Transaction ID below to record payment.
                  </p>

                  <div className="p-3 bg-cyan-950/60 rounded-xl border border-cyan-900 text-cyan-200 text-[11px]">
                    <strong>Cash Payments:</strong> Cash can also be handed directly to our verified nurse upon arrival. The nurse records cash receipt in their dashboard.
                  </div>
                </div>
              </div>

              {/* UTR Submission Form */}
              <div className="bg-[#0c1a36] p-5 rounded-2xl border border-cyan-950 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-white text-sm">Submit UPI Transaction ID (UTR)</h3>
                <p className="text-slate-400">
                  Select your active booking and submit the 12-digit bank reference number:
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white font-medium focus:border-cyan-400"
                    onChange={(e) => setPayingBookingId(e.target.value)}
                    value={payingBookingId || allBookings[0]?.id || ''}
                  >
                    {allBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bookingNumber} - {b.serviceName} (₹{b.paymentAmount})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={enteredUtr}
                    onChange={(e) => setEnteredUtr(e.target.value)}
                    placeholder="12-digit UPI UTR Number (e.g. 492817291048)"
                    className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white font-mono focus:border-cyan-400"
                  />

                  <button
                    onClick={() => handleUtrSubmit(payingBookingId || allBookings[0]?.id || '')}
                    className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold whitespace-nowrap shadow-sm"
                  >
                    I Have Paid
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Manager Chat */}
          {activeTab === 'chat' && (
            <div className="bg-[#0c1a36] rounded-3xl border border-cyan-950 shadow-md flex flex-col h-[520px]">
              <div className="p-4 border-b border-cyan-950 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Operations Manager Chat</h3>
                  <p className="text-[11px] text-cyan-200/70">Private text channel with Vikram Singh (Patna Operations)</p>
                </div>
                <a
                  href="https://wa.me/918893659849"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Documents on WhatsApp</span>
                </a>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#08152e] text-xs">
                {chatMessages
                  .filter((m) => m.channel === 'customer_manager')
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          msg.senderId === user.id
                            ? 'bg-cyan-600 text-white rounded-br-none shadow-xs'
                            : 'bg-[#0c1a36] text-slate-200 border border-cyan-950 rounded-bl-none shadow-xs'
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

              <div className="p-3 border-t border-cyan-950 flex items-center gap-2 bg-[#0c1a36]">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type a message to Operations Manager..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#071228] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Patient Care Reviews</h2>
                <p className="text-xs text-cyan-200/70">Rate your completed nursing services to help other Patna families</p>
              </div>

              {allBookings.filter((b) => b.status === 'completed').length > 0 && (
                <form onSubmit={handleSubmitReview} className="bg-[#0c1a36] p-5 rounded-2xl border border-cyan-950 shadow-sm space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">Write a Service Review</h3>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Select Completed Service</label>
                    <select
                      className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white font-medium"
                      onChange={(e) => setReviewBookingId(e.target.value)}
                      value={reviewBookingId || allBookings.find((b) => b.status === 'completed')?.id || ''}
                    >
                      {allBookings.filter((b) => b.status === 'completed').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bookingNumber} - {b.serviceName} ({b.assignedStaffName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Your Written Experience</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="How was the nurse's punctuality, care, and hygiene?"
                      className="w-full px-3 py-2 rounded-xl bg-[#071228] border border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl"
                    >
                      Submit Review for Verification
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {allReviews.map((rev) => (
                  <div key={rev.id} className="bg-[#0c1a36] p-4 rounded-xl border border-cyan-950 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rev.serviceName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${rev.isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                        {rev.isApproved ? 'Owner Approved' : 'Pending Owner Approval'}
                      </span>
                    </div>
                    <p className="text-slate-300 italic">"{rev.reviewText}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Security & Account */}
          {activeTab === 'security' && (
            <div className="bg-[#0c1a36] p-6 rounded-3xl border border-cyan-950 shadow-sm space-y-6 text-xs">
              <div>
                <h3 className="font-bold text-white text-base">Account Security & Privacy</h3>
                <p className="text-cyan-200/70">Manage your Google session, active devices, and privacy rights</p>
              </div>

              <div className="p-4 bg-[#08152e] rounded-2xl border border-cyan-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Authenticated Google Account:</span>
                  <span className="font-mono text-cyan-300">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Account Role:</span>
                  <span className="font-bold text-emerald-400 uppercase">{user.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Session Inactivity Timeout:</span>
                  <span className="text-slate-400">30 Minutes (Configurable by Owner)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-cyan-950 space-y-3">
                <h4 className="font-bold text-red-400 text-sm">Account Deletion Request</h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  Under our zero-budget privacy governance, you may submit an account erasure request. Upon Owner approval, your personal profile and saved family addresses will be permanently purged (retaining only legally mandated financial receipts).
                </p>
                <button
                  type="button"
                  onClick={() => alert('Account deletion request submitted to Owner for review.')}
                  className="px-4 py-2 bg-red-950/80 text-red-300 hover:bg-red-900 font-semibold rounded-xl border border-red-800 transition-colors"
                >
                  Submit Account Deletion Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HealthcareService, PatientProfile, SavedAddress } from '../../types';
import { storage } from '../../services/storage';
import { X, Calendar, Clock, MapPin, User, FileText, MessageCircle, CheckCircle, ShieldAlert } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: HealthcareService | null;
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onBookingSuccess
}) => {
  const allServices = storage.getServices();
  const currentUser = storage.getCurrentUser();
  const customerId = currentUser?.id || 'usr-customer-1';
  const customerName = currentUser?.name || 'Valued Patient / Guardian';
  const customerPhone = currentUser?.phone || '8893671162';

  const savedPatients = storage.getPatients(customerId);
  const savedAddresses = storage.getAddresses(customerId);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedService?.id || allServices[0]?.id || 'srv-1'
  );
  const [bookingType, setBookingType] = useState<'asap' | 'scheduled'>('asap');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [shiftDuration, setShiftDuration] = useState<string>('12 Hours Day Shift');

  // Patient selection or quick entry
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>(
    savedPatients.length > 0 ? 'existing' : 'new'
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    savedPatients[0]?.id || ''
  );
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientRelation, setNewPatientRelation] = useState('Father');
  const [newPatientAge, setNewPatientAge] = useState<number>(65);
  const [newPatientCondition, setNewPatientCondition] = useState('');

  // Address selection or quick entry
  const [addressMode, setAddressMode] = useState<'existing' | 'new'>(
    savedAddresses.length > 0 ? 'existing' : 'new'
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || ''
  );
  const [newAddressText, setNewAddressText] = useState('East Boring Canal Road, Patna');
  const [newLandmark, setNewLandmark] = useState('Near Panchmukhi Mandir');
  const [careNotes, setCareNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeService = allServices.find((s) => s.id === selectedServiceId) || allServices[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let patName = '';
    let patRelation = '';
    let patAge = 60;
    let patId = '';

    if (patientMode === 'existing') {
      const existing = savedPatients.find((p) => p.id === selectedPatientId) || savedPatients[0];
      if (existing) {
        patName = existing.fullName;
        patRelation = existing.relationship;
        patAge = existing.age;
        patId = existing.id;
      }
    } else {
      patName = newPatientName || 'Elderly Patient';
      patRelation = newPatientRelation;
      patAge = Number(newPatientAge) || 60;
      patId = `pat-${Date.now()}`;
      // Save new patient profile
      storage.savePatient({
        id: patId,
        customerId,
        fullName: patName,
        relationship: patRelation,
        age: patAge,
        gender: 'male',
        medicalConditions: newPatientCondition || 'Needs general supervision'
      });
    }

    let fullAddr = '';
    let lmark = '';
    if (addressMode === 'existing') {
      const existingAddr = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
      if (existingAddr) {
        fullAddr = `${existingAddr.fullAddress}, ${existingAddr.city} - ${existingAddr.pincode}`;
        lmark = existingAddr.landmark;
      }
    } else {
      fullAddr = `${newAddressText}, Patna - 800001`;
      lmark = newLandmark;
      // Save new address
      storage.saveAddress({
        id: `addr-${Date.now()}`,
        customerId,
        label: 'New Residence',
        fullAddress: newAddressText,
        landmark: newLandmark,
        city: 'Patna',
        pincode: '800001'
      });
    }

    // Create booking in database
    const newBooking = storage.createBooking({
      customerId,
      customerName,
      customerPhone,
      patientId: patId,
      patientName: patName,
      patientRelation: patRelation,
      patientAge: patAge,
      serviceId: activeService.id,
      serviceName: activeService.name,
      bookingType,
      startDate: bookingType === 'asap' ? new Date().toISOString().split('T')[0] : startDate,
      shiftDuration,
      address: fullAddr,
      landmark: lmark,
      careNotes: careNotes || 'Requires qualified home nursing care.',
      source: 'website',
      status: 'pending_quotation',
      paymentMethod: 'upi',
      paymentStatus: 'pending',
      paymentAmount: activeService.startingPrice
    });

    setIsSubmitting(false);
    setConfirmedBookingId(newBooking.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
              24×7 Patna Service Request
            </span>
          </div>
          <h2 id="booking-modal-title" className="text-2xl font-bold tracking-tight text-white">
            Request Nursing Service
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Our Operations Manager verifies availability and sends a customized 72-hour quotation.
          </p>
        </div>

        {/* Confirmation Screen */}
        {confirmedBookingId ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10 stroke-2 text-teal-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Service Request Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your request has been routed directly to our Operations Desk. The manager is reviewing staff availability and will issue your formal quotation within 15–30 minutes.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800">{activeService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold text-slate-800">{shiftDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City / Coverage:</span>
                <span className="font-semibold text-slate-800">Patna, Bihar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-amber-600">Pending Manager Quotation</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onBookingSuccess(confirmedBookingId);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition-all"
              >
                Go to Customer Dashboard & Track
              </button>
              <a
                href={`https://wa.me/918893671162?text=Namaste%20MYRA%20HomeCare%2C%20I%20have%20submitted%20request%20for%20${encodeURIComponent(activeService.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Notify Manager on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
            {/* 1. Service Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Healthcare Service
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {allServices.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} (from ₹{srv.startingPrice})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Booking Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Urgency / Timing
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('asap')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      bookingType === 'asap'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ASAP (Earliest)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('scheduled')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      bookingType === 'scheduled'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Scheduled Date
                  </button>
                </div>
              </div>

              {bookingType === 'scheduled' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Service Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Shift Duration
                </label>
                <select
                  value={shiftDuration}
                  onChange={(e) => setShiftDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {activeService.durationOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Patient Profile */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Patient Details
                </label>
                {savedPatients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPatientMode(patientMode === 'existing' ? 'new' : 'existing')}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    {patientMode === 'existing' ? '+ Add New Patient' : 'Select Existing Patient'}
                  </button>
                )}
              </div>

              {patientMode === 'existing' && savedPatients.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    {savedPatients.map((pat) => (
                      <option key={pat.id} value={pat.id}>
                        {pat.fullName} ({pat.relationship}, Age: {pat.age}) - {pat.medicalConditions}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="e.g. Ramakant Verma"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Relation
                    </label>
                    <select
                      value={newPatientRelation}
                      onChange={(e) => setNewPatientRelation(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                    >
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Spouse</option>
                      <option>Child</option>
                      <option>Self</option>
                      <option>Other Relative</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Address in Patna */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Patna Service Address
                </label>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAddressMode(addressMode === 'existing' ? 'new' : 'existing')}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    {addressMode === 'existing' ? '+ Add New Address' : 'Select Saved Address'}
                  </button>
                )}
              </div>

              {addressMode === 'existing' && savedAddresses.length > 0 ? (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                >
                  {savedAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label}: {addr.fullAddress} ({addr.landmark})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Street Address in Patna
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      placeholder="e.g. Flat 302, Boring Canal Road, Patna"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Nearest Landmark
                    </label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="e.g. Near Panchmukhi Hanuman Mandir"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Care Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Specific Care Notes / Instructions (Optional)
              </label>
              <textarea
                value={careNotes}
                onChange={(e) => setCareNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Patient needs gentle handling, sugar monitoring before lunch, bed positioning..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* STRICT PRIVACY: Direct WhatsApp Document Sharing Banner */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  Prescriptions & Discharge Summaries
                </p>
                <p className="text-[11px] text-emerald-700">
                  Version 1 has zero document storage on web. Direct documents to our official WhatsApp.
                </p>
              </div>
              <a
                href="https://wa.me/918893671162?text=Namaste%20MYRA%20HomeCare%2C%20I%20am%20submitting%20a%20booking%20and%20sharing%20patient%20medical%20records."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Share on WhatsApp (8893671162)</span>
              </a>
            </div>

            {/* Submit Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-500/25 transition-all"
              >
                {isSubmitting ? 'Submitting Request...' : 'Confirm & Request Quotation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

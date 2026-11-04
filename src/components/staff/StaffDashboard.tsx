import React, { useEffect, useState } from 'react';
import { UserProfile, Booking, StaffSchedule, ChatMessage } from '../../types';
import { storage } from '../../services/storage';
import { 
  Activity, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  MapPin, 
  LogOut, 
  Play, 
  CheckSquare, 
  User, 
  FileText 
} from 'lucide-react';

interface StaffDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'schedule' | 'attendance' | 'chat' | 'profile'>('jobs');
  
  const [allBookings, setAllBookings] = useState(() => storage.getBookings());
  const [mySchedules, setMySchedules] = useState(() => storage.getSchedules(user.id));
  const [chatMessages, setChatMessages] = useState(() => storage.getChats());
  const assignedJobs = allBookings.filter((b) => b.assignedStaffId === user.id);

  useEffect(() => {
    const refresh = () => {
      setAllBookings(storage.getBookings());
      setMySchedules(storage.getSchedules(user.id));
      setChatMessages(storage.getChats());
    };
    const unsubscribe = storage.subscribe(refresh);
    window.addEventListener('storage', refresh);
    return () => { unsubscribe(); window.removeEventListener('storage', refresh); };
  }, [user.id]);

  const updateScheduleStatus = (scheduleId: string, status: 'checked_in' | 'completed') => {
    const schedule = storage.getSchedules(user.id).find(item => item.id === scheduleId);
    if (!schedule) return;
    storage.saveSchedule({
      ...schedule,
      status,
      ...(status === 'checked_in' ? { checkInTime: new Date().toISOString() } : { checkOutTime: new Date().toISOString() })
    });
    storage.addLog({
      actorId: user.id, actorName: user.name, actorRole: 'staff',
      action: status === 'checked_in' ? 'Checked In to Scheduled Shift' : 'Completed Scheduled Shift',
      category: 'Staff', recordId: schedule.id,
      details: `${user.name} marked ${schedule.serviceName} as ${status}.`
    });
  };

  const [chatInput, setChatInput] = useState('');
  const [unableModalBookingId, setUnableModalBookingId] = useState<string | null>(null);
  const [unableReason, setUnableReason] = useState('');

  // Handle Staff Unable to Attend
  const handleUnableToAttend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unableModalBookingId || !unableReason.trim()) return;

    const bk = storage.getBookingById(unableModalBookingId);
    if (bk) {
      bk.status = 'staff_unable';
      bk.staffUnableReason = unableReason.trim();
      storage.saveBooking(bk);

      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'staff',
        action: 'Staff Unable to Attend',
        category: 'Staff',
        recordId: bk.id,
        details: `Staff ${user.name} reported unable to attend booking ${bk.bookingNumber}. Reason: ${unableReason.trim()}`
      });

      // Also send an urgent alert to Manager
      storage.sendChatMessage({
        conversationId: `manager_staff_${user.id}`,
        channel: 'manager_staff',
        senderId: user.id,
        senderName: user.name,
        senderRole: 'staff',
        text: `⚠️ URGENT: I am unable to attend booking ${bk.bookingNumber} (${bk.serviceName}). Reason: ${unableReason.trim()}. Please arrange replacement staff immediately.`
      });

      setUnableModalBookingId(null);
      setUnableReason('');
      alert('Urgent notification dispatched to Operations Manager. Replacement will be assigned.');
    }
  };

  // Start Service
  const handleStartService = (bookingId: string) => {
    const bk = storage.getBookingById(bookingId);
    if (bk) {
      bk.status = 'in_progress';
      bk.serviceStartedAt = new Date().toISOString();
      storage.saveBooking(bk);
      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'staff',
        action: 'Started Service Shift',
        category: 'Booking',
        recordId: bk.id,
        details: `Service started by nurse ${user.name} at patient residence.`
      });
      alert('Shift started! Vitals tracking initiated.');
    }
  };

  // Mark Completed
  const handleCompleteService = (bookingId: string) => {
    const bk = storage.getBookingById(bookingId);
    if (bk) {
      bk.status = 'completed';
      bk.serviceCompletedAt = new Date().toISOString();
      storage.saveBooking(bk);
      storage.addLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: 'staff',
        action: 'Completed Service Shift',
        category: 'Booking',
        recordId: bk.id,
        details: `Nurse ${user.name} marked ${bk.serviceName} completed.`
      });
      alert('Shift successfully marked as Completed! Patient can now submit review.');
    }
  };

  // Send message to Manager
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    storage.sendChatMessage({
      conversationId: `manager_staff_${user.id}`,
      channel: 'manager_staff',
      senderId: user.id,
      senderName: user.name,
      senderRole: 'staff',
      text: chatInput.trim()
    });
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Futuristic Glow Header */}
      <div className="bg-[#0b1426]/90 backdrop-blur-md border-b border-cyan-900/40 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-cyan-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-400/30">
            <Activity className="w-6 h-6 animate-pulse text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-sm tracking-wide uppercase">
                MYRA Clinical Staff Portal
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Futuristic Dark UI
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/70">
              Nurse on Duty: <strong className="text-cyan-400">{user.name}</strong> · {user.qualification || 'GNM / B.Sc RN'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-800/50 text-[11px] text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>MYRA Physical Audit: <strong>{user.isVerified ? 'VERIFIED' : 'PENDING'}</strong></span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800/60 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Futuristic Glass Nav */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#0c162c]/80 rounded-2xl border border-cyan-900/40 p-3 backdrop-blur-md shadow-xl space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                activeTab === 'jobs'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>My Assigned Jobs</span>
              </div>
              <span className={`tabular-nums text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'jobs' ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {assignedJobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                activeTab === 'schedule'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Duty Schedule</span>
              </div>
              <span className="tabular-nums text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {mySchedules.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                activeTab === 'chat'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4" />
                <span>Manager Comms</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                activeTab === 'profile'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Status</span>
              </div>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-800/40 text-[11px] text-cyan-200/80 space-y-2">
            <span className="font-bold text-cyan-400 block uppercase tracking-wider text-[10px]">
              Clinical Protocol
            </span>
            <p className="leading-relaxed">
              Strictly follow doctor prescriptions. In case of sudden vital instability, notify emergency supervisor immediately.
            </p>
          </div>
        </div>

        {/* Dynamic Pane */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: Assigned Jobs */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Active Bedside Assignments</h2>
                  <p className="text-xs text-slate-400">Patna residences requiring qualified nurse attendance</p>
                </div>
              </div>

              {assignedJobs.length === 0 ? (
                <div className="p-12 text-center bg-[#0c162c]/60 rounded-3xl border border-cyan-900/30">
                  <Activity className="w-10 h-10 text-cyan-700 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No active assignments at this moment</p>
                  <p className="text-xs text-slate-500 mt-1">Operations manager will assign your next shift shortly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-[#0c162c]/90 rounded-3xl border border-cyan-900/40 p-6 shadow-xl shadow-cyan-950/20 space-y-4 relative overflow-hidden"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950 pb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">{job.bookingNumber}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-300 capitalize">{job.shiftDuration}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          job.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                          job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          job.status === 'staff_unable' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {job.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Job Body */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500 block mb-1">Service & Shift</span>
                          <span className="text-sm font-bold text-white block">{job.serviceName}</span>
                          <span className="text-cyan-300/80 text-[11px] mt-0.5 block">Shift Date: {job.startDate}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 block mb-1">Patient Details</span>
                          <span className="font-semibold text-slate-200 block">
                            {job.patientName} (Age {job.patientAge}, {job.patientRelation})
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{job.address}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-500 block mb-1">Clinical Care Notes</span>
                          <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-950 leading-relaxed">
                            {job.careNotes || 'Standard bedside vitals charting and oral hygiene protocol.'}
                          </p>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-cyan-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          {job.status !== 'in_progress' && job.status !== 'completed' && job.status !== 'staff_unable' && (
                            <button
                              onClick={() => handleStartService(job.id)}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Start Service Shift</span>
                            </button>
                          )}

                          {job.status === 'in_progress' && (
                            <button
                              onClick={() => handleCompleteService(job.id)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Mark Shift Completed</span>
                            </button>
                          )}
                        </div>

                        {job.status !== 'completed' && job.status !== 'staff_unable' && (
                          <button
                            onClick={() => setUnableModalBookingId(job.id)}
                            className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl border border-red-800/60 font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <span>Unable to Attend</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Duty Schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Shift Duty Roster</h2>
                <p className="text-xs text-slate-400">Scheduled home visits and resident nursing shifts in Patna</p>
              </div>

              <div className="space-y-3">
                {mySchedules.length === 0 && <div className="rounded-2xl border border-dashed border-cyan-900 p-8 text-center text-xs text-slate-400">No shifts assigned yet. Your manager will add your schedule here.</div>}
                {mySchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-4 bg-[#0c162c]/80 rounded-2xl border border-cyan-900/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{sch.serviceName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300">
                          {sch.shift}
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Patient: <strong className="text-slate-200">{sch.patientName}</strong> · Location: {sch.location}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className="text-slate-500 text-[11px] font-mono">{sch.date}</span>
                      <span className="text-[10px] text-cyan-200">{sch.startTime || 'Time TBD'}{sch.endTime ? ` – ${sch.endTime}` : ''}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sch.status === 'checked_in' ? 'bg-cyan-500/20 text-cyan-300' :
                        sch.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {sch.status.toUpperCase()}
                      </span>
                      {sch.status === 'upcoming' && <button onClick={() => updateScheduleStatus(sch.id, 'checked_in')} className="rounded-lg bg-cyan-500 px-3 py-1.5 font-bold text-slate-950">Check in</button>}
                      {sch.status === 'checked_in' && <button onClick={() => updateScheduleStatus(sch.id, 'completed')} className="rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-slate-950">Complete shift</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Comms with Manager */}
          {activeTab === 'chat' && (
            <div className="bg-[#0c162c]/90 rounded-3xl border border-cyan-900/40 shadow-xl flex flex-col h-[520px]">
              <div className="p-4 border-b border-cyan-950 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Manager Operational Comms</h3>
                  <p className="text-[11px] text-slate-400">Direct encrypted line with Operations Lead Vikram Singh</p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080e1c]/60 text-xs">
                {chatMessages
                  .filter((m) => m.channel === 'manager_staff')
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          msg.senderId === user.id
                            ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-none'
                            : 'bg-[#101c38] text-slate-100 border border-cyan-900/50 rounded-bl-none'
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

              <div className="p-3 border-t border-cyan-950 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Report vitals or update shift status to Manager..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-cyan-900/60 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Profile & Physical Audit */}
          {activeTab === 'profile' && (
            <div className="bg-[#0c162c]/90 p-6 rounded-3xl border border-cyan-900/40 shadow-xl space-y-6 text-xs">
              <div>
                <h3 className="font-bold text-white text-base">Nurse Credentials & Physical Audit</h3>
                <p className="text-slate-400">All MYRA nurses undergo physical original document scrutiny by the Owner</p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-cyan-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Staff Nurse:</span>
                  <span className="font-bold text-white">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Designation:</span>
                  <span className="font-semibold text-cyan-300">{user.designation || 'Bedside Care Nurse'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Verified Qualification:</span>
                  <span className="text-slate-200">{user.qualification || 'B.Sc Nursing / GNM'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Audit Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {user.isVerified ? 'VERIFIED (Physical Original Document Inspection)' : 'PENDING OWNER AUDIT'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* UNABLE TO ATTEND EMERGENCY MODAL */}
      {unableModalBookingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1830] rounded-3xl max-w-md w-full border border-red-500/50 p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Report Unable to Attend Shift</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Reporting unable to attend will immediately notify the Operations Manager to arrange an emergency replacement nurse. Please provide the reason below:
            </p>

            <form onSubmit={handleUnableToAttend} className="space-y-3">
              <textarea
                required
                rows={3}
                value={unableReason}
                onChange={(e) => setUnableReason(e.target.value)}
                placeholder="e.g. Acute fever, family medical emergency, bike breakdown..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-900 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUnableModalBookingId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                >
                  Confirm & Alert Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

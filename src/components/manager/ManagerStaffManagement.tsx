import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search, Star, Users, Clock, MapPin, X } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip, Cell } from 'recharts';
import { UserProfile, StaffSchedule } from '../../types';
import { storage } from '../../services/storage';

interface Props { manager: UserProfile; }

const toISODate = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const mondayOf = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
const dateLabel = (date: Date) => date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

export const ManagerStaffManagement: React.FC<Props> = ({ manager }) => {
  const [staff, setStaff] = useState(() => storage.getUsers().filter(u => u.role === 'staff'));
  const [schedules, setSchedules] = useState(() => storage.getSchedules());
  const [reviews, setReviews] = useState(() => storage.getReviews());
  const [bookings, setBookings] = useState(() => storage.getBookings());
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssign, setShowAssign] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({
    staffId: '', date: toISODate(new Date()), startTime: '08:00', endTime: '20:00',
    serviceName: 'Home Nursing Care', patientName: 'New patient', location: 'Patna',
    shift: '12 Hours Day Shift'
  });

  const refresh = () => {
    setStaff(storage.getUsers().filter(u => u.role === 'staff'));
    setSchedules(storage.getSchedules());
    setReviews(storage.getReviews());
    setBookings(storage.getBookings());
  };

  useEffect(() => {
    const unsubscribe = storage.subscribe(refresh);
    window.addEventListener('storage', refresh);
    return () => { unsubscribe(); window.removeEventListener('storage', refresh); };
  }, []);

  const staffRatings = useMemo(() => staff.map(person => {
    const staffBookings = bookings.filter(b => b.assignedStaffId === person.id);
    const ids = new Set(staffBookings.map(b => b.id));
    const staffReviews = reviews.filter(r => ids.has(r.bookingId) && r.isApproved);
    const average = staffReviews.length ? staffReviews.reduce((sum, r) => sum + r.rating, 0) / staffReviews.length : 0;
    return { ...person, average, reviewCount: staffReviews.length, assignedCount: staffBookings.length };
  }), [staff, bookings, reviews]);

  const filteredStaff = staffRatings.filter(person =>
    (person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.phone.includes(search) ||
      (person.qualification || '').toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'all' || (statusFilter === 'verified' ? person.isVerified : !person.isVerified))
  );

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });
  const weekEnd = weekDays[6];
  const weekSchedules = schedules.filter(s => s.date >= toISODate(weekStart) && s.date <= toISODate(weekEnd));
  const ratedStaff = staffRatings.filter(person => person.average > 0);
  const ratingDistribution = [
    { name: '4.5–5.0', count: ratedStaff.filter(p => p.average >= 4.5).length, fill: '#10b981' },
    { name: '4.0–4.4', count: ratedStaff.filter(p => p.average >= 4 && p.average < 4.5).length, fill: '#22c55e' },
    { name: '3.0–3.9', count: ratedStaff.filter(p => p.average >= 3 && p.average < 4).length, fill: '#f59e0b' },
    { name: 'Below 3.0', count: ratedStaff.filter(p => p.average < 3).length, fill: '#ef4444' }
  ];
  const maxRatingCount = Math.max(1, ...ratingDistribution.map(r => r.count));
  const topStaff = [...ratedStaff].sort((a, b) => b.average - a.average).slice(0, 5);

  const assignShift = (event: React.FormEvent) => {
    event.preventDefault();
    const selected = staff.find(s => s.id === form.staffId && s.isVerified && s.status === 'active');
    if (!selected) { setNotice('Please select a staff member.'); return; }
    const candidateStart = new Date(`${form.date}T${form.startTime}:00`).getTime();
    let candidateEnd = new Date(`${form.date}T${form.endTime}:00`).getTime();
    if (candidateEnd <= candidateStart) candidateEnd += 24 * 60 * 60 * 1000; // overnight / 24-hour shift
    const collision = schedules.some(existing => {
      if (existing.staffId !== form.staffId || existing.status === 'leave') return false;
      const existingStart = new Date(`${existing.date}T${existing.startTime || '00:00'}:00`).getTime();
      let existingEnd = new Date(`${existing.date}T${existing.endTime || '23:59'}:00`).getTime();
      if (existingEnd <= existingStart) existingEnd += 24 * 60 * 60 * 1000;
      return candidateStart < existingEnd && candidateEnd > existingStart;
    });
    if (collision) { setNotice('This staff member already has an overlapping shift. Choose another time or date.'); return; }

    const schedule: StaffSchedule = {
      id: `sch-${Date.now()}`, staffId: selected.id, staffName: selected.name,
      serviceName: form.serviceName.trim(), patientName: form.patientName.trim(),
      location: form.location.trim(), date: form.date, shift: form.shift,
      startTime: form.startTime, endTime: form.endTime, status: 'upcoming'
    };
    storage.saveSchedule(schedule);
    storage.addLog({
      actorId: manager.id, actorName: manager.name, actorRole: 'manager',
      action: 'Created Weekly Staff Shift', category: 'Staff', recordId: schedule.id,
      details: `${selected.name} assigned ${form.date} ${form.startTime}-${form.endTime} for ${form.serviceName}`
    });
    setShowAssign(false);
    setNotice('Shift assigned. It will appear in the selected staff member’s Duty Schedule.');
    refresh();
  };

  const removeShift = (schedule: StaffSchedule) => {
    if (!window.confirm(`Remove ${schedule.staffName}'s shift on ${schedule.date}?`)) return;
    storage.deleteSchedule(schedule.id);
    storage.addLog({
      actorId: manager.id, actorName: manager.name, actorRole: 'manager',
      action: 'Removed Staff Shift', category: 'Staff', recordId: schedule.id,
      details: `Removed ${schedule.staffName}'s ${schedule.date} shift`
    });
    refresh();
  };

  return <div className="space-y-6">
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold text-white">Staff Management</h2>
          <p className="text-xs text-slate-400">Staff directory, verification and performance overview</p></div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-xl bg-slate-900 px-3 py-2 text-slate-300">{staff.length} total staff</span>
          <span className="rounded-xl bg-emerald-950 px-3 py-2 text-emerald-300">{staff.filter(s => s.isVerified).length} verified</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone or qualification"
            className="w-full rounded-xl border border-indigo-950 bg-[#0c1a36] py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-indigo-500"/></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-xl border border-indigo-950 bg-[#0c1a36] px-3 py-2.5 text-xs text-white">
          <option value="all">All staff</option><option value="verified">Verified</option><option value="pending">Pending verification</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredStaff.map(person => <article key={person.id} className="rounded-2xl border border-indigo-950 bg-[#0c1a36] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div><h3 className="font-bold text-white">{person.name}</h3><p className="text-[11px] text-indigo-300">{person.designation || 'Staff Nurse'}</p></div>
            <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${person.isVerified ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>{person.isVerified ? 'VERIFIED' : 'PENDING'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div><span className="block text-slate-500">Qualification</span>{person.qualification || 'Not provided'}</div>
            <div><span className="block text-slate-500">Phone</span>{person.phone}</div>
            <div><span className="block text-slate-500">Assigned bookings</span>{person.assignedCount}</div>
            <div><span className="block text-slate-500">Approved review avg.</span><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-400"/> {person.average ? person.average.toFixed(1) : 'No rating'} ({person.reviewCount})</span></div>
          </div>
        </article>)}
        {filteredStaff.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-slate-700 p-8 text-center text-xs text-slate-400">No staff match this filter.</p>}
      </div>
    </section>

    <section className="rounded-2xl border border-indigo-950 bg-[#0c1a36] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="flex items-center gap-2 text-lg font-bold text-white"><CalendarDays className="h-5 w-5 text-indigo-400"/> Weekly Shift Calendar</h2>
          <p className="text-xs text-slate-400">Assign staff to dated time slots and see the roster by day</p></div>
        <button onClick={() => { setNotice(''); setForm(v => ({...v, staffId: staff.find(s => s.isVerified && s.status === 'active')?.id || '', date: toISODate(new Date())})); setShowAssign(true); }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"><Plus className="h-4 w-4"/> Assign Shift</button>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekStart(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))} className="rounded-lg border border-slate-700 p-2 text-slate-300"><ChevronLeft className="h-4 w-4"/></button>
        <div className="text-xs font-semibold text-slate-200">{dateLabel(weekStart)} – {dateLabel(weekEnd)}, {weekEnd.getFullYear()}</div>
        <button onClick={() => setWeekStart(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))} className="rounded-lg border border-slate-700 p-2 text-slate-300"><ChevronRight className="h-4 w-4"/></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-2">
        {weekDays.map(day => {
          const key = toISODate(day);
          const dayShifts = weekSchedules.filter(s => s.date === key);
          return <div key={key} className="min-h-32 rounded-xl border border-slate-800 bg-[#071228] p-2">
            <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase text-slate-400">{day.toLocaleDateString('en-IN',{weekday:'short'})}</span><span className="text-xs font-bold text-white">{day.getDate()}</span></div>
            <div className="space-y-1.5">{dayShifts.map(shift => <div key={shift.id} className="rounded-lg border border-indigo-800/70 bg-indigo-950/50 p-2">
              <div className="truncate text-[10px] font-bold text-indigo-200">{shift.staffName}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-300"><Clock className="h-3 w-3"/>{shift.startTime || '—'}–{shift.endTime || '—'}</div>
              <div className="truncate text-[9px] text-slate-400">{shift.serviceName}</div>
              <div className={`mt-1 text-[8px] font-bold uppercase ${shift.status === 'completed' ? 'text-emerald-300' : shift.status === 'checked_in' ? 'text-cyan-300' : 'text-amber-300'}`}>{shift.status.replace('_', ' ')}</div>
              <button onClick={() => removeShift(shift)} className="mt-1 text-[9px] text-red-300 hover:text-red-200">Remove shift</button>
            </div>)}
              {dayShifts.length === 0 && <p className="py-3 text-center text-[9px] text-slate-600">No shifts</p>}</div>
          </div>;
        })}
      </div>
      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400"><span>{weekSchedules.length} shifts this week</span><span>•</span><span>{new Set(weekSchedules.map(s => s.staffId)).size} staff scheduled</span></div>
    </section>

    <section className="rounded-2xl border border-indigo-950 bg-[#0c1a36] p-4 sm:p-5">
      <h3 className="mb-1 text-sm font-bold text-white">Nursing staff performance ratings</h3>
      <p className="mb-3 text-[11px] text-slate-400">Based on approved customer reviews linked to each staff member’s completed bookings</p>
      {ratedStaff.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-64"><ResponsiveContainer width="100%" height="100%"><RadialBarChart data={ratingDistribution} innerRadius="18%" outerRadius="95%" startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, maxRatingCount]} tick={false}/>
          <RadialBar dataKey="count" background={{ fill: '#172554' }} cornerRadius={8}>
            {ratingDistribution.map(row => <Cell key={row.name} fill={row.fill}/>)}
          </RadialBar>
          <Tooltip formatter={(value: number) => [`${value} reviews`, 'Count']}/>
        </RadialBarChart></ResponsiveContainer></div>
        <div className="space-y-2">
          {ratingDistribution.map(row => <div key={row.name} className="flex items-center justify-between rounded-lg bg-[#071228] px-3 py-2 text-xs"><span className="flex items-center gap-2 text-slate-300"><Star className="h-3 w-3 text-amber-400"/>{row.name} average</span><strong className="text-white">{row.count} staff</strong></div>)}
          <div className="border-t border-slate-800 pt-2"><p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Top performing staff</p>
            {topStaff.map((person, index) => <div key={person.id} className="flex justify-between py-1 text-xs"><span className="text-slate-300">{index + 1}. {person.name}</span><strong className="text-emerald-300">{person.average.toFixed(1)} / 5</strong></div>)}
          </div>
        </div>
      </div> : <p className="py-8 text-center text-xs text-slate-400">No staff-linked approved reviews yet. Performance ratings will appear after customers submit reviews for completed bookings.</p>}
    </section>

    {notice && <div className="rounded-xl border border-indigo-800 bg-indigo-950/50 p-3 text-xs text-indigo-200">{notice}</div>}
    {showAssign && <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/80 p-4">
      <form onSubmit={assignShift} className="my-6 w-full max-w-xl space-y-4 rounded-2xl border border-indigo-800 bg-[#0c1a36] p-5 text-xs text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between"><h3 className="text-base font-bold">Assign staff shift</h3><button type="button" onClick={() => setShowAssign(false)}><X className="h-4 w-4"/></button></div>
        <label className="block space-y-1"><span className="text-slate-400">Staff member</span><select required value={form.staffId} onChange={e => setForm(v => ({...v,staffId:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5">{staff.filter(s => s.isVerified && s.status === 'active').map(s => <option key={s.id} value={s.id}>{s.name} (Verified)</option>)}</select></label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="space-y-1"><span className="text-slate-400">Date</span><input required type="date" value={form.date} onChange={e => setForm(v => ({...v,date:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"/></label>
          <label className="space-y-1"><span className="text-slate-400">Start time</span><input required type="time" value={form.startTime} onChange={e => setForm(v => ({...v,startTime:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"/></label>
          <label className="space-y-1"><span className="text-slate-400">End time</span><input required type="time" value={form.endTime} onChange={e => setForm(v => ({...v,endTime:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"/></label>
        </div>
        <label className="block space-y-1"><span className="text-slate-400">Shift type</span><select value={form.shift} onChange={e => setForm(v => ({...v,shift:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"><option>12 Hours Day Shift</option><option>12 Hours Night Shift</option><option>8 Hours General Shift</option><option>24 Hours Shift</option><option>Single Visit</option></select></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1"><span className="text-slate-400">Service</span><input required value={form.serviceName} onChange={e => setForm(v => ({...v,serviceName:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"/></label>
          <label className="space-y-1"><span className="text-slate-400">Patient name</span><input required value={form.patientName} onChange={e => setForm(v => ({...v,patientName:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"/></label>
        </div>
        <label className="block space-y-1"><span className="text-slate-400">Location / address</span><input required value={form.location} onChange={e => setForm(v => ({...v,location:e.target.value}))} className="w-full rounded-lg border border-slate-700 bg-[#071228] p-2.5"/></label>
        {notice && <p className="text-amber-300">{notice}</p>}
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowAssign(false)} className="rounded-lg border border-slate-700 px-4 py-2">Cancel</button><button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 font-bold">Save shift</button></div>
      </form>
    </div>}
  </div>;
};

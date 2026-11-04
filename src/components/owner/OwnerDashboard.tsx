import React, { useState } from 'react';
import { 
  UserProfile, 
  Booking, 
  HealthcareService, 
  CustomerReview, 
  ActivityLog, 
  SystemSettings 
} from '../../types';
import { storage } from '../../services/storage';
import { QRCodeGenerator } from '../common/QRCodeGenerator';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  CreditCard, 
  Star, 
  FileText, 
  Database, 
  Download, 
  LogOut, 
  Sliders, 
  Activity, 
  Award, 
  Globe, 
  Phone, 
  Edit3, 
  Save, 
  Check, 
  Smartphone,
  Eye,
  RefreshCw
} from 'lucide-react';

interface OwnerDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenZip: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, onLogout, onOpenZip }) => {
  const [activeTab, setActiveTab] = useState<
    'cms' | 'services' | 'analytics' | 'control' | 'staff_verify' | 'upi' | 'reviews' | 'logs' | 'backup'
  >('cms');

  const [settings, setSettings] = useState<SystemSettings>(() => storage.getSettings());
  const [servicesList, setServicesList] = useState<HealthcareService[]>(() => storage.getServices());
  const allBookings = storage.getBookings();
  const allUsers = storage.getUsers();
  const allStaff = allUsers.filter((u) => u.role === 'staff');
  const allReviews = storage.getReviews();
  const allLogs = storage.getLogs();

  // Metrics
  const totalRevenue = allBookings
    .filter((b) => b.paymentStatus === 'verified_paid')
    .reduce((sum, b) => sum + (b.paymentAmount || 0), 0);
  const pendingPayments = allBookings
    .filter((b) => b.paymentStatus === 'submitted_verification')
    .reduce((sum, b) => sum + (b.paymentAmount || 0), 0);
  const completedServices = allBookings.filter((b) => b.status === 'completed').length;
  const activeShifts = allBookings.filter((b) => b.status === 'in_progress').length;

  // Last six calendar months: booking volume and verified earnings.
  const monthlyRevenueData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthBookings = allBookings.filter(booking => {
      const created = new Date(booking.createdAt);
      return created.getFullYear() === year && created.getMonth() === month;
    });
    const monthEarnings = allBookings.filter(booking => {
      if (booking.paymentStatus !== 'verified_paid') return false;
      const paidDate = new Date(booking.paidAt || booking.createdAt);
      return paidDate.getFullYear() === year && paidDate.getMonth() === month;
    }).reduce((sum, booking) => sum + (booking.paymentAmount || 0), 0);
    return {
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      bookings: monthBookings.length,
      earnings: monthEarnings
    };
  });
  const currentMonth = monthlyRevenueData[5];
  const previousMonth = monthlyRevenueData[4];
  const revenueGrowth = previousMonth.earnings > 0
    ? ((currentMonth.earnings - previousMonth.earnings) / previousMonth.earnings) * 100
    : currentMonth.earnings > 0 ? 100 : 0;
  const bookingGrowth = previousMonth.bookings > 0
    ? ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings) * 100
    : currentMonth.bookings > 0 ? 100 : 0;

  // CMS Form States (Owner can change every piece of data without code!)
  const [phoneInput, setPhoneInput] = useState(settings.phone || '8893671162');
  const [secPhoneInput, setSecPhoneInput] = useState(settings.secondaryPhone || '8893659849');
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsapp || '+91 8893671162');
  const [emailInput, setEmailInput] = useState(settings.email || 'myrahomecareservices@gmail.com');
  const [locationInput, setLocationInput] = useState(settings.location || 'Patna, Bihar, India');
  const [heroTitleInput, setHeroTitleInput] = useState(settings.heroTitle || 'Better Care ❤️ Better Life');
  const [heroSubtitleInput, setHeroSubtitleInput] = useState(settings.heroSubtitle || 'Home healthcare support at your doorstep in Patna. Contact our team to discuss your care needs and confirm staff and service availability.');
  const [stat1Title, setStat1Title] = useState(settings.stat1Title || 'Male & Female Staff');
  const [stat1Desc, setStat1Desc] = useState(settings.stat1Desc || 'Subject to availability');
  const [stat2Title, setStat2Title] = useState(settings.stat2Title || 'Home Care Support');
  const [stat2Desc, setStat2Desc] = useState(settings.stat2Desc || 'Service requests by phone');
  const [stat3Title, setStat3Title] = useState(settings.stat3Title || 'Patna, Bihar');
  const [stat3Desc, setStat3Desc] = useState(settings.stat3Desc || 'Confirm service area first');
  
  // App Download settings
  const [appTitleInput, setAppTitleInput] = useState(settings.appTitle || 'MYRA Mobile App');
  const [appDescInput, setAppDescInput] = useState(settings.appDescription || 'The official app download will appear here when MYRA publishes a release.');
  const [appAvailableInput, setAppAvailableInput] = useState(settings.appAvailable || false);
  const [appStatusTextInput, setAppStatusTextInput] = useState(settings.appStatusText || 'APP NOT AVAILABLE YET');
  const [apkUrlInput, setApkUrlInput] = useState(settings.apkDownloadUrl || '');
  const [appVersionInput, setAppVersionInput] = useState(settings.appVersion || '1.0.0');

  // UPI settings state
  const [upiIdInput, setUpiIdInput] = useState(settings.upiId || '8893671162@okbizaxis');
  const [upiNameInput, setUpiNameInput] = useState(settings.upiPayeeName || 'MYRA HomeCare Services');
  const [upiEnabled, setUpiEnabled] = useState(settings.isUpiEnabled);

  // Success alert indicator
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateSettings({
      phone: phoneInput.trim(),
      secondaryPhone: secPhoneInput.trim(),
      whatsapp: whatsappInput.trim(),
      email: emailInput.trim(),
      location: locationInput.trim(),
      heroTitle: heroTitleInput.trim(),
      heroSubtitle: heroSubtitleInput.trim(),
      stat1Title: stat1Title.trim(),
      stat1Desc: stat1Desc.trim(),
      stat2Title: stat2Title.trim(),
      stat2Desc: stat2Desc.trim(),
      stat3Title: stat3Title.trim(),
      stat3Desc: stat3Desc.trim(),
      appTitle: appTitleInput.trim(),
      appDescription: appDescInput.trim(),
      appAvailable: appAvailableInput,
      appStatusText: appStatusTextInput.trim(),
      apkDownloadUrl: apkUrlInput.trim(),
      appVersion: appVersionInput.trim()
    });
    setSettings(updated);
    setSaveSuccessMsg('All website phone numbers, headlines, stats and app settings updated live!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateSettings({
      upiId: upiIdInput.trim(),
      upiPayeeName: upiNameInput.trim(),
      isUpiEnabled: upiEnabled
    });
    setSettings(updated);
    setSaveSuccessMsg('UPI ID updated! The dynamic QR code for customers has been refreshed.');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleToggleMaintenance = () => {
    const updated = storage.updateSettings({
      maintenanceMode: !settings.maintenanceMode
    });
    setSettings(updated);
    alert(`Maintenance Mode is now ${updated.maintenanceMode ? 'ACTIVE (Public website shows maintenance page)' : 'DISABLED (Public website is live)'}!`);
  };

  const handleVerifyStaff = (staffId: string, isApproved: boolean) => {
    const target = allStaff.find((s) => s.id === staffId);
    if (!target) return;

    target.isVerified = isApproved;
    target.status = isApproved ? 'active' : 'suspended';
    target.verificationDate = new Date().toISOString().split('T')[0];
    target.verifiedBy = user.name;
    storage.saveUser(target);

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'owner',
      action: isApproved ? 'Approved Staff Verification' : 'Rejected Staff Verification',
      category: 'Staff',
      recordId: target.id,
      details: `Owner ${user.name} recorded physical audit outcome as ${isApproved ? 'VERIFIED' : 'REJECTED'} for ${target.name}.`
    });

    setSaveSuccessMsg(`Staff verification for ${target.name} set to ${isApproved ? 'VERIFIED' : 'REJECTED'}`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleToggleReviewApproval = (reviewId: string) => {
    const rev = allReviews.find((r) => r.id === reviewId);
    if (!rev) return;

    rev.isApproved = !rev.isApproved;
    storage.saveReview(rev);

    storage.addLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: 'owner',
      action: rev.isApproved ? 'Published Customer Review' : 'Unpublished Customer Review',
      category: 'Review',
      recordId: rev.id,
      details: `Review for ${rev.serviceName} marked as ${rev.isApproved ? 'PUBLIC' : 'HIDDEN'}.`
    });

    setSaveSuccessMsg(`Review marked as ${rev.isApproved ? 'Published & Visible' : 'Unpublished & Hidden'}`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Service Edit Handler
  const handleServiceChange = (id: string, field: keyof HealthcareService, val: any) => {
    const updated = servicesList.map((srv) => {
      if (srv.id === id) {
        return { ...srv, [field]: val };
      }
      return srv;
    });
    setServicesList(updated);
  };

  const handleSaveAllServices = () => {
    storage.setServices(servicesList);
    setSaveSuccessMsg('All 16 services, prices, and emoji icons saved live to the website!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = storage.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myra-homecare-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071126] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <div className="bg-[#071b50] dark:bg-[#050e1f] border-b border-amber-500/40 px-4 sm:px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm tracking-wide text-white uppercase">
                Owner Master Control & CMS
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                Full Business Control
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Change numbers, website copy, 16 services & pricing without needing an engineer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {settings.maintenanceMode && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800 animate-pulse">
              MAINTENANCE ACTIVE
            </span>
          )}

          <button
            onClick={onOpenZip}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
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

      {/* Floating Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs font-bold shadow-md animate-in slide-in-from-top-2 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-[#0c1a36] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                activeTab === 'cms' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Website Content & Phone CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'services' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>16 Services & Prices</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                16
              </span>
            </button>

            <button
              onClick={() => setActiveTab('upi')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                activeTab === 'upi' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Live UPI & QR Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('staff_verify')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'staff_verify' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Staff Physical Audit</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {allStaff.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'reviews' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Review Approvals</span>
              </div>
              <span className="tabular-nums font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {allReviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Revenue Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('control')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                activeTab === 'control' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Maintenance Mode Switch</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                activeTab === 'logs' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Activity & Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                activeTab === 'backup' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Data Export & Backup</span>
            </button>
          </div>
        </div>

        {/* Dynamic Pane */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: WEBSITE CONTENT & PHONE CMS (LIVE DATA EDITOR) */}
          {activeTab === 'cms' && (
            <div className="bg-white dark:bg-[#0c1a36] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-500" />
                    Live Website Content & Number Manager
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    यहाँ से आप फोन नंबर, व्हाट्सएप, हेडिंग, आंकड़े व ऐप डिटेल्स सीधे बदल सकते हैं — किसी इंजीनियर की जरूरत नहीं!
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCMS} className="space-y-6">
                {/* 1. Contact Numbers & WhatsApp */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm text-[#071b50] dark:text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Phone className="w-4 h-4" />
                    1. Contact Numbers & WhatsApp
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Primary Phone Helpline *
                      </label>
                      <input
                        type="text"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="e.g. 8893671162"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Secondary Phone Helpline
                      </label>
                      <input
                        type="text"
                        value={secPhoneInput}
                        onChange={(e) => setSecPhoneInput(e.target.value)}
                        placeholder="e.g. 8893659849"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        placeholder="e.g. +91 8893671162"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Official Email
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="myrahomecareservices@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Hero Headline & Subtitle */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-[#071b50] dark:text-cyan-400 uppercase tracking-wider">
                    2. Homepage Hero Headlines
                  </h3>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Big Title (H1)
                    </label>
                    <input
                      type="text"
                      value={heroTitleInput}
                      onChange={(e) => setHeroTitleInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-extrabold text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hero Paragraph Description
                    </label>
                    <textarea
                      rows={2}
                      value={heroSubtitleInput}
                      onChange={(e) => setHeroSubtitleInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* 3. Three Stat Boxes */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-[#071b50] dark:text-cyan-400 uppercase tracking-wider">
                    3. Three Strip Stat Boxes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Box 1 Title & Desc</label>
                      <input
                        type="text"
                        value={stat1Title}
                        onChange={(e) => setStat1Title(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                      <input
                        type="text"
                        value={stat1Desc}
                        onChange={(e) => setStat1Desc(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Box 2 Title & Desc</label>
                      <input
                        type="text"
                        value={stat2Title}
                        onChange={(e) => setStat2Title(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                      <input
                        type="text"
                        value={stat2Desc}
                        onChange={(e) => setStat2Desc(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Box 3 Title & Desc</label>
                      <input
                        type="text"
                        value={stat3Title}
                        onChange={(e) => setStat3Title(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      />
                      <input
                        type="text"
                        value={stat3Desc}
                        onChange={(e) => setStat3Desc(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Mobile App Download Settings */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-[#071b50] dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    4. Mobile App Download Section
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        App Title
                      </label>
                      <input
                        type="text"
                        value={appTitleInput}
                        onChange={(e) => setAppTitleInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Status Label (e.g. APP NOT AVAILABLE YET / APK AVAILABLE)
                      </label>
                      <input
                        type="text"
                        value={appStatusTextInput}
                        onChange={(e) => setAppStatusTextInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        APK Download Direct URL
                      </label>
                      <input
                        type="url"
                        value={apkUrlInput}
                        onChange={(e) => setApkUrlInput(e.target.value)}
                        placeholder="https://.../myra-app.apk"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="appLive"
                      checked={appAvailableInput}
                      onChange={(e) => setAppAvailableInput(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <label htmlFor="appLive" className="font-extrabold text-slate-800 dark:text-slate-200">
                      Enable APK Download Button on Website
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Website Data (लाइव सेव करें)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: 16 SERVICES & PRICING LIVE EDITOR */}
          {activeTab === 'services' && (
            <div className="bg-white dark:bg-[#0c1a36] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    16 Clinical Services & Pricing Manager
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    यहाँ से आप 16 सेवाओं के नाम, इमोजी आइकॉन, फीस (₹) और एक्टिव स्थिति बदल सकते हैं।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllServices}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All 16 Services</span>
                </button>
              </div>

              <div className="space-y-3">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 bg-slate-50 dark:bg-[#081224] rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    {/* Icon Emoji */}
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Icon</label>
                      <input
                        type="text"
                        value={srv.icon || '🩺'}
                        onChange={(e) => handleServiceChange(srv.id, 'icon', e.target.value)}
                        className="w-12 text-center text-xl py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    {/* Service Name */}
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Service Name</label>
                      <input
                        type="text"
                        value={srv.name}
                        onChange={(e) => handleServiceChange(srv.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Short Description</label>
                      <input
                        type="text"
                        value={srv.shortDesc}
                        onChange={(e) => handleServiceChange(srv.id, 'shortDesc', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px]"
                      />
                    </div>

                    {/* Starting Fee */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={srv.startingPrice}
                        onChange={(e) => handleServiceChange(srv.id, 'startingPrice', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-extrabold text-blue-700 dark:text-cyan-400"
                      />
                    </div>

                    {/* Active Checkbox */}
                    <div className="sm:col-span-1 text-center">
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Active</label>
                      <input
                        type="checkbox"
                        checked={srv.isActive}
                        onChange={(e) => handleServiceChange(srv.id, 'isActive', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAllServices}
                  className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All 16 Services (सेवाएं सुरक्षित करें)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE UPI CONFIGURATION */}
          {activeTab === 'upi' && (
            <div className="bg-white dark:bg-[#0c1a36] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs transition-colors">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Live Business UPI & QR Setup</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  अपना UPI ID (उदा. 8893671162@okbizaxis) बदलें। कस्टमर पोर्टल में तुरंत डायनामिक QR कोड अपडेट हो जाएगा।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <form onSubmit={handleSaveUpi} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Merchant / Business UPI ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g. 8893671162@okbizaxis"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Payee Display Name
                    </label>
                    <input
                      type="text"
                      value={upiNameInput}
                      onChange={(e) => setUpiNameInput(e.target.value)}
                      placeholder="e.g. MYRA HomeCare Services"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="upiToggle"
                      checked={upiEnabled}
                      onChange={(e) => setUpiEnabled(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <label htmlFor="upiToggle" className="font-bold text-slate-800 dark:text-slate-200">
                      Enable UPI QR Code for Customers
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md"
                    >
                      Save Live UPI ID
                    </button>
                  </div>
                </form>

                <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider text-[11px]">
                    Live Dynamic QR Code Preview
                  </span>
                  <QRCodeGenerator
                    value={`upi://pay?pa=${upiIdInput}&pn=${encodeURIComponent(upiNameInput)}&cu=INR`}
                    size={160}
                    className="mx-auto"
                  />
                  <span className="block mt-2 font-mono text-xs text-slate-600 dark:text-cyan-400 font-bold">{upiIdInput}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF PHYSICAL AUDIT */}
          {activeTab === 'staff_verify' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Staff Physical Audit Approvals</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  मूल सर्टिफिकेट भौतिक रूप से देखकर अप्रूव या रिजेक्ट करें।
                </p>
              </div>

              <div className="space-y-3">
                {allStaff.map((stf) => (
                  <div key={stf.id} className="bg-white dark:bg-[#0c1a36] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">{stf.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{stf.email} · Phone: {stf.phone}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        stf.isVerified ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {stf.isVerified ? 'VERIFIED BY OWNER' : 'PENDING AUDIT'}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {stf.isVerified ? (
                        <button
                          onClick={() => handleVerifyStaff(stf.id, false)}
                          className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg font-semibold"
                        >
                          Revoke Verification
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyStaff(stf.id, true)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                        >
                          Confirm Physical Audit & Activate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Customer Reviews Moderation</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ओनर द्वारा अप्रूव किए गए रिव्यू ही वेबसाइट पर दिखते हैं।
                </p>
              </div>

              <div className="space-y-3">
                {allReviews.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-[#0c1a36] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{rev.customerName} ({rev.serviceName})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.isApproved ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {rev.isApproved ? 'APPROVED & PUBLIC' : 'PENDING APPROVAL'}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">"{rev.reviewText}"</p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleToggleReviewApproval(rev.id)}
                        className={`px-4 py-1.5 rounded-lg font-bold transition-colors ${
                          rev.isApproved ? 'border border-slate-300 text-slate-600 hover:bg-slate-100' : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                      >
                        {rev.isApproved ? 'Unpublish from Website' : 'Approve for Public Website'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REVENUE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Revenue & Shift Analytics</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">सत्यापित भुगतानों पर आधारित आंकड़े</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white dark:bg-[#0c1a36] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Revenue</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-[#0c1a36] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Completed Shifts</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    {completedServices}
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-[#0c1a36] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Active Bedside</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                    {activeShifts}
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-[#0c1a36] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Verification</span>
                  <div className="text-2xl font-black text-amber-600 tabular-nums">
                    ₹{pendingPayments.toLocaleString()}
                  </div>
                </div>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c1a36] space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Revenue & Growth</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monthly service bookings compared with verified earnings</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Last 6 months</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/70">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Revenue growth vs last month</span>
                    <div className={`mt-1 text-xl font-black ${revenueGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>{revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/70">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Booking growth vs last month</span>
                    <div className={`mt-1 text-xl font-black ${bookingGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>{bookingGrowth >= 0 ? '+' : ''}{bookingGrowth.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyRevenueData} margin={{ top: 12, right: 18, left: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.2}/>
                      <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                      <YAxis yAxisId="left" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false}/>
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false}/>
                      <Tooltip formatter={(value, name) => [name === 'Verified earnings' ? `₹${Number(value).toLocaleString('en-IN')}` : value, name]} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#fff' }}/>
                      <Legend wrapperStyle={{ fontSize: 11 }}/>
                      <Bar yAxisId="left" dataKey="bookings" name="Service bookings" fill="#6366f1" radius={[6,6,0,0]} maxBarSize={42}/>
                      <Line yAxisId="right" type="monotone" dataKey="earnings" name="Verified earnings" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Earnings include only bookings marked verified_paid. Booking counts use booking creation month; earnings use payment date when available.</p>
              </section>
            </div>
          )}

          {/* TAB 7: MASTER SWITCHES & MAINTENANCE */}
          {activeTab === 'control' && (
            <div className="bg-white dark:bg-[#0c1a36] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs transition-colors">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Emergency Controls & Maintenance</h2>
                <p className="text-slate-500 dark:text-slate-400">वेबसाइट को मेंटेनेंस मोड पर डालने या हटाने का स्विच</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block">Website Maintenance Mode</span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    चालू करने पर जनता को मेंटेनेंस स्क्रीन दिखेगी। ओनर डैशबोर्ड कभी लॉक नहीं होता।
                  </p>
                </div>
                <button
                  onClick={handleToggleMaintenance}
                  className={`px-5 py-2.5 rounded-xl font-black transition-all ${
                    settings.maintenanceMode ? 'bg-red-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {settings.maintenanceMode ? 'ENABLED (OFFLINE)' : 'DISABLED (ONLINE)'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Security & Activity Audit Logs</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">हर प्रशासनिक बदलाव का सुरक्षित रिकॉर्ड</p>
              </div>

              <div className="bg-white dark:bg-[#0c1a36] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {allLogs.slice(0, 15).map((log) => (
                  <div key={log.id} className="p-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-amber-600 font-semibold uppercase text-[10px]">{log.category}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{log.details}</p>
                      <span className="text-[10px] text-slate-400">Actor: {log.actorName} ({log.actorRole.toUpperCase()})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: DATA BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="bg-white dark:bg-[#0c1a36] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs transition-colors">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Zero-Budget Data Backup</h2>
                <p className="text-slate-500 dark:text-slate-400">पूरे सिस्टम डेटा को 1-क्लिक में सुरक्षित JSON या ZIP में बैकअप करें</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Export All Data (JSON)</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    सभी 16 सेवाएं, बुकिंग, मरीज प्रोफाइल, UPI लेन-देन व सुरक्षा लॉग्स डाउनलोड करें।
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="p-5 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-3">
                  <h3 className="font-bold text-sm text-teal-950 dark:text-teal-200">GitHub Pages Source ZIP</h3>
                  <p className="text-teal-800 dark:text-teal-300 text-[11px]">
                    GitHub Pages पर फ्री डिप्लॉयमेंट हेतु पूरा प्रोजेक्ट ZIP तैयार करें।
                  </p>
                  <button
                    onClick={onOpenZip}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Project ZIP Package</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

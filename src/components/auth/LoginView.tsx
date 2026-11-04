import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { storage } from '../../services/storage';
import { Shield, User, Briefcase, Activity, HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  initialRole?: UserRole;
  onLoginSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialRole = 'customer',
  onLoginSuccess,
  onCancel
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(() => {
    if (initialRole === 'owner') return 'myrahomecareservices@gmail.com';
    if (initialRole === 'manager') return 'manager.myra@gmail.com';
    if (initialRole === 'staff') return 'pooja.nurse@gmail.com';
    return 'kumarverma353134@gmail.com';
  });
  const [fullName, setFullName] = useState(() => {
    if (initialRole === 'owner') return 'MYRA Business Administrator';
    if (initialRole === 'manager') return 'Vikram Singh';
    if (initialRole === 'staff') return 'Pooja Sharma, RN';
    return 'Kumar Verma';
  });
  const [phone, setPhone] = useState('8893671162');
  const [staffQualification, setStaffQualification] = useState('B.Sc Nursing (RNC Registered)');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'owner') {
      setEmail('myrahomecareservices@gmail.com');
      setFullName('MYRA Business Administrator');
    } else if (role === 'manager') {
      setEmail('manager.myra@gmail.com');
      setFullName('Vikram Singh');
    } else if (role === 'staff') {
      setEmail('pooja.nurse@gmail.com');
      setFullName('Pooja Sharma, RN');
    } else {
      setEmail('kumarverma353134@gmail.com');
      setFullName('Kumar Verma');
    }
  };

  const handleGoogleSignIn = () => {
    // Check if user already exists
    const users = storage.getUsers();
    let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      existing = {
        id: `usr-${selectedRole}-${Date.now()}`,
        name: fullName || 'Authorized User',
        email,
        phone,
        role: selectedRole,
        createdAt: new Date().toISOString(),
        status: selectedRole === 'staff' ? 'pending_approval' : 'active',
        qualification: selectedRole === 'staff' ? staffQualification : undefined,
        designation: selectedRole === 'staff' ? 'Staff Nurse' : undefined
      };
      storage.saveUser(existing);
    }

    storage.setCurrentUser(existing);
    onLoginSuccess(existing);
  };

  return (
    <div className="min-h-screen bg-[#050c1c] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#0c1a36] rounded-3xl max-w-md w-full shadow-2xl border border-cyan-900/60 overflow-hidden">
        {/* Header */}
        <div className="bg-[#071228] border-b border-cyan-950 p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 mx-auto flex items-center justify-center font-bold shadow-md">
            <HeartPulse className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            MYRA HomeCare Access Portal
          </h2>
          <p className="text-xs text-cyan-200/70">
            Sign in with Google or select your dedicated workspace
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-[#08152e] border-b border-cyan-950 grid grid-cols-4 gap-1.5 text-[11px] font-semibold text-center">
          <button
            type="button"
            onClick={() => handleRoleChange('customer')}
            className={`py-2 px-1 rounded-xl transition-all ${
              selectedRole === 'customer'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('manager')}
            className={`py-2 px-1 rounded-xl transition-all ${
              selectedRole === 'manager'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Manager
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('staff')}
            className={`py-2 px-1 rounded-xl transition-all ${
              selectedRole === 'staff'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('owner')}
            className={`py-2 px-1 rounded-xl transition-all ${
              selectedRole === 'owner'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Owner
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Role Description Banner */}
          <div className="p-3.5 rounded-xl bg-[#08152e] border border-cyan-950 text-slate-300 text-xs">
            {selectedRole === 'customer' && (
              <p>
                <strong className="text-cyan-300">Customer Workspace:</strong> Book 16 home nursing services, view family profiles, accept 72-hour quotations, and pay via UPI or cash.
              </p>
            )}
            {selectedRole === 'manager' && (
              <p>
                <strong className="text-indigo-300">Operations Manager:</strong> Manage daily 16 services & live prices, assign nurses, handle quotations, verify UPI payments, and manage helpline numbers.
              </p>
            )}
            {selectedRole === 'staff' && (
              <p>
                <strong className="text-teal-300">Staff Portal:</strong> View assigned patients, clock attendance, access care instructions, and report shift status.
              </p>
            )}
            {selectedRole === 'owner' && (
              <p>
                <strong className="text-amber-300">Owner Master Control:</strong> Full CMS control over website texts, 16 services, 3 stats, helpline numbers, UPI ID, and backup export.
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Google Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#071228] border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-[#071228] border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {selectedRole === 'staff' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nursing Qualification (For Physical Audit)
              </label>
              <input
                type="text"
                value={staffQualification}
                onChange={(e) => setStaffQualification(e.target.value)}
                placeholder="e.g. B.Sc Nursing, GNM, Patient Attendant Diploma"
                className="w-full px-3 py-2 bg-[#071228] border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 bg-[#08152e] hover:bg-cyan-950 text-white font-bold text-xs rounded-xl border border-cyan-800/80 shadow-md flex items-center justify-center gap-2.5 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google as {selectedRole.toUpperCase()}</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

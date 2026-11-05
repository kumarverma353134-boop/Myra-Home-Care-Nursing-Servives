import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { auth, db, googleProvider } from '../../services/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { HeartPulse } from 'lucide-react';

interface LoginViewProps {
  initialRole?: UserRole;
  onLoginSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

const roleLabels: Record<UserRole, string> = {
  customer: 'Customer',
  manager: 'Manager',
  staff: 'Staff',
  owner: 'Owner'
};

export const LoginView: React.FC<LoginViewProps> = ({
  initialRole = 'customer',
  onLoginSuccess,
  onCancel
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = credential.user;
      const profileRef = doc(db, 'users', firebaseUser.uid);
      const profileSnapshot = await getDoc(profileRef);

      if (!profileSnapshot.exists()) {
        if (selectedRole !== 'customer') {
          await signOut(auth);
          throw new Error('This account is not authorized for the selected portal. Contact the MYRA administrator.');
        }

        if (!firebaseUser.email || !firebaseUser.emailVerified) {
          await signOut(auth);
          throw new Error('Please sign in with a verified Google account.');
        }

        const customerProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'MYRA Customer',
          email: firebaseUser.email,
          role: 'customer',
          status: 'active',
          createdAt: new Date().toISOString()
        };

        await setDoc(profileRef, customerProfile);
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          name: customerProfile.name,
          email: customerProfile.email,
          phone: '',
          role: 'customer',
          createdAt: customerProfile.createdAt,
          status: 'active'
        };
        onLoginSuccess(userProfile);
        return;
      }

      const data = profileSnapshot.data();
      const allowedRoles: UserRole[] = ['customer', 'staff', 'manager', 'owner'];
      if (!allowedRoles.includes(data.role as UserRole)) {
        await signOut(auth);
        throw new Error('Your account has an invalid access role. Contact the MYRA administrator.');
      }

      if (data.role !== selectedRole) {
        await signOut(auth);
        throw new Error(`This Google account is not authorized for the ${roleLabels[selectedRole]} portal.`);
      }

      if (data.status !== 'active') {
        await signOut(auth);
        throw new Error(data.status === 'pending_approval'
          ? 'Your account is awaiting administrator approval.'
          : 'Your account is not active. Contact the MYRA administrator.');
      }

      if (data.uid !== firebaseUser.uid || data.email !== firebaseUser.email) {
        await signOut(auth);
        throw new Error('Account identity verification failed. Contact the MYRA administrator.');
      }

      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        name: typeof data.name === 'string' ? data.name : (firebaseUser.displayName || 'MYRA User'),
        email: firebaseUser.email || '',
        phone: typeof data.phone === 'string' ? data.phone : '',
        role: data.role as UserRole,
        avatar: firebaseUser.photoURL || undefined,
        createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
        isVerified: data.isVerified === true,
        qualification: typeof data.qualification === 'string' ? data.qualification : undefined,
        designation: typeof data.designation === 'string' ? data.designation : undefined,
        status: 'active'
      };

      onLoginSuccess(userProfile);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const message = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      if (code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again when ready.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This website domain is not authorized in Firebase Authentication settings.');
      } else if (code === 'auth/popup-blocked') {
        setError('Your browser blocked the sign-in popup. Allow popups and try again.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050c1c] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#0c1a36] rounded-3xl max-w-md w-full shadow-2xl border border-cyan-900/60 overflow-hidden">
        <div className="bg-[#071228] border-b border-cyan-950 p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 mx-auto flex items-center justify-center font-bold shadow-md">
            <HeartPulse className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">MYRA HomeCare Access Portal</h2>
          <p className="text-xs text-cyan-200/70">Sign in with the Google account authorized for this workspace</p>
        </div>

        <div className="p-3 bg-[#08152e] border-b border-cyan-950 grid grid-cols-4 gap-1.5 text-[11px] font-semibold text-center">
          {(['customer', 'manager', 'staff', 'owner'] as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => { setSelectedRole(role); setError(''); }}
              disabled={loading}
              className={`py-2 px-1 rounded-xl transition-all ${selectedRole === role ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#08152e] border border-cyan-950 text-slate-300">
            {selectedRole === 'customer' && <p><strong className="text-cyan-300">Customer Workspace:</strong> Sign in to manage your own bookings and care requests.</p>}
            {selectedRole === 'manager' && <p><strong className="text-indigo-300">Operations Manager:</strong> Access is limited to manager accounts pre-authorized by MYRA.</p>}
            {selectedRole === 'staff' && <p><strong className="text-teal-300">Staff Portal:</strong> Access is limited to approved staff accounts assigned by MYRA.</p>}
            {selectedRole === 'owner' && <p><strong className="text-amber-300">Owner Administration:</strong> Access is limited to the pre-authorized owner account.</p>}
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-[#08152e] hover:bg-cyan-950 disabled:opacity-60 text-white font-bold text-xs rounded-xl border border-cyan-800/80 shadow-md flex items-center justify-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{loading ? 'Connecting securely...' : `Continue with Google as ${roleLabels[selectedRole]}`}</span>
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Staff, Manager and Owner access must be created and approved by the MYRA administrator. Choosing a portal does not grant access.
          </p>

          <div className="pt-2 text-center">
            <button type="button" onClick={onCancel} disabled={loading} className="text-xs text-slate-400 hover:text-cyan-300 transition-colors">
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

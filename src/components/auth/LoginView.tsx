import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { auth, db, googleProvider } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { HeartPulse } from 'lucide-react';

interface LoginViewProps {
  initialRole?: UserRole;
  onLoginSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

type AuthMode = 'login' | 'signup';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingGoogleUser, setPendingGoogleUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const finishSignIn = async (firebaseUser: typeof auth.currentUser, allowCustomerCreation: boolean) => {
    if (!firebaseUser) throw new Error('Unable to read your signed-in account.');

    const profileRef = doc(db, 'users', firebaseUser.uid);
    const profileSnapshot = await getDoc(profileRef);

    if (!profileSnapshot.exists()) {
      if (!allowCustomerCreation) {
        await signOut(auth);
        throw new Error('MYRA account profile was not found. Please create a customer account or contact the administrator.');
      }

      if (!firebaseUser.email) {
        await signOut(auth);
        throw new Error('A valid email address is required for a MYRA account.');
      }

      const customerProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || name.trim() || 'MYRA Customer',
        email: firebaseUser.email,
        role: 'customer',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await setDoc(profileRef, customerProfile);
      onLoginSuccess({
        id: firebaseUser.uid,
        name: customerProfile.name,
        email: customerProfile.email,
        phone: '',
        role: 'customer',
        createdAt: customerProfile.createdAt,
        status: 'active'
      });
      return;
    }

    const data = profileSnapshot.data();
    const allowedRoles: UserRole[] = ['customer', 'staff', 'manager', 'owner'];
    if (
      !allowedRoles.includes(data.role as UserRole) ||
      data.status !== 'active' ||
      data.uid !== firebaseUser.uid ||
      data.email !== firebaseUser.email
    ) {
      await signOut(auth);
      throw new Error(data.status === 'pending_approval'
        ? 'Your MYRA account is awaiting administrator approval.'
        : 'Your account is not active or its access details are invalid. Contact the MYRA administrator.');
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
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const hasEmailPassword = credential.user.providerData.some(
        (provider) => provider.providerId === 'password'
      );
      if (!hasEmailPassword) {
        setPendingGoogleUser(credential.user);
        setMessage('Set a password for this Google account so you can later use either Google or Email + Password.');
        return;
      }
      await finishSignIn(credential.user, true);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const msg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      if (code === 'auth/popup-closed-by-user') setError('Sign-in was cancelled. Please try again.');
      else if (code === 'auth/unauthorized-domain') setError('This website domain is not authorized in Firebase Authentication settings.');
      else if (code === 'auth/popup-blocked') setError('Your browser blocked the sign-in popup. Allow popups and try again.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSetGooglePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!pendingGoogleUser || loading) return;
    if (password.length < 6) { setError('Choose a password with at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('The passwords do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      if (!pendingGoogleUser.email) throw new Error('A valid Google email is required.');
      const emailCredential = EmailAuthProvider.credential(pendingGoogleUser.email, password);
      const linked = await linkWithCredential(pendingGoogleUser, emailCredential);
      setPendingGoogleUser(null);
      setConfirmPassword('');
      setMessage('Password linked successfully. You can now use Google or Email + Password.');
      await finishSignIn(linked.user, true);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const friendly: Record<string, string> = {
        'auth/weak-password': 'Choose a password with at least 6 characters.',
        'auth/provider-already-linked': 'A password is already linked. Please sign in with Email + Password.',
        'auth/credential-already-in-use': 'This email/password credential is already linked to another account.'
      };
      setError(friendly[code || ''] || (err instanceof Error ? err.message : 'Unable to link password. Please try again.'));
    } finally { setLoading(false); }
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const credential = mode === 'signup'
        ? await createUserWithEmailAndPassword(auth, email.trim(), password)
        : await signInWithEmailAndPassword(auth, email.trim(), password);

      if (mode === 'signup' && name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
      await finishSignIn(credential.user, mode === 'signup');
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const msg = err instanceof Error ? err.message : 'Email sign-in failed. Please try again.';
      const friendly: Record<string, string> = {
        'auth/email-already-in-use': 'This email already has an account. Please sign in instead.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/weak-password': 'Choose a password with at least 6 characters.',
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/user-not-found': 'No account found with this email. Please create a customer account.',
        'auth/wrong-password': 'Email or password is incorrect.',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again.'
      };
      setError(friendly[code || ''] || msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setError('Enter your email address first, then choose Forgot password.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050c1c] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#0c1a36] rounded-3xl max-w-md w-full shadow-2xl border border-cyan-900/60 overflow-hidden">
        <div className="bg-[#071228] border-b border-cyan-950 p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 mx-auto flex items-center justify-center font-bold shadow-md">
            <HeartPulse className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">MYRA Home Care</h2>
          <p className="text-xs text-cyan-200/70">One secure account for your MYRA workspace</p>
        </div>

        <div className="p-6 space-y-4">
          {error && <div role="alert" className="p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs">{error}</div>}
          {message && <div role="status" className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 text-xs">{message}</div>}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-800 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-slate-500 text-[10px] uppercase tracking-wider">
            <div className="h-px bg-slate-700 flex-1" /><span>or continue with email</span><div className="h-px bg-slate-700 flex-1" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                autoComplete="name"
                required
                className="w-full rounded-xl bg-[#08152e] border border-cyan-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              autoComplete="email"
              required
              className="w-full rounded-xl bg-[#08152e] border border-cyan-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password (minimum 6 characters)"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={6}
                required
                className="w-full rounded-xl bg-[#08152e] border border-cyan-950 px-4 py-3 pr-20 text-sm text-white outline-none focus:border-cyan-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-xs font-semibold text-cyan-300">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={handlePasswordReset} className="text-xs text-cyan-300 hover:text-cyan-200">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create customer account' : 'Sign in with Email'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            {mode === 'login' ? "New to MYRA? " : 'Already have an account? '}
            <button
              type="button"
              disabled={loading}
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              {mode === 'login' ? 'Create customer account' : 'Sign in'}
            </button>
          </p>

          <p className="text-[11px] leading-5 text-slate-400 text-center">
            Your dashboard is assigned automatically from your approved MYRA account role. Customer registration cannot create staff, manager or owner access.
          </p>

          <div className="pt-1 text-center">
            <button type="button" onClick={onCancel} disabled={loading} className="text-xs text-slate-400 hover:text-cyan-300 transition-colors">
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

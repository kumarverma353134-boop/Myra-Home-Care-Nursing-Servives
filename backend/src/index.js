import express from 'express';
import crypto from 'node:crypto';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

const required = [
  'FIREBASE_SERVICE_ACCOUNT_JSON',
  'BREVO_API_KEY',
  'BREVO_SENDER_EMAIL',
  'OTP_HMAC_SECRET'
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.OTP_HMAC_SECRET.length < 32) {
  console.error('OTP_HMAC_SECRET must contain at least 32 characters.');
  process.exit(1);
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  next();
});

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
const adminAuth = getAuth();
const db = getFirestore();

const otpTtlMinutes = Math.min(10, Math.max(3, Number(process.env.OTP_TTL_MINUTES || 5)));
const requestWindows = new Map();

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const current = requestWindows.get(key);
  if (!current || current.resetAt <= now) {
    requestWindows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

function otpDigest(uid, otp) {
  return crypto.createHmac('sha256', process.env.OTP_HMAC_SECRET)
    .update(`${uid}:${otp}`)
    .digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function authenticatedUser(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    const error = new Error('Sign in first.');
    error.status = 401;
    throw error;
  }
  return adminAuth.verifyIdToken(header.slice(7), true);
}

async function privilegedProfile(uid, tokenEmail) {
  const userRecord = await adminAuth.getUser(uid);
  if (!userRecord.email || !userRecord.emailVerified || userRecord.email !== tokenEmail) {
    const error = new Error('A verified registered email is required.');
    error.status = 403;
    throw error;
  }

  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) {
    const error = new Error('Account profile was not found.');
    error.status = 403;
    throw error;
  }
  const profile = snap.data();
  const role = profile.role;
  if (!['staff', 'manager', 'owner'].includes(role) || profile.status !== 'active') {
    const error = new Error('This account is not approved for privileged access.');
    error.status = 403;
    throw error;
  }
  if (role === 'owner' && userRecord.email.toLowerCase() !== 'myrahomecareservices@gmail.com') {
    const error = new Error('Owner account email is not authorized.');
    error.status = 403;
    throw error;
  }
  return { role, email: userRecord.email };
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'myra-auth-backend' }));

app.post('/auth/otp/request', async (req, res) => {
  try {
    const decoded = await authenticatedUser(req);
    const { role, email } = await privilegedProfile(decoded.uid, decoded.email);
    const ip = req.ip || 'unknown';
    const emailKey = email.toLowerCase();

    if (!rateLimit(`ip:${ip}`, 10, 15 * 60 * 1000) ||
        !rateLimit(`email:${emailKey}`, 3, 15 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many OTP requests. Try again later.' });
    }

    const ref = db.collection('authOtps').doc(decoded.uid);
    const existing = await ref.get();
    if (existing.exists) {
      const lastSentAt = existing.get('lastSentAt')?.toMillis?.() || 0;
      if (Date.now() - lastSentAt < 60 * 1000) {
        return res.status(429).json({ error: 'Please wait 60 seconds before requesting another code.' });
      }
    }

    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const expiresAt = Timestamp.fromMillis(Date.now() + otpTtlMinutes * 60 * 1000);
    await ref.set({
      digest: otpDigest(decoded.uid, otp),
      expiresAt,
      attempts: 0,
      consumed: false,
      lastSentAt: Timestamp.now(),
      role
    });

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || 'MYRA Home Care',
          email: process.env.BREVO_SENDER_EMAIL
        },
        to: [{ email }],
        subject: 'Your MYRA verification code',
        textContent: `Your MYRA verification code is ${otp}. It expires in ${otpTtlMinutes} minutes. Do not share this code with anyone.`
      })
    });

    if (!response.ok) {
      await ref.delete();
      console.error('Brevo email delivery failed:', response.status);
      return res.status(502).json({ error: 'Could not send verification email. Please try again later.' });
    }

    return res.json({ ok: true, message: 'Verification code sent to your registered email.' });
  } catch (error) {
    console.error('OTP request failed:', error.message);
    return res.status(error.status || 401).json({ error: error.status ? error.message : 'Unable to process OTP request.' });
  }
});

app.post('/auth/otp/verify', async (req, res) => {
  try {
    const decoded = await authenticatedUser(req);
    const { role, email } = await privilegedProfile(decoded.uid, decoded.email);
    const code = String(req.body?.code || '').trim();
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Enter the 6-digit verification code.' });
    }

    const ref = db.collection('authOtps').doc(decoded.uid);
    let valid = false;
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists) return;
      const data = snap.data();
      if (data.consumed || data.expiresAt.toMillis() <= Date.now() || data.attempts >= 5) {
        transaction.delete(ref);
        return;
      }
      if (!safeEqual(data.digest, otpDigest(decoded.uid, code))) {
        transaction.update(ref, { attempts: data.attempts + 1 });
        return;
      }
      transaction.update(ref, { consumed: true, consumedAt: Timestamp.now() });
      valid = true;
    });

    if (!valid) {
      return res.status(400).json({ error: 'Invalid or expired code. Request a new code if needed.' });
    }

    const otpVerifiedUntil = Date.now() + 60 * 60 * 1000;
    const current = await adminAuth.getUser(decoded.uid);
    await adminAuth.setCustomUserClaims(decoded.uid, {
      ...(current.customClaims || {}),
      role,
      otpVerifiedUntil
    });

    const customToken = await adminAuth.createCustomToken(decoded.uid);
    return res.json({ ok: true, customToken, role, email });
  } catch (error) {
    console.error('OTP verification failed:', error.message);
    return res.status(error.status || 401).json({ error: error.status ? error.message : 'Unable to verify code.' });
  }
});

const port = Number(process.env.PORT || 10000);
app.listen(port, '0.0.0.0', () => {
  console.log(`MYRA auth backend listening on port ${port}`);
});

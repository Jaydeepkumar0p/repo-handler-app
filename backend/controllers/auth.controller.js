import { asyncHandler } from '../middleware/error.middleware.js';

function makeToken(password) {
  return Buffer.from(`folio-admin:${password}`).toString('base64');
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    // Dev: 'lax' works for same-site requests via Vite proxy
    // Prod: 'none' required for cross-site Vercel→Render
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days ms
  };
}

export const login = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not set on server' });
  }

  if (password.trim() !== adminPassword.trim()) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = makeToken(adminPassword.trim());

  // Set httpOnly cookie
  res.cookie('admin_token', token, cookieOptions());

  // Also return token in body so frontend can store it for multipart requests
  return res.status(200).json({ success: true, token });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('admin_token', { ...cookieOptions(), maxAge: 0 });
  return res.status(200).json({ success: true });
});

export const verify = asyncHandler(async (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return res.status(401).json({ authenticated: false });

  const expected = makeToken(adminPassword.trim());
  const token = req.cookies?.admin_token
    || req.headers?.['x-admin-token']
    || req.headers?.authorization?.replace('Bearer ', '').trim();

  if (token && token === expected) {
    return res.status(200).json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
});

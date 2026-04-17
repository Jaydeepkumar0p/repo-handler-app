import axios from 'axios';

/**
 * Base URL logic:
 *
 * LOCAL DEV (no .env needed):
 *   Leave VITE_API_URL empty or unset.
 *   Vite proxy rewrites /api/* → http://localhost:5000/api/*
 *   so axios calls like api.get('/websites') hit:
 *     browser: http://localhost:5173/api/websites
 *     proxy forwards to: http://localhost:5000/api/websites  ✅
 *
 * PRODUCTION (Vercel):
 *   Set VITE_API_URL=https://your-backend.onrender.com/api
 *   axios calls like api.get('/websites') hit:
 *     https://your-backend.onrender.com/api/websites  ✅
 *
 * COMMON MISTAKE — if someone sets VITE_API_URL=http://localhost:5000
 *   (without /api), this guard appends it automatically.
 */
function resolveBaseURL() {
  const raw = import.meta.env.VITE_API_URL || '';

  // Nothing set → use proxy path
  if (!raw || raw.trim() === '') return '/api';

  const url = raw.trim().replace(/\/$/, ''); // strip trailing slash

  // If they forgot /api, add it
  if (!url.endsWith('/api')) return `${url}/api`;

  return url;
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true,   // required — sends the admin_token cookie
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    let msg = 'Something went wrong';

    if (err.code === 'ECONNABORTED') {
      msg = 'Request timed out — is the backend running?';
    } else if (err.code === 'ERR_NETWORK' || !err.response) {
      msg = 'Cannot reach server — check backend is running on port 5000';
    } else {
      msg = err.response?.data?.error || err.message || msg;
    }

    return Promise.reject(new Error(msg));
  }
);

export default api;

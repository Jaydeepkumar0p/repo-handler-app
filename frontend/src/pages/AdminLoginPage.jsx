import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAdmin, checking, login } = useAuth();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');   // inline error — not a toast

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (!checking && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [checking, isAdmin, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) return;

    setError('');
    setLoading(true);

    try {
      await login(trimmed);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      // Show the exact server error message inline
      setError(err.message || 'Login failed. Check your password.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  // Don't flash the form while checking cookie
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xs"
      >
        <div className="rounded-2xl p-7" style={{ background: '#0f0f1a', border: '1px solid #1e1e35' }}>
          {/* Icon */}
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Lock size={20} className="text-indigo-400" />
          </div>

          <h1 className="text-lg font-semibold text-center text-white mb-1">Admin Access</h1>
          <p className="text-xs text-gray-500 text-center mb-6">Enter your admin password</p>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Password input */}
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                autoFocus
                autoComplete="current-password"
                spellCheck={false}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm focus:outline-none text-gray-100 placeholder:text-gray-600 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${error ? '#ef4444' : '#1e1e35'}`,
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Inline error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertCircle size={13} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? '#4f46e5' : '#6366f1' }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Verifying…' : 'Continue'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

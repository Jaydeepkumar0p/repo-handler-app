import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

// localStorage key — used to send token in multipart upload requests
const TOKEN_KEY = 'folio_admin_token';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      await api.get('/auth/verify');
      setIsAdmin(true);
    } catch {
      // Not authenticated — clear any stale stored token
      localStorage.removeItem(TOKEN_KEY);
      setIsAdmin(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (password) => {
    const { data } = await api.post('/auth/login', { password });
    if (data.success) {
      // Store token for multipart requests (uploads can't rely on httpOnly cookie alone)
      if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
      setIsAdmin(true);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Network error OK — still clear everything
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};

// Helper used by WebsiteFormModal for upload requests
export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

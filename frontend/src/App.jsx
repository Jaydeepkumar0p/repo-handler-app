import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import HomePage from './pages/HomePage.jsx';
import SiteDetailPage from './pages/SiteDetailPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/site/:id"          element={<SiteDetailPage />} />
          <Route path="/admin/login"       element={<AdminLoginPage />} />
          <Route path="/admin/dashboard"   element={
            <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>
          } />
          {/* Catch-all → home */}
          <Route path="*"                  element={<HomePage />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f0f1a',
            color: '#f1f1f8',
            border: '1px solid #1e1e35',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}

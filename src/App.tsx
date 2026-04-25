import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { LandingPage } from './pages/LandingPage';
import { LoginPage, RegisterPage, ResendVerificationPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { ResumesPage } from './pages/ResumesPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { NotFoundPage, ProtectedRoute, PublicOnlyRoute } from './pages/NotFoundPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PageLoader } from './components/ui/Loader';

const App: React.FC = () => (
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        },
        success: { iconTheme: { primary: '#636B2F', secondary: '#fff' } },
        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
      }}
    />

    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />

        {/* Dashboard - protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<SettingsPage />} />
        </Route>

        {/* Resume Builder - full-screen protected */}
        <Route path="/resume/:id" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;

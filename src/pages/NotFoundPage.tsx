import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

// 404 Page 

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 dot-pattern">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-sm"
    >
      <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
        <FileText className="w-10 h-10 text-white" />
      </div>
      <h1 className="font-display text-6xl font-semibold text-gray-900 mb-3">404</h1>
      <p className="text-lg font-medium text-gray-700 mb-2">Page not found</p>
      <p className="text-gray-500 text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/">
          <Button leftIcon={<Home className="w-4 h-4" />}>Go home</Button>
        </Link>
        <Button variant="ghost" onClick={() => history.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go back
        </Button>
      </div>
    </motion.div>
  </div>
);

// Protected Route 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

//  Public-only Route (redirect if logged in)

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

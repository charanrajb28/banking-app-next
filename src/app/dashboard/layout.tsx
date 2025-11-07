// src/app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, LogIn, RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          console.log('No auth token found');
          setShowAuthModal(true);
          setIsLoading(false);
          return;
        }

        // Verify token by fetching user profile
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Token verification failed:', response.status);
          localStorage.removeItem('auth_token');
          setShowAuthModal(true);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        
        if (!data.user) {
          localStorage.removeItem('auth_token');
          setShowAuthModal(true);
          setIsLoading(false);
          return;
        }

        // User is authenticated
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('auth_token');
        setShowAuthModal(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoToLogin = () => {
    localStorage.removeItem('auth_token');
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: 'var(--card-text)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-2xl font-bold text-center mb-2"
            style={{ color: 'var(--card-text)' }}
          >
            Authentication Required
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center mb-6"
            style={{ color: 'var(--card-text-secondary)' }}
          >
            Your session has expired or you are not logged in. Please log in to continue.
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {/* Go to Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoToLogin}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Go to Login
            </motion.button>

            {/* Reload Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReload}
              className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: 'var(--card-bg-alt)',
                color: 'var(--card-text)',
                border: '2px solid var(--card-bg-alt)'
              }}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reload Page
            </motion.button>
          </div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="text-xs text-center mt-4"
            style={{ color: 'var(--card-text-secondary)' }}
          >
            If you continue to experience issues, please clear your browser cache and try again.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}

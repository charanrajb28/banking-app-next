'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home,
  CreditCard,
  ArrowUpDown,
  PieChart,
  Wallet,
  Shield,
  X,
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Accounts', href: '/dashboard/accounts', icon: Wallet },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowUpDown },
  { name: 'Cards', href: '/dashboard/cards', icon: CreditCard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
  // { name: 'Security', href: '/dashboard/security', icon: Shield },
];

interface UserProfile {
  full_name: string;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserProfile(data.user);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const initials = userProfile ? getInitials(userProfile.full_name) : 'U';
  const fullName = userProfile?.full_name || 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0">
        <div
          className="flex flex-col flex-grow shadow-md backdrop-blur-xl"
          style={{
            background: 'var(--sidebar-bg1)',
            color: 'var(--sidebar-text)',
          }}
        >
          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 pt-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'shadow-sm'
                      : 'hover:scale-[1.02] hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? 'var(--sidebar-active-bg)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--sidebar-active-text)'
                      : 'var(--sidebar-text)',
                  }}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 transition-colors"
                    style={{
                      color: isActive
                        ? 'var(--sidebar-active-text)'
                        : 'var(--sidebar-text-secondary)',
                    }}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <Link href="/dashboard/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 p-5 mt-auto cursor-pointer transition-all duration-200 group"
              style={{
                background: 'var(--card-bg-alt)',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-sm"
                >
                  <span className="text-sm font-bold text-white">{initials}</span>
                </motion.div>
                <div className="ml-3">
                  <p
                    className="text-sm font-medium group-hover:text-blue-600 transition-colors"
                    style={{ color: 'var(--sidebar-text)' }}
                  >
                    {fullName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--sidebar-text-secondary)' }}
                  >
                    View Profile
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-72 shadow-2xl lg:hidden backdrop-blur-2xl"
        style={{
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2 shadow-md">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <div className="ml-3">
                <h2
                  className="text-xl font-bold"
                  style={{ color: 'var(--sidebar-text)' }}
                >
                  NeoBank
                </h2>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-[var(--card-bg-alt)] transition-colors"
            >
              <X className="h-6 w-6" style={{ color: 'var(--sidebar-text)' }} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? 'var(--sidebar-active-bg)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--sidebar-active-text)'
                      : 'var(--sidebar-text)',
                  }}
                >
                  <item.icon
                    className="mr-3 h-5 w-5"
                    style={{
                      color: isActive
                        ? 'var(--sidebar-active-text)'
                        : 'var(--sidebar-text-secondary)',
                    }}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Profile Section */}
          <Link href="/dashboard/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSidebarOpen(false)}
              className="flex-shrink-0 p-5 cursor-pointer transition-all duration-200 group"
              style={{
                background: 'var(--card-bg-alt)',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-sm"
                >
                  <span className="text-sm font-bold text-white">{initials}</span>
                </motion.div>
                <div className="ml-3">
                  <p
                    className="text-sm font-medium group-hover:text-blue-600 transition-colors"
                    style={{ color: 'var(--sidebar-text)' }}
                  >
                    {fullName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--sidebar-text-secondary)' }}
                  >
                    View Profile
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

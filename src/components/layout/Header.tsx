// src/components/layout/Header.tsx
'use client';

import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

interface User {
  id?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  toggleTheme 
}: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInitial, setUserInitial] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
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

        if (response.ok) {
          const data = await response.json();
          const userData = data.user;
          
          setUser(userData);

          // Calculate user initials
          if (userData?.full_name) {
            const nameArray = userData.full_name.toUpperCase().split(' ');
            const initials = nameArray.length >= 2
              ? nameArray[0][0] + nameArray[1][0]
              : nameArray[0]?.[0] || '';
            setUserInitial(initials);
          } else if (userData?.email) {
            setUserInitial(userData.email[0].toUpperCase());
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const greeting = user?.full_name 
    ? `Welcome back, ${user.full_name.split(' ')[0]}! Here's your financial overview.`
    : "Welcome back! Here's your financial overview.";

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </button>

          <div className="hidden lg:block ml-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-slate-500 dark:text-slate-400"
            >
              {loading ? 'Loading...' : greeting}
            </motion.p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 w-64 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toggleTheme();
              // Sync with data-theme attribute
              const html = document.documentElement;
              html.setAttribute('data-theme', darkMode ? 'light' : 'dark');
            }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link href="/dashboard/notifications">
              <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </Link>
          </motion.div>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center"
          >
            <Link href="/dashboard/profile">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
                <span className="text-sm font-semibold text-white">
                  {loading ? '...' : userInitial || 'U'}
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

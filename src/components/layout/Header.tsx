// src/components/layout/Header.tsx
'use client';

import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  toggleTheme 
}: HeaderProps) {
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, John! Here's your financial overview.
            </p>
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
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

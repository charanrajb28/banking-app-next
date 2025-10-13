// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  ArrowUpDown, 
  PieChart, 
  Bell, 
  Settings, 
  HelpCircle,
  Wallet,
  TrendingUp,
  Shield,
  X
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
  { name: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
  { name: 'Security', href: '/dashboard/security', icon: Shield },
];

const secondaryNav = [
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg">
          {/* Logo */}
          <div className="flex items-center px-6 py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  NeoBank
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Digital Banking
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute right-2 w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
              {secondaryNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  John Doe
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Premium Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 shadow-xl lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  NeoBank
                </h2>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>

          {/* Mobile Navigation - Same as desktop */}
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
}

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
        <div
          className="flex flex-col flex-grow border-r shadow-lg"
          style={{ 
            backgroundColor: 'var(--sidebar-bg)', 
            color: 'var(--sidebar-text)', 
            borderColor: 'var(--sidebar-text-secondary)' 
          }}
        >
          

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => {
  const isActive = pathname === item.href;
  return (
    <div key={item.name} className="relative">
      {/* Active Background */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: 'var(--sidebar-active-bg)' }}
        />
      )}

      <Link
        href={item.href}
        className="relative group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
        onClick={() => setSidebarOpen(false)}
        style={{ color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)' }}
      >
        <item.icon
          className="mr-3 h-5 w-5"
          style={{ color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text-secondary)' }}
        />
        {item.name}
      </Link>
    </div>
  );
})}


            <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--sidebar-text-secondary)' }}>
              {secondaryNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative"
                    style={{
                      background: isActive
                        ? 'linear-gradient(to right, var(--sidebar-active-gradient-start), var(--sidebar-active-gradient-end))'
                        : 'transparent',
                      color: isActive ? '#fff' : 'var(--sidebar-text)',
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" style={{ color: isActive ? '#fff' : 'var(--sidebar-text-secondary)' }} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="flex-shrink-0 px-4 py-4 border-t" style={{ borderColor: 'var(--sidebar-text-secondary)' }}>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div className="ml-3">
                <p style={{ color: 'var(--sidebar-text)' }} className="text-sm font-medium">
                  John Doe
                </p>
                <p style={{ color: 'var(--sidebar-text-secondary)' }} className="text-xs">
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
        className="fixed inset-y-0 left-0 z-50 w-72 shadow-xl lg:hidden"
        style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h2 style={{ color: 'var(--sidebar-text)' }} className="text-xl font-bold">
                  NeoBank
                </h2>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative"
                style={{
                  background: pathname === item.href
                    ? 'linear-gradient(to right, var(--sidebar-active-gradient-start), var(--sidebar-active-gradient-end))'
                    : 'transparent',
                  color: pathname === item.href ? '#fff' : 'var(--sidebar-text)',
                }}
              >
                <item.icon className="mr-3 h-5 w-5" style={{ color: pathname === item.href ? '#fff' : 'var(--sidebar-text-secondary)' }} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
}

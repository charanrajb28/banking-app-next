'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { name: 'Security', href: '/dashboard/security', icon: Shield },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

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
          <div
            className="flex-shrink-0 p-5 mt-auto "
            style={{
              background: 'var(--card-bg-alt)',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div className="ml-3">
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--sidebar-text)' }}
                >
                  John Doe
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--sidebar-text-secondary)' }}
                >
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
        </div>
      </motion.div>
    </>
  );
}

// src/components/dashboard/QuickActions.tsx
'use client';

import { motion } from 'framer-motion';
import { Send, TrendingUp, CreditCard, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    name: 'Transfer Money',
    icon: Send,
    from: '#2563EB', // blue-600
    to: '#1D4ED8',   // blue-700
    href: '/dashboard/transactions/transfer',
  },
  {
    name: 'Request Money',
    icon: TrendingUp,
    from: '#16A34A', // green-600
    to: '#15803D',   // green-700
    href: '/dashboard/request-money',
  },
  {
    name: 'My Cards',
    icon: CreditCard,
    from: '#7C3AED', // purple-600
    to: '#6D28D9',   // purple-700
    href: '/dashboard/cards',
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    from: '#EA580C', // orange-600
    to: '#C2410C',   // orange-700
    href: '/dashboard/analytics',
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--card-text)' }}>
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link key={action.name} href={action.href}>
            <motion.button
              initial={{
                opacity: 0,
                y: 20,
                backgroundImage: 'linear-gradient(to bottom right, var(--card-alt-bg), var(--card-alt-bg))',
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -4,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                backgroundImage: `linear-gradient(to bottom right, ${action.from}, ${action.to})`,
                color: '#fff',
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl p-6 text-black transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors mb-3">
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm">{action.name}</h3>
              </div>
            </motion.button>
          </Link>
        ))}
      </div>
    </div>
  );
}

// src/components/dashboard/QuickActions.tsx
'use client';

import { motion } from 'framer-motion';
import { Send, TrendingUp, CreditCard, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    name: 'Transfer Money',
    icon: Send,
    baseColor: '#2563EB', // blue-600
    colorShades: ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'], // dark to light blue
    href: '/dashboard/transactions/transfer',
  },
  {
    name: 'Request Money',
    icon: TrendingUp,
    baseColor: '#16A34A', // green-600
    colorShades: ['#15803D', '#16A34A', '#22C55E', '#4ADE80'], // dark to light green
    href: '/dashboard/request-money',
  },
  {
    name: 'My Cards',
    icon: CreditCard,
    baseColor: '#7C3AED', // purple-600
    colorShades: ['#6D28D9', '#7C3AED', '#A855F7', '#D8B4FE'], // dark to light purple
    href: '/dashboard/cards',
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    baseColor: '#EA580C', // orange-600
    colorShades: ['#C2410C', '#EA580C', '#F97316', '#FED7AA'], // dark to light orange
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
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{
                y: -6,
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl group relative overflow-hidden"
              style={{
                background: action.baseColor,
                color: '#fff',
              }}
            >
              {/* Animated gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundImage: `linear-gradient(-45deg, ${action.colorShades[0]}, ${action.colorShades[1]}, ${action.colorShades[2]}, ${action.colorShades[3]}, ${action.colorShades[0]})`,
                  backgroundSize: '300% 300%',
                }}
              />

              {/* Content wrapper */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                  className="p-3 rounded-lg backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-300 mb-3"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <action.icon className="h-6 w-6" />
                  </motion.div>
                </motion.div>
                <h3 className="font-semibold text-sm tracking-wide">{action.name}</h3>
              </div>
            </motion.button>
          </Link>
        ))}
      </div>
    </div>
  );
}

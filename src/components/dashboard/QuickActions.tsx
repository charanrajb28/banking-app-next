// src/components/dashboard/QuickActions.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  PiggyBank,
  QrCode,
  Smartphone
} from 'lucide-react';

const quickActions = [
  {
    name: 'Transfer Money',
    icon: ArrowUpRight,
    description: 'Send money to anyone',
    color: 'bg-blue-500 hover:bg-blue-600',
    href: '/dashboard/transfer'
  },
  {
    name: 'Request Money',
    icon: ArrowDownLeft, 
    description: 'Request payment from others',
    color: 'bg-green-500 hover:bg-green-600',
    href: '/dashboard/request'
  },
  {
    name: 'Pay Bills',
    icon: CreditCard,
    description: 'Utilities, subscriptions, etc.',
    color: 'bg-purple-500 hover:bg-purple-600',
    href: '/dashboard/bills'
  },
  {
    name: 'Save Money',
    icon: PiggyBank,
    description: 'Create savings goals',
    color: 'bg-pink-500 hover:bg-pink-600',
    href: '/dashboard/savings'
  },
  {
    name: 'QR Payment',
    icon: QrCode,
    description: 'Scan & pay instantly',
    color: 'bg-orange-500 hover:bg-orange-600',
    href: '/dashboard/qr-pay'
  },
  {
    name: 'Mobile Recharge',
    icon: Smartphone,
    description: 'Top up your mobile',
    color: 'bg-teal-500 hover:bg-teal-600',
    href: '/dashboard/recharge'
  }
];

export default function QuickActions() {
  return (
    <div className="card rounded-2xl p-6 shadow-lg transition-colors duration-300">
  <h2 className="text-xl font-bold mb-6">
    Quick Actions
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {quickActions.map((action, index) => (
      <motion.button
        key={action.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${action.color} rounded-xl p-4 text-white transition-all duration-200 shadow-lg hover:shadow-xl`}
      >
        <div className="flex flex-col items-center text-center">
          <action.icon className="h-8 w-8 mb-2" />
          <h3 className="font-semibold text-sm">{action.name}</h3>
          <p className="text-xs opacity-90 mt-1">{action.description}</p>
        </div>
      </motion.button>
    ))}
  </div>
</div>

  );
}

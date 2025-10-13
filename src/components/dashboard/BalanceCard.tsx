// src/components/dashboard/BalanceCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
  title: string;
  balance: number;
  accountNumber: string;
  change: number;
  changeType: 'increase' | 'decrease';
  currency?: string;
  gradient: string;
}

export default function BalanceCard({ 
  title, 
  balance, 
  accountNumber, 
  change, 
  changeType, 
  currency = 'USD',
  gradient 
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${gradient}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white"></div>
        <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-white opacity-50"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <p className="text-xs opacity-70">**** {accountNumber}</p>
          </div>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            {showBalance ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-3xl font-bold">
            {showBalance ? formatBalance(balance) : '****'}
          </h3>
          
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              {changeType === 'increase' ? '+' : '-'}{Math.abs(change)}% this month
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

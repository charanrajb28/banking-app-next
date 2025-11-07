// src/components/dashboard/BalanceCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BalanceCardProps {
  accountId: string;
  title: string;
  balance: number;
  accountNumber: string;
  change: number;
  changeType: 'increase' | 'decrease';
  currency?: string;
  gradient: string;
}

export default function BalanceCard({ 
  accountId,
  title, 
  balance, 
  accountNumber, 
  change, 
  changeType, 
  currency = 'USD',
  gradient 
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [loading, setLoading] = useState(false);
  const [displayChange, setDisplayChange] = useState(change);

  useEffect(() => {
    fetchAccountData();
  }, [accountId]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) return;

      // Fetch current account balance
      const response = await fetch(`/api/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentBalance(data.account.balance);

        // Calculate percentage change from previous month
        if (data.previousBalance) {
          const changePercent = ((data.account.balance - data.previousBalance) / data.previousBalance) * 100;
          setDisplayChange(Math.abs(changePercent));
        }
      }
    } catch (err) {
      console.error('Error fetching account data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetchAccountData();
  };

  return (
    <Link href={`/dashboard/accounts/${accountId}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${gradient} cursor-pointer group`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white"></div>
          <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-white opacity-50"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{title}</p>
              <p className="text-xs opacity-70">•• •••• {" "+accountNumber.slice(-4)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowBalance(!showBalance);
                }}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {showBalance ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Refresh balance"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Balance Section */}
          <div className="mt-6">
            <p className="text-xs opacity-70 mb-2">Available Balance</p>
            <h3 className="text-3xl font-bold font-mono">
              {showBalance ? formatBalance(currentBalance) : '••••••••'}
            </h3>
            
            {/* Change Indicator */}
            <div className="flex items-center mt-4 opacity-90">
              {changeType === 'increase' ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    +{displayChange.toFixed(1)}% this month
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    -{displayChange.toFixed(1)}% this month
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions Footer */}
          {/* <div className="mt-6 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-70">Click to view details</span>
              <span>→</span>
            </div>
          </div> */}
        </div>
      </motion.div>
    </Link>
  );
}

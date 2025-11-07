// src/components/dashboard/RecentTransactions.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  transaction_id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  category?: string;
  created_at: string;
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/transactions?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTransactionType = (type: string) => {
    const creditTypes = ['deposit', 'refund', 'transfer_in', 'interest', 'salary'];
    return creditTypes.includes(type) ? 'credit' : 'debit';
  };

  return (
    <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>
          Recent Transactions
        </h3>
        <Link
          href="/dashboard/transactions"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-5 w-5 animate-spin" style={{ color: 'var(--card-text-secondary)' }} />
        </div>
      ) : transactions.length === 0 ? (
        <p style={{ color: 'var(--card-text-secondary)' }} className="text-center py-8">
          No transactions yet
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((txn, index) => {
            const type = getTransactionType(txn.transaction_type);
            return (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: 'var(--card-bg-alt)' }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: type === 'credit' ? '#dcfce720' : '#fee2e220'
                    }}
                  >
                    {type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                      {txn.description || txn.category || txn.transaction_type}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                      {formatDate(txn.created_at)}
                    </p>
                  </div>
                </div>
                <p
                  className="font-bold"
                  style={{ color: type === 'credit' ? '#16a34a' : '#dc2626' }}
                >
                  {type === 'credit' ? '+' : '-'}
                  {formatCurrency(parseFloat(txn.amount.toString()), txn.currency)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// src/components/dashboard/RecentTransactions.tsx  
'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

const transactions = [
  { id: '1', type: 'credit', description: 'Salary Payment', amount: 5000.0, date: '2025-10-13', category: 'Income', status: 'completed' },
  { id: '2', type: 'debit', description: 'Coffee Shop', amount: 15.5, date: '2025-10-12', category: 'Food & Dining', status: 'completed' },
  { id: '3', type: 'debit', description: 'Netflix Subscription', amount: 12.99, date: '2025-10-11', category: 'Entertainment', status: 'completed' },
];

export default function RecentTransactions() {
  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    return type === 'credit' ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="card rounded-2xl p-6 shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
          Recent Transactions
        </h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:brightness-95"
            style={{ backgroundColor: 'var(--background)' }}
          >
            {/* Left section: icon + description */}
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor:
                    transaction.type === 'credit'
                      ? 'rgba(34,197,94,0.15)' // green-500 tint
                      : 'rgba(239,68,68,0.15)', // red-500 tint
                }}
              >
                {transaction.type === 'credit' ? (
                  <ArrowDownLeft
                    className="h-4 w-4"
                    style={{
                      color:
                        transaction.type === 'credit'
                          ? '#22c55e' // green
                          : '#ef4444', // red
                    }}
                  />
                ) : (
                  <ArrowUpRight
                    className="h-4 w-4"
                    style={{
                      color:
                        transaction.type === 'credit'
                          ? '#22c55e'
                          : '#ef4444',
                    }}
                  />
                )}
              </div>

              <div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {transaction.description}
                </p>
                <p className="text-sm opacity-70">
                  {transaction.category} • {format(new Date(transaction.date), 'MM/dd/yyyy')}
                </p>
              </div>
            </div>

            {/* Right section: amount + status */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p
                  className="font-semibold"
                  style={{
                    color:
                      transaction.type === 'credit'
                        ? '#22c55e'
                        : '#ef4444',
                  }}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </p>
                <p
                  className="text-xs"
                  style={{
                    color:
                      transaction.status === 'completed'
                        ? 'rgba(107,114,128,0.8)'
                        : '#eab308', // yellow-500
                  }}
                >
                  {transaction.status}
                </p>
              </div>

              <button
                className="p-1 rounded-full transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(156,163,175,0.8)',
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

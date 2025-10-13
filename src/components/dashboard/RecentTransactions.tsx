// src/components/dashboard/RecentTransactions.tsx  
'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
const transactions = [
  {
    id: '1',
    type: 'credit',
    description: 'Salary Payment',
    amount: 5000.00,
    date: '2025-10-13',
    category: 'Income',
    status: 'completed'
  },
  {
    id: '2', 
    type: 'debit',
    description: 'Coffee Shop',
    amount: 15.50,
    date: '2025-10-12',
    category: 'Food & Dining',
    status: 'completed'
  },
  {
    id: '3',
    type: 'debit',
    description: 'Netflix Subscription',
    amount: 12.99,
    date: '2025-10-11',
    category: 'Entertainment',
    status: 'completed'
  },
  {
    id: '4',
    type: 'credit',
    description: 'Freelance Work',
    amount: 800.00,
    date: '2025-10-10',
    category: 'Income',
    status: 'pending'
  },
  {
    id: '5',
    type: 'debit',
    description: 'Grocery Store',
    amount: 87.32,
    date: '2025-10-09',
    category: 'Shopping',
    status: 'completed'
  }
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Recent Transactions
        </h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                transaction.type === 'credit'
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {transaction.type === 'credit' ? (
                  <ArrowDownLeft className={`h-4 w-4 ${
                    transaction.type === 'credit'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                ) : (
                  <ArrowUpRight className={`h-4 w-4 ${
                    transaction.type === 'credit'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                )}
              </div>
              
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
  {transaction.category} • {format(new Date(transaction.date), 'MM/dd/yyyy')}
</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </p>
                <p className={`text-xs ${
                  transaction.status === 'completed' 
                    ? 'text-slate-500' 
                    : 'text-yellow-600'
                }`}>
                  {transaction.status}
                </p>
              </div>
              
              <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

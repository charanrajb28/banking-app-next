// src/app/dashboard/transactions/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Search, 
  Download,
  Calendar,
  Plus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

const mockTransactions = [
  {
    id: 'TXN001',
    type: 'credit',
    description: 'Salary Payment - Tech Corp',
    amount: 5000.00,
    date: '2025-10-13T10:30:00',
    status: 'completed',
    category: 'Income',
    account: 'Primary Savings',
    recipient: 'You',
    method: 'Direct Deposit'
  },
  {
    id: 'TXN002',
    type: 'debit',
    description: 'Transfer to Sarah Wilson',
    amount: 250.00,
    date: '2025-10-12T15:45:00',
    status: 'completed',
    category: 'Transfer',
    account: 'Primary Savings',
    recipient: 'Sarah Wilson',
    method: 'UPI Transfer'
  },
  {
    id: 'TXN003',
    type: 'debit',
    description: 'Amazon Purchase',
    amount: 89.99,
    date: '2025-10-12T09:20:00',
    status: 'completed',
    category: 'Shopping',
    account: 'Primary Savings',
    recipient: 'Amazon',
    method: 'Card Payment'
  },
  {
    id: 'TXN004',
    type: 'credit',
    description: 'Refund - Electronics Store',
    amount: 199.00,
    date: '2025-10-11T14:15:00',
    status: 'completed',
    category: 'Refund',
    account: 'Primary Savings',
    recipient: 'You',
    method: 'Bank Transfer'
  },
  {
    id: 'TXN005',
    type: 'debit',
    description: 'Monthly Subscription - Netflix',
    amount: 15.99,
    date: '2025-10-10T08:00:00',
    status: 'completed',
    category: 'Entertainment',
    account: 'Primary Savings',
    recipient: 'Netflix',
    method: 'Auto Payment'
  },
  {
    id: 'TXN006',
    type: 'debit',
    description: 'Coffee Shop - Downtown',
    amount: 4.50,
    date: '2025-10-09T16:30:00',
    status: 'pending',
    category: 'Food & Dining',
    account: 'Primary Savings',
    recipient: 'Coffee Shop',
    method: 'Card Payment'
  }
];

const categories = [
  { id: 'all', name: 'All Categories', count: mockTransactions.length },
  { id: 'income', name: 'Income', count: 2 },
  { id: 'transfer', name: 'Transfers', count: 1 },
  { id: 'shopping', name: 'Shopping', count: 1 },
  { id: 'food', name: 'Food & Dining', count: 1 },
  { id: 'entertainment', name: 'Entertainment', count: 1 }
];

export default function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           transaction.category.toLowerCase() === selectedCategory ||
                           (selectedCategory === 'food' && transaction.category === 'Food & Dining');
    return matchesSearch && matchesCategory;
  });

  const totalCredits = mockTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = mockTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track all your financial activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <Link 
            href="/dashboard/transactions/transfer"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalCredits)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This month</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalDebits)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This month</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Net Change</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(totalCredits - totalDebits)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <ArrowUpRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-3">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <button className="flex items-center px-4 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            <button className="flex items-center px-4 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mt-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {category.name}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Activity ({filteredTransactions.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'credit'
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {transaction.category}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {transaction.method}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'credit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <p>{formatDate(transaction.date)}</p>
                      <p>{formatTime(transaction.date)}</p>
                    </div>
                  </div>
                  
                  <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">No transactions found</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="p-6 text-center border-t border-slate-200 dark:border-slate-700">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Load More Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

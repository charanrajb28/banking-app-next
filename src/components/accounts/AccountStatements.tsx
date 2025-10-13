// src/components/accounts/AccountStatements.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown
} from 'lucide-react';

const mockTransactions = [
  {
    id: '1',
    date: '2025-10-13',
    description: 'Direct Deposit - Acme Corp',
    amount: 3500.00,
    type: 'credit',
    category: 'Salary',
    balance: 25840.50,
    reference: 'DD001234'
  },
  {
    id: '2',
    date: '2025-10-12',
    description: 'Online Transfer to Investment Account',
    amount: 1000.00,
    type: 'debit',
    category: 'Transfer',
    balance: 22340.50,
    reference: 'TRF001233'
  },
  {
    id: '3',
    date: '2025-10-11',
    description: 'ATM Withdrawal - Main Street',
    amount: 200.00,
    type: 'debit',
    category: 'Cash',
    balance: 23340.50,
    reference: 'ATM001232'
  },
  {
    id: '4',
    date: '2025-10-10',
    description: 'Monthly Interest Credit',
    amount: 45.75,
    type: 'credit',
    category: 'Interest',
    balance: 23540.50,
    reference: 'INT001231'
  },
  {
    id: '5',
    date: '2025-10-09',
    description: 'Grocery Store Payment',
    amount: 87.32,
    type: 'debit',
    category: 'Shopping',
    balance: 23494.75,
    reference: 'POS001230'
  }
];

export default function AccountStatements() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Statements</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            View and download your transaction history
          </p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Period Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Statement Period
            </label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 appearance-none"
              >
                <option value="current">Current Month</option>
                <option value="last">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search Transactions
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="salary">Salary</option>
                <option value="transfer">Transfer</option>
                <option value="shopping">Shopping</option>
                <option value="cash">Cash</option>
                <option value="interest">Interest</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Statement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Credits</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(3545.75)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <ArrowDownLeft className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Debits</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(1287.32)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <ArrowUpRight className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Net Change</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(2258.43)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Transaction History ({filteredTransactions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Category</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <span className="text-sm text-slate-900 dark:text-white font-medium">
                        {transaction.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right ${
                    transaction.type === 'credit'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white text-right font-medium">
                    {formatCurrency(transaction.balance)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {transaction.reference}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No transactions found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

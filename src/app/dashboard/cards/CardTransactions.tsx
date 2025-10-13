// src/components/cards/CardTransactions.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Search, 
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CreditCard
} from 'lucide-react';

const cardTransactions = [
  {
    id: 'CT001',
    type: 'debit',
    merchant: 'Amazon.com',
    amount: 89.99,
    date: '2025-10-13T14:30:00',
    status: 'completed',
    category: 'Shopping',
    location: 'Online',
    cardLast4: '9012',
    merchantLogo: '🛒'
  },
  {
    id: 'CT002',
    type: 'debit',
    merchant: 'Starbucks Coffee',
    amount: 5.75,
    date: '2025-10-13T09:15:00',
    status: 'completed',
    category: 'Food & Dining',
    location: 'New York, NY',
    cardLast4: '9012',
    merchantLogo: '☕'
  },
  {
    id: 'CT003',
    type: 'debit',
    merchant: 'Uber',
    amount: 18.50,
    date: '2025-10-12T20:45:00',
    status: 'completed',
    category: 'Transportation',
    location: 'New York, NY',
    cardLast4: '9012',
    merchantLogo: '🚗'
  },
  {
    id: 'CT004',
    type: 'debit',
    merchant: 'Netflix',
    amount: 15.99,
    date: '2025-10-12T08:00:00',
    status: 'completed',
    category: 'Entertainment',
    location: 'Online',
    cardLast4: '9012',
    merchantLogo: '📺'
  },
  {
    id: 'CT005',
    type: 'debit',
    merchant: 'Shell Gas Station',
    amount: 45.20,
    date: '2025-10-11T16:30:00',
    status: 'pending',
    category: 'Gas & Fuel',
    location: 'Brooklyn, NY',
    cardLast4: '9012',
    merchantLogo: '⛽'
  }
];

interface CardTransactionsProps {
  cardId: string;
  cardName: string;
}

export default function CardTransactions({ cardId, cardName }: CardTransactionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

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
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredTransactions = cardTransactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'gas', name: 'Gas & Fuel' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Transaction History - {cardName}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Recent card transactions and spending activity
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search merchants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
              />
            </div>
          </div>

          {/* Date Filter */}
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
            </select>

            <button className="flex items-center px-4 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Transactions ({filteredTransactions.length})
          </h4>
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
                  {/* Merchant Logo */}
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                    {transaction.merchantLogo}
                  </div>
                  
                  {/* Transaction Details */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-slate-900 dark:text-white">
                        {transaction.merchant}
                      </h5>
                      {transaction.status === 'pending' && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(transaction.date)} at {formatTime(transaction.date)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {transaction.location}
                      </span>
                      <span className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        •••• {transaction.cardLast4}
                      </span>
                    </div>
                    
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    -{formatCurrency(transaction.amount)}
                  </p>
                  
                  {transaction.status === 'pending' && (
                    <div className="flex items-center justify-end mt-1 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Processing</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-slate-400" />
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

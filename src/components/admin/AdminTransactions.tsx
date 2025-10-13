// src/components/admin/AdminTransactions.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  XCircle
} from 'lucide-react';

// Mock transaction data
const transactions = [
  {
    id: 'TXN001234',
    userId: 'USR001',
    userName: 'John Smith',
    type: 'transfer',
    amount: 2500.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-10-13T14:30:00',
    fromAccount: '****4521',
    toAccount: '****7890',
    method: 'Bank Transfer',
    flagged: false,
    riskScore: 12
  },
  {
    id: 'TXN001235',
    userId: 'USR002',
    userName: 'Sarah Wilson',
    type: 'withdrawal',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-10-13T13:45:00',
    fromAccount: '****3210',
    toAccount: 'ATM Downtown',
    method: 'ATM Withdrawal',
    flagged: false,
    riskScore: 5
  },
  {
    id: 'TXN001236',
    userId: 'USR003',
    userName: 'Michael Johnson',
    type: 'deposit',
    amount: 10000.00,
    currency: 'USD',
    status: 'pending',
    timestamp: '2025-10-13T12:20:00',
    fromAccount: 'External Bank',
    toAccount: '****5678',
    method: 'Wire Transfer',
    flagged: true,
    riskScore: 85
  },
  {
    id: 'TXN001237',
    userId: 'USR004',
    userName: 'Emily Davis',
    type: 'card_payment',
    amount: 89.99,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-10-13T11:15:00',
    fromAccount: '****9012',
    toAccount: 'Amazon.com',
    method: 'Card Payment',
    flagged: false,
    riskScore: 8
  },
  {
    id: 'TXN001238',
    userId: 'USR005',
    userName: 'Robert Brown',
    type: 'transfer',
    amount: 15000.00,
    currency: 'USD',
    status: 'failed',
    timestamp: '2025-10-13T10:30:00',
    fromAccount: '****4444',
    toAccount: '****1111',
    method: 'Bank Transfer',
    flagged: true,
    riskScore: 92
  },
  {
    id: 'TXN001239',
    userId: 'USR006',
    userName: 'Jennifer Taylor',
    type: 'refund',
    amount: 199.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-10-13T09:45:00',
    fromAccount: 'Electronics Store',
    toAccount: '****2345',
    method: 'Refund',
    flagged: false,
    riskScore: 3
  },
  {
    id: 'TXN001240',
    userId: 'USR007',
    userName: 'David Martinez',
    type: 'withdrawal',
    amount: 3000.00,
    currency: 'USD',
    status: 'pending',
    timestamp: '2025-10-13T08:20:00',
    fromAccount: '****8888',
    toAccount: 'ATM Brooklyn',
    method: 'ATM Withdrawal',
    flagged: true,
    riskScore: 78
  }
];

export default function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return { label: 'High Risk', color: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400' };
    if (score >= 40) return { label: 'Medium Risk', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400' };
    return { label: 'Low Risk', color: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer':
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'deposit':
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesFlagged = !flaggedOnly || transaction.flagged;
    return matchesSearch && matchesStatus && matchesType && matchesFlagged;
  });

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const flaggedCount = transactions.filter(t => t.flagged).length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const failedCount = transactions.filter(t => t.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Volume</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalVolume)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12.5% today</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <ArrowUpRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Flagged</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {flaggedCount}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">Requires review</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <Flag className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {pendingCount}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">In process</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Failed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {failedCount}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Today</p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
              <XCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </motion.div>
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
                placeholder="Search by ID or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex space-x-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 transition-all"
            >
              <option value="all">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="deposit">Deposit</option>
              <option value="card_payment">Card Payment</option>
              <option value="refund">Refund</option>
            </select>

            <button
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                flaggedOnly
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Flag className="h-4 w-4 mr-2" />
              Flagged Only
            </button>

            <button className="flex items-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
            Transactions ({filteredTransactions.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredTransactions.map((transaction, index) => {
                const riskBadge = getRiskBadge(transaction.riskScore);
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      transaction.flagged ? 'bg-red-50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.flagged && (
                          <Flag className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {transaction.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {transaction.userName}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {transaction.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <span className="ml-2 text-sm text-slate-900 dark:text-white capitalize">
                          {transaction.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {transaction.method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${riskBadge.color}`}>
                        {transaction.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      <div>{formatDate(transaction.timestamp)}</div>
                      <div className="text-xs">{formatTime(transaction.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {transaction.flagged && (
                        <button className="text-green-600 hover:text-green-900">
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

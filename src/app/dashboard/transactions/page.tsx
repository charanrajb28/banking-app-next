// src/app/dashboard/transactions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Search, 
  Download,
  Plus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  transaction_id: string;
  user_id: string;
  from_account_id?: string;
  to_account_id?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  category?: string;
  payment_method?: string;
  created_at: string;
  from_account?: {
    account_name: string;
    account_number: string;
  };
  to_account?: {
    account_name: string;
    account_number: string;
  };
}

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'income', name: 'Income' },
  { id: 'transfer', name: 'Transfers' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'food', name: 'Food & Dining' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'bills', name: 'Bills' },
  { id: 'other', name: 'Other' }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();
  useEffect(() => {
    fetchTransactions();
  }, [dateRange, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Please login to view transactions');
      }

      // Build query parameters
      const params = new URLSearchParams({
        limit: '100',
        offset: '0',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      // Add date range filter
      if (dateRange !== 'all') {
        const dates = getDateRange(dateRange);
        if (dates.start) params.append('start_date', dates.start);
        if (dates.end) params.append('end_date', dates.end);
      }

      const response = await fetch(`/api/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      setTransactions(data.transactions || []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      if(err.message==="Unauthorized"){
        router.push('/auth/login');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        return { start: null, end: null };
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/transactions/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: dateRange !== 'all' ? getDateRange(dateRange).start : null,
          end_date: dateRange !== 'all' ? getDateRange(dateRange).end : null,
          category: selectedCategory !== 'all' ? selectedCategory : null,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error exporting transactions:', err);
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

  const getTransactionType = (transaction: Transaction) => {
    // Determine if it's a credit or debit based on transaction type
    const creditTypes = ['deposit', 'refund', 'transfer_in', 'interest', 'salary'];
    return creditTypes.includes(transaction.transaction_type) ? 'credit' : 'debit';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      transaction.category?.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalCredits = transactions
    .filter(t => getTransactionType(t) === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalDebits = transactions
    .filter(t => getTransactionType(t) === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' 
      ? transactions.length 
      : transactions.filter(t => t.category?.toLowerCase() === cat.id).length
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ color: 'var(--card-text)' }} className="text-3xl font-bold">Transactions</h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Track all your financial activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/dashboard/transactions/transfer"
            className="flex items-center px-4 py-2 rounded-xl shadow-lg text-white"
            style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
        >
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalCredits)}
              </p>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm mt-1">
                This period
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalDebits)}
              </p>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm mt-1">
                This period
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">Net Change</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalCredits - totalDebits)}
              </p>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm mt-1">
                This period
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <ArrowUpRight className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--card-text-secondary)' }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none"
              style={{
                backgroundColor: 'var(--card-bg-alt)',
                borderColor: 'var(--card-bg-alt)',
                color: 'var(--card-text)'
              }}
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 rounded-xl p-1 mt-6 overflow-x-auto" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
          {categoryCounts.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all"
              style={
                selectedCategory === cat.id
                  ? { backgroundColor: 'var(--card-bg)', color: 'var(--card-text)' }
                  : { color: 'var(--card-text-secondary)' }
              }
            >
              {cat.name}
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={
                  selectedCategory === cat.id
                    ? { backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }
                    : { backgroundColor: 'var(--card-bg)', color: 'var(--card-text-secondary)' }
                }
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
          <h3 style={{ color: 'var(--card-text)' }} className="text-lg font-semibold">
            Recent Activity ({filteredTransactions.length})
          </h3>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--card-bg-alt)' }}>
          {filteredTransactions.map((transaction, i) => {
            const type = getTransactionType(transaction);
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 hover:bg-opacity-50 transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: type === 'credit' ? '#dcfce7' : '#fee2e2' }}
                    >
                      {type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p style={{ color: 'var(--card-text)' }} className="font-semibold">
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <div
                        className="flex items-center space-x-2 mt-1 text-sm"
                        style={{ color: 'var(--card-text-secondary)' }}
                      >
                        <span>{transaction.category || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{transaction.payment_method || 'Bank Transfer'}</span>
                        <span>•</span>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              transaction.status === 'completed' ? '#dcfce7' : '#fef3c7',
                            color: transaction.status === 'completed' ? '#16a34a' : '#ca8a04'
                          }}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p
                        className="font-bold text-lg"
                        style={{ color: type === 'credit' ? '#16a34a' : '#dc2626' }}
                      >
                        {type === 'credit' ? '+' : '-'}
                        {formatCurrency(parseFloat(transaction.amount.toString()), transaction.currency)}
                      </p>
                      <div className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                        <p>{formatDate(transaction.created_at)}</p>
                        <p>{formatTime(transaction.created_at)}</p>
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--card-text-secondary)' }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--card-text-secondary)' }}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--card-bg-alt)' }}
            >
              <Search className="h-8 w-8" />
            </div>
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

// src/app/dashboard/accounts/[id]/statements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { 
  Download, 
  Search, 
  ChevronDown,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

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
  balance_after?: number;
}

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
}

export default function AccountStatementsPage() {
  const params = useParams();
  const accountId = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (accountId) {
      fetchAccountData();
      fetchTransactions();
    }
  }, [accountId]);

  useEffect(() => {
    if (selectedPeriod !== 'custom') {
      fetchTransactions();
    }
  }, [selectedPeriod]);

  const fetchAccountData = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch account');
      }

      setAccount(data.account);
    } catch (err: any) {
      console.error('Error fetching account:', err);
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      // Build query parameters
      const params = new URLSearchParams({
        limit: '100',
        offset: '0',
      });

      // Add date filters based on period
      if (selectedPeriod === 'custom' && startDate && endDate) {
        params.append('start_date', startDate);
        params.append('end_date', endDate);
      } else if (selectedPeriod !== 'current') {
        const dates = getPeriodDates(selectedPeriod);
        params.append('start_date', dates.start);
        params.append('end_date', dates.end);
      }

      const response = await fetch(`/api/accounts/${accountId}/transactions?${params}`, {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodDates = (period: string) => {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'last':
        start.setMonth(start.getMonth() - 1);
        break;
      case '3months':
        start.setMonth(start.getMonth() - 3);
        break;
      case '6months':
        start.setMonth(start.getMonth() - 6);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setDate(1); // Start of current month
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/${accountId}/statement/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: startDate || getPeriodDates(selectedPeriod).start,
          end_date: endDate || getPeriodDates(selectedPeriod).end,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statement-${accountId}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading statement:', err);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = selectedCategory === 'all' || transaction.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateSummary = () => {
    const credits = filteredTransactions
      .filter(t => ['deposit', 'refund', 'transfer_in', 'interest'].includes(t.transaction_type))
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const debits = filteredTransactions
      .filter(t => ['withdrawal', 'payment', 'transfer_out', 'fee'].includes(t.transaction_type))
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return {
      credits,
      debits,
      net: credits - debits,
    };
  };

  const summary = calculateSummary();

  if (loading && !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading statement...</p>
        </div>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>Error Loading Statement</h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">{error}</p>
          <button
            onClick={() => {
              fetchAccountData();
              fetchTransactions();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>Account Statement</h2>
          {account && (
            <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
              {account.account_name} - {account.account_number}
            </p>
          )}
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Period Selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
              Statement Period
            </label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all duration-200 appearance-none"
                style={{ 
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              >
                <option value="current">Current Month</option>
                <option value="last">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'var(--card-text-secondary)' }} />
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
              Search Transactions
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--card-text-secondary)' }} />
              <input
                type="text"
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all duration-200 appearance-none"
                style={{ 
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              >
                <option value="all">All Categories</option>
                <option value="salary">Salary</option>
                <option value="transfer">Transfer</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
                <option value="entertainment">Entertainment</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'var(--card-text-secondary)' }} />
            </div>
          </div>
        </div>

        {/* Custom Date Range */}
        {selectedPeriod === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </div>

      {/* Statement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Total Credits</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.credits, account?.currency)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ArrowDownLeft className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Total Debits</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.debits, account?.currency)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Net Change</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.net, account?.currency)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--card-text)' }}>
            Transaction History ({filteredTransactions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Category</th>
                <th className="px-6 py-4 text-right text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-bg-alt)' }}>
              {filteredTransactions.map((transaction, index) => {
                const isCredit = ['deposit', 'refund', 'transfer_in', 'interest'].includes(transaction.transaction_type);
                
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--card-text)' }}>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          isCredit ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {isCredit ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--card-text)' }}>
                          {transaction.description || transaction.transaction_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                      {transaction.category || 'Uncategorized'}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${
                      isCredit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCredit ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount.toString()), transaction.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--card-text-secondary)' }}>
                      {transaction.transaction_id}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--card-text-secondary)' }} />
            <p style={{ color: 'var(--card-text-secondary)' }}>No transactions found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

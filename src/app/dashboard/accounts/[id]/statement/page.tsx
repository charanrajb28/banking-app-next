// src/app/dashboard/accounts/[id]/statement/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  Download, 
  Search, 
  ChevronDown,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Wallet
} from 'lucide-react';
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
  balance_after?: number;
  from_account_id?: string;
  to_account_id?: string;
}

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function AccountStatementPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
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

      const queryParams = new URLSearchParams({
        limit: '100',
        offset: '0',
      });

      // Add date filters based on period
      if (selectedPeriod === 'custom' && startDate && endDate) {
        queryParams.append('start_date', startDate);
        queryParams.append('end_date', endDate);
      } else if (selectedPeriod !== 'current') {
        const dates = getPeriodDates(selectedPeriod);
        queryParams.append('start_date', dates.start);
        queryParams.append('end_date', dates.end);
      }

      // Use the account-specific endpoint
      const response = await fetch(`/api/accounts/${accountId}/transactions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      console.log('Fetched transactions:', data.transactions);
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
        start.setDate(1);
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
        a.download = `statement-${accountId}-${Date.now()}.csv`;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '****';
    return `****${accountNumber.slice(-4)}`;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalCredits = filteredTransactions
    .filter(t => ['deposit', 'refund', 'transfer_in', 'interest', 'salary'].includes(t.transaction_type))
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalDebits = filteredTransactions
    .filter(t => ['withdrawal', 'payment', 'transfer_out', 'fee'].includes(t.transaction_type))
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  if (loading && !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading account statement...</p>
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/accounts">
            <button className="flex items-center transition-colors group" style={{ color: 'var(--card-text-secondary)' }}>
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>Account Statement</h1>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPDF}
          className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </motion.button>
      </motion.div>

      {/* Account Details Card */}
      {account && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl p-6 shadow-lg" 
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Account Name */}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Account Name</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-lg font-semibold mt-1" 
                style={{ color: 'var(--card-text)' }}
              >
                {account.account_name}
              </motion.p>
            </div>

            {/* Account Number */}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Account Number</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold mt-1 font-mono" 
                style={{ color: 'var(--card-text)' }}
              >
                {maskAccountNumber(account.account_number)}
              </motion.p>
            </div>

            {/* Account Type */}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Type</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-lg font-semibold mt-1 capitalize" 
                style={{ color: 'var(--card-text)' }}
              >
                {account.account_type}
              </motion.p>
            </div>

            {/* Current Balance */}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Current Balance</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold text-blue-600 mt-1"
              >
                {formatCurrency(account.balance, account.currency)}
              </motion.p>
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Status</p>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
              </motion.span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--card-text-secondary)' }}>
              Member since {formatDate(account.created_at)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
        className="rounded-2xl p-6 shadow-lg" 
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          >
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
              Statement Period
            </label>
            <div className="relative">
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
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
              </motion.select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'var(--card-text-secondary)' }} />
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
          >
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
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
            className="flex items-end"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchTransactions}
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 inline mr-2" />
              )}
              Refresh
            </motion.button>
          </motion.div>
        </div>

        {/* Custom Date Range */}
        {selectedPeriod === 'custom' && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
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
          </motion.div>
        )}
      </motion.div>

      {/* Transaction Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl p-6 shadow-lg" 
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm font-medium" 
                style={{ color: 'var(--card-text-secondary)' }}
              >
                Total Credits
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-2xl font-bold text-green-600 mt-2"
              >
                {formatCurrency(totalCredits, account?.currency)}
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="p-3 bg-green-100 rounded-xl"
            >
              <ArrowDownLeft className="h-6 w-6 text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Total Debits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl p-6 shadow-lg" 
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-sm font-medium" 
                style={{ color: 'var(--card-text-secondary)' }}
              >
                Total Debits
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-2xl font-bold text-red-600 mt-2"
              >
                {formatCurrency(totalDebits, account?.currency)}
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.35, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="p-3 bg-red-100 rounded-xl"
            >
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Net Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl p-6 shadow-lg" 
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-medium" 
                style={{ color: 'var(--card-text-secondary)' }}
              >
                Net Change
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="text-2xl font-bold text-blue-600 mt-2"
              >
                {formatCurrency(totalCredits - totalDebits, account?.currency)}
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="p-3 bg-blue-100 rounded-xl"
            >
              <FileText className="h-6 w-6 text-blue-600" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
        className="rounded-2xl shadow-lg overflow-hidden" 
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--card-text)' }}>
            Transaction History ({filteredTransactions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>Category</th>
                <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-bg-alt)' }}>
              {filteredTransactions.map((transaction, index) => {
                // const isCredit = ['deposit', 'refund', 'transfer_in', 'interest', 'salary'].includes(transaction.transaction_type);
                const isCredit = transaction.to_account_id === accountId;   // income
const isDebit = transaction.from_account_id === accountId;  // expense

                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--card-text)' }}>
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.1, duration: 0.3, type: 'spring', stiffness: 200 }}
                          className={`p-2 rounded-full flex-shrink-0 ${
                            isCredit ? 'bg-green-100' : 'bg-red-100'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </motion.div>
                        <span className="text-sm font-medium" style={{ color: 'var(--card-text)' }}>
                          {transaction.description || transaction.transaction_type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize" style={{ color: 'var(--card-text-secondary)' }}>
                      {transaction.category || 'Uncategorized'}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${
                      isCredit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCredit ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount.toString()), transaction.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.15, duration: 0.3, type: 'spring', stiffness: 200 }}
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono " style={{ color: 'var(--card-text-secondary)' }}>
                      {transaction.transaction_id.slice(-8)}...
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
            >
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--card-text-secondary)' }} />
            </motion.div>
            <p style={{ color: 'var(--card-text-secondary)' }}>No transactions found for the selected period</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

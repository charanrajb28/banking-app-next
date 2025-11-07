// src/app/dashboard/accounts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical,
  Download,
  Settings,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Building,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Account type definitions
interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: 'savings' | 'current' | 'investment';
  account_name: string;
  balance: number;
  currency: string;
  status: string;
  interest_rate?: number;
  monthly_limit?: number;
  daily_limit?: number;
  created_at: string;
  updated_at: string;
}

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
  from_account?: {
    account_name: string;
    account_number: string;
  };
  to_account?: {
    account_name: string;
    account_number: string;
  };
}

export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState('all');

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      console.log('Using auth token:', token);
      const response = await fetch('/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch accounts');
      }

      setAccounts(data.accounts || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/transactions?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions || []);
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return Wallet;
      case 'current':
        return Building;
      case 'investment':
        return TrendingUp;
      default:
        return CreditCard;
    }
  };

  const getAccountGradient = (type: string) => {
    switch (type) {
      case 'savings':
        return 'from-blue-600 to-blue-700';
      case 'current':
        return 'from-purple-600 to-purple-700';
      case 'investment':
        return 'from-green-600 to-green-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '****';
    return `****${accountNumber.slice(-4)}`;
  };

  const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance.toString()), 0);

  const calculateMonthlyChange = (account: Account) => {
    // This would ideally come from your backend
    // For now, return a placeholder
    return Math.random() * 20 - 5; // Random change between -5 and +15
  };

  const filteredTransactions = selectedAccountFilter === 'all' 
    ? transactions 
    : transactions.filter(txn => 
        txn.from_account?.account_number === selectedAccountFilter || 
        txn.to_account?.account_number === selectedAccountFilter
      );

  const formatTransactionType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>Error Loading Accounts</h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">{error}</p>
          <button
            onClick={fetchAccounts}
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ color: 'var(--card-text)' }} className="text-3xl font-bold">Accounts</h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Manage your accounts and view transaction history
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{
              backgroundColor: 'var(--card-bg-alt)',
              color: 'var(--card-text)'
            }}
          >
            {showBalances ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </button>
          <button
            onClick={fetchAccounts}
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{
              backgroundColor: 'var(--card-bg-alt)',
              color: 'var(--card-text)'
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <Link href="/dashboard/accounts/new" className="flex items-center px-4 py-2 rounded-xl transition-all shadow-lg"
            style={{
              background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
              color: 'white'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Link>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-lg">Total Balance</p>
              <h2 style={{ color: 'var(--card-text)' }} className="text-4xl font-bold mt-2">
                {showBalances ? formatCurrency(totalBalance) : '****'}
              </h2>
              <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
                Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p style={{ color: 'var(--card-text-secondary)' }}>This Month</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-green-400 text-xl font-semibold">+$2,840</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Cards Grid */}
      {accounts.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: 'var(--card-bg)' }}>
          <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--card-text-secondary)' }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-text)' }}>No Accounts Yet</h3>
          <p className="mb-4" style={{ color: 'var(--card-text-secondary)' }}>Create your first account to get started</p>
          <Link href="/dashboard/accounts/new" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account, index) => {
            const IconComponent = getAccountIcon(account.account_type);
            const monthlyChange = calculateMonthlyChange(account);
            const changeType = monthlyChange >= 0 ? 'increase' : 'decrease';

            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl p-6 transition-all duration-300 border cursor-pointer hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-bg-alt)'
                }}
              >
                {/* Account Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getAccountGradient(account.account_type)}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--card-text)' }} className="font-semibold">{account.account_name}</h3>
                      <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                        {maskAccountNumber(account.account_number)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {account.status}
                    </span>
                    <button className="p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: 'var(--card-bg-alt)' }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">Available Balance</p>
                  <h4 style={{ color: 'var(--card-text)' }} className="text-2xl font-bold">
                    {showBalances ? formatCurrency(parseFloat(account.balance.toString()), account.currency) : '****'}
                  </h4>
                </div>

                {/* Account Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span style={{ color: changeType === 'increase' ? '#16a34a' : '#dc2626' }} className="text-sm font-medium">
                      {changeType === 'increase' ? '+' : ''}{monthlyChange.toFixed(1)}%
                    </span>
                    <span style={{ color: 'var(--card-text-secondary)' }} className="text-sm">this month</span>
                  </div>
                  {account.interest_rate && (
                    <div className="text-right">
                      <p style={{ color: 'var(--card-text-secondary)' }} className="text-xs">Interest Rate</p>
                      <p style={{ color: 'var(--card-text)' }} className="text-sm font-semibold">
                        {account.interest_rate}% APY
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <Link 
                    href={`/dashboard/transactions/transfer?from=${account.id}`}
                    className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Transfer
                  </Link>
                  <Link
                    href={`/dashboard/accounts/${account.id}/statement`}
                    className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Statement
                  </Link>
                  <Link
                    href={`/dashboard/accounts/${account.id}`}
                    className="flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#2563eb', color: '#fff' }}
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Transactions Section */}
      {transactions.length > 0 && (
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: 'var(--card-text)' }} className="text-xl font-bold">Recent Activity</h2>
            <select 
              className="px-4 py-2 rounded-lg text-sm border-none focus:ring-2 transition-colors"
              style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
              value={selectedAccountFilter}
              onChange={(e) => setSelectedAccountFilter(e.target.value)}
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.account_number}>{account.account_name}</option>
              ))}
            </select>
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.slice(0, 5).map((transaction, index) => {
              const isCredit = ['deposit', 'refund', 'transfer_in'].includes(transaction.transaction_type);
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl transition-colors hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: 'var(--card-bg-alt)' }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isCredit ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p style={{ color: 'var(--card-text)' }} className="font-medium">
                        {transaction.description || formatTransactionType(transaction.transaction_type)}
                      </p>
                      <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                        {transaction.category || 'Uncategorized'} • {transaction.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      style={{ color: isCredit ? '#16a34a' : '#dc2626' }} 
                      className="font-semibold"
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount.toString()), transaction.currency)}
                    </p>
                    <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Link href="/dashboard/transactions" style={{ color: '#2563eb' }} className="font-medium hover:text-blue-700">
              View All Transactions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

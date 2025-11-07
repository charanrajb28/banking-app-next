// src/app/dashboard/accounts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Settings,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  CreditCard,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  Download,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  BarChart3
} from 'lucide-react';

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
}

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    if (accountId) {
      fetchAccountData();
      fetchRecentTransactions();
    }
  }, [accountId]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
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
      setAccountName(data.account.account_name);
      setError('');
    } catch (err: any) {
      console.error('Error fetching account:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/${accountId}/transactions?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRecentTransactions(data.transactions || []);
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleUpdateAccountName = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_name: accountName }),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchAccountData();
      }
    } catch (err) {
      console.error('Error updating account name:', err);
    }
  };

  const handleCloseAccount = async () => {
    if (!confirm('Are you sure you want to close this account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/dashboard/accounts');
      }
    } catch (err) {
      console.error('Error closing account:', err);
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
        return '💰';
      case 'current':
        return '🏢';
      case 'investment':
        return '📈';
      default:
        return '💳';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>Error Loading Account</h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">{error || 'Account not found'}</p>
          <Link
            href="/dashboard/accounts"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Accounts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/accounts"
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--card-bg-alt)' }}
          >
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--card-text)' }} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>Account Overview</h1>
            <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
              Complete details and recent activity
            </p>
          </div>
        </div>
        <button
          onClick={fetchAccountData}
          className="flex items-center px-4 py-2 rounded-xl transition-colors"
          style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Account Card - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-8 bg-gradient-to-br ${getAccountGradient(account.account_type)} text-white shadow-2xl relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{getAccountIcon(account.account_type)}</div>
              <div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border-2 border-white/30 focus:border-white"
                    />
                    <button
                      onClick={handleUpdateAccountName}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">{account.account_name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="text-white/80 capitalize">{account.account_type} Account</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                account.status === 'active' 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-red-500/20 text-red-100'
              }`}>
                {account.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <p className="text-white/80 text-sm">Available Balance</p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <h3 className="text-5xl font-bold">
              {showBalance ? formatCurrency(parseFloat(account.balance.toString()), account.currency) : '****'}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Account Number</p>
              <p className="font-mono font-semibold">{account.account_number}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Currency</p>
              <p className="font-semibold">{account.currency}</p>
            </div>
            {account.interest_rate && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white/70 text-sm mb-1">Interest Rate</p>
                <p className="font-semibold">{account.interest_rate}% APY</p>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Opened On</p>
              <p className="font-semibold">{new Date(account.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href={`/dashboard/transactions/transfer?from=${account.id}`}
          className="rounded-xl p-6 transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--card-text)' }}>Transfer</p>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Send money</p>
            </div>
          </div>
        </Link>

        <Link
          href={`/dashboard/accounts/${account.id}/statements`}
          className="rounded-xl p-6 transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--card-text)' }}>Statement</p>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>View history</p>
            </div>
          </div>
        </Link>

        <button
          className="rounded-xl p-6 transition-all hover:shadow-lg text-left"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--card-text)' }}>Download</p>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Get PDF</p>
            </div>
          </div>
        </button>

        <button
          className="rounded-xl p-6 transition-all hover:shadow-lg text-left"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--card-text)' }}>Settings</p>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Manage</p>
            </div>
          </div>
        </button>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Monthly Income</p>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">+$3,500</p>
          <p className="text-sm mt-2" style={{ color: 'var(--card-text-secondary)' }}>↑ 12% from last month</p>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Monthly Expenses</p>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">-$1,287</p>
          <p className="text-sm mt-2" style={{ color: 'var(--card-text-secondary)' }}>↓ 5% from last month</p>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: 'var(--card-text-secondary)' }}>Transactions</p>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>{recentTransactions.length}</p>
          <p className="text-sm mt-2" style={{ color: 'var(--card-text-secondary)' }}>This month</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>Recent Transactions</h3>
          <Link
            href={`/dashboard/accounts/${account.id}/statements`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--card-text-secondary)' }}>
              No recent transactions
            </p>
          ) : (
            recentTransactions.map((transaction) => {
              const isCredit = ['deposit', 'refund', 'transfer_in', 'interest'].includes(transaction.transaction_type);
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-colors"
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
                      <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount.toString()), transaction.currency)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl p-6 shadow-lg border-2 border-red-200" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: 'var(--card-text)' }}>Close Account</p>
            <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
              Permanently close this account. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handleCloseAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Close Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

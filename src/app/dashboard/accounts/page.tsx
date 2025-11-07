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

interface AccountMonthlyData {
  accountId: string;
  currentBalance: number;
  previousMonthBalance: number;
  changeAmount: number;
  changePercent: number;
}

interface TotalMonthlyData {
  currentMonthTotal: number;
  previousMonthTotal: number;
  totalChangeAmount: number;
  totalChangePercent: number;
}

// Rolling number component
const RollingNumber = ({ value, showValue }: { value: number; showValue: boolean }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!showValue) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.floor(stepValue * currentStep));

      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value, showValue]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </motion.span>
  );
};

export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState('all');
  const [accountMonthlyData, setAccountMonthlyData] = useState<Map<string, AccountMonthlyData>>(new Map());
  const [totalMonthlyData, setTotalMonthlyData] = useState<TotalMonthlyData>({
    currentMonthTotal: 0,
    previousMonthTotal: 0,
    totalChangeAmount: 0,
    totalChangePercent: 0
  });

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
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
      const response = await fetch('/api/transactions?limit=1000', {
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

  const calculateMonthlyData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthlyMap = new Map<string, AccountMonthlyData>();
    
    let totalCurrentMonth = 0;
    let totalPreviousMonth = 0;

    accounts.forEach(account => {
      // Current month balance = current account balance
      const currentBalance = parseFloat(account.balance.toString());

      // Get all transactions for this account
      const accountTxns = transactions.filter(txn => 
        txn.from_account?.account_number === account.account_number ||
        txn.to_account?.account_number === account.account_number
      );

      // Calculate net change from this month's transactions
      let thisMonthNetChange = 0;

      accountTxns.forEach(txn => {
        const txnDate = new Date(txn.created_at);
        
        // Only consider transactions from current month
        if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
          const isFromThisAccount = txn.from_account?.account_number === account.account_number;
          const isCredit = ['deposit', 'refund', 'transfer_in'].includes(txn.transaction_type);

          const amount = parseFloat(txn.amount.toString());

          // If transaction is FROM this account (debit)
          if (isFromThisAccount) {
            thisMonthNetChange -= amount;
          } 
          // If transaction is TO this account (credit)
          else if (!isFromThisAccount) {
            thisMonthNetChange += amount;
          }
        }
      });

      // Previous month balance = current balance - this month's net change
      const previousMonthBalance = currentBalance - thisMonthNetChange;

      // Check if account was created this month
      const accountCreatedDate = new Date(account.created_at);
      const isNewThisMonth = accountCreatedDate.getMonth() === currentMonth && 
                            accountCreatedDate.getFullYear() === currentYear;
      
      // If new this month, treat previous balance as 0
      const prevMonthAmount = isNewThisMonth ? 0 : previousMonthBalance;
      
      const changeAmount = currentBalance - prevMonthAmount;
      const changePercent = prevMonthAmount === 0 
        ? (currentBalance > 0 ? 100 : (currentBalance < 0 ? -100 : 0))
        : (changeAmount / Math.abs(prevMonthAmount)) * 100;

      monthlyMap.set(account.id, {
        accountId: account.id,
        currentBalance,
        previousMonthBalance: prevMonthAmount,
        changeAmount,
        changePercent
      });

      totalCurrentMonth += currentBalance;
      totalPreviousMonth += prevMonthAmount;
    });

    setAccountMonthlyData(monthlyMap);

    // Total = sum of all current balances - sum of all previous balances
    const totalChangeAmount = totalCurrentMonth - totalPreviousMonth;
    const totalChangePercent = totalPreviousMonth === 0
      ? (totalCurrentMonth > 0 ? 100 : (totalCurrentMonth < 0 ? -100 : 0))
      : (totalChangeAmount / Math.abs(totalPreviousMonth)) * 100;

    setTotalMonthlyData({
      currentMonthTotal: totalCurrentMonth,
      previousMonthTotal: totalPreviousMonth,
      totalChangeAmount,
      totalChangePercent
    });
  };

  useEffect(() => {
    if (accounts.length > 0) {
      calculateMonthlyData();
    }
  }, [accounts, transactions]);

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

  const isIncrease = totalMonthlyData.totalChangeAmount >= 0;

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
            onClick={() => {
              fetchAccounts();
              fetchTransactions();
            }}
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
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ color: 'var(--card-text-secondary)' }}
                className="text-lg"
              >
                Total Balance
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ color: 'var(--card-text)' }}
                className="text-4xl font-bold mt-2"
              >
                {showBalances ? <RollingNumber value={totalBalance} showValue={showBalances} /> : '****'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ color: 'var(--card-text-secondary)' }}
                className="mt-1"
              >
                Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-right"
            >
              <p style={{ color: 'var(--card-text-secondary)' }}>This Month vs Last</p>
              <div className="flex items-center mt-2 justify-end">
                {isIncrease ? (
                  <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400 mr-2" />
                )}
                <span className={`text-xl font-semibold ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                  {isIncrease ? '+' : ''}{totalMonthlyData.totalChangePercent.toFixed(1)}%
                </span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm mt-1"
                style={{ color: 'var(--card-text-secondary)' }}
              >
                {isIncrease ? '+' : ''}{formatCurrency(totalMonthlyData.totalChangeAmount)}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Account Cards Grid */}
      {accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 rounded-2xl"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--card-text-secondary)' }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-text)' }}>No Accounts Yet</h3>
          <p className="mb-4" style={{ color: 'var(--card-text-secondary)' }}>Create your first account to get started</p>
          <Link href="/dashboard/accounts/new" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account, index) => {
            const IconComponent = getAccountIcon(account.account_type);
            const monthlyInfo = accountMonthlyData.get(account.id);
            const changeType = monthlyInfo && monthlyInfo.changeAmount >= 0 ? 'increase' : 'decrease';

            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
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

                {/* Current Balance */}
                <div className="mb-4">
                  <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">Current Balance</p>
                  <h4 style={{ color: 'var(--card-text)' }} className="text-2xl font-bold">
                    {showBalances ? formatCurrency(parseFloat(account.balance.toString()), account.currency) : '****'}
                  </h4>
                </div>

                {/* Monthly Comparison Card */}
                {monthlyInfo && (
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                    {/* Previous and Current Month */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p style={{ color: 'var(--card-text-secondary)' }} className="text-xs font-medium">Last Month</p>
                        <p style={{ color: 'var(--card-text)' }} className="text-sm font-bold mt-1">
                          {formatCurrency(monthlyInfo.previousMonthBalance)}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--card-text-secondary)' }} className="text-xs font-medium">This Month</p>
                        <p style={{ color: 'var(--card-text)' }} className="text-sm font-bold mt-1">
                          {formatCurrency(monthlyInfo.currentBalance)}
                        </p>
                      </div>
                    </div>

                    {/* Change Summary */}
                    <div className="pt-3 border-t" style={{ borderColor: 'var(--card-bg)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ color: 'var(--card-text-secondary)' }} className="text-xs font-medium">Change</p>
                          <p 
                            style={{ color: changeType === 'increase' ? '#16a34a' : '#dc2626' }} 
                            className="text-sm font-bold mt-1"
                          >
                            {changeType === 'increase' ? '+' : ''}{formatCurrency(monthlyInfo.changeAmount)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 px-2 py-1 rounded-lg"
                          style={{ backgroundColor: 'var(--card-bg)' }}
                        >
                          {changeType === 'increase' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span style={{ color: changeType === 'increase' ? '#16a34a' : '#dc2626' }} className="text-sm font-bold">
                            {changeType === 'increase' ? '+' : ''}{monthlyInfo.changePercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interest Rate */}
                {account.interest_rate && (
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                    <p style={{ color: 'var(--card-text-secondary)' }} className="text-xs">Interest Rate</p>
                    <p style={{ color: 'var(--card-text)' }} className="text-sm font-semibold mt-1">
                      {account.interest_rate}% APY
                    </p>
                  </div>
                )}

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
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
          <div className="space-y-3">
            {filteredTransactions.slice(0, 5).map((transaction, index) => {
              const isCredit = ['deposit', 'refund', 'transfer_in'].includes(transaction.transaction_type);
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -30, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: 'easeOut'
                  }}
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: 'var(--card-bg-alt)' }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.1,
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 200
                      }}
                      className={`p-2 rounded-full ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.15,
                        duration: 0.4
                      }}
                    >
                      <p style={{ color: 'var(--card-text)' }} className="font-medium">
                        {transaction.description || formatTransactionType(transaction.transaction_type)}
                      </p>
                      <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                        {transaction.category || 'Uncategorized'} • {transaction.status}
                      </p>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1 + 0.15,
                      duration: 0.4
                    }}
                    className="text-right"
                  >
                    <p 
                      style={{ color: isCredit ? '#16a34a' : '#dc2626' }} 
                      className="font-semibold"
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount.toString()), transaction.currency)}
                    </p>
                    <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <Link href="/dashboard/transactions" style={{ color: '#2563eb' }} className="font-medium hover:text-blue-700">
              View All Transactions →
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

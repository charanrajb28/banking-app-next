// src/app/dashboard/accounts/page.tsx
'use client';

import { useState } from 'react';
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
  Building
} from 'lucide-react';

// Mock account data
const accounts = [
  {
    id: '1',
    type: 'savings',
    name: 'Primary Savings',
    accountNumber: '****4521',
    fullAccountNumber: '1234567894521',
    balance: 25840.50,
    availableBalance: 25840.50,
    currency: 'USD',
    status: 'active',
    interestRate: 2.5,
    monthlyChange: 12.5,
    changeType: 'increase',
    lastTransaction: '2025-10-13',
    icon: Wallet,
    gradient: 'from-blue-600 to-blue-700'
  },
  {
    id: '2',
    type: 'current',
    name: 'Business Current',
    accountNumber: '****7832',
    fullAccountNumber: '1234567897832',
    balance: 8920.75,
    availableBalance: 8420.75,
    currency: 'USD',
    status: 'active',
    interestRate: 0.5,
    monthlyChange: -3.2,
    changeType: 'decrease',
    lastTransaction: '2025-10-12',
    icon: Building,
    gradient: 'from-purple-600 to-purple-700'
  },
  {
    id: '3',
    type: 'investment',
    name: 'Investment Portfolio',
    accountNumber: '****9156',
    fullAccountNumber: '1234567899156',
    balance: 45200.00,
    availableBalance: 42800.00,
    currency: 'USD',
    status: 'active',
    interestRate: 7.2,
    monthlyChange: 18.7,
    changeType: 'increase',
    lastTransaction: '2025-10-11',
    icon: TrendingUp,
    gradient: 'from-green-600 to-green-700'
  }
];

export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

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
          <button className="flex items-center px-4 py-2 rounded-xl transition-all shadow-lg"
            style={{
              background: 'linear-gradient(to right, var(--card-text), var(--card-text-secondary))',
              color: 'white'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Background Pattern */}
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--card-text-secondary)' }} className="text-lg">Total Balance</p>
              <h2 style={{ color: 'var(--card-text)' }} className="text-4xl font-bold mt-2">
                {showBalances ? formatCurrency(totalBalance) : '****'}
              </h2>
              <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">Across {accounts.length} accounts</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((account, index) => {
          const IconComponent = account.icon;
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl p-6 transition-all duration-300 border"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-bg-alt)'
              }}
            >
              {/* Account Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${account.gradient}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--card-text)' }} className="font-semibold">{account.name}</h3>
                    <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">{account.accountNumber}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: 'var(--card-bg-alt)' }}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Balance */}
              <div className="mb-4">
                <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">Available Balance</p>
                <h4 style={{ color: 'var(--card-text)' }} className="text-2xl font-bold">
                  {showBalances ? formatCurrency(account.balance) : '****'}
                </h4>
              </div>

              {/* Account Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {account.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span style={{ color: account.changeType === 'increase' ? '#16a34a' : '#dc2626' }} className="text-sm font-medium">
                    {account.changeType === 'increase' ? '+' : ''}{account.monthlyChange}%
                  </span>
                  <span style={{ color: 'var(--card-text-secondary)' }} className="text-sm">this month</span>
                </div>
                <div className="text-right">
                  <p style={{ color: 'var(--card-text-secondary)' }} className="text-xs">Interest Rate</p>
                  <p style={{ color: 'var(--card-text)' }} className="text-sm font-semibold">{account.interestRate}% APY</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Transfer
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Statement
                </button>
                <button 
                  onClick={() => setSelectedAccount(account)}
                  className="flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#2563eb', color: '#fff' }}
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Transactions Section */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ color: 'var(--card-text)' }} className="text-xl font-bold">Recent Activity</h2>
          <select className="px-4 py-2 rounded-lg text-sm border-none focus:ring-2 transition-colors"
            style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
          >
            <option>All Accounts</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {[...Array(4).keys()].map((index) => {
            const transaction = index === 0 ? {
              id: '1',
              type: 'credit',
              description: 'Direct Deposit - Salary',
              amount: 3500.00,
              date: '2025-10-13',
              account: 'Primary Savings',
              category: 'Income'
            } : index === 1 ? {
              id: '2',
              type: 'debit',
              description: 'Transfer to Investment Account',
              amount: 1000.00,
              date: '2025-10-12',
              account: 'Primary Savings',
              category: 'Transfer'
            } : index === 2 ? {
              id: '3',
              type: 'credit',
              description: 'Investment Return',
              amount: 850.00,
              date: '2025-10-11',
              account: 'Investment Portfolio',
              category: 'Investment'
            } : {
              id: '4',
              type: 'debit',
              description: 'Monthly Service Fee',
              amount: 15.00,
              date: '2025-10-10',
              account: 'Business Current',
              category: 'Fees'
            };
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--card-bg-alt)' }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`} />
                  <div>
                    <p style={{ color: 'var(--card-text)' }} className="font-medium">{transaction.description}</p>
                    <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                      {transaction.account} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ color: transaction.type === 'credit' ? '#16a34a' : '#dc2626' }} className="font-semibold">
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p style={{ color: 'var(--card-text-secondary)' }} className="text-sm">{transaction.date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button style={{ color: '#2563eb' }} className="font-medium hover:text-blue-700">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}

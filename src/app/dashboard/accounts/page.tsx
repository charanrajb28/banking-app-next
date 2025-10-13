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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Accounts</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your accounts and view transaction history
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
          >
            {showBalances ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-16 translate-y-16"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-lg">Total Balance</p>
              <h2 className="text-4xl font-bold mt-2">
                {showBalances ? formatCurrency(totalBalance) : '****'}
              </h2>
              <p className="text-slate-300 mt-1">Across {accounts.length} accounts</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300">This Month</p>
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
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
            >
              {/* Account Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${account.gradient}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{account.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{account.accountNumber}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Balance */}
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Available Balance</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
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
                  <span className={`text-sm font-medium ${
                    account.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {account.changeType === 'increase' ? '+' : ''}{account.monthlyChange}%
                  </span>
                  <span className="text-sm text-slate-500">this month</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Interest Rate</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{account.interestRate}% APY</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Transfer
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                  <Download className="h-4 w-4 mr-1" />
                  Statement
                </button>
                <button 
                  onClick={() => setSelectedAccount(account)}
                  className="flex items-center justify-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          <select className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500">
            <option>All Accounts</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {[
            {
              id: '1',
              type: 'credit',
              description: 'Direct Deposit - Salary',
              amount: 3500.00,
              date: '2025-10-13',
              account: 'Primary Savings',
              category: 'Income'
            },
            {
              id: '2',
              type: 'debit',
              description: 'Transfer to Investment Account',
              amount: 1000.00,
              date: '2025-10-12',
              account: 'Primary Savings',
              category: 'Transfer'
            },
            {
              id: '3',
              type: 'credit',
              description: 'Investment Return',
              amount: 850.00,
              date: '2025-10-11',
              account: 'Investment Portfolio',
              category: 'Investment'
            },
            {
              id: '4',
              type: 'debit',
              description: 'Monthly Service Fee',
              amount: 15.00,
              date: '2025-10-10',
              account: 'Business Current',
              category: 'Fees'
            }
          ].map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-4">
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
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {transaction.account} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}

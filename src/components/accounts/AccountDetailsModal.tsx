// src/components/accounts/AccountDetailsModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Copy, 
  Download, 
  Settings, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Percent,
  Clock
} from 'lucide-react';

interface Account {
  id: string;
  type: string;
  name: string;
  accountNumber: string;
  fullAccountNumber: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: string;
  interestRate: number;
  monthlyChange: number;
  changeType: 'increase' | 'decrease';
  lastTransaction: string;
}

interface AccountDetailsModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDetailsModal({ account, isOpen, onClose }: AccountDetailsModalProps) {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!account) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'details', name: 'Account Details' },
    { id: 'statements', name: 'Statements' },
    { id: 'settings', name: 'Settings' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{account.name}</h2>
                <p className="text-slate-500 dark:text-slate-400">Account Management</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Balance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Current Balance</h3>
                        <DollarSign className="h-6 w-6 opacity-80" />
                      </div>
                      <p className="text-3xl font-bold">{formatCurrency(account.balance)}</p>
                      <p className="text-blue-100 mt-2">Available immediately</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Interest Rate</h3>
                        <Percent className="h-6 w-6 opacity-80" />
                      </div>
                      <p className="text-3xl font-bold">{account.interestRate}%</p>
                      <p className="text-green-100 mt-2">Annual Percentage Yield</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Account Number
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-900 dark:text-white font-mono">
                            {showFullNumber ? account.fullAccountNumber : account.accountNumber}
                          </span>
                          <button
                            onClick={() => setShowFullNumber(!showFullNumber)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                          >
                            {showFullNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(account.fullAccountNumber)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Account Type
                        </label>
                        <span className="text-slate-900 dark:text-white capitalize">{account.type} Account</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 capitalize">{account.status}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Last Transaction
                        </label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-white">{account.lastTransaction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Limits & Features</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Daily Transfer Limit</span>
                        <span className="text-slate-900 dark:text-white font-medium">$10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Monthly Transaction Limit</span>
                        <span className="text-slate-900 dark:text-white font-medium">Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Minimum Balance</span>
                        <span className="text-slate-900 dark:text-white font-medium">$100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Mobile Banking</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Online Banking</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'statements' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account Statements</h3>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Download Current
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { month: 'October 2025', status: 'current', size: '2.1 MB' },
                      { month: 'September 2025', status: 'available', size: '1.8 MB' },
                      { month: 'August 2025', status: 'available', size: '2.3 MB' },
                      { month: 'July 2025', status: 'available', size: '1.9 MB' }
                    ].map((statement, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{statement.month}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{statement.size}</p>
                          </div>
                        </div>
                        <button className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Account Notifications</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Get alerts for transactions</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Monthly Statements</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Email monthly statements</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-400">Danger Zone</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          These actions cannot be undone. Please proceed with caution.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                          Close Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

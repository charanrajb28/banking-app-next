// src/app/dashboard/request-money/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, AlertCircle, Check, User, Phone, Mail, Building } from 'lucide-react';
import Link from 'next/link';

interface UserDetails {
  id: string;
  full_name: string;
  phone: string;
  email: string;
}

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
}

interface NotificationData {
  requesterId: string;
  requesterName: string;
  amount: string;
  description: string;
  recipientAccountNumber: string;
}

export default function RequestMoneyPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone');
  const [foundUser, setFoundUser] = useState<UserDetails | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [myAccounts, setMyAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recipientAccountId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user's accounts on mount
  useEffect(() => {
    fetchMyAccounts();
  }, []);

  const fetchMyAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        const activeAccounts = data.accounts.filter((acc: Account) => acc.status === 'active');
        setMyAccounts(activeAccounts);
        
        // Auto-select first account
        if (activeAccounts.length > 0) {
          setFormData(prev => ({ ...prev, recipientAccountId: activeAccounts[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Search for user
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchInput.trim()) {
      setSearchError('Please enter a valid contact');
      return;
    }

    setSearching(true);
    setSearchError('');
    setFoundUser(null);

    try {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();
      
      if (searchType === 'phone') {
        params.append('phone', searchInput);
      } else {
        params.append('email', searchInput);
      }

      const response = await fetch(`/api/users/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.found) {
        setFoundUser(data.user);
      } else {
        setSearchError(data.error || 'User not found');
      }
    } catch (err: any) {
      setSearchError(err.message);
    } finally {
      setSearching(false);
    }
  };

  // Submit payment request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foundUser) {
      setError('Please search for a user first');
      return;
    }

    if (!formData.amount) {
      setError('Please enter an amount');
      return;
    }

    if (!formData.recipientAccountId) {
      setError('Please select an account to receive the payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      
      // Get the selected account details
      const selectedAccount = myAccounts.find(acc => acc.id === formData.recipientAccountId);
      if (!selectedAccount) {
        throw new Error('Selected account not found');
      }

      const response = await fetch('/api/notifications/send-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: foundUser.id,
          recipientPhone: foundUser.phone,
          recipientEmail: foundUser.email,
          amount: parseFloat(formData.amount),
          description: formData.description,
          recipientAccountNumber: selectedAccount.account_number,
          recipientAccountId: selectedAccount.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSuccessMessage(`Payment request for $${formData.amount} sent to ${foundUser.full_name}`);
        setFormData({ amount: '', description: '', recipientAccountId: myAccounts[0]?.id || '' });
        setFoundUser(null);
        setSearchInput('');
        
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to send request');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearUser = () => {
    setFoundUser(null);
    setFormData({
      amount: '',
      description: '',
      recipientAccountId: formData.recipientAccountId,
    });
  };

  const selectedAccount = myAccounts.find(acc => acc.id === formData.recipientAccountId);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <button className="flex items-center mr-4 transition-colors" style={{ color: 'var(--card-text-secondary)' }}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
            Request Money
          </h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Request payment from your contacts
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start"
        >
          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-600 text-sm font-medium">Success!</p>
            <p className="text-green-600 text-xs mt-1">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Recipient Account Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--card-text)' }}>
            Select Account to Receive Payment *
          </label>
          
          {loadingAccounts ? (
            <div className="p-4 text-center" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <p style={{ color: 'var(--card-text-secondary)' }}>Loading accounts...</p>
            </div>
          ) : myAccounts.length === 0 ? (
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <p style={{ color: 'var(--card-text-secondary)' }}>
                No active accounts found. Please create an account first.
              </p>
              <Link href="/dashboard/accounts/new">
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Create Account
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myAccounts.map((account) => (
                <label
                  key={account.id}
                  className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:border-blue-500 transition-all"
                  style={{ borderColor: formData.recipientAccountId === account.id ? '#3b82f6' : 'var(--card-bg-alt)' }}
                >
                  <input
                    type="radio"
                    name="recipientAccount"
                    value={account.id}
                    checked={formData.recipientAccountId === account.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipientAccountId: e.target.value }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                          {account.account_name}
                        </p>
                        <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                          <Building className="h-3 w-3 inline mr-1" />
                          {account.account_number} • {account.account_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: 'var(--card-text)' }}>
                          ${account.balance.toFixed(2)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                          Available
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Step 1: Search for User */}
        {!foundUser ? (
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--card-text)' }}>
                Who do you want to request from?
              </label>

              {/* Search Type Tabs */}
              <div className="flex space-x-2 mb-4 p-1 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                {['phone', 'email'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSearchType(type as 'phone' | 'email');
                      setSearchError('');
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      searchType === type ? 'shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: searchType === type ? 'var(--card-bg)' : 'transparent',
                      color: searchType === type ? 'var(--card-text)' : 'var(--card-text-secondary)'
                    }}
                  >
                    {type === 'phone' ? 'Phone' : 'Email'}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="flex space-x-2">
                <input
                  type={searchType === 'phone' ? 'tel' : 'email'}
                  placeholder={searchType === 'phone' ? '+1 (555) 123-4567' : 'user@example.com'}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearchError('');
                  }}
                  className="flex-1 px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all"
                  style={{
                    backgroundColor: 'var(--card-bg-alt)',
                    borderColor: searchError ? '#ef4444' : 'var(--card-bg-alt)',
                    color: 'var(--card-text)'
                  }}
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {searching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>

              {searchError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2"
                >
                  {searchError}
                </motion.p>
              )}
            </div>
          </form>
        ) : (
          /* Step 2: Enter Amount & Description */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected User Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl border-2 border-blue-200 flex items-center justify-between"
              style={{ backgroundColor: 'var(--card-bg-alt)' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                  {foundUser.full_name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--card-text)' }}>
                    {foundUser.full_name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                    {foundUser.phone || foundUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearUser}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </motion.div>

            {/* Receiving Account Summary */}
            {selectedAccount && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border-2 border-green-200"
                style={{ backgroundColor: 'var(--card-bg-alt)' }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                  Payment will be received in:
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                      {selectedAccount.account_name}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                      <Building className="h-3 w-3 inline mr-1" />
                      {selectedAccount.account_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ${selectedAccount.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--card-text-secondary)' }}>
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all text-xl font-semibold"
                  style={{
                    backgroundColor: 'var(--card-bg-alt)',
                    borderColor: 'var(--card-bg-alt)',
                    color: 'var(--card-text)'
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                Description (Optional)
              </label>
              <textarea
                placeholder="What is this payment for? (e.g., Dinner, Rent, etc.)"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 transition-all resize-none"
                style={{
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClearUser}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
              >
                Change Contact
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Request
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

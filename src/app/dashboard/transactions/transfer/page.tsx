// src/app/dashboard/transactions/transfer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Building, 
  Smartphone, 
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  QrCode,
  Search,
  RefreshCw
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
}

interface RecipientAccount {
  id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  user: {
    full_name: string;
    phone: string;
  };
}

const transferMethods = [
  {
    id: 'internal',
    name: 'Internal Transfer',
    description: 'Transfer between your accounts',
    icon: CreditCard,
    color: 'from-indigo-600 to-indigo-700'
  },
  {
    id: 'phone',
    name: 'Phone Number',
    description: 'Send using phone number',
    icon: Smartphone,
    color: 'from-green-600 to-green-700'
  },
  {
    id: 'account',
    name: 'Account Number',
    description: 'Send to account number',
    icon: Building,
    color: 'from-blue-600 to-blue-700'
  }
];

export default function TransferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedAccount = searchParams.get('from');
  const preSelectedRecipient = searchParams.get('to');
  const preSelectedAmount = searchParams.get('amount');
  const [step, setStep] = useState(preSelectedRecipient ? 2 : 1);
  const [selectedMethod, setSelectedMethod] = useState(preSelectedRecipient ? 'account' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [myAccounts, setMyAccounts] = useState<Account[]>([]);
  const [recipientAccounts, setRecipientAccounts] = useState<RecipientAccount[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchAccountNumber, setSearchAccountNumber] = useState(preSelectedRecipient || '');

  const [transferData, setTransferData] = useState({
    fromAccountId: preSelectedAccount || '',
    toAccountId: '',
    amount: preSelectedAmount || '',
    purpose: '',
    notes: '',
    recipientPhone: '',
    recipientName: ''
  });

  useEffect(() => {
    fetchMyAccounts();
  }, []);

  // Auto-search for recipient if preSelectedRecipient is provided
  useEffect(() => {
    if (preSelectedRecipient && step === 2 && selectedMethod === 'account') {
      setSearchAccountNumber(preSelectedRecipient);
      searchByAccountNumber(preSelectedRecipient);
    }
  }, [step, selectedMethod]);

  const fetchMyAccounts = async () => {
    try {
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
        
        if (!preSelectedAccount && activeAccounts.length > 0) {
          setTransferData(prev => ({ ...prev, fromAccountId: activeAccounts[0].id }));
        } else if (preSelectedAccount) {
          setTransferData(prev => ({ ...prev, fromAccountId: preSelectedAccount }));
        }
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const searchByPhone = async (phone: string) => {
    if (!phone || phone.length < 10) return;

    try {
      setLoadingRecipients(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/search?phone=${encodeURIComponent(phone)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No accounts found');
      }

      setRecipientAccounts(data.accounts || []);
      
      if (data.accounts.length === 0) {
        setError('No active accounts found for this phone number');
      }
    } catch (err: any) {
      setError(err.message);
      setRecipientAccounts([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const searchByAccountNumber = async (accountNumber: string) => {
    if (!accountNumber || accountNumber.length < 5) return;

    try {
      setLoadingRecipients(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/accounts/search?account_number=${encodeURIComponent(accountNumber)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account not found');
      }

      setRecipientAccounts(data.accounts || []);
      
      if (data.accounts.length === 0) {
        setError('No active account found with this account number');
      } else if (data.accounts.length === 1) {
        // Auto-select if only one account found
        const account = data.accounts[0];
        setTransferData(prev => ({
          ...prev,
          toAccountId: account.id,
          recipientName: account.user.full_name,
          recipientPhone: account.user.phone
        }));
      }
    } catch (err: any) {
      setError(err.message);
      setRecipientAccounts([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handlePhoneSearch = () => {
    searchByPhone(searchPhone);
  };

  const handleAccountSearch = () => {
    searchByAccountNumber(searchAccountNumber);
  };

  const handleTransfer = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      if (!transferData.fromAccountId || !transferData.toAccountId) {
        throw new Error('Please select both accounts');
      }

      if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const fromAccount = myAccounts.find(acc => acc.id === transferData.fromAccountId);
      if (fromAccount && parseFloat(transferData.amount) > fromAccount.balance) {
        throw new Error('Insufficient balance');
      }

      const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_account_id: transferData.fromAccountId,
          to_account_id: transferData.toAccountId,
          amount: parseFloat(transferData.amount),
          description: transferData.notes || 'Fund transfer',
          category: transferData.purpose || 'transfer',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      setTransactionId(data.transaction.transaction_id);
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const selectedFromAccount = myAccounts.find(acc => acc.id === transferData.fromAccountId);
  const selectedToAccount = selectedMethod === 'internal'
    ? myAccounts.find(acc => acc.id === transferData.toAccountId)
    : recipientAccounts.find(acc => acc.id === transferData.toAccountId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>Send Money</h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Transfer funds securely and instantly
          </p>
        </div>
        {step > 1 && (
          <button
            onClick={() => {
              setStep(step - 1);
              setError('');
            }}
            className="flex items-center px-4 py-2 transition-colors"
            style={{ color: 'var(--card-text-secondary)' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, name: 'Method' },
          { num: 2, name: 'Details' },
          { num: 3, name: 'Confirm' },
          { num: 4, name: 'Complete' }
        ].map((stepItem, index) => (
          <div key={stepItem.num} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step >= stepItem.num
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-300 text-slate-400'
            }`}>
              {step > stepItem.num ? <CheckCircle className="h-5 w-5" /> : stepItem.num}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step >= stepItem.num ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {stepItem.name}
            </span>
            {index < 3 && (
              <div className={`w-12 h-0.5 mx-4 ${
                step > stepItem.num ? 'bg-blue-600' : 'bg-slate-300'
              }`} />
            )}
          </div>
        ))}
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

      {/* Step 1: Select Transfer Method */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--card-text)' }}>
              Choose Transfer Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {transferMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setRecipientAccounts([]);
                      setSearchPhone('');
                      setSearchAccountNumber('');
                      setError('');
                      setStep(2);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 border-2 rounded-2xl hover:border-blue-500 transition-all text-left group"
                    style={{ borderColor: 'var(--card-bg-alt)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors" style={{ color: 'var(--card-text)' }}>
                          {method.name}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Transfer Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--card-text)' }}>
            Transfer Details
          </h2>

          <div className="space-y-6">
            {/* From Account */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--card-text)' }}>
                From Account
              </label>
              <div className="space-y-3">
                {myAccounts.map((account) => (
                  <label
                    key={account.id}
                    className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:border-blue-500 transition-all"
                    style={{ borderColor: transferData.fromAccountId === account.id ? '#3b82f6' : 'var(--card-bg-alt)' }}
                  >
                    <input
                      type="radio"
                      name="fromAccount"
                      value={account.id}
                      checked={transferData.fromAccountId === account.id}
                      onChange={(e) => setTransferData(prev => ({ ...prev, fromAccountId: e.target.value }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                            {account.account_name}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            {account.account_number} • {account.account_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold" style={{ color: 'var(--card-text)' }}>
                            {formatCurrency(account.balance, account.currency)}
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
            </div>

            {/* Account Number Search */}
            {selectedMethod === 'account' && (
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                  Recipient Account Number *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={searchAccountNumber}
                    onChange={(e) => setSearchAccountNumber(e.target.value)}
                    className="flex-1 px-4 py-4 border-2 rounded-2xl focus:border-blue-500 transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--card-bg-alt)',
                      borderColor: 'var(--card-bg-alt)',
                      color: 'var(--card-text)'
                    }}
                  />
                  <button
                    onClick={handleAccountSearch}
                    disabled={loadingRecipients}
                    className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loadingRecipients ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Recipient Account Results */}
                {recipientAccounts.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold" style={{ color: 'var(--card-text)' }}>
                      Account Found
                    </p>
                    {recipientAccounts.map((account) => (
                      <label
                        key={account.id}
                        className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:border-blue-500 transition-all"
                        style={{ borderColor: transferData.toAccountId === account.id ? '#3b82f6' : 'var(--card-bg-alt)' }}
                      >
                        <input
                          type="radio"
                          name="toAccount"
                          value={account.id}
                          checked={transferData.toAccountId === account.id}
                          onChange={(e) => {
                            setTransferData(prev => ({
                              ...prev,
                              toAccountId: e.target.value,
                              recipientName: account.user.full_name,
                              recipientPhone: account.user.phone
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                            {account.account_name}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            {account.account_number} • {account.account_type}
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                            Account holder: {account.user.full_name}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Phone Number Search */}
            {selectedMethod === 'phone' && (
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                  Recipient Phone Number *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="flex-1 px-4 py-4 border-2 rounded-2xl focus:border-blue-500 transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--card-bg-alt)',
                      borderColor: 'var(--card-bg-alt)',
                      color: 'var(--card-text)'
                    }}
                  />
                  <button
                    onClick={handlePhoneSearch}
                    disabled={loadingRecipients}
                    className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loadingRecipients ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Recipient Accounts */}
                {recipientAccounts.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold" style={{ color: 'var(--card-text)' }}>
                      Select Recipient Account
                    </p>
                    {recipientAccounts.map((account) => (
                      <label
                        key={account.id}
                        className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:border-blue-500 transition-all"
                        style={{ borderColor: transferData.toAccountId === account.id ? '#3b82f6' : 'var(--card-bg-alt)' }}
                      >
                        <input
                          type="radio"
                          name="toAccount"
                          value={account.id}
                          checked={transferData.toAccountId === account.id}
                          onChange={(e) => {
                            setTransferData(prev => ({
                              ...prev,
                              toAccountId: e.target.value,
                              recipientName: account.user.full_name,
                              recipientPhone: account.user.phone
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                            {account.account_name}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            {account.account_number} • {account.account_type}
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
                            Account holder: {account.user.full_name}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Internal Transfer - To Account */}
            {selectedMethod === 'internal' && (
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--card-text)' }}>
                  To Account (Your Accounts)
                </label>
                <div className="space-y-3">
                  {myAccounts
                    .filter(acc => acc.id !== transferData.fromAccountId)
                    .map((account) => (
                      <label
                        key={account.id}
                        className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:border-blue-500 transition-all"
                        style={{ borderColor: transferData.toAccountId === account.id ? '#3b82f6' : 'var(--card-bg-alt)' }}
                      >
                        <input
                          type="radio"
                          name="toAccount"
                          value={account.id}
                          checked={transferData.toAccountId === account.id}
                          onChange={(e) => setTransferData(prev => ({ ...prev, toAccountId: e.target.value }))}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                                {account.account_name}
                              </p>
                              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                                {account.account_number} • {account.account_type}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold" style={{ color: 'var(--card-text)' }}>
                                {formatCurrency(account.balance, account.currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-medium" style={{ color: 'var(--card-text-secondary)' }}>
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:border-blue-500 transition-all duration-200 text-2xl font-semibold"
                  style={{
                    backgroundColor: 'var(--card-bg-alt)',
                    borderColor: 'var(--card-bg-alt)',
                    color: 'var(--card-text)'
                  }}
                  value={transferData.amount}
                  onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              {selectedFromAccount && transferData.amount && (
                <p className="text-sm mt-2" style={{ color: 'var(--card-text-secondary)' }}>
                  Available balance: {formatCurrency(selectedFromAccount.balance, selectedFromAccount.currency)}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-3">
              {[50, 100, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTransferData(prev => ({ ...prev, amount: amount.toString() }))}
                  className="px-4 py-2 rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Purpose & Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                Purpose of Transfer
              </label>
              <select
                value={transferData.purpose}
                onChange={(e) => setTransferData(prev => ({ ...prev, purpose: e.target.value }))}
                className="w-full px-4 py-4 border-2 rounded-2xl focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
              >
                <option value="">Select purpose (optional)</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="family">Family Support</option>
                <option value="investment">Investment</option>
                <option value="loan">Loan Payment</option>
                <option value="transfer">Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                Notes (Optional)
              </label>
              <textarea
                placeholder="Add a note for this transfer"
                rows={3}
                className="w-full px-4 py-4 border-2 rounded-2xl focus:border-blue-500 transition-all duration-200 resize-none"
                style={{
                  backgroundColor: 'var(--card-bg-alt)',
                  borderColor: 'var(--card-bg-alt)',
                  color: 'var(--card-text)'
                }}
                value={transferData.notes}
                onChange={(e) => setTransferData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Continue Button */}
            <motion.button
              onClick={() => {
                if (!transferData.toAccountId) {
                  setError('Please select a recipient account');
                  return;
                }
                if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
                  setError('Please enter a valid amount');
                  return;
                }
                setError('');
                setStep(3);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Review Transfer
              <ArrowRight className="h-5 w-5 ml-2" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Confirm Transfer */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--card-text)' }}>
              Confirm Transfer
            </h2>

            {/* Transfer Summary */}
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <div className="text-center mb-6">
                <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>You're sending</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--card-text)' }}>
                  ${transferData.amount}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-semibold text-sm">From</span>
                  </div>
                  <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                    {selectedFromAccount?.account_name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                    {selectedFromAccount?.account_number}
                  </p>
                </div>

                <div className="flex-1 mx-8">
                  <div className="relative">
                    <div className="h-0.5" style={{ backgroundColor: 'var(--card-bg-alt)' }}></div>
                    <ArrowRight
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full p-1"
                      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-secondary)' }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-semibold text-sm">To</span>
                  </div>
                  <p className="font-medium" style={{ color: 'var(--card-text)' }}>
                    {selectedMethod === 'internal' 
                      ? (selectedToAccount as Account)?.account_name
                      : (selectedToAccount as RecipientAccount)?.account_name
                    }
                  </p>
                  <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                    {selectedMethod === 'internal'
                      ? (selectedToAccount as Account)?.account_number
                      : (selectedToAccount as RecipientAccount)?.account_number
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
                <span style={{ color: 'var(--card-text-secondary)' }}>Transfer Method</span>
                <span className="font-medium capitalize" style={{ color: 'var(--card-text)' }}>
                  {transferMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
                <span style={{ color: 'var(--card-text-secondary)' }}>Transfer Fee</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--card-bg-alt)' }}>
                <span style={{ color: 'var(--card-text-secondary)' }}>Total Amount</span>
                <span className="font-bold text-lg" style={{ color: 'var(--card-text)' }}>
                  ${transferData.amount}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Secure Transfer</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This transfer is protected by bank-grade security and will be processed instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <motion.button
              onClick={handleTransfer}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  Confirm Transfer
                  <CheckCircle className="h-5 w-5 ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-8 shadow-lg text-center"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>
            Transfer Successful! 🎉
          </h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-8">
            Your money has been sent successfully
          </p>

          <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: 'var(--card-text-secondary)' }}>Transaction ID</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm" style={{ color: 'var(--card-text)' }}>
                  {transactionId}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(transactionId)}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <Copy className="h-4 w-4" style={{ color: 'var(--card-text-secondary)' }} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: 'var(--card-text-secondary)' }}>Amount Sent</span>
              <span className="font-bold text-lg" style={{ color: 'var(--card-text)' }}>
                ${transferData.amount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--card-text-secondary)' }}>Status</span>
              <span className="font-medium text-green-600">Completed</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/dashboard/accounts')}
              className="flex-1 px-6 py-3 rounded-2xl font-medium transition-colors"
              style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
            >
              View Accounts
            </button>
            <button
              onClick={() => router.push('/dashboard/transactions')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              View Transactions
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

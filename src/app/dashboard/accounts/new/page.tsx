// src/app/dashboard/accounts/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  ArrowRight,
  Wallet,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Lock
} from 'lucide-react';
import Link from 'next/link';

const accountTypes = [
  {
    type: 'savings',
    name: 'Savings Account',
    description: 'Earn interest on your deposits with flexible access to your funds',
    icon: Wallet,
    gradient: 'from-blue-600 to-blue-700',
    features: [
      'Up to 2.5% annual interest',
      'Unlimited deposits',
      'Free withdrawals',
      'Mobile banking access'
    ],
    minBalance: 100,
    monthlyFee: 0,
  },
  {
    type: 'current',
    name: 'Current Account',
    description: 'Perfect for daily transactions and business operations',
    icon: Building,
    gradient: 'from-purple-600 to-purple-700',
    features: [
      'No transaction limits',
      'Free checkbook',
      'Overdraft facility',
      'Business tools integration'
    ],
    minBalance: 500,
    monthlyFee: 5,
  },
  {
    type: 'investment',
    name: 'Investment Account',
    description: 'Grow your wealth with higher returns and investment options',
    icon: TrendingUp,
    gradient: 'from-green-600 to-green-700',
    features: [
      'Up to 7.2% annual returns',
      'Investment advisory',
      'Portfolio management',
      'Tax benefits'
    ],
    minBalance: 5000,
    monthlyFee: 10,
  },
];

export default function NewAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingAccounts, setExistingAccounts] = useState<string[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [formData, setFormData] = useState({
    accountType: '',
    accountName: '',
    initialBalance: '',
    acceptTerms: false,
  });

  const selectedType = accountTypes.find(t => t.type === formData.accountType);

  useEffect(() => {
    fetchExistingAccounts();
  }, []);

  const fetchExistingAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Get all active account types
        const activeTypes = data.accounts
          .filter((acc: any) => acc.status === 'active')
          .map((acc: any) => acc.account_type);
        
        setExistingAccounts(activeTypes);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const isAccountTypeDisabled = (type: string) => {
    return existingAccounts.includes(type);
  };

  const validateStep1 = () => {
    return formData.accountType !== '' && !isAccountTypeDisabled(formData.accountType);
  };

  const validateStep2 = () => {
    if (!formData.accountName.trim()) return false;
    if (!formData.initialBalance) return false;
    
    const balance = parseFloat(formData.initialBalance);
    if (isNaN(balance) || balance < 0) return false;
    
    if (selectedType && balance < selectedType.minBalance) return false;
    
    return formData.acceptTerms;
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Please login to create an account');
      }

      // Double-check if account type already exists
      if (isAccountTypeDisabled(formData.accountType)) {
        throw new Error(`You already have an active ${selectedType?.name}. Please manage your existing account instead.`);
      }

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_type: formData.accountType,
          account_name: formData.accountName,
          initial_balance: parseFloat(formData.initialBalance),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setSuccess(true);
      setStep(3);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/accounts');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  if (loadingAccounts) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--dashboard-bg)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--dashboard-bg)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/accounts"
            className="inline-flex items-center mb-4 transition-colors"
            style={{ color: 'var(--card-text-secondary)' }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Accounts
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
            Create New Account
          </h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Choose an account type and set up your new account
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  step >= s 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {index < 2 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors ${
                    step > s ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2">
            <span className="text-xs font-medium" style={{ color: step >= 1 ? 'var(--card-text)' : 'var(--card-text-secondary)' }}>
              Account Type
            </span>
            <span className="text-xs font-medium" style={{ color: step >= 2 ? 'var(--card-text)' : 'var(--card-text-secondary)' }}>
              Details
            </span>
            <span className="text-xs font-medium" style={{ color: step >= 3 ? 'var(--card-text)' : 'var(--card-text-secondary)' }}>
              Complete
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start max-w-2xl mx-auto"
          >
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Step 1: Choose Account Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accountTypes.map((account, index) => {
                const IconComponent = account.icon;
                const isSelected = formData.accountType === account.type;
                const isDisabled = isAccountTypeDisabled(account.type);

                return (
                  <motion.div
                    key={account.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => !isDisabled && setFormData(prev => ({ ...prev, accountType: account.type }))}
                    className={`rounded-2xl p-6 transition-all duration-300 border-2 relative ${
                      isDisabled
                        ? 'opacity-60 cursor-not-allowed border-slate-300'
                        : isSelected 
                        ? 'border-blue-500 shadow-lg cursor-pointer' 
                        : 'border-transparent hover:border-blue-300 cursor-pointer'
                    }`}
                    style={{ backgroundColor: 'var(--card-bg)' }}
                  >
                    {/* Already Exists Badge */}
                    {isDisabled && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          <Lock className="h-3 w-3" />
                          <span>Already Exists</span>
                        </div>
                      </div>
                    )}

                    <div className={`p-4 rounded-xl bg-gradient-to-r ${account.gradient} mb-4 inline-block ${isDisabled ? 'opacity-50' : ''}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>
                      {account.name}
                    </h3>
                    
                    <p className="text-sm mb-4" style={{ color: 'var(--card-text-secondary)' }}>
                      {account.description}
                    </p>

                    {isDisabled && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-xs text-orange-700">
                          You already have an active {account.name.toLowerCase()}. Manage it from your accounts page.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {account.features.map((feature, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}>
                      <div className="flex justify-between text-sm mb-2">
                        <span style={{ color: 'var(--card-text-secondary)' }}>Min. Balance:</span>
                        <span className="font-semibold" style={{ color: 'var(--card-text)' }}>
                          ${account.minBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--card-text-secondary)' }}>Monthly Fee:</span>
                        <span className="font-semibold" style={{ color: 'var(--card-text)' }}>
                          {account.monthlyFee === 0 ? 'Free' : `$${account.monthlyFee}`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Info Message */}
            <div className="max-w-2xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                You can only have one active account of each type. If you need multiple accounts of the same type, please contact support.
              </p>
            </div>

            <div className="flex justify-end max-w-2xl mx-auto">
              <motion.button
                onClick={() => setStep(2)}
                disabled={!validateStep1()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Account Details */}
        {step === 2 && selectedType && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl p-8 shadow-lg space-y-6" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>
                  Account Details
                </h2>
                <p style={{ color: 'var(--card-text-secondary)' }}>
                  Setting up: {selectedType.name}
                </p>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                  Account Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Emergency Fund, Business Account"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full px-4 py-4 border-2 rounded-xl focus:border-blue-500 transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--card-bg-alt)',
                    borderColor: 'var(--card-bg-alt)',
                    color: 'var(--card-text)'
                  }}
                />
                <p className="text-sm mt-2" style={{ color: 'var(--card-text-secondary)' }}>
                  Give your account a memorable name
                </p>
              </div>

              {/* Initial Balance */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                  Initial Deposit Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--card-text-secondary)' }}>
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min={selectedType.minBalance}
                    step="0.01"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: e.target.value }))}
                    className="w-full pl-8 pr-4 py-4 border-2 rounded-xl focus:border-blue-500 transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--card-bg-alt)',
                      borderColor: 'var(--card-bg-alt)',
                      color: 'var(--card-text)'
                    }}
                  />
                </div>
                <div className="flex items-start space-x-2 mt-2">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--card-text-secondary)' }} />
                  <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                    Minimum balance required: ${selectedType.minBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm" style={{ color: 'var(--card-text)' }}>
                  I agree to the account terms and conditions. I understand that this account is subject to the bank's policies and fees.
                </label>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}>
                <motion.button
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 font-medium transition-colors"
                  style={{ color: 'var(--card-text-secondary)' }}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </motion.button>

                <motion.button
                  onClick={handleCreateAccount}
                  disabled={!validateStep2() || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl p-8 shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--card-text)' }}>
                Account Created Successfully! 🎉
              </h2>
              
              <p className="text-lg mb-2" style={{ color: 'var(--card-text-secondary)' }}>
                Your {selectedType?.name} has been set up
              </p>
              
              <p className="mb-6" style={{ color: 'var(--card-text-secondary)' }}>
                Redirecting to your accounts...
              </p>

              <div className="inline-block animate-pulse">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// src/app/dashboard/transactions/transfer/page.tsx
'use client';

import { useState } from 'react';
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
  QrCode
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const transferMethods = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Send to any bank account',
    icon: Building,
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'upi',
    name: 'UPI Transfer',
    description: 'Instant payment via UPI ID',
    icon: Smartphone,
    color: 'from-green-600 to-green-700'
  },
  {
    id: 'contact',
    name: 'To Contact',
    description: 'Send to saved contact',
    icon: User,
    color: 'from-purple-600 to-purple-700'
  },
  {
    id: 'qr',
    name: 'QR Code',
    description: 'Scan and pay instantly',
    icon: QrCode,
    color: 'from-orange-600 to-orange-700'
  }
];

const recentContacts = [
  { id: '1', name: 'John Smith', phone: '+1 555-0123', avatar: 'JS' },
  { id: '2', name: 'Sarah Wilson', phone: '+1 555-0456', avatar: 'SW' },
  { id: '3', name: 'Mike Johnson', phone: '+1 555-0789', avatar: 'MJ' },
  { id: '4', name: 'Emma Davis', phone: '+1 555-0321', avatar: 'ED' }
];

export default function TransferPage() {
  const [step, setStep] = useState(1); // 1: Method, 2: Details, 3: Confirm, 4: Success
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [transferData, setTransferData] = useState({
    fromAccount: 'savings-4521',
    toAccount: '',
    toName: '',
    amount: '',
    purpose: '',
    notes: '',
    upiId: '',
    ifsc: '',
    bankName: ''
  });

  const accounts = [
    { id: 'savings-4521', name: 'Primary Savings', balance: 25840.50, number: '****4521' },
    { id: 'current-7832', name: 'Business Current', balance: 8920.75, number: '****7832' }
  ];

  const selectedAccount = accounts.find(acc => acc.id === transferData.fromAccount);

  const handleTransfer = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Send Money</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Transfer funds securely and instantly
          </p>
        </div>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
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
              {step > stepItem.num ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                stepItem.num
              )}
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

      {/* Step 1: Select Transfer Method */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Choose Transfer Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transferMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setStep(2);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {method.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Recent Contacts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentContacts.map((contact) => (
                <motion.button
                  key={contact.id}
                  onClick={() => {
                    setTransferData(prev => ({
                      ...prev,
                      toName: contact.name,
                      toAccount: contact.phone
                    }));
                    setSelectedMethod('contact');
                    setStep(2);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 transition-all text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-semibold text-sm">{contact.avatar}</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{contact.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{contact.phone}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Transfer Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Transfer Details
          </h2>

          <div className="space-y-6">
            {/* From Account */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                From Account
              </label>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <label key={account.id} className="flex items-center p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="fromAccount"
                      value={account.id}
                      checked={transferData.fromAccount === account.id}
                      onChange={(e) => setTransferData(prev => ({ ...prev, fromAccount: e.target.value }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{account.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{account.number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(account.balance)}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Recipient Details */}
            {selectedMethod === 'bank' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter recipient name"
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                      value={transferData.toName}
                      onChange={(e) => setTransferData(prev => ({ ...prev, toName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                      value={transferData.toAccount}
                      onChange={(e) => setTransferData(prev => ({ ...prev, toAccount: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter IFSC code"
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                      value={transferData.ifsc}
                      onChange={(e) => setTransferData(prev => ({ ...prev, ifsc: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Bank name (auto-filled)"
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                      value={transferData.bankName}
                      onChange={(e) => setTransferData(prev => ({ ...prev, bankName: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}

            {selectedMethod === 'upi' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  UPI ID *
                </label>
                <input
                  type="text"
                  placeholder="example@upi"
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                  value={transferData.upiId}
                  onChange={(e) => setTransferData(prev => ({ ...prev, upiId: e.target.value }))}
                />
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-medium">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 text-2xl font-semibold"
                  value={transferData.amount}
                  onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              {selectedAccount && transferData.amount && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Available balance: {formatCurrency(selectedAccount.balance)}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-3">
              {[50, 100, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTransferData(prev => ({ ...prev, amount: amount.toString() }))}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-xl transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Purpose of Transfer
              </label>
              <select className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200">
                <option value="">Select purpose (optional)</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="family">Family Support</option>
                <option value="investment">Investment</option>
                <option value="loan">Loan Payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Add a note for this transfer"
                rows={3}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 resize-none"
                value={transferData.notes}
                onChange={(e) => setTransferData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Continue Button */}
            <motion.button
              onClick={() => setStep(3)}
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

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Confirm Transfer
            </h2>

            {/* Transfer Summary */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 mb-6">
              <div className="text-center mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">You're sending</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  ${transferData.amount}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-semibold">You</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedAccount?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedAccount?.number}</p>
                </div>

                <div className="flex-1 mx-8">
                  <div className="relative">
                    <div className="h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                    <ArrowRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 bg-white dark:bg-slate-800 rounded-full p-1" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {transferData.toName || 'Recipient'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedMethod === 'upi' ? transferData.upiId : transferData.toAccount}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Transfer Method</span>
                <span className="font-medium text-slate-900 dark:text-white capitalize">
                  {transferMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Transfer Fee</span>
                <span className="font-medium text-green-600 dark:text-green-400">FREE</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
                <span className="font-bold text-slate-900 dark:text-white text-lg">
                  ${transferData.amount}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-400">Secure Transfer</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
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
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Transfer Successful! 🎉
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your money has been sent successfully
          </p>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600 dark:text-slate-400">Transaction ID</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-slate-900 dark:text-white">TXN123456789</span>
                <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                  <Copy className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600 dark:text-slate-400">Amount Sent</span>
              <span className="font-bold text-slate-900 dark:text-white text-lg">
                ${transferData.amount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Estimated Arrival</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                Instant
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl font-medium transition-colors">
              Download Receipt
            </button>
            <button 
              onClick={() => router.push('/dashboard/transactions')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              View Transaction
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

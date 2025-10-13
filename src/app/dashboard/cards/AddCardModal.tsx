// src/components/cards/AddCardModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardTypes = [
  {
    id: 'virtual-instant',
    name: 'Virtual Card - Instant',
    description: 'Get a virtual card instantly for online purchases',
    features: ['Instant activation', 'Online payments only', 'Customizable limits'],
    icon: Smartphone,
    gradient: 'from-blue-600 to-indigo-600',
    fee: 'Free'
  },
  {
    id: 'virtual-premium',
    name: 'Virtual Card - Premium',
    description: 'Enhanced virtual card with higher limits and rewards',
    features: ['Higher limits', 'Cashback rewards', 'Priority support'],
    icon: Shield,
    gradient: 'from-purple-600 to-pink-600',
    fee: '$5/month'
  },
  {
    id: 'physical-standard',
    name: 'Physical Debit Card',
    description: 'Traditional plastic card for ATM and in-store purchases',
    features: ['ATM access', 'In-store payments', 'Global acceptance'],
    icon: CreditCard,
    gradient: 'from-green-600 to-emerald-600',
    fee: '$3/month'
  }
];

export default function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const [step, setStep] = useState(1); // 1: Type selection, 2: Details, 3: Confirmation
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [cardData, setCardData] = useState({
    cardName: '',
    monthlyLimit: '2000',
    dailyLimit: '500',
    singleTransactionLimit: '1000',
    linkedAccount: 'primary-savings',
    enableOnline: true,
    enableContactless: true,
    enableInternational: false
  });

  const handleCreateCard = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const resetModal = () => {
    setStep(1);
    setSelectedType('');
    setCardData({
      cardName: '',
      monthlyLimit: '2000',
      dailyLimit: '500',
      singleTransactionLimit: '1000',
      linkedAccount: 'primary-savings',
      enableOnline: true,
      enableContactless: true,
      enableInternational: false
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {step === 1 ? 'Add New Card' : step === 2 ? 'Card Details' : 'Card Created!'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {step === 1 ? 'Choose your card type' : step === 2 ? 'Configure your new card' : 'Your card is ready to use'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>

            {/* Progress Steps */}
            {step < 3 && (
              <div className="flex items-center justify-center py-4 border-b border-slate-200 dark:border-slate-700">
                {[1, 2].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      step >= stepNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {stepNum}
                    </div>
                    {stepNum < 2 && (
                      <div className={`w-16 h-0.5 mx-3 ${
                        step > stepNum ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Card Type Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cardTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <motion.button
                          key={type.id}
                          onClick={() => {
                            setSelectedType(type.id);
                            setStep(2);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 transition-all text-left group h-full"
                        >
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${type.gradient} inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                            {type.name}
                          </h3>
                          
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            {type.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            {type.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{type.fee}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Card Configuration */}
              {step === 2 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {cardTypes.find(t => t.id === selectedType)?.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {cardTypes.find(t => t.id === selectedType)?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Card Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter card name (e.g., Shopping Card)"
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                      value={cardData.cardName}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                    />
                  </div>

                  {/* Linked Account */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Link to Account *
                    </label>
                    <select
                      value={cardData.linkedAccount}
                      onChange={(e) => setCardData(prev => ({ ...prev, linkedAccount: e.target.value }))}
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                    >
                      <option value="primary-savings">Primary Savings - ****4521</option>
                      <option value="business-current">Business Current - ****7832</option>
                    </select>
                  </div>

                  {/* Spending Limits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Daily Limit ($)
                      </label>
                      <input
                        type="number"
                        placeholder="500"
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                        value={cardData.dailyLimit}
                        onChange={(e) => setCardData(prev => ({ ...prev, dailyLimit: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Monthly Limit ($)
                      </label>
                      <input
                        type="number"
                        placeholder="2000"
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                        value={cardData.monthlyLimit}
                        onChange={(e) => setCardData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Per Transaction ($)
                      </label>
                      <input
                        type="number"
                        placeholder="1000"
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                        value={cardData.singleTransactionLimit}
                        onChange={(e) => setCardData(prev => ({ ...prev, singleTransactionLimit: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Card Features */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                      Card Features
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Online Payments</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Enable online transactions</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCardData(prev => ({ ...prev, enableOnline: !prev.enableOnline }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            cardData.enableOnline ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cardData.enableOnline ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Contactless Payments</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Tap to pay functionality</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCardData(prev => ({ ...prev, enableContactless: !prev.enableContactless }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            cardData.enableContactless ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cardData.enableContactless ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">International Transactions</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Allow foreign transactions</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCardData(prev => ({ ...prev, enableInternational: !prev.enableInternational }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            cardData.enableInternational ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cardData.enableInternational ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Create Button */}
                  <motion.button
                    onClick={handleCreateCard}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !cardData.cardName}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Create Card
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="text-center space-y-6 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Card Created Successfully! 🎉
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your new {cardTypes.find(t => t.id === selectedType)?.name.toLowerCase()} is ready to use
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Card Name</span>
                        <span className="font-medium text-slate-900 dark:text-white">{cardData.cardName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Monthly Limit</span>
                        <span className="font-medium text-slate-900 dark:text-white">${cardData.monthlyLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Status</span>
                        <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    View My Cards
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

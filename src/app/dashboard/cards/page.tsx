// src/app/dashboard/cards/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Settings, 
  MoreVertical,
  Pause,
  Play,
  ShieldCheck,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

const cards = [
  {
    id: '1',
    type: 'virtual',
    name: 'Primary Virtual Card',
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/28',
    cvv: '123',
    status: 'active',
    balance: 2500.00,
    spentThisMonth: 850.32,
    monthlyLimit: 3000.00,
    cardHolder: 'JOHN DOE',
    brand: 'visa',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    lastUsed: '2025-10-13T09:30:00'
  },
  {
    id: '2',
    type: 'physical',
    name: 'Premium Debit Card',
    cardNumber: '5432 9876 5432 1098',
    expiryDate: '08/27',
    cvv: '456',
    status: 'active',
    balance: 15420.75,
    spentThisMonth: 1250.45,
    monthlyLimit: 5000.00,
    cardHolder: 'JOHN DOE',
    brand: 'mastercard',
    gradient: 'from-purple-600 via-purple-700 to-pink-800',
    lastUsed: '2025-10-12T14:20:00'
  },
  {
    id: '3',
    type: 'virtual',
    name: 'Shopping Card',
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '06/29',
    cvv: '789',
    status: 'frozen',
    balance: 500.00,
    spentThisMonth: 0.00,
    monthlyLimit: 1000.00,
    cardHolder: 'JOHN DOE',
    brand: 'visa',
    gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
    lastUsed: '2025-10-05T11:15:00'
  }
];

export default function CardsPage() {
  const [showCardNumbers, setShowCardNumbers] = useState<{[key: string]: boolean}>({});
  const [selectedCard, setSelectedCard] = useState(cards[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatCardNumber = (cardNumber: string, show: boolean) => {
    if (show) return cardNumber;
    return cardNumber.replace(/(\d{4})\s(\d{4})\s(\d{4})\s(\d{4})/, '**** **** **** $4');
  };

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'frozen': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'blocked': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700';
    }
  };

  const totalSpent = cards.reduce((sum, card) => sum + card.spentThisMonth, 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.monthlyLimit, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Cards</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your virtual and physical cards
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Card Settings
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add New Card
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This month</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Available Limit</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalLimit - totalSpent)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Remaining</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Cards</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {cards.filter(card => card.status === 'active').length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Out of {cards.length}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Cards</h2>
          
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCard(card)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedCard.id === card.id ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Card Front */}
              <div className={`relative w-full h-56 rounded-3xl bg-gradient-to-br ${card.gradient} p-8 text-white overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl transform -translate-x-8 translate-y-8"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm opacity-90">{card.name}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(card.status)}`}>
                            {card.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardVisibility(card.id);
                        }}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {showCardNumbers[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-4">
                    <p className="text-2xl font-mono tracking-wider">
                      {formatCardNumber(card.cardNumber, showCardNumbers[card.id])}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-70">CARD HOLDER</p>
                        <p className="text-sm font-medium">{card.cardHolder}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70">EXPIRES</p>
                        <p className="text-sm font-medium">{card.expiryDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">
                            {card.brand === 'visa' ? 'VISA' : 'MC'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg -mt-4 pt-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Available Balance</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(card.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Spending</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(card.spentThisMonth)}
                    </p>
                  </div>
                </div>

                {/* Spending Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Limit</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {Math.round((card.spentThisMonth / card.monthlyLimit) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((card.spentThisMonth / card.monthlyLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 flex items-center justify-center py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                    {card.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Freeze
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Unfreeze
                      </>
                    )}
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </button>
                  <button className="flex items-center justify-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Card Controls */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Card Controls - {selectedCard.name}
          </h2>

          {/* Security Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
              Security Controls
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Online Payments</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Allow online transactions</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">International Transactions</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Allow foreign transactions</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">ATM Withdrawals</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Allow cash withdrawals</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Contactless Payments</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tap to pay transactions</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Spending Limits */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Spending Limits
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Daily Limit
                  </label>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(500)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  defaultValue="500"
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Monthly Limit
                  </label>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(selectedCard.monthlyLimit)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  defaultValue={selectedCard.monthlyLimit}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Single Transaction Limit
                  </label>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(1000)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  defaultValue="1000"
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
              Update Limits
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all">
                <Lock className="h-4 w-4 mr-2" />
                Block Card
              </button>
              <button className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all">
                <Unlock className="h-4 w-4 mr-2" />
                Unblock Card
              </button>
              <button className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all">
                <Settings className="h-4 w-4 mr-2" />
                Card Settings
              </button>
              <button className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all">
                <Calendar className="h-4 w-4 mr-2" />
                Replace Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

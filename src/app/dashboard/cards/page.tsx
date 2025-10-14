// src/app/dashboard/cards/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff, 
  Settings, 
  MoreVertical,
  Pause,
  Play,
  TrendingUp,
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
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatCardNumber = (cardNumber: string, show: boolean) => {
    if (show) return cardNumber;
    return cardNumber.replace(/(\d{4})\s(\d{4})\s(\d{4})\s(\d{4})/, '**** **** **** $4');
  };

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
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
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>My Cards</h1>
          <p className="mt-1" style={{ color: 'var(--card-text-secondary)' }}>Manage your virtual and physical cards</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-slate-100 dark:bg-[var(--card-bg)] hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
            style={{ color: 'var(--card-text)' }}
          >
            <Settings className="h-4 w-4 mr-2" /> Card Settings
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" /> Add New Card
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Spent', value: totalSpent, icon: <DollarSign className="h-6 w-6" /> },
          { title: 'Available Limit', value: totalLimit - totalSpent, icon: <TrendingUp className="h-6 w-6" /> },
          { title: 'Active Cards', value: cards.filter(c => c.status === 'active').length, icon: <CreditCard className="h-6 w-6" /> },
        ].map((cardItem, idx) => (
          <div
            key={idx}
            className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg transition-all duration-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>{cardItem.title}</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>{formatCurrency(cardItem.value)}</p>
              </div>
              <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl" style={{ color: 'var(--card-text)' }}>
                {cardItem.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--card-text)' }}>Your Cards</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {cards.map((card) => {
            const isSelected = selectedCard === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`cursor-pointer transition-all duration-500 rounded-3xl shadow-lg hover:shadow-xl col-span-1 ${isSelected ? 'scale-105' : 'scale-100'}`}
              >
                {/* Card Front */}
                <div
                  onClick={() => setSelectedCard(isSelected ? null : card.id)}
                  className={`relative w-full h-56 rounded-3xl bg-gradient-to-br ${card.gradient} p-8 text-white overflow-hidden transition-all duration-500`}
                >
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
                          onClick={(e) => { e.stopPropagation(); toggleCardVisibility(card.id); }}
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
                          <p className="text-xs text-gray-200" >CARD HOLDER</p>
                          <p className="text-sm font-medium text-white" >{card.cardHolder}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-200" >EXPIRES</p>
                          <p className="text-sm font-medium text-white" >{card.expiryDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold">{card.brand === 'visa' ? 'VISA' : 'MC'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Card Details */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-2xl p-6 overflow-hidden transition-all duration-500"
                      style={{ marginTop: '-2rem' }}
                    >
                      {/* Available Balance & Monthly Spending */}
                      <div className="grid grid-cols-2 gap-6" style={{ marginTop: '2rem' }}>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Available Balance</p>
                          <p className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>{formatCurrency(card.balance)}</p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Monthly Spending</p>
                          <p className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>{formatCurrency(card.spentThisMonth)}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Monthly Limit</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--card-text)' }}>
                            {Math.round((card.spentThisMonth / card.monthlyLimit) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((card.spentThisMonth / card.monthlyLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-3 mt-6">
                        <button
                          className="flex-1 flex items-center justify-center py-2 px-3 bg-slate-100 dark:bg-[var(--card-bg-alt)] hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
                          style={{ color: 'var(--card-text)' }}
                        >
                          {card.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" /> Freeze
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" /> Unfreeze
                            </>
                          )}
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center py-2 px-3 bg-slate-100 dark:bg-[var(--card-bg-alt)] hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
                          style={{ color: 'var(--card-text)' }}
                        >
                          <Settings className="h-4 w-4 mr-1" /> Settings
                        </button>
                        
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

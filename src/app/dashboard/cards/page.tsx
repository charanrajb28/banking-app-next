// src/app/dashboard/cards/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Settings, 
  MoreVertical,
  Pause,
  Play,
  TrendingUp,
  DollarSign,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface Card {
  id: string;
  account_id: string;
  card_number: string;
  card_holder_name: string;
  expiry_date: string;
  cvv: string;
  card_type: 'virtual' | 'physical';
  status: 'active' | 'frozen' | 'blocked';
  monthly_limit: number;
  created_at: string;
}

interface Account {
  id: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
}

interface CardWithAccount extends Card {
  account: Account;
  spentThisMonth: number;
}

const cardGradients = [
  'from-blue-600 via-blue-700 to-indigo-800',
  'from-purple-600 via-purple-700 to-pink-800',
  'from-emerald-600 via-emerald-700 to-teal-800',
  'from-orange-600 via-orange-700 to-red-800',
  'from-cyan-600 via-cyan-700 to-blue-800',
];

export default function CardsPage() {
  const [cards, setCards] = useState<CardWithAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCardNumbers, setShowCardNumbers] = useState<{[key: string]: boolean}>({});
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Please login to view cards');
      }

      const response = await fetch('/api/cards', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cards');
      }

      setCards(data.cards || []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardStatus = async (cardId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const newStatus = currentStatus === 'active' ? 'frozen' : 'active';

      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchCards(); // Refresh cards
      }
    } catch (err) {
      console.error('Error toggling card status:', err);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  const formatCardNumber = (cardNumber: string, show: boolean) => {
    if (show) return cardNumber;
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'frozen': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getCardGradient = (index: number) => {
    return cardGradients[index % cardGradients.length];
  };

  const totalSpent = cards.reduce((sum, card) => sum + card.spentThisMonth, 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.monthly_limit, 0);
  const activeCards = cards.filter(c => c.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>Error Loading Cards</h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">{error}</p>
          <button
            onClick={fetchCards}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>No Cards Yet</h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-6">
            Cards are automatically created when you open a new account. Create your first account to get started!
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/accounts/new'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>My Cards</h1>
          <p className="mt-1" style={{ color: 'var(--card-text-secondary)' }}>
            Manage your virtual and physical cards
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={fetchCards}
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Total Spent</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <DollarSign className="h-6 w-6" style={{ color: 'var(--card-text)' }} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Available Limit</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {formatCurrency(totalLimit - totalSpent)}
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <TrendingUp className="h-6 w-6" style={{ color: 'var(--card-text)' }} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Active Cards</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {activeCards}
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <CreditCard className="h-6 w-6" style={{ color: 'var(--card-text)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--card-text)' }}>Your Cards</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const isSelected = selectedCard === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`cursor-pointer transition-all duration-500 rounded-3xl shadow-lg hover:shadow-xl col-span-1 ${
                  isSelected ? 'scale-105' : 'scale-100'
                }`}
              >
                {/* Card Front */}
                <div
                  onClick={() => setSelectedCard(isSelected ? null : card.id)}
                  className={`relative w-full h-56 rounded-3xl bg-gradient-to-br ${getCardGradient(index)} p-8 text-white overflow-hidden transition-all duration-500`}
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
                            <p className="text-sm opacity-90">{card.account.account_name}</p>
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
                          {showCardNumbers[card.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="space-y-4">
                      <p className="text-2xl font-mono tracking-wider">
                        {formatCardNumber(card.card_number, showCardNumbers[card.id])}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-200">CARD HOLDER</p>
                          <p className="text-sm font-medium text-white">{card.card_holder_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-200">EXPIRES</p>
                          <p className="text-sm font-medium text-white">{card.expiry_date}</p>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {card.card_type === 'virtual' ? 'VIRTUAL' : 'PHYSICAL'}
                            </span>
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
                      className="rounded-2xl p-6 overflow-hidden"
                      style={{ backgroundColor: 'var(--card-bg)', marginTop: '-2rem' }}
                    >
                      {/* Available Balance & Monthly Spending */}
                      <div className="grid grid-cols-2 gap-6" style={{ marginTop: '2rem' }}>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            Available Balance
                          </p>
                          <p className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>
                            {formatCurrency(card.account.balance, card.account.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            Monthly Spending
                          </p>
                          <p className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>
                            {formatCurrency(card.spentThisMonth)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                            Monthly Limit
                          </span>
                          <span className="text-sm font-medium" style={{ color: 'var(--card-text)' }}>
                            {Math.round((card.spentThisMonth / card.monthly_limit) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((card.spentThisMonth / card.monthly_limit) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p style={{ color: 'var(--card-text-secondary)' }}>Account Type</p>
                            <p className="font-medium capitalize" style={{ color: 'var(--card-text)' }}>
                              {card.account.account_type}
                            </p>
                          </div>
                          <div>
                            <p style={{ color: 'var(--card-text-secondary)' }}>Card Type</p>
                            <p className="font-medium capitalize" style={{ color: 'var(--card-text)' }}>
                              {card.card_type}
                            </p>
                          </div>
                          {showCardNumbers[card.id] && (
                            <div>
                              <p style={{ color: 'var(--card-text-secondary)' }}>CVV</p>
                              <p className="font-medium font-mono" style={{ color: 'var(--card-text)' }}>
                                {card.cvv}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-3 mt-6">
                        <button
                          onClick={() => toggleCardStatus(card.id, card.status)}
                          disabled={card.status === 'blocked'}
                          className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
                        >
                          {card.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" /> Freeze Card
                            </>
                          ) : card.status === 'frozen' ? (
                            <>
                              <Play className="h-4 w-4 mr-1" /> Unfreeze Card
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-1" /> Blocked
                            </>
                          )}
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                          style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
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

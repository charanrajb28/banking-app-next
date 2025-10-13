// src/components/analytics/SavingsInsights.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Lightbulb, 
  ArrowRight,
  Target,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const savingsInsights = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Reduce Coffee Spending',
    description: 'You spent $95 on coffee this month. Making coffee at home could save you $65/month.',
    impact: 65,
    difficulty: 'easy',
    category: 'Food & Dining',
    icon: '☕',
    color: 'green'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Great Job on Transportation!',
    description: 'You saved $40 this month by using public transport instead of ride-sharing.',
    impact: 40,
    difficulty: 'completed',
    category: 'Transportation',
    icon: '🚇',
    color: 'blue'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Shopping Budget Alert',
    description: 'You\'re 30% over your shopping budget. Consider waiting for sales or using coupons.',
    impact: -150,
    difficulty: 'medium',
    category: 'Shopping',
    icon: '🛍️',
    color: 'red'
  },
  {
    id: '4',
    type: 'investment',
    title: 'Investment Opportunity',
    description: 'Your savings account has $3,000+ idle. Consider a high-yield savings or investment.',
    impact: 180,
    difficulty: 'medium',
    category: 'Investment',
    icon: '📈',
    color: 'purple'
  }
];

const monthlyTrends = [
  { month: 'Jul', saved: 1200, target: 1500 },
  { month: 'Aug', saved: 1800, target: 1500 },
  { month: 'Sep', saved: 900, target: 1500 },
  { month: 'Oct', saved: 2100, target: 1500 }
];

export default function SavingsInsights() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'achievement': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      case 'warning': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'investment': return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20';
      default: return 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'achievement': return <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'investment': return <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default: return <PiggyBank className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'completed': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const totalPotentialSavings = savingsInsights
    .filter(insight => insight.impact > 0)
    .reduce((sum, insight) => sum + insight.impact, 0);

  const currentMonth = monthlyTrends[monthlyTrends.length - 1];
  const previousMonth = monthlyTrends[monthlyTrends.length - 2];
  const savingsChange = currentMonth.saved - previousMonth.saved;
  const savingsChangePercent = ((savingsChange / previousMonth.saved) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Savings Insights</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Personalized recommendations to boost your savings
        </p>
      </div>

      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">This Month's Savings</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(currentMonth.saved)}
              </p>
              <div className="flex items-center mt-2">
                {savingsChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${
                  savingsChange >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {savingsChange >= 0 ? '+' : ''}{savingsChangePercent.toFixed(1)}% vs last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Savings Target</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(currentMonth.target)}
              </p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {((currentMonth.saved / currentMonth.target) * 100).toFixed(0)}% achieved
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Potential Savings</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalPotentialSavings)}
              </p>
              <div className="flex items-center mt-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  From recommendations
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Towards Target */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Progress</h4>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 mr-1" />
            October 2025
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Savings Progress</span>
            <span>{formatCurrency(currentMonth.saved)} / {formatCurrency(currentMonth.target)}</span>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${Math.min((currentMonth.saved / currentMonth.target) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{((currentMonth.saved / currentMonth.target) * 100).toFixed(0)}% complete</span>
            <span>{formatCurrency(Math.max(currentMonth.target - currentMonth.saved, 0))} remaining</span>
          </div>
        </div>

        {currentMonth.saved >= currentMonth.target && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Target className="h-5 w-5 mr-2" />
              <span className="font-medium">Congratulations! You've exceeded your savings target this month! 🎉</span>
            </div>
          </div>
        )}
      </div>

      {/* Insights List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Personalized Recommendations
        </h4>
        
        <div className="space-y-4">
          {savingsInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`p-4 border-2 rounded-xl ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{insight.icon}</span>
                      <h5 className="font-semibold text-slate-900 dark:text-white">{insight.title}</h5>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    insight.impact >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {insight.impact >= 0 ? '+' : ''}{formatCurrency(insight.impact)}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(insight.difficulty)}`}>
                    {insight.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-full">
                  {insight.category}
                </span>
                
                {insight.difficulty !== 'completed' && (
                  <button className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Take Action
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Savings Trend
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {monthlyTrends.map((month, index) => {
            const percentage = (month.saved / month.target) * 100;
            const isCurrentMonth = index === monthlyTrends.length - 1;
            
            return (
              <div 
                key={month.month}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCurrentMonth 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{month.month}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {formatCurrency(month.saved)}
                  </p>
                  <div className="mt-2">
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          percentage >= 100 ? 'bg-green-500' : 
                          percentage >= 80 ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {percentage.toFixed(0)}% of target
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

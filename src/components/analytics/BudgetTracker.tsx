// src/components/analytics/BudgetTracker.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const budgets = [
  {
    id: '1',
    category: 'Food & Dining',
    icon: '🍽️',
    budgeted: 1000,
    spent: 850,
    color: 'blue'
  },
  {
    id: '2',
    category: 'Shopping',
    icon: '🛍️',
    budgeted: 500,
    spent: 650,
    color: 'red'
  },
  {
    id: '3',
    category: 'Transportation',
    icon: '🚗',
    budgeted: 400,
    spent: 320,
    color: 'green'
  },
  {
    id: '4',
    category: 'Entertainment',
    icon: '🎬',
    budgeted: 300,
    spent: 180,
    color: 'purple'
  },
  {
    id: '5',
    category: 'Utilities',
    icon: '⚡',
    budgeted: 350,
    spent: 320,
    color: 'orange'
  }
];

export default function BudgetTracker() {
  const [showAddBudget, setShowAddBudget] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBudgetStatus = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return { status: 'over', color: 'red' };
    if (percentage >= 80) return { status: 'warning', color: 'yellow' };
    return { status: 'good', color: 'green' };
  };

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Budget Tracker</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor your spending against budgets
          </p>
        </div>
        <button 
          onClick={() => setShowAddBudget(true)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Budget
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget Progress</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}
          </span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getProgressColor(totalSpent, totalBudgeted)}`}
            style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {Math.round((totalSpent / totalBudgeted) * 100)}% used
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatCurrency(totalBudgeted - totalSpent)} remaining
          </span>
        </div>
      </div>

      {/* Budget List */}
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const status = getBudgetStatus(budget.spent, budget.budgeted);
          const percentage = Math.min((budget.spent / budget.budgeted) * 100, 100);

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{budget.icon}</span>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{budget.category}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.budgeted)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {status.status === 'over' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  {status.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  {status.status === 'good' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  <span className={`text-sm font-medium ${
                    status.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    status.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    status.color === 'red' ? 'bg-red-500' :
                    status.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {budget.spent > budget.budgeted && (
                <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    Over budget by {formatCurrency(budget.spent - budget.budgeted)}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Budget Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-400">Budget Tip</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You're spending 15% more on shopping this month. Consider setting stricter limits or finding better deals.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

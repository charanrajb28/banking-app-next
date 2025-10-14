// src/components/analytics/BudgetTracker.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, AlertTriangle, CheckCircle, ShoppingCart, Coffee, Airplay, Music, Zap } from 'lucide-react';

const budgets = [
  { id: '1', category: 'Food & Dining', Icon: Coffee, budgeted: 1000, spent: 850 },
  { id: '2', category: 'Shopping', Icon: ShoppingCart, budgeted: 500, spent: 650 },
  { id: '3', category: 'Transportation', Icon: Airplay, budgeted: 400, spent: 320 },
  { id: '4', category: 'Entertainment', Icon: Music, budgeted: 300, spent: 180 },
  { id: '5', category: 'Utilities', Icon: Zap, budgeted: 350, spent: 320 }
];

export default function BudgetTracker() {
  const [showAddBudget, setShowAddBudget] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getBudgetStatus = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return { status: 'over', colorVar: '--red-600' };
    if (percentage >= 80) return { status: 'warning', colorVar: '--yellow-600' };
    return { status: 'good', colorVar: '--green-600' };
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--card-text)]">Budget Tracker</h3>
          <p className="text-sm text-[var(--card-text-secondary)]">Monitor your spending against budgets</p>
        </div>
        <button
          onClick={() => setShowAddBudget(true)}
          className="flex items-center px-3 py-2 bg-[var(--accent)] text-[var(--card-text)] rounded-xl hover:brightness-110 transition-colors text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Budget
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-[var(--card-bg-alt)] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--card-text-secondary)]">Total Budget Progress</span>
          <span className="text-sm text-[var(--card-text-secondary)]">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}
          </span>
        </div>
        <div className="h-3 bg-[var(--card-bg)] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%`, backgroundColor: 'var(--accent)' }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-[var(--card-text-secondary)]">
          <span>{Math.round((totalSpent / totalBudgeted) * 100)}% used</span>
          <span>{formatCurrency(totalBudgeted - totalSpent)} remaining</span>
        </div>
      </div>

      {/* Budget List */}
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const status = getBudgetStatus(budget.spent, budget.budgeted);
          const percentage = Math.min((budget.spent / budget.budgeted) * 100, 100);
          const CategoryIcon = budget.Icon;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 border border-[var(--card-bg-alt)] rounded-xl hover:bg-[var(--card-bg-alt)] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="h-6 w-6 text-[var(--card-text)]" />
                  <div>
                    <h4 className="font-medium text-[var(--card-text)]">{budget.category}</h4>
                    <p className="text-sm text-[var(--card-text-secondary)]">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.budgeted)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {status.status === 'over' && <AlertTriangle className="h-5 w-5" style={{ color: `var(${status.colorVar})` }} />}
                  {status.status === 'warning' && <AlertTriangle className="h-5 w-5" style={{ color: `var(${status.colorVar})` }} />}
                  {status.status === 'good' && <CheckCircle className="h-5 w-5" style={{ color: `var(${status.colorVar})` }} />}
                  <span className="text-sm font-medium" style={{ color: `var(${status.colorVar})` }}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="h-2 bg-[var(--card-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: `var(${status.colorVar})` }}
                />
              </div>

              {budget.spent > budget.budgeted && (
                <div className="mt-2 flex items-center text-[var(--red-600)]">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Over budget by {formatCurrency(budget.spent - budget.budgeted)}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Budget Insights */}
      <div className="mt-6 p-4 bg-[var(--accent)]/10 rounded-xl">
        <div className="flex items-start space-x-3">
          <Target className="h-5 w-5 text-[var(--accent)] mt-0.5" />
          <div>
            <h4 className="font-medium text-[var(--accent)]">Budget Tip</h4>
            <p className="text-sm text-[var(--card-text-secondary)] mt-1">
              You're spending 15% more on shopping this month. Consider setting stricter limits or finding better deals.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// src/components/analytics/GoalsTracker.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, Trophy, AlertTriangle } from 'lucide-react';

const goals = [
  {
    id: '1',
    name: 'Emergency Fund',
    icon: <AlertTriangle />,
    target: 10000,
    current: 6500,
    deadline: '2025-12-31',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Vacation to Europe',
    icon: <TrendingUp />,
    target: 5000,
    current: 2800,
    deadline: '2026-06-15',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    icon: <Target />,
    target: 8000,
    current: 4200,
    deadline: '2026-03-30',
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Home Renovation',
    icon: <Trophy />,
    target: 15000,
    current: 1500,
    deadline: '2026-09-01',
    priority: 'low'
  }
];

export default function GoalsTracker() {
  const [showAddGoal, setShowAddGoal] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getProgressPercentage = (current: number, target: number) =>
    Math.min((current / target) * 100, 100);

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'var(--green-600)';
    if (percentage >= 50) return 'var(--blue-600)';
    if (percentage >= 25) return 'var(--yellow-600)';
    return 'var(--red-600)';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[var(--red-100)] text-[var(--red-600)] dark:bg-[var(--red-100)]/20 dark:text-[var(--red-600)]';
      case 'medium':
        return 'bg-[var(--yellow-100)] text-[var(--yellow-600)] dark:bg-[var(--yellow-100)]/20 dark:text-[var(--yellow-600)]';
      case 'low':
        return 'bg-[var(--green-100)] text-[var(--green-600)] dark:bg-[var(--green-100)]/20 dark:text-[var(--green-600)]';
      default:
        return 'bg-[var(--card-bg-alt)] text-[var(--card-text-secondary)] dark:bg-[var(--card-bg-alt)]/20 dark:text-[var(--card-text-secondary)]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--card-text)]">Financial Goals</h3>
          <p className="text-sm text-[var(--card-text-secondary)]">
            Track progress towards your savings goals
          </p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center px-3 py-2 bg-[var(--accent)] text-[var(--card-text)] rounded-xl hover:brightness-110 transition-colors text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const monthlyRequired = Math.ceil((goal.target - goal.current) / (daysRemaining / 30));

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-4 border border-[var(--card-bg-alt)] rounded-xl hover:bg-[var(--card-bg-alt)] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-[var(--card-text)]">{goal.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--card-text-secondary)]">
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[var(--card-text)]">{percentage.toFixed(0)}%</p>
                  <div className="flex items-center text-sm text-[var(--card-text-secondary)]">
                    <Calendar className="h-4 w-4 mr-1" />
                    {daysRemaining} days left
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-[var(--card-text-secondary)] mb-1">
                  <span>Progress</span>
                  <span>{formatCurrency(goal.target - goal.current)} remaining</span>
                </div>
                <div className="h-3 bg-[var(--card-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: getProgressColor(percentage) }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-[var(--card-text-secondary)]">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Need {formatCurrency(monthlyRequired)}/month</span>
                </div>
                <div className="text-[var(--card-text-secondary)]">
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>

              {percentage >= 100 && (
                <div className="mt-3 flex items-center text-[var(--green-600)]">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Goal achieved!</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Goal Insights */}
      <div className="mt-6 p-4 bg-[var(--green-100)] dark:bg-[var(--green-100)]/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Target className="h-5 w-5 text-[var(--green-600)] mt-0.5" />
          <div>
            <h4 className="font-medium text-[var(--green-600)]">Goal Tip</h4>
            <p className="text-sm text-[var(--card-text-secondary)] mt-1">
              You're on track with your Emergency Fund! Consider automating transfers to reach it faster.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// src/components/analytics/GoalsTracker.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, Trophy } from 'lucide-react';

const goals = [
  {
    id: '1',
    name: 'Emergency Fund',
    icon: '🚨',
    target: 10000,
    current: 6500,
    deadline: '2025-12-31',
    color: 'red',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Vacation to Europe',
    icon: '✈️',
    target: 5000,
    current: 2800,
    deadline: '2026-06-15',
    color: 'blue',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    icon: '🚗',
    target: 8000,
    current: 4200,
    deadline: '2026-03-30',
    color: 'green',
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Home Renovation',
    icon: '🏠',
    target: 15000,
    current: 1500,
    deadline: '2026-09-01',
    color: 'purple',
    priority: 'low'
  }
];

export default function GoalsTracker() {
  const [showAddGoal, setShowAddGoal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Financial Goals</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Track progress towards your savings goals
          </p>
        </div>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
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
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">{goal.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {percentage.toFixed(0)}%
                  </p>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {daysRemaining} days left
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{formatCurrency(goal.target - goal.current)} remaining</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Need {formatCurrency(monthlyRequired)}/month</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>

              {percentage >= 100 && (
                <div className="mt-3 flex items-center text-green-600 dark:text-green-400">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Goal achieved! 🎉</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Goal Insights */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Target className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-400">Goal Tip</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You're on track with your Emergency Fund! Consider automating transfers to reach it faster.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

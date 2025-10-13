// src/app/dashboard/analytics/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SpendingChart from '@/components/analytics/SpendingChart';
import CategoryBreakdown from '@/components/analytics/CategoryBreakdown';
import BudgetTracker from '@/components/analytics/BudgetTracker';
import GoalsTracker from '@/components/analytics/GoalsTracker';
import SavingsInsights from '@/components/analytics/SavingsInsights';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PiggyBank,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedAccount, setSelectedAccount] = useState('all');

  // Mock data - in real app, this would come from API
  const analyticsData = {
    totalSpent: 3420.45,
    totalIncome: 6500.00,
    savingsRate: 47.4,
    monthlyChange: 12.5,
    topCategory: 'Food & Dining'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track your spending patterns and financial goals
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(analyticsData.totalSpent)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{analyticsData.monthlyChange}% vs last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Income</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(analyticsData.totalIncome)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Steady income
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Savings Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyticsData.savingsRate}%
              </p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Above 40% target
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Top Category</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyticsData.topCategory}
              </p>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  32% of spending
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="xl:col-span-2">
          <SpendingChart timeRange={timeRange} />
        </div>

        {/* Category Breakdown */}
        <div>
          <CategoryBreakdown timeRange={timeRange} />
        </div>
      </div>

      {/* Budget and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetTracker />
        <GoalsTracker />
      </div>

      {/* Savings Insights */}
      <SavingsInsights />
    </div>
  );
}

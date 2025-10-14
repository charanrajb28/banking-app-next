'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SpendingChart from '@/components/analytics/SpendingChart';
import CategoryBreakdown from '@/components/analytics/CategoryBreakdown';
import BudgetTracker from '@/components/analytics/BudgetTracker';
import GoalsTracker from '@/components/analytics/GoalsTracker';
// import SavingsInsights from '@/components/analytics/SavingsInsights';
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

  const analyticsData = {
    totalSpent: 3420.45,
    totalIncome: 6500.00,
    savingsRate: 47.4,
    monthlyChange: 12.5,
    topCategory: 'Food & Dining'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>Analytics & Insights</h1>
          <p className="mt-1" style={{ color: 'var(--card-text-secondary)' }}>
            Track your spending patterns and financial goals
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--card-text)'
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--card-text)',
            }}
          >
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
        {[
          {
            title: 'Total Spent',
            value: formatCurrency(analyticsData.totalSpent),
            icon: <TrendingDown className="h-6 w-6" />,
            trend: '+12.5%',
            trendIcon: <TrendingUp className="h-4 w-4" />,
            bg: 'var(--bg-red)',
            trendColor: 'var(--text-green)'
          },
          {
            title: 'Total Income',
            value: formatCurrency(analyticsData.totalIncome),
            icon: <TrendingUp className="h-6 w-6" />,
            trend: 'Steady income',
            trendIcon: <TrendingUp className="h-4 w-4" />,
            bg: 'var(--bg-green)',
            trendColor: 'var(--text-green)'
          },
          {
            title: 'Savings Rate',
            value: analyticsData.savingsRate + '%',
            icon: <PiggyBank className="h-6 w-6" />,
            trend: 'Above 40% target',
            trendIcon: <Target className="h-4 w-4" />,
            bg: 'var(--bg-blue)',
            trendColor: 'var(--text-blue)'
          },
          {
            title: 'Top Category',
            value: analyticsData.topCategory,
            icon: <span className="text-2xl">🍽️</span>,
            trend: '32% of spending',
            trendIcon: <Calendar className="h-4 w-4" />,
            bg: 'var(--bg-purple)',
            trendColor: 'var(--text-purple)'
          },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl p-6 shadow-lg"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>{metric.title}</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>{metric.value}</p>
                <div className="flex items-center mt-2" style={{ color: metric.trendColor }}>
                  {metric.trendIcon}
                  <span className="ml-1 text-sm">{metric.trend}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: metric.bg, color: 'var(--card-text)' }}>
                {metric.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SpendingChart timeRange={timeRange} />
        </div>
        <div>
          <CategoryBreakdown timeRange={timeRange} />
        </div>
      </div>

      {/* Budget & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetTracker />
        <GoalsTracker />
      </div>

      {/* <SavingsInsights /> */}
    </div>
  );
}

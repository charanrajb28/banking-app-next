// src/app/dashboard/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpendingChart from '@/components/analytics/SpendingChart';
import CategoryBreakdown from '@/components/analytics/CategoryBreakdown';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AnalyticsData {
  totalSpent: number;
  totalIncome: number;
  netChange: number;
  transactionCount: number;
  topCategory: {
    name: string;
    amount: number;
    percentage: number;
  };
  previousPeriod: {
    totalSpent: number;
    totalIncome: number;
  };
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Please login to view analytics');
      }

      const response = await fetch(`/api/analytics?period=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      setAnalyticsData(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ period: timeRange }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${timeRange}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>
            Error Loading Analytics
          </h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const spentChange = calculatePercentageChange(
    analyticsData.totalSpent,
    analyticsData.previousPeriod.totalSpent
  );

  const incomeChange = calculatePercentageChange(
    analyticsData.totalIncome,
    analyticsData.previousPeriod.totalIncome
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
            Analytics & Insights
          </h1>
          <p className="mt-1" style={{ color: 'var(--card-text-secondary)' }}>
            Track your spending patterns and financial insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--card-text)'
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center px-4 py-2 rounded-xl transition-colors"
            style={{
              backgroundColor: 'var(--card-bg-alt)',
              color: 'var(--card-text)',
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                Total Spent
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {formatCurrency(analyticsData.totalSpent)}
              </p>
              <div className="flex items-center mt-2">
                {spentChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className={`ml-1 text-sm ${spentChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.abs(spentChange).toFixed(1)}% vs last period
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        {/* Total Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                Total Income
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {formatCurrency(analyticsData.totalIncome)}
              </p>
              <div className="flex items-center mt-2">
                {incomeChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-1 text-sm ${incomeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(incomeChange).toFixed(1)}% vs last period
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Net Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                Net Change
              </p>
              <p className={`text-2xl font-bold ${analyticsData.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(analyticsData.netChange)}
              </p>
              <div className="flex items-center mt-2">
                <DollarSign className="h-4 w-4" style={{ color: 'var(--card-text-secondary)' }} />
                <span className="ml-1 text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                  Income - Expenses
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Top Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                Top Category
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
                {analyticsData.topCategory.name}
              </p>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4" style={{ color: 'var(--card-text-secondary)' }} />
                <span className="ml-1 text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                  {analyticsData.topCategory.percentage.toFixed(1)}% of spending
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </motion.div>
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

      {/* Transaction Summary */}
      <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--card-text)' }}>
          Transaction Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--card-text-secondary)' }}>
              Total Transactions
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
              {analyticsData.transactionCount}
            </p>
          </div>
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--card-text-secondary)' }}>
              Average Transaction
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
              {formatCurrency(analyticsData.totalSpent / (analyticsData.transactionCount || 1))}
            </p>
          </div>
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--card-text-secondary)' }}>
              Largest Transaction
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>
              {formatCurrency(analyticsData.topCategory.amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

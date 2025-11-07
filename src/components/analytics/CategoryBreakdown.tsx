// src/components/analytics/CategoryBreakdown.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Utensils,
  ShoppingBag,
  Car,
  Film,
  Zap,
  Heart,
  BookOpen,
  Plane,
  User,
  Send,
  CreditCard,
  Package,
  DollarSign,
  Briefcase,
  Gift
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  type: 'income' | 'expense';
}

const categoryColors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#94a3b8'  // slate
];

const categoryIcons: { [key: string]: any } = {
  'salary': Briefcase,
  'deposit': DollarSign,
  'refund': Gift,
  'interest': TrendingUp,
  'food': Utensils,
  'shopping': ShoppingBag,
  'transport': Car,
  'entertainment': Film,
  'bills': Zap,
  'health': Heart,
  'education': BookOpen,
  'travel': Plane,
  'personal': User,
  'transfer': Send,
  'payment': CreditCard,
  'other': Package
};

export default function CategoryBreakdown({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    fetchCategoryData();
  }, [timeRange]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setChartKey(prev => prev + 1);
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/analytics/categories?period=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        const allCategories = result.categories || [];

        // Separate income and expenses
        const expenses = allCategories.filter((cat: any) => cat.type === 'expense');
        const income = allCategories.filter((cat: any) => cat.type === 'income');

        // Process expenses - top 6 + other
        let processedExpenses = expenses.slice(0, 6);
        if (expenses.length > 6) {
          const otherAmount = expenses.slice(6).reduce((sum: number, cat: any) => sum + cat.amount, 0);
          const totalExpense = expenses.reduce((sum: number, cat: any) => sum + cat.amount, 0);
          processedExpenses.push({
            category: 'Other',
            amount: otherAmount,
            percentage: totalExpense > 0 ? (otherAmount / totalExpense) * 100 : 0,
            type: 'expense'
          });
        }

        // Process income - top 6 + other
        let processedIncome = income.slice(0, 6);
        if (income.length > 6) {
          const otherAmount = income.slice(6).reduce((sum: number, cat: any) => sum + cat.amount, 0);
          const totalIncome = income.reduce((sum: number, cat: any) => sum + cat.amount, 0);
          processedIncome.push({
            category: 'Other',
            amount: otherAmount,
            percentage: totalIncome > 0 ? (otherAmount / totalIncome) * 100 : 0,
            type: 'income'
          });
        }

        // Combine and assign colors
        const combined = [...processedExpenses, ...processedIncome].map((cat: any, idx: number) => ({
          ...cat,
          color: categoryColors[idx % categoryColors.length]
        }));

        setData(combined);
      }
    } catch (err) {
      console.error('Error fetching category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const totalAmount = filteredData.reduce((sum, cat) => sum + cat.amount, 0);
  const totalIncome = data.filter(d => d.type === 'income').reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpense = data.filter(d => d.type === 'expense').reduce((sum, cat) => sum + cat.amount, 0);

  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    return categoryIcons[key] || Package;
  };

  // Chart data
  const chartData = {
  labels: filteredData.map(item => item.category),
  datasets: [
    {
      data: filteredData.map(item => parseFloat(item.amount.toFixed(2))),
      backgroundColor: filteredData.map(item => item.color),
      borderColor: 'transparent', // Changed from 'var(--card-bg)' to 'transparent'
      borderWidth: 0, // Changed from 3 to 0
      hoverOffset: 15, // Increased from 10 for more hover lift
      spacing: 3, // Increased from 2 for more gap
      hoverBorderWidth: 0, // No border on hover
    }
  ]
};


  const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true,
    animateScale: false,
    duration: 2500,
    easing: 'easeInOutQuart',
    delay: (context: any) => {
      let delay = 0;
      if (context.type === 'data') {
        delay = context.dataIndex * 50 + context.datasetIndex * 100;
      }
      return delay;
    }
  },
  rotation: -90, // Start rotation
  circumference: 360, // Full circle
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: 14,
      borderWidth: 0,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      displayColors: true,
      borderRadius: 8,
      callbacks: {
        title: function(context: any) {
          return context[0].label;
        },
        label: function(context: any) {
          const value = context.parsed || 0;
          const percentage = filteredData[context.dataIndex]?.percentage.toFixed(1) || 0;
          return `Amount: $${value.toFixed(2)}`;
        },
        afterLabel: function(context: any) {
          const percentage = filteredData[context.dataIndex]?.percentage.toFixed(1) || 0;
          return `Percentage: ${percentage}%`;
        }
      }
    }
  }
};


  return (
    <div className="rounded-2xl p-6 shadow-lg h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>
            Category Breakdown
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
            Income & Expenses
          </p>
        </div>
        <PieChart className="h-5 w-5" style={{ color: 'var(--card-text-secondary)' }} />
      </div>

      {/* Tab Selector */}
      <div className="flex space-x-2 mb-4 p-1 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
        {[
          { id: 'all', label: 'All', icon: PieChart },
          { id: 'income', label: 'Income', icon: TrendingUp },
          { id: 'expense', label: 'Expenses', icon: TrendingDown }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
                color: activeTab === tab.id ? 'var(--card-text)' : 'var(--card-text-secondary)'
              }}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p style={{ color: 'var(--card-text-secondary)' }}>Loading categories...</p>
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
            <PieChart className="h-8 w-8" style={{ color: 'var(--card-text-secondary)' }} />
          </div>
          <p className="text-lg font-medium" style={{ color: 'var(--card-text)' }}>No data yet</p>
          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
            Start transacting to see breakdown
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Summary Cards */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Income</p>
              </div>
              <p className="text-lg font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <div className="flex items-center space-x-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Expenses</p>
              </div>
              <p className="text-lg font-bold text-red-600">${totalExpense.toFixed(2)}</p>
            </div>
          </motion.div> */}

          {/* Chart Container */}
          <motion.div
            key={chartKey}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-56 flex items-center justify-center"
          >
            {filteredData.length > 0 ? (
              <Doughnut data={chartData} options={chartOptions} />
            ) : null}
          </motion.div>

          {/* Category List */}
          <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {filteredData.map((item, index) => {
              const IconComponent = getCategoryIcon(item.category);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-3 rounded-lg transition-all hover:shadow-sm cursor-pointer hover:scale-105"
                  style={{ backgroundColor: 'var(--card-bg-alt)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: item.color }}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize truncate" style={{ color: 'var(--card-text)' }}>
                          {item.category}
                        </p>
                      </div>
                      {item.type && (
                        <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                          item.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.type === 'income' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--card-text)' }}>
                      ${item.amount.toFixed(2)}
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color
                      }}
                    >
                      {item.percentage.toFixed(1)}%
                    </motion.span>
                  </div>

                  {/* Animated Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}40`
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

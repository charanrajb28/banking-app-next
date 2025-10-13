// src/components/analytics/CategoryBreakdown.tsx
'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const categoryData = [
  { name: 'Food & Dining', value: 850, color: '#f59e0b', icon: '🍽️' },
  { name: 'Shopping', value: 650, color: '#3b82f6', icon: '🛍️' },
  { name: 'Transportation', value: 420, color: '#10b981', icon: '🚗' },
  { name: 'Entertainment', value: 380, color: '#8b5cf6', icon: '🎬' },
  { name: 'Utilities', value: 320, color: '#f97316', icon: '⚡' },
  { name: 'Healthcare', value: 280, color: '#ef4444', icon: '🏥' },
  { name: 'Other', value: 520, color: '#6b7280', icon: '📦' }
];

interface CategoryBreakdownProps {
  timeRange: string;
}

export default function CategoryBreakdown({ timeRange }: CategoryBreakdownProps) {
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">
            {data.icon} {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ${data.value.toLocaleString()} ({((data.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Spending by Category</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Where your money goes this month
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      <div className="space-y-3 mt-4">
        {categoryData.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-lg mr-2">{category.icon}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {category.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                ${category.value.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {((category.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

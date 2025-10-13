// src/components/analytics/SpendingChart.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const spendingData = [
  { name: 'Jan', spending: 2400, income: 5000, savings: 2600 },
  { name: 'Feb', spending: 1398, income: 5000, savings: 3602 },
  { name: 'Mar', spending: 3800, income: 5200, savings: 1400 },
  { name: 'Apr', spending: 3908, income: 5200, savings: 1292 },
  { name: 'May', spending: 4800, income: 5500, savings: 700 },
  { name: 'Jun', spending: 3490, income: 5500, savings: 2010 },
  { name: 'Jul', spending: 4300, income: 5800, savings: 1500 },
  { name: 'Aug', spending: 3200, income: 5800, savings: 2600 },
  { name: 'Sep', spending: 2780, income: 6000, savings: 3220 },
  { name: 'Oct', spending: 3420, income: 6500, savings: 3080 }
];

interface SpendingChartProps {
  timeRange: string;
}

export default function SpendingChart({ timeRange }: SpendingChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Spending Trends</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Track your income vs expenses over time
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="Spending"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Savings"
              />
            </LineChart>
          ) : (
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spending" fill="#f59e0b" name="Spending" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#3b82f6" name="Savings" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Spending</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Savings</span>
        </div>
      </div>
    </motion.div>
  );
}

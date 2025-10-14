// src/components/dashboard/DashboardCharts.tsx
'use client';

import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const categoryData = [
  { name: 'Food', value: 1200, color: '#10b981' },
  { name: 'Rent', value: 2500, color: '#3b82f6' },
  { name: 'Travel', value: 800, color: '#f59e0b' },
  { name: 'Shopping', value: 600, color: '#ef4444' },
];

const dailySpendingData = [
  { day: '1', amount: 120 },
  { day: '2', amount: 90 },
  { day: '3', amount: 150 },
  { day: '4', amount: 70 },
  { day: '5', amount: 200 },
  { day: '6', amount: 50 },
  { day: '7', amount: 130 },
];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Spending by Category */}
      <motion.div
        // whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center md:items-start"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--card-text)',
        }}
      >
        <div className="w-full md:w-2/3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={5}
                startAngle={90}
                endAngle={450}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--card-bg-alt)',
                  border: 'none',
                  color: 'var(--card-text)',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Indicator List */}
        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2 w-full md:w-1/3">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span style={{ color: 'var(--card-text)' }} className="text-sm font-medium">
                  {item.name}
                </span>
              </div>
              <span style={{ color: 'var(--card-text-secondary)' }} className="text-sm">
                {((item.value / categoryData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Spending Trend */}
      <motion.div
        // whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="rounded-2xl p-6 shadow-lg"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--card-text)',
        }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--card-text)' }}>
          Daily Spending Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySpendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-bg-alt)" />
              <XAxis dataKey="day" stroke="var(--card-text-secondary)" />
              <YAxis stroke="var(--card-text-secondary)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card-bg-alt)', border: 'none', color: 'var(--card-text)', borderRadius: '0.5rem' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

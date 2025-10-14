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
        <div
          className="p-4 rounded-xl shadow-lg border"
          style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--card-text)',
            borderColor: 'var(--card-border)',
          }}
        >
          <p className="font-semibold mb-2">{label}</p>
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

  const axisColor = 'var(--card-text-secondary)';
  const gridColor = 'var(--card-border)';

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-2xl p-6 shadow-lg"
  style={{
    backgroundColor: 'var(--card-bg)',
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(255,255,255,0.05),
      rgba(255,255,255,0.05) 1px,
      transparent 1px,
      transparent 20px
    ), 
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,0.05),
      rgba(255,255,255,0.05) 1px,
      transparent 1px,
      transparent 20px
    )`,
  }}
>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>Spending Trends</h3>
          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
            Track your income vs expenses over time
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors`}
            style={{
              backgroundColor: chartType === 'line' ? 'var(--accent)' : 'var(--card-bg-alt)',
              color: chartType === 'line' ? 'white' : 'var(--card-text)',
            }}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors`}
            style={{
              backgroundColor: chartType === 'bar' ? 'var(--accent)' : 'var(--card-bg-alt)',
              color: chartType === 'bar' ? 'white' : 'var(--card-text)',
            }}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={spendingData}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis 
                stroke={axisColor} 
                fontSize={12} 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="income" stroke="var(--income-color)" strokeWidth={3} dot={{ r: 4 }} name="Income" />
              <Line type="monotone" dataKey="spending" stroke="var(--spending-color)" strokeWidth={3} dot={{ r: 4 }} name="Spending" />
              <Line type="monotone" dataKey="savings" stroke="var(--savings-color)" strokeWidth={3} dot={{ r: 4 }} name="Savings" />
            </LineChart>
          ) : (
            <BarChart data={spendingData}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis 
                stroke={axisColor} 
                fontSize={12} 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="var(--income-color)" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spending" fill="var(--spending-color)" name="Spending" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="var(--savings-color)" name="Savings" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        {[
          { color: 'var(--income-color)', label: 'Income' },
          { color: 'var(--spending-color)', label: 'Spending' },
          { color: 'var(--savings-color)', label: 'Savings' },
        ].map((item) => (
          <div key={item.label} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

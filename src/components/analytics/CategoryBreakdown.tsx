'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const categoryData = [
  { name: 'Food & Dining', value: 850, iconClass: 'icon-food', colorVar: '--category-food' },
  { name: 'Shopping', value: 650, iconClass: 'icon-shopping', colorVar: '--category-shopping' },
  { name: 'Transportation', value: 420, iconClass: 'icon-transport', colorVar: '--category-transportation' },
  { name: 'Entertainment', value: 380, iconClass: 'icon-entertainment', colorVar: '--category-entertainment' },
  { name: 'Utilities', value: 320, iconClass: 'icon-utilities', colorVar: '--category-utilities' },
  { name: 'Healthcare', value: 280, iconClass: 'icon-healthcare', colorVar: '--category-healthcare' },
  { name: 'Other', value: 520, iconClass: 'icon-other', colorVar: '--category-other' }
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
        <div className="p-3 rounded-xl shadow-lg border"
             style={{
               backgroundColor: 'var(--card-bg)',
               borderColor: 'var(--card-bg-alt)',
               color: 'var(--card-text)'
             }}
        >
          <div className="flex items-center space-x-2">
            <span className={`${data.iconClass} w-5 h-5`} />
            <p className="font-semibold">{data.name}</p>
          </div>
          <p className="text-sm mt-1 text-[var(--card-text-secondary)]">
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
      className="rounded-2xl p-6 shadow-lg"
      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text)' }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold">Spending by Category</h3>
        <p className="text-sm text-[var(--card-text-secondary)]">
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
                <Cell
                  key={`cell-${index}`}
                  fill={`var(${entry.colorVar})`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

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
                style={{ backgroundColor: `var(${category.colorVar})` }}
              ></div>
              <span className={`${category.iconClass} w-5 h-5`} />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{`$${category.value.toLocaleString()}`}</p>
              <p className="text-xs text-[var(--card-text-secondary)]">
                {((category.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

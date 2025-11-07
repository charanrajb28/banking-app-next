// src/components/analytics/SpendingChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SpendingData {
  date: string;
  amount: number;
}

export default function SpendingChart({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<SpendingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpendingData();
  }, [timeRange]);

  const fetchSpendingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`/api/analytics/spending?period=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching spending data:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxAmount = Math.max(...data.map(d => d.amount), 1);
  const totalSpent = data.reduce((sum, d) => sum + d.amount, 0);
  const avgSpent = data.length > 0 ? totalSpent / data.length : 0;

  return (
    <div className="rounded-2xl p-6 shadow-lg h-full" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--card-text)' }}>
            Spending Trend
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--card-text-secondary)' }}>
            Daily spending over time
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>Total</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--card-text)' }}>
            ${totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p style={{ color: 'var(--card-text-secondary)' }}>Loading chart...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
            <TrendingDown className="h-8 w-8" style={{ color: 'var(--card-text-secondary)' }} />
          </div>
          <p className="text-lg font-medium" style={{ color: 'var(--card-text)' }}>No spending data</p>
          <p className="text-sm" style={{ color: 'var(--card-text-secondary)' }}>
            Make some transactions to see your spending trends
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Chart Area */}
          <div className="relative h-64 flex items-end space-x-2 px-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs" style={{ color: 'var(--card-text-secondary)' }}>
              <span>${maxAmount.toFixed(0)}</span>
              <span>${(maxAmount * 0.75).toFixed(0)}</span>
              <span>${(maxAmount * 0.5).toFixed(0)}</span>
              <span>${(maxAmount * 0.25).toFixed(0)}</span>
              <span>$0</span>
            </div>

            {/* Grid lines */}
            <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px" style={{ backgroundColor: 'var(--card-bg-alt)' }} />
              ))}
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-between space-x-1 ml-12">
              {data.map((item, index) => {
                const heightPercentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                const isAboveAvg = item.amount > avgSpent;

                return (
                  <div key={index} className="flex-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="rounded-lg px-3 py-2 shadow-lg whitespace-nowrap" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <p className="text-xs font-medium" style={{ color: 'var(--card-text)' }}>{item.date}</p>
                        <p className="text-sm font-bold text-blue-600">${item.amount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="relative h-full flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer ${
                          isAboveAvg ? 'bg-gradient-to-t from-red-600 to-orange-500' : 'bg-gradient-to-t from-blue-600 to-indigo-600'
                        }`}
                        style={{ 
                          height: `${heightPercentage}%`,
                          minHeight: item.amount > 0 ? '4px' : '0'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex items-center justify-between ml-12 text-xs" style={{ color: 'var(--card-text-secondary)' }}>
            {data.map((item, index) => {
              // Show every nth label to avoid crowding
              const showEvery = Math.ceil(data.length / 7);
              const shouldShow = index % showEvery === 0 || index === data.length - 1;
              
              return (
                <span 
                  key={index} 
                  className={`flex-1 text-center ${shouldShow ? '' : 'invisible'}`}
                >
                  {item.date}
                </span>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t" style={{ borderColor: 'var(--card-bg-alt)' }}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-blue-600 to-indigo-600"></div>
              <span className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>
                Below average
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-red-600 to-orange-500"></div>
              <span className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>
                Above average (${avgSpent.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Highest</p>
              <p className="text-lg font-bold" style={{ color: 'var(--card-text)' }}>
                ${maxAmount.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Average</p>
              <p className="text-lg font-bold" style={{ color: 'var(--card-text)' }}>
                ${avgSpent.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card-bg-alt)' }}>
              <p className="text-xs" style={{ color: 'var(--card-text-secondary)' }}>Days</p>
              <p className="text-lg font-bold" style={{ color: 'var(--card-text)' }}>
                {data.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

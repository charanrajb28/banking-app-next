// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Account {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  account_type: string;
  currency: string;
  created_at: string;
}

interface DashboardData {
  accounts: Account[];
  previousBalance?: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({ accounts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Please login to view dashboard');
      }

      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const dashboardData = await response.json();

      if (!response.ok) {
        throw new Error(dashboardData.error || 'Failed to fetch dashboard data');
      }

      setData(dashboardData);
      setError('');
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getGradient = (accountType: string): string => {
    switch (accountType.toLowerCase()) {
      case 'savings':
        return 'bg-gradient-to-br from-blue-600 to-blue-700';
      case 'current':
        return 'bg-gradient-to-br from-purple-600 to-purple-700';
      case 'investment':
        return 'bg-gradient-to-br from-green-600 to-green-700';
      default:
        return 'bg-gradient-to-br from-indigo-600 to-indigo-700';
    }
  };

  const calculateChangePercentage = (account: Account): { change: number; type: 'increase' | 'decrease' } => {
    // This would typically be calculated from transaction history
    // For now, returning a default value - you can enhance this with real data
    const change = Math.random() * 20 - 10; // Random change for demo
    return {
      change: Math.abs(change),
      type: change >= 0 ? 'increase' : 'decrease'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--card-text)' }} />
          <p style={{ color: 'var(--card-text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--card-text)' }}>Error</h2>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--card-text)' }}>Dashboard</h1>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mt-1">
            Welcome back! Here's your financial overview
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--card-bg-alt)', color: 'var(--card-text)' }}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Balance Cards */}
      {data.accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.accounts.map((account, index) => {
            const changeData = calculateChangePercentage(account);
            return (
              <BalanceCard
                key={account.id}
                accountId={account.id}
                title={account.account_name}
                balance={account.balance}
                accountNumber={account.account_number}
                change={changeData.change}
                changeType={changeData.type}
                gradient={getGradient(account.account_type)}
                currency={account.currency}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl p-8 shadow-lg text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <p style={{ color: 'var(--card-text-secondary)' }} className="mb-4">
            No accounts found. Create your first account to get started!
          </p>
          <a
            href="/dashboard/accounts/new"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Create Account
          </a>
        </div>
      )}

      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentTransactions />
      </div>
    </div>
  );
}
